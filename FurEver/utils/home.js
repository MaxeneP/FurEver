document.addEventListener("DOMContentLoaded", async function(){
    const supabase =  window.supabase.createClient("https://idiqjlywytsddktbcvvc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaXFqbHl3eXRzZGRrdGJjdnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDAyMjQsImV4cCI6MjA1NTcxNjIyNH0.Q4HGFs832rIw2jhlKvFg2LsCgQuA7hEw91eedAApY60");
    console.log("Supabase success.", supabase);

    let user = await getUser();
    if(!user){
        alert("You must be logged in to browse");
        window.location.href="../pages/signin_Furever.html";
    }

    async function getUser(){
        const { data, error } = await supabase.auth.getUser();
        return error ? null : data.user;
    }
    
const submit = document.getElementById("survey-btn");
const searchInput = document.getElementById("searchbar");

if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
    if(event.key=="Enter"){
        event.preventDefault();
        const query = searchInput.value.toLowerCase();
        fetchListings(query);
    }
    });
}
    
function init() {
    //for survey button
    if (submit) {
        submit.addEventListener("click", function(event) {
            event.preventDefault();
            console.log("Button clicked");
            
            let species = document.getElementById('species').value;
            let size = document.getElementById('size').value;
            let sex = document.querySelector('input[name="sex"]:checked')?.id;
            let activeness = document.querySelector('input[name="activity"]:checked')?.id || "";
            let temperament = document.querySelector('input[name="children"]:checked')?.id === "family-yes" ? "true" : "false";

            let filterData = {
                species: species || "",
                size: size || "",
                sex: sex || "",
                activeness: activeness || "",
                temperament: temperament || ""
            };
    
            localStorage.setItem("surveyFilters", JSON.stringify(filterData)); // Save filters
    
            window.location.href = "home.html";

        });
    }else{
     // for populating dropdown
    let dropdown = document.getElementById('cities');

    
    let cityObj = new City();
    let locations = cityObj.getAllCities();
    for (let i in locations) {
        let city = document.createElement('div');
        city.setAttribute('class', 'city');
        city.textContent = locations[i];
        dropdown.append(city);
    }

    window.addEventListener('click', eventDelegation);
    fetchListings();

    fetchPotd();
    showPotd();
    }

}

    //fetch records
       async function fetchListings(searchQuery = ""){

        if (!document.referrer.includes("survey_2.html")) {
            localStorage.removeItem("surveyFilters"); // Remove filters if user didn't come from survey
        }

        let filterData = localStorage.getItem("surveyFilters"); // Check if survey filters exist
        let filters = filterData ? JSON.parse(filterData) : null;

        let {data, error} = await supabase.from("animal_listing").select("animal_id, animal_name, image_URL, Is_adopted, city, species, size, sex, activeness, temperament").eq("Is_adopted", false);

        if(searchQuery){
            data = data.filter(item => item.animal_name.toLowerCase().includes(searchQuery)); //search pet name
        }
        if (filters){
            if (filters.species && filters.species.toLowerCase() !== "others") {
                data = data.filter(item => item.species.toLowerCase() === filters.species.toLowerCase());
            } else if (filters.species.toLowerCase() === "others") {
                data = data.filter(item => item.species.toLowerCase() !== "dog" && item.species.toLowerCase() !== "cat");
            }            
            if(filters.size){
                data = data.filter(item => item.size === filters.size);
            }
            if(filters.sex){
                data = data.filter(item => item.sex === filters.sex);
            }
            if (filters.activeness) {
                let activenessValue = parseInt(filters.activeness, 10);
                console.log("Activeness filter value:", activenessValue);
                
                data = data.filter(item => {
                    let itemActiveness = parseInt(item.activeness, 10); //pass as int
                    return itemActiveness >= (activenessValue <= 3 ? 1 : 4) &&
                           itemActiveness <= (activenessValue <= 3 ? 3 : 5);
                });
            }
            if (filters.temperament) {
                let temperamentValue = parseInt(filters.temperament, 10);
                if (!isNaN(temperamentValue)) {
                    data = data.filter(item => {
                        let itemTemperament = parseInt(item.temperament, 10);
                        return itemTemperament >= 1 && itemTemperament <= 3;
                    });
                }
            }
            
        }
            if (!data || data.length === 0) {
                alert("No listings match your preferences.");
            }

        clearListings();
        data.forEach(listing => {
            const firstImage = listing.image_URL?.split(',')[0]?.trim() || '';
            createTile(listing.animal_name, firstImage, listing.animal_id);

            if(error){
                console.error("Error fetching listings: ", error);
            }
        });
    }

    const applyFilter = document.getElementById("apply-filters-btn");

    if(applyFilter){
        applyFilter.addEventListener("click", async function(event) {
        event.preventDefault();

        let species = document.getElementById('species').value;
        let size = document.getElementById('size').value;
        let sex = document.getElementById('sex').value;
        let neutered = document.getElementById('neutered').value;

        let neuteredValue = null;
        if (neutered === "male") neuteredValue = true;
        else if (neutered === "female") neuteredValue = false;

        const filters = {
            species: species !== "1=1" ? species : null,
            size: size !== "1=1" ? size : null,
            sex: sex !== "1=1" ? sex : null,
            neutered: neuteredValue
        };

        fetchListingsWithFilters(filters);
        });

    }
   

    async function fetchListingsWithFilters(filters) {
    let query = supabase.from("animal_listing").select(
        "animal_id, animal_name, image_URL, Is_adopted, city, species, size, sex, activeness, temperament, Is_neutered"
    ).eq("Is_adopted", false);

    if (filters.species) query = query.eq("species", filters.species);
    if (filters.size) query = query.eq("size", filters.size);
    if (filters.sex) query = query.eq("sex", filters.sex);
    if (filters.neutered !== null) query = query.eq("Is_neutered", filters.neutered);

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching filtered results:", error);
        alert("Failed to load filtered listings.");
        return;
    }

    if (!data || data.length === 0) {
        alert("No listings match your preferences.");
    }

    clearListings();
    data.forEach(listing => {
        const firstImage = listing.image_URL?.split(',')[0]?.trim() || '';
            createTile(listing.animal_name, firstImage, listing.animal_id);
    });
    }

    const resetBtn = document.getElementById("reset-filters-btn");

    if(resetBtn){
        resetBtn.addEventListener("click", function () {
        document.getElementById('species').value = "1=1";
        document.getElementById('size').value = "1=1";
        document.getElementById('sex').value = "1=1";
        document.getElementById('neutered').value = "1=1";

        localStorage.removeItem("surveyFilters");

        fetchListings();
        });
    }


    function clearListings() {
        let ls = document.getElementById('listing-scroll');
        while (ls.firstChild) {
            ls.removeChild(ls.firstChild);
        }
    
    }

