function init() {
    window.addEventListener('click', eventDelegation);
    tryAddLisitng();
}

// for testing
function tryAddLisitng() {
    for (i = 0; i < 100; i++) {
        createEntry('Ace', i);
    }
}

// event delegation for click events
function eventDelegation(e) {
    if (e.target != document.querySelector('#burger-menu-trigger')) {
        let cb = document.getElementById('burger-menu-trigger')
        cb.checked = false;
    }
    if (e.target.closest('.listing-settings-button')) {
        popup = e.target.closest('.listing-settings-button').nextElementSibling;
        popup.setAttribute('style', 'display: flex');
    }
    if (e.target.classList.contains('view-listing')) {
        id = e.target.closest('.listing').id
        viewListing(id);
    }
    if (e.target.classList.contains('edit')) {
        id = e.target.closest('.listing').id
        editListing(id);
    }
    if (e.target.classList.contains('mark-adopted')) {
        id = e.target.closest('.listing').id
        markAdopted(id);
    }
    document.querySelectorAll('.listing').forEach(listing => {
        if (e.target.closest('.listing') != listing) {
            listing.lastElementChild.setAttribute('style', 'display: none');
        }
    })
}

init();

/*****************************************************/
/*****************************************************/
/*****************************************************/
/*****************************************************/
/*****************************************************/
/*****************************************************/


// removes all listings displayed
function clearListings() {
    let pane = document.getElementById('body-bottom');
    while (pane.firstElementChild) {
        pane.removeChild(pane.firstElementChild);
    }
}


// creates an entry for a listing
// can be used when initially fetching data
// id is id of listing in db, name is name of listing
function createEntry(name, id) {
    let pane = document.getElementById('body-bottom');
    let listing = document.createElement('div');
    let listingName = document.createElement('div');
    let btnWrapper = document.createElement('div');
    let btn = document.createElement('i');
    let popupWrapper = document.createElement('div');
    let view = document.createElement('div');
    let edit = document.createElement('div');
    let mark = document.createElement('div');

    listing.setAttribute('class', 'listing');
    listingName.setAttribute('class', 'listing-name');
    btnWrapper.setAttribute('class', 'listing-settings-button');
    btn.setAttribute('class', 'fa fa-ellipsis-h');
    btn.setAttribute('aria-hidden', 'true');
    popupWrapper.setAttribute('class', 'listing-settings-popup');
    view.setAttribute('class', 'view-listing');
    edit.setAttribute('class', 'edit');
    mark.setAttribute('class', 'mark-adopted');

    listingName.textContent = name;
    listing.id = id;
    view.textContent = "View";
    edit.textContent = "Edit";
    mark.textContent = "Mark as Adopted";

    popupWrapper.appendChild(view);
    popupWrapper.appendChild(edit);
    popupWrapper.appendChild(mark);
    btnWrapper.appendChild(btn);
    listing.appendChild(listingName);
    listing.appendChild(btnWrapper);
    listing.appendChild(popupWrapper);
    pane.appendChild(listing);    
}

// function called when view listing is clicked 
function viewListing(id) {
    console.log(id);
}

// function called when edit listing is clicked
function editListing(id) {
    console.log(id);
}

// function called when mark Adopted is clicked
function markAdopted(id) {
    console.log(id);
}