document.addEventListener("DOMContentLoaded", async function () {
    const supabase =  window.supabase.createClient("https://idiqjlywytsddktbcvvc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaXFqbHl3eXRzZGRrdGJjdnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDAyMjQsImV4cCI6MjA1NTcxNjIyNH0.Q4HGFs832rIw2jhlKvFg2LsCgQuA7hEw91eedAApY60");
    console.log("Supabase success.", supabase);

    const urlParams = new URLSearchParams(window.location.search);
    const animalId = urlParams.get("animal_id");

    async function fetchListings(){

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
            let selectedProvince = e.target.value; // Get the selected province
            locationObject.showCities('#cities', selectedProvince);
        }
        
        init();

        if (!animalId) return;

        const {data, error} = await supabase.from("animal_listing").select("*").eq("animal_id", animalId).single();

        if (error){
            console.error("Error fetching listing: ", error);
            return;
        }
        document.getElementById("name").value = data.animal_name || "";
        document.getElementById("dob").value = data.dob || "";
        document.getElementById("species").value = data.species || "";
        document.getElementById("breed").value = data.breed || "";
        document.getElementById("size").value = data.size || "";
        document.getElementById("description").value = data.description || "";
        document.getElementById("contact").value = data.contact_info || "";
        document.getElementById("provinces").value = data.region || "";
        document.getElementById("cities").value = data.city || "";
        
        // Trigger city population after setting the province
        if (data.region) {
            provinceChange({ target: document.getElementById("provinces") });
        }

        //radio buttons
        if (data.sex) document.querySelector(`input[name='sex'][value='${data.sex}']`).checked = true;
        if (data.activeness) document.querySelector(`input[name='activeness'][value='${data.activeness}']`).checked = true;
        if (data.temperament) document.querySelector(`input[name='temperament'][value='${data.temperament}']`).checked = true;


        if (data.Is_neutered.toString) document.querySelector(`input[name='neutered'][value='${data.Is_neutered}']`).checked = true;

        //load image
        if (data.image_URL){
            let photoSlot = document.querySelector(".photo-slot");
            photoSlot.innerHTML = `<img src="${data.image_URL}" width="100%" height="100%">`;
            photoSlot.dataset.imageUrl = data.image_URL;
        }
    }


    //update record
    async function updateListing(){
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


        let images = [];
        document.querySelectorAll(".photo-slot").forEach(slot => {
            if (slot.dataset.imageUrl) images.push(slot.dataset.imageUrl);
        });

        const { error } = await supabase
        .from("animal_listing")
        .update({
            animal_name: name,
            species,
            breed,
            sex,
            dob,
            size,
            activeness,
            temperament,
            Is_neutered,
            contact_info: contact,
            region,
            city,
            description,
            image_URL: images.length > 0 ? images[0] : null
        })
        .eq("animal_id", animalId);

    if (error) {
        console.error("Error updating listing:", error);
        alert("Failed to update listing.");
    } else {
        alert("Listing updated successfully!");
        window.location.href = `../pages/view-lising.html?animal_id=${animalId}`;
    }

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


    const save = document.querySelector(".save-create-btn");

    save.addEventListener("click", async function(event){
        event.preventDefault();
        if(animalId){
            await updateListing();
        }

    });

    fetchListings();
});