// event delegation for click events
function eventDelegation(e) {
    // console.log(e.target);
    if (e.target != document.querySelector('#burger-menu-trigger')) {
        let cb = document.getElementById('burger-menu-trigger')
        cb.checked = false;
    }
    if (e.target.closest('.city')) {
        let p = document.querySelector('#location-dropdown-label>p');
        let cb = document.getElementById('location-dropdown-trigger');
        cb.checked = false;
        p.textContent = e.target.textContent;
        onLocationChange(p.textContent);
    }
    if (e.target != document.getElementById('location-dropdown-trigger')) {
        let cb = document.getElementById('location-dropdown-trigger');
        cb.checked = false;
    }
    if (e.target.closest('#carousel-right')) {
        let carousel = document.getElementById('carousel-window');
        let size = carousel.offsetWidth;
        carousel.scrollBy(size,0);
    }
    if (e.target.closest('#carousel-left')) {
        let carousel = document.getElementById('carousel-window');
        let size = carousel.offsetWidth;
        carousel.scrollBy(-size,0);
    }
    if (e.target == document.getElementById('close-lv')) {
        let lv = document.getElementById('listing-view-wrapper');
        lv.setAttribute('style', 'display: none'); 
    }
    if (e.target == document.getElementById('close-potd')) {
        document.getElementById('potd-trigger').checked = false;
    }
    if (e.target == document.getElementById('view-potd')) {
        viewPotd();
    }
    if (e.target == document.getElementById("filter-btn")) {
        document.getElementById("filters-wrapper").setAttribute('style', 'display: flex');
    }
    if (e.target == document.getElementById("close-filters-btn")) {
        document.getElementById("filters-wrapper").setAttribute('style', 'display: none');
    }
}

// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************

// takes name of animal and cover picture of animal
// then creates necessary HTML elements and appends output to be displayed on page
function createTile(name, imageSrc, id) {
    let listing = document.createElement('div');
    listing.classList.add('listing');
    listing.setAttribute('animal_id', id);

    let listingPic = document.createElement('img');
    listingPic.setAttribute('src', imageSrc); // cover picture
    listingPic.classList.add('listing-pic');
    
    let listingName = document.createElement('div');
    listingName.classList.add('listing-name');
    listingName.textContent = name;  // name of animal

    let p = document.createElement('p');

    listing.setAttribute('animal_id', id); 

    p.textContent = 'View More';
    listingName.setAttribute('class', 'listing-name');
    listingPic.setAttribute('class', 'listing-pic');

    listing.addEventListener('click', function () {
        window.location.href = `../pages/view-lising.html?animal_id=${id}`;
    });
    
    listing.appendChild(listingPic);
    listing.appendChild(listingName);
    
    let ls = document.getElementById('listing-scroll');
    ls.appendChild(listing);
}


let animalId = null;

// for potd record fetching
async function fetchPotd() {
    const potdCache = localStorage.getItem("potdCache");
    const now = Date.now();
    const oneDay = 86400000;

    if (potdCache) {
        const { animal_id, animal_name, image_URL, timestamp } = JSON.parse(potdCache);

        if (now - timestamp < oneDay) {
            animalId = animal_id;
            const firstImage = image_URL?.split(',')[0]?.trim() || '';
            setPotd(animal_name, firstImage, animal_id);
            return;
        }
    }

    // Fetch new POTD
    const { data, error } = await supabase
        .from("potd_view")
        .select("animal_id, animal_name, image_URL, Is_adopted")
        .eq("Is_adopted", false)
        .limit(1)
        .single();

    if (error) {
        console.error("Error fetching record:", error);
        return;
    }

    if (!data) {
        alert("No pet of the day found");
        return;
    }

    const { animal_id, animal_name, image_URL } = data;

    const firstImage = image_URL?.split(',')[0]?.trim() || '';

    // Store full data in cache (including all image_URLs)
    localStorage.setItem("potdCache", JSON.stringify({
        animal_id,
        animal_name,
        image_URL,
        timestamp: now
    }));

    animalId = animal_id;
    setPotd(animal_name, firstImage, animal_id);
}

// makes potd element visible
// potd trigger is a checkbox
// css rule makes potd tile visible depending
// on state of checkbox 
function showPotd() {
    document.getElementById('potd-trigger').checked = true;
}

// sets pet of the day expects url in src
// name is displayed as a string
function setPotd(name, src) {
    document.getElementById('potd-name').textContent = name;
    document.getElementById('potd-pic').setAttribute('src', src);
}


// function called when view pet of the day
// is clicked
function viewPotd() {
    console.log('view potd clicked!');
    
    window.location.href = `../pages/view-lising.html?animal_id=${animalId}`;

    if (!animalId){
        alert("No animal Id");
    }
}


// function for adding loader when no element
// is in listing scroll
function createLoader() {
    let ls = document.getElementById('listing-scroll');
    let loader = document.createElement('div');
    loader.classList.add('loader');
    ls.appendChild(loader);
}

// function triggered when location from dropdown changes
async function onLocationChange(city = null) {
    clearListings();
    createLoader();
    let Listingfilter = supabase.from("animal_listing").select("animal_id, animal_name, image_URL, Is_adopted, city").eq("Is_adopted", false);

    if(city){
        Listingfilter = Listingfilter.eq("city", city);
    }

    const {data, error} = await Listingfilter;
    
    if (!data || data.length === 0) {
        alert("There are no adoptable pets available in this city.");
        return;
    }

    if(error){
        alert("No listing in that location");
    }

    clearListings();
    data.forEach(listing => {
        createTile(listing.animal_name, listing.image_URL, listing.animal_id);
    });

}

// function called when a listing is clicked, id is
// id of listing in database

// there is only a single pop-up modal for displaying
// listings, this function updates the contents of that modal

init();

});
