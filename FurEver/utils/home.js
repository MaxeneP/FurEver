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
}

    //fetch records
    async function fetchListings(){
        const {data, error} = await supabase.from("animal_listing").select("animal_id, animal_name, image_URL");

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

    let listingHover = document.createElement('div');
    let p = document.createElement('p');


    listing.setAttribute('animal_id', id); 

    p.textContent = 'View More';
    listingHover.setAttribute('class', 'listing-hover');
    listingName.setAttribute('class', 'listing-name');
    listingPic.setAttribute('class', 'listing-pic');

    listing.addEventListener('click', function () {
        window.location.href = `../pages/view-lising.html?animal_id=${id}`;
    });
    
    listingHover.appendChild(p);
    listing.appendChild(listingPic);
    listing.appendChild(listingName);
    listing.appendChild(listingHover)
    
    let ls = document.getElementById('listing-scroll');
    ls.appendChild(listing);
}

function createEmptyTile() {
    let ls = document.getElementById('listing-scroll');
    do {
        let empty = document.createElement('div');
        ls.appendChild(empty);
    }
    while (ls.children.length % 4 != 1)
}

// function triggered when location from dropdown changes
function onLocationChange(location) {
    clearListings(); 
    // get listings
    // ...
    // call create tile for listings
}

// function called when a listing is clicked, id is
// id of listing in database

// there is only a single pop-up modal for displaying
// listings, this function updates the contents of that modal

init();

});
