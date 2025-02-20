document.addEventListener("DOMContentLoaded", function () {
    let index = localStorage.getItem("viewProfileIndex");

    if (index !== null) {
        let profiles = JSON.parse(localStorage.getItem("adoptionProfiles")) || [];
        let profile = profiles[index];

        if (profile) {
            document.getElementById("profileName").textContent = profile.name;
            document.getElementById("profileDOB").textContent = profile.dob;
            document.getElementById("profileBreed").textContent = profile.breed;
            document.getElementById("profileSex").textContent = profile.sex;
            document.getElementById("profileActiveness").textContent = profile.activeness;
            document.getElementById("profileTemperament").textContent = profile.temperament;
            document.getElementById("profileNeutered").textContent = profile.neutered;
            document.getElementById("profileDescription").textContent = profile.description;
            document.getElementById("profileContact").textContent = profile.contact;
            document.getElementById("profileLocation").textContent = `${profile.region}, ${profile.city}, ${profile.address}`;

            let profileImagesDiv = document.getElementById("profileImages");
            if (profile.images && profile.images.length > 0) {
                profile.images.forEach(imgSrc => {
                    let imgElement = document.createElement("img");
                    imgElement.src = imgSrc;
                    imgElement.width = 150;
                    imgElement.style.margin = "5px";
                    profileImagesDiv.appendChild(imgElement);
                });
            }
        }
    }
});
