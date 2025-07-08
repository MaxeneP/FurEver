document.addEventListener("DOMContentLoaded", async function () {
    const supabase =  window.supabase.createClient("https://idiqjlywytsddktbcvvc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaXFqbHl3eXRzZGRrdGJjdnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDAyMjQsImV4cCI6MjA1NTcxNjIyNH0.Q4HGFs832rIw2jhlKvFg2LsCgQuA7hEw91eedAApY60");
    console.log("Supabase success.", supabase);

    let user = await getUser();
    if(!user){
        alert("You must be logged in to create a listing");
        window.location.href="../pages/signin_Furever.html";
    }

    async function getUser(){
        const { data, error } = await supabase.auth.getUser();
        return error ? null : data.user;
    }

    //uploads images to supabase storage
    async function uploadImage(file, userId){
        if(!userId){
            console.error("User ID is missing, cannot upload");
            return null;
        }
        const folderName = `user_${userId}`;
        const fileName = `${folderName}/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("images") //bucket name
            .upload(fileName, file);

        if (error){
            console.error("Image upload failed.", error);
            return null;
        }
        return `${"https://idiqjlywytsddktbcvvc.supabase.co"}/storage/v1/object/public/images/${fileName}`;
    }

    document.querySelector(".photo-slot").addEventListener("click", function(){
        document.getElementById("fileInput").click();
    });

    const fileinput = document.getElementById("fileInput");

    fileinput.addEventListener("change", async function(event){
        event.preventDefault();

        let file = event.target.files[0];
        if (!file) return;

        let imageUrl = await uploadImage(file, user.id);
        if (imageUrl){
            let photoSlot = document.querySelector(".photo-slot");
            photoSlot.innerHTML = `<img src="${imageUrl}" width="100%" height="100%">`;
            photoSlot.dataset.imageUrl = imageUrl;
        }
    });
    let locationObject = new City();

    function init() {
        let provinceDrop = document.getElementById('provinces');
        locationObject.showProvinces('#provinces');
        
        window.addEventListener('click', eventDelegation);
        provinceDrop.addEventListener('change', provinceChange);
    }


    // for click events
    function eventDelegation(e) {
        console.log(e.target)
        if (e.target != document.querySelector('#burger-menu-trigger')) {
            let cb = document.getElementById('burger-menu-trigger')
            cb.checked = false;
        }
        if (e.target == document.getElementById('tnc-open-btn')) {
            let tnc = document.getElementById('tnc-wrapper');
            tnc.classList.toggle('hidden');
            tnc.classList.toggle('flex');
        }
        if (e.target == document.getElementById('close-tnc-btn')) {
            let tnc = document.getElementById('tnc-wrapper');
            tnc.classList.toggle('hidden');
            tnc.classList.toggle('flex');
        }
        if (e.target.classList.contains('toggle')) {
            let date = e.target.nextElementSibling.nextElementSibling;
            if (date.disabled) {
                date.disabled = false;
            } else {
                date.disabled = true;
            }
        }
        if (e.target.classList.contains('file-toggle')) {
            let label = e.target.nextElementSibling.nextElementSibling.nextElementSibling;
            label.classList.toggle('file-label-disabled');
            label.classList.toggle('file-label-hover');
        }
        
    }

    function provinceChange(e) {
        locationObject.showCities('#cities');
    }

    init();


    const save = document.querySelector(".save-create-btn");

    save.addEventListener("click", async function(event){
        event.preventDefault();

        let name = document.getElementById("name").value;
        let dobInput = document.getElementById("dob").value;
        let dob = "";
        if (dobInput) {
            let dateObj = new Date(dobInput);
            let year = dateObj.getFullYear();
            let month = String(dateObj.getMonth() + 1).padStart(2, "0");
            let day = String(dateObj.getDate()).padStart(2, "0"); 
            dob = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
        }        

        console.log("Formatted DOB:", dob);
        
        let species = document.getElementById("species").value;
        let breed = document.getElementById("breed").value;
        let size = document.getElementById("size").value;
        let sex = document.querySelector("input[name='sex']:checked")?.value || "";
        let activeness = document.querySelector("input[name='activeness']:checked")?.value || "";
        let temperament = document.querySelector("input[name='temperament']:checked")?.value || "";
        let Is_neutered = document.querySelector("input[name='neutered']:checked")?.value || "";
        let description = document.getElementById("description").value;
        let contact = document.getElementById("contact").value;
        let region = document.getElementById("provinces").value;
        let city = document.getElementById("cities").value;

        if (!name || !contact) {
            alert("Please fill in required fields (Name, Contact)");
            return;
        }
        
        let images = [];
        document.querySelectorAll(".photo-slot").forEach(slot => {
            if (slot.dataset.imageUrl) images.push(slot.dataset.imageUrl);
        });

        
        //insert animal data to animal listing table
        let { data, error } = await supabase
            .from("animal_listing")
            .insert([{
                user_id: user.id,
                animal_name: name,
                species,
                breed,
                sex,
                dob,
                size,
                activeness,
                temperament,
                Is_neutered,
                Is_adopted: false,
                contact_info: contact,
                region,
                city,
                description,
                image_URL: images.length > 0 ? images[0] : null
        }])
            .select("animal_id")
            .single();

        if (error) {
            console.error("Error saving listing:", error);
            alert("Failed to save listing.");
        } else {
            alert("Listing saved successfully!");
            let listingId = data.animal_id;
             window.location.href = `../pages/view-lising.html?animal_id=${listingId}`;
        }

    });
});

