document.addEventListener("DOMContentLoaded", function () {
    let editIndex = localStorage.getItem("editProfileIndex");

    if (editIndex !== null) {
        let adoptionProfiles = JSON.parse(localStorage.getItem("adoptionProfiles")) || [];
        let profile = adoptionProfiles[editIndex];

        if (profile) {
            document.getElementById("name").value = profile.name || "";
            document.getElementById("dob").value = profile.dob || "";
            document.getElementById("breed").value = profile.breed || "";

            let sexInput = document.querySelector(`input[name="sex"][value="${profile.sex}"]`);
            if (sexInput) sexInput.checked = true;

            let activenessInput = document.querySelector(`input[name="activeness"][value="${profile.activeness}"]`);
            if (activenessInput) activenessInput.checked = true;

            let temperamentInput = document.querySelector(`input[name="temperament"][value="${profile.temperament}"]`);
            if (temperamentInput) temperamentInput.checked = true;

            let neuteredInput = document.querySelector(`input[name="neutered"][value="${profile.neutered}"]`);
            if (neuteredInput) neuteredInput.checked = true;

            document.getElementById("description").value = profile.description || "";
            document.getElementById("contact").value = profile.contact || "";
            document.getElementById("region").value = profile.region || "";
            document.getElementById("city").value = profile.city || "";
            document.getElementById("address").value = profile.address || "";
        }
    }
});

function saveProfile() {
    let name = document.getElementById("name").value;
    let dob = document.getElementById("dob").value;
    let breed = document.getElementById("breed").value;
    let sex = document.querySelector("input[name='sex']:checked")?.value || "";
    let activeness = document.querySelector("input[name='activeness']:checked")?.value || "";
    let temperament = document.querySelector("input[name='temperament']:checked")?.value || "";
    let neutered = document.querySelector("input[name='neutered']:checked")?.value || "";
    let description = document.getElementById("description").value;
    let contact = document.getElementById("contact").value;
    let region = document.getElementById("region").value;
    let city = document.getElementById("city").value;
    let address = document.getElementById("address").value;

    if (!name || !contact) {
        alert("Please fill in required fields (Name, Contact)");
        return;
    }

    let newProfile = { name, dob, breed, sex, activeness, temperament, neutered, description, contact, region, city, address };

    let profiles = JSON.parse(localStorage.getItem("adoptionProfiles")) || [];
    let editIndex = localStorage.getItem("editProfileIndex");

    if (editIndex !== null) {
        profiles[editIndex] = newProfile;
        localStorage.removeItem("editProfileIndex");
    } else {
        profiles.push(newProfile);
    }

    localStorage.setItem("adoptionProfiles", JSON.stringify(profiles));

    alert("Profile saved successfully!");
    window.location.href = "savedlist.html";
}

// Function to open file input when clicking a photo slot
function uploadImage(index) {
    let fileInput = document.getElementById("fileInput");
    fileInput.dataset.index = index; // Store the index of the clicked slot
    fileInput.click();
}

// Function to handle image upload and display it in the correct slot
function handleImageUpload(event) {
    let file = event.target.files[0]; // Get the selected file
    let index = event.target.dataset.index; // Get the stored slot index
    if (!file || index === undefined) return;

    let reader = new FileReader();
    reader.onload = function (e) {
        let photoGrid = document.getElementById("photoGrid");
        let slots = photoGrid.getElementsByClassName("photo-slot");

        if (index < slots.length) {
            slots[index].innerHTML = `<img src="${e.target.result}" width="100%" height="100%">`;
        }
    };
    reader.readAsDataURL(file);
}

