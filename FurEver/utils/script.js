document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.getElementById("menu-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    menuIcon.addEventListener("click", function () {
        dropdownMenu.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
        if (!menuIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
        }
    });
    
    const bookmarks = document.querySelectorAll(".bookmark-icon");

    // Toggle active class on click
    bookmarks.forEach(bookmark => {
        bookmark.addEventListener("click", function () {
            this.classList.toggle("active");
        });
    });

    // Pop-up functionality
    const cards = document.querySelectorAll(".card");
    const popup = document.getElementById("popup");
    const popupName = document.getElementById("popup-name");
    const popupBreed = document.getElementById("popup-breed");
    const popupBirthday = document.getElementById("popup-birthday");
    const popupSex = document.getElementById("popup-sex");
    const popupSize = document.getElementById("popup-size");
    const popupActiveness = document.getElementById("popup-activeness");
    const popupTemperament = document.getElementById("popup-temperament");
    const closeBtn = document.querySelector(".close-btn");

    cards.forEach(card => {
        card.addEventListener("click", function () {
            if (!card.classList.contains("adopted")) { 
                popupName.textContent = card.getAttribute("data-name");
                popupBreed.textContent = card.getAttribute("data-breed");
                popupBirthday.textContent = card.getAttribute("data-birthday");
                popupSex.textContent = card.getAttribute("data-sex");
                popupSize.textContent = card.getAttribute("data-size");
                popupActiveness.textContent = card.getAttribute("data-activeness");
                popupTemperament.textContent = card.getAttribute("data-temperament");
                popup.style.display = "block";
            }
        });
    });

    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});