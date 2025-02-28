document.addEventListener("DOMContentLoaded", function () {
    let profiles = JSON.parse(localStorage.getItem("adoptionProfiles")) || [];
    let listContainer = document.getElementById("adoptionList");

    listContainer.innerHTML = "";

    profiles.forEach((profile, index) => {
        let listItem = document.createElement("div");
        listItem.classList.add("profile-item");

        let imageSrc = profile.images?.length > 0 ? profile.images[0] : "placeholder.jpg";

        listItem.innerHTML = `
            <img src="${imageSrc}" alt="Profile Image" width="50px" height="50px" style="border-radius: 5px; margin-right: 10px;">
            <span>${profile.name} ${profile.status ? "(Adopted)" : ""}</span>
            <div class="dropdown">
                <button>⋮</button>
                <div class="dropdown-content">
                    <button onclick="viewProfile(${index})">View</button>
                    <button onclick="editProfile(${index})">Edit</button>
                    <button onclick="markAsAdopted(${index})">Mark as Adopted</button>
                    <button onclick="deleteProfile(${index})">Delete</button>
                </div>
            </div>
        `;

        listContainer.appendChild(listItem);
    });
});

function viewProfile(index) {
    localStorage.setItem("viewProfileIndex", index);
    window.location.href = "viewprofile.html";
}

function editProfile(index) {
    localStorage.setItem("editProfileIndex", index);
    window.location.href = "createlist.html";
}

function markAsAdopted(index) {
    let profiles = JSON.parse(localStorage.getItem("adoptionProfiles")) || [];
    profiles[index].status = "Adopted";
    localStorage.setItem("adoptionProfiles", JSON.stringify(profiles));
    alert("Marked as Adopted!");
    location.reload();
}

function deleteProfile(index) {
    let profiles = JSON.parse(localStorage.getItem("adoptionProfiles")) || [];
    profiles.splice(index, 1);
    localStorage.setItem("adoptionProfiles", JSON.stringify(profiles));
    alert("Profile deleted!");
    location.reload();
}

function redirectToCreateList() {
    window.location.href = "createlist.html";
}
