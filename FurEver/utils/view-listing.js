function init() {
    window.addEventListener('click', eventDelegation);
    
    // for testing
    tryPage();
}

// for testing purposes
function tryPage() {
    let sources = [
        "../assets/view_listing_test2.jpg",
        "../assets/view_listing_test1.jpg",
        "../assets/view_listing_test3.jpg",
        "../assets/view_listing_test4.jpg",
        "../assets/view_listing_test5.jpg",
    ];
    let desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent viverra mauris risus, quis interdum turpis maximus sed. Etiam vehicula neque a metus eleifend aliquam. Mauris tincidunt metus ligula, vel venenatis sem vestibulum nec. Morbi eget turpis at tellus rutrum condimentum et nec quam. Proin ornare ultrices nisi. Sed a est nec elit facilisis tempor. Maecenas condimentum diam sem, sit amet porttitor mauris consequat id. Vivamus sed mi viverra, maximus lacus a, faucibus sapien. Nulla ullamcorper leo aliquam, vehicula diam et, sagittis ligula. Etiam a purus blandit, aliquam turpis sit amet, elementum nisl. Quisque vehicula massa vel enim euismod, et auctor turpis lobortis. Phasellus sagittis arcu id magna rhoncus, molestie lobortis magna eleifend. Aliquam sodales suscipit turpis, at consectetur nulla varius nec. Vestibulum mauris risus, vehicula ut felis sed, tristique mattis erat.\r\n \r\n Fusce molestie velit ut turpis ullamcorper, in ornare dolor finibus. Quisque non nulla id odio bibendum hendrerit a eget mauris. Ut sollicitudin tellus eget nisl feugiat euismod. Curabitur luctus metus purus, ut mattis ipsum consectetur nec. In in ante non est volutpat ornare in quis tellus. Vestibulum non eros vel massa rhoncus tristique a sed augue. Nam fringilla felis ut laoreet tempor. Morbi dolor magna, pharetra sed nunc ac, pellentesque posuere quam. Aliquam consectetur nunc ut euismod convallis. Suspendisse sagittis velit et imperdiet iaculis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum lorem nisi, condimentum quis elementum eu, euismod ut odio."

    setListingDetails(false, 1, 3, false, sources, '04/23/1950', desc, 'General Trias, Cavite', '0919 020 2420', 'Ophelia', 'Maine Coon', 'large');
}

// event delegation for click events
function eventDelegation(e) {
    //console.log(e.target);
    if (e.target != document.querySelector('#burger-menu-trigger')) {
        let cb = document.getElementById('burger-menu-trigger')
        cb.checked = false;
    }
    if (e.target.closest('#add-to-wishlist-btn')) {
        addToWishlist();
    }
    if (e.target.closest('#pictures-left')) {
        changePicture(e.target);
    }
}

/**********************************************/
/**********************************************/
/**********************************************/
/**********************************************/
/**********************************************/
/**********************************************/
/**********************************************/
/**********************************************/


// function for setting all information of listing
// uses the functions below

// isMale and isNeutered is bool true or false
// activenessRate and temperamentRate are numbers 1 - 5
// imageSources are arrays of src to be used for <img> tag
// birthday, desc, loc, name, breed, size and num are text
function setListingDetails(isMale, activenessRate, temperamentRate, isNeutered, imageSources, birthday, desc, loc, num, name, breed, size) {
    toggleSex(isMale);
    toggleActiveness(activenessRate);
    toggleTemperament(temperamentRate);
    toggleNeutered(isNeutered);
    setBDay(birthday);
    setDescription(desc);
    setContact(loc, num);
    setName(name);
    setBreed(breed);
    setSize(size);

    for (let i in imageSources) {
        addPicture(imageSources[i]);
    }
}

// function for displaying sex symbol
// takes true or false as parameter
// true = male, false = female
function toggleSex(isMale) {
    let male = document.getElementById('male-trigger')
    let female = document.getElementById('female-trigger')
    if (isMale) {
        male.checked = true;
        female.checked = false;
    } else {
        male.checked = false;
        female.checked = true;
    }
}

// function for toggling activeness radio button
// takes as input rate from 1 - 5
function toggleActiveness(rate) {
    let activeness = document.getElementById('activeness');
    let btns = activeness.children;
    for (i = 0; i < btns.length; ++i) {
        if (i == (rate-1)) {
            btns[i].classList.add('checked');
        }
    }
}

// function for toggling temperament radio button
// takes as input rate from 1 - 5
function toggleTemperament(rate) {
    let temperament = document.getElementById('temperament');
    let btns = temperament.children;
    for (i = 0; i < btns.length; ++i) {
        if (i == (rate-1)) {
            btns[i].classList.add('checked');
        }
    }
}

// function for toggling neutered radio button
// takes as input true or false
// true = neutered, false = not neutered
function toggleNeutered(isNeutered) {
    let neutered = document.getElementById("yes-neutered");
    let notNeutered = document.getElementById("no-neutered");
    if (isNeutered) {
        neutered.classList.add('checked');
    } else {
        notNeutered.classList.add('checked');
    }
}

// function for adding picture to galleries
// creates img element and appends as child 
// to appro. element 
// takes as input src to be used in <img> tag
function addPicture(src) {
    let miniGallery = document.getElementById('pictures-left');
    let gallery = document.getElementById('pic-right-slider');
    let img = document.createElement('img');
    let img2 = document.createElement('img');
    
    img.setAttribute('src', src); // parameter is used here
    img2.setAttribute('src', src); // parameter is used here

    miniGallery.appendChild(img);
    gallery.appendChild(img2);
}

// function for setting birthday
// takes as input birthday in text
function setBDay(birthday) {
    document.getElementById('birthday').textContent = birthday;
}

// for setting description
function setDescription(desc) {
    document.getElementById('description').textContent = desc;
}

// for setting location and phone number
function setContact(loc, num) {
    document.getElementById('location').textContent = loc;
    document.getElementById('contact-number').textContent = num;
}

// function for setting size
// taks as input size in text
function setSize(size) {
    document.getElementById('size').textContent = size;
}

// for setting name
function setName(name) {
    document.getElementById('name').textContent = name;
}

// for setting breed
function setBreed(breed) {
    document.getElementById('breed').textContent = breed;
}

function setSize(size) {
    document.getElementById('size').textContent = size;
}

// function triggered when different picture
// is chosen from mini gallery
function changePicture(target) {
    let index = 0;
    let galleryChildren = document.getElementById('pic-right-slider').children;
    let children = document.getElementById('pictures-left').children;
    
    for (let i in children) {
        if (children[i] == target) {
            index = i;
        }
    }

    galleryChildren[index].scrollIntoView({'behavior': 'smooth'});  
}

// function triggered when add to wishlist btn
// has been pressed
function addToWishlist() {
    console.log('Add to wishlist');
    // ...
    // do something here
}

init();