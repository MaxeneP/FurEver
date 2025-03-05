let locationObject = new City();

function init() {
    let provinceDrop = document.getElementById('provinces');
    locationObject.showProvinces('#provinces');
    
    window.addEventListener('click', eventDelegation);
    provinceDrop.addEventListener('change', provinceChange);
}


// for click events
function eventDelegation(e) {
    // console.log(e.target);
    if (e.target != document.querySelector('#burger-menu-trigger')) {
        let cb = document.getElementById('burger-menu-trigger')
        cb.checked = false;
    }
}

function provinceChange(e) {
    locationObject.showCities('#cities');
}

init();