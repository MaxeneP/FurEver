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

function init() {
    // for populating dropdown
    let cityObj = new City();
    let locations = cityObj.getAllCities();
    let dropdown = document.getElementById('cities');
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

    setInterval(fetchPotd, 60000); //for testing, 24 hours = 86400000
}

    //fetch records
    async function fetchListings(){
        const {data, error} = await supabase.from("animal_listing").select("animal_id, animal_name, image_URL, Is_adopted").eq("Is_adopted", false);

        if(error){
            console.error("Error fetching listings: ", error);
        }

        clearListings();
        data.forEach(listing => {
            createTile(listing.animal_name, listing.image_URL, listing.animal_id);
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
async function fetchPotd(){
        const {data, error} = await supabase.from("potd_view").select("animal_id, animal_name, image_URL, Is_adopted").eq("Is_adopted", false).limit(1).single();
        if (error){
            console.error("Error fetching record:", error);
        }
        if (!data || data.length === 0){
            alert("No pet of the day found");
        }

        animalId = data.animal_id;
        setPotd(data.animal_name, data.image_URL, data.animal_id);    

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
    createLoader(); 
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
