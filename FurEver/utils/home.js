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
    tryAddListing();
}

// for testing
function tryAddListing() {
    for (i = 0; i < 100; ++i) {
        createTile('Ace Chan', '../assets/test-image.jpg', i);
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
    if (e.target.closest('.listing')) {
        getListingDetails(e.target.closest('.listing').id);
        showListing();
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
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************

// removes all current listings currently displayed 
// can be called before fetching new listings
function clearListings() {
    let ls = document.getElementById('listing-scroll');
    while (ls.firstChild) {
        ls.removeChild(ls.firstChild);
    }

}

// takes name of animal and cover picture of animal
// then creates necessary HTML elements and appends output to be displayed on page
function createTile(name, imageSrc, id) {
    let listing = document.createElement('div');
    let listingPic = document.createElement('img');
    let listingName = document.createElement('div');
    let listingHover = document.createElement('div');
    let p = document.createElement('p');

    listingName.textContent = name;  // name of animal
    listingPic.setAttribute('src', imageSrc); // cover picture
    listing.setAttribute('id', id); // id is the PK of listing in the database

    p.textContent = 'View More';
    listingHover.setAttribute('class', 'listing-hover');
    listingName.setAttribute('class', 'listing-name');
    listing.setAttribute('class', 'listing');
    listingPic.setAttribute('class', 'listing-pic');
    listingHover.appendChild(p);
    listing.appendChild(listingPic);
    listing.appendChild(listingName);
    listing.appendChild(listingHover)
    
    let ls = document.getElementById('listing-scroll');
    ls.appendChild(listing);
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
function getListingDetails(id) {
    // get details of listing corresponding to id
    // ...
    // call updateListingPopup with parameters
}

// there is only a single pop-up modal for displaying
// listings, this function updates the contents of that modal
function updateListingPopup(imageSrces, breed, birthday, sex, size, activeness, temperament, familyRating, neutered, additionalInfo, contactNo, location, isAdopted) {

    let carousel = document.getElementById('carousel-window');
    
    while (carousel.firstChild) {
        carousel.removeChild(carousel.firstChild);
    }

    for (let src in imageSrces) {
        let img = document.createElement('img');
        img.setAttribute('src', src);
        carousel.appendChild(img);
    }
    
    document.getElementById('breed').textContent = breed;
    document.getElementById('birthday').textContent = birthday;
    document.getElementById('sex').textContent = sex;
    document.getElementById('size').textContent = size;
    document.getElementById('activeness').textContent = activeness;
    document.getElementById('temperament').textContent = temperament;
    document.getElementById('family-friendliness').textContent = familyRating;
    document.getElementById('neutered').textContent = neutered;
    document.getElementById('additional-info').textContent = additionalInfo;
    document.getElementById('contact').textContent = contactNo;
    document.getElementById('location').textContent = location;

    if (isAdopted) {
        document.getElementById('adopted-trigger').checked = true;
    } else {
        document.getElementById('adopted-trigger').checked = false;
    }
}

// shows listing details via popup
function showListing() {
    let lv = document.getElementById('listing-view-wrapper');
    lv.setAttribute('style', 'display: grid');
}

init();