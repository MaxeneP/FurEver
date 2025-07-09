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
    let currentUSlot = null;

    document.querySelectorAll(".photo-slot").forEach(slot => {
    slot.addEventListener("click", function () {
        currentUSlot = slot;
        fileinput.click();
        });
    });

    fileinput.addEventListener("change", async function(event){
        event.preventDefault();

        let file = event.target.files[0];
        if (!file || !currentUSlot) return;

        let imageUrl = await uploadImage(file, user.id);
        if (imageUrl){
            currentUSlot.innerHTML = `<img src="${imageUrl}" width="100%" height="100%"> 
                                        <button class="remove-btn" type="button">&#10006;</button>`;
            currentUSlot.dataset.imageUrl = imageUrl;
            currentUSlot.classList.add("has-image");
        }
        fileinput.value = "";
    });

    const photoGrid = document.getElementById("photoGrid");
    photoGrid.addEventListener("click", async function (e) {
    if (e.target.classList.contains("remove-btn")) {
        e.stopPropagation();
        
        const slot = e.target.closest(".photo-slot");
         const imageUrl = slot.dataset.imageUrl;
         
        if(imageUrl){
            const urlParts = imageUrl.split("/storage/v1/object/public/images/");
            const filePath = urlParts[1];
            if (filePath) {
                const { data, error } = await supabase
                    .storage
                    .from("images")
                    .remove([filePath]);

                if (error) {
                    console.error("Failed to delete image from Supabase:", error);
                } else {
                    console.log("Image deleted:", filePath);
                }
            }
        }
        slot.innerHTML = `<i class="fa fa-upload" aria-hidden="true"></i><button class="remove-btn" type="button"></button>`;
        slot.classList.remove("has-image");
        delete slot.dataset.imageUrl;
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
        tnc.classList.remove('hidden');
        tnc.classList.add('flex');
        }
                
        if (e.target == document.getElementById('close-tnc-btn')) {
        let tnc = document.getElementById('tnc-wrapper');
        tnc.classList.add('hidden');
        tnc.classList.remove('flex');
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
            let fileInput = e.target.nextElementSibling.nextElementSibling;
            let label = e.target.nextElementSibling.nextElementSibling.nextElementSibling;
            
            fileInput.disabled = !e.target.checked;
            
            if (e.target.checked) {
                label.classList.remove('file-label-disabled');
                label.classList.add('file-label-hover');
                label.textContent = 'Upload file';
            } else {
                label.classList.add('file-label-disabled');
                label.classList.remove('file-label-hover', 'file-selected');
                label.textContent = 'Upload file';
                fileInput.value = '';
            }
        }
        document.getElementById('p-vaccination').addEventListener('change', function(e) {
            if (e.target.files[0]) {
                const label = document.querySelector('label[for="p-vaccination"]');
                label.textContent = e.target.files[0].name;
                label.classList.add('file-selected');
            }
        });

        document.getElementById('p-medical-certificate').addEventListener('change', function(e) {
            if (e.target.files[0]) {
                const label = document.querySelector('label[for="p-medical-certificate"]');
                label.textContent = e.target.files[0].name;
                label.classList.add('file-selected');
            }
        });

        document.getElementById('p-pedigree').addEventListener('change', function(e) {
            if (e.target.files[0]) {
                const label = document.querySelector('label[for="p-pedigree"]');
                label.textContent = e.target.files[0].name;
                label.classList.add('file-selected');
            }
        });
        
    }

    function provinceChange(e) {
        locationObject.showCities('#cities');
    }

    init();

    const save = document.querySelector(".save-create-btn");

    save.addEventListener("click", async function(event){
        event.preventDefault();

        let name = document.getElementById("name").value;
        let dob = document.getElementById("dob")?.value ? new Date(document.getElementById("dob").value).toISOString().slice(0, 10) : null;
        console.log("Formatted DOB:", dob);

        //medical history & vaccination records
        let vetcb = document.getElementById("vet-visit-cb");
        let healthcb = document.getElementById("other-health-cb");
        let rabiescb = document.getElementById("rabies-cb");
        let fivenonecb = document.getElementById("5-in-1-cb");
        let threenonecb = document.getElementById("3-in-1-cb");
        let dewormcb = document.getElementById("deworm-cb");
        let othercb = document.getElementById("other-vaccine-cb");

        //paperwork
        let pvaccb = document.getElementById("p-vaccination-cb");
        let medcb = document.getElementById("p-medical-certificate-cb");
        let pedcb = document.getElementById("p-pedigree-cb");

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
        let tncCheckbox = document.getElementById("tnc-cb");

        if (!tncCheckbox.checked) {
        return alert("You must agree to the Terms and Conditions before signing up.");
        }

        if (!name || !contact || !description || !activeness || !temperament || !breed || !species || !size || !sex || !Is_neutered) {
            alert("Please fill in required fields.");
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
                dob: dob,
                size,
                activeness,
                temperament,
                Is_neutered,
                Is_adopted: false,
                contact_info: contact,
                region,
                city,
                description,
                image_URL: images.join(","),
        }])
            .select("animal_id")
            .single();

        //insert medical history records
        if (vetcb.checked || healthcb.checked || rabiescb.checked || fivenonecb.checked || threenonecb.checked || dewormcb.checked || othercb.checked){
            let last_vet_visit = document.getElementById("vet-visit-date")?.value ? new Date(document.getElementById("vet-visit-date").value).toISOString().slice(0,10) : null;
            let health_desc = document.getElementById("other-health").value;
            let rabies_date = document.getElementById("rabies-date")?.value ? new Date(document.getElementById("rabies-date").value).toISOString().slice(0,10) : null;
            let fiveinone_date = document.getElementById("5-in-1-date")?.value ? new Date(document.getElementById("5-in-1-date").value).toISOString().slice(0,10) : null;
            let threeinone_date = document.getElementById("3-in-1-date")?.value ? new Date(document.getElementById("3-in-1-date").value).toISOString().slice(0,10) : null;
            let deworm_date = document.getElementById("deworm-date")?.value ? new Date(document.getElementById("deworm-date").value).toISOString().slice(0,10) : null;
            let vacc_desc = document.getElementById("vaccination-other").value;

            let {error: medError} = await supabase
                .from("health_record")
                .insert([{
                    animal_id: data.animal_id,
                    last_vet_visit,
                    health_desc,
                    rabies_date,
                    ["5-in-1_date"]: fiveinone_date,
                    ["3-in-1_date"]: threeinone_date,
                    deworm_date,
                    vacc_desc
                }]);
            if(medError){
                console.error("Health record insert error: ", medError);
            }
        }
        //paper work table
            let medCertURL = null;
            let vacCardURL = null;
            let pedCertURL = null;
            let pvaccine =  document.getElementById("p-vaccination")?.files[0];
            let pmed = document.getElementById("p-medical-certificate")?.files[0];
            let pped = document.getElementById("p-pedigree")?.files[0];

            console.log("File inputs:", { pvaccine, pmed, pped });
            console.log("Checkboxes:", { 
                pvaccb: pvaccb.checked, 
                medcb: medcb.checked, 
                pedcb: pedcb.checked 
            });

            if (pvaccb.checked && pvaccine) {
                console.log("Uploading vaccination card...");
                vacCardURL = await uploadImage(pvaccine, user.id);
                console.log("Vaccination card URL:", vacCardURL);
            }

            if (medcb.checked && pmed) {
                console.log("Uploading medical certificate...");
                medCertURL = await uploadImage(pmed, user.id);
                console.log("Medical certificate URL:", medCertURL);
            }

            if (pedcb.checked && pped) {
                console.log("Uploading pedigree...");
                pedCertURL = await uploadImage(pped, user.id);
                console.log("Pedigree URL:", pedCertURL);
            }
             let { error: paperError } = await supabase
                .from("paperwork")
                .insert([{
                    animal_id: data.animal_id,
                    med_cert_url: medCertURL,
                    vac_card_url: vacCardURL,
                    ped_cert_url: pedCertURL
                }]);

            if (paperError) {
                console.error("Paperwork insert error:", paperError);
            }

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

