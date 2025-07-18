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

    const urlParams = new URLSearchParams(window.location.search);
    const animalId = urlParams.get("animal_id");

    async function fetchListings() {
        let locationObject = new City();

        function init() {
            let provinceDrop = document.getElementById('provinces');
            locationObject.showProvinces('#provinces');
            window.addEventListener('click', eventDelegation);
            provinceDrop.addEventListener('change', provinceChange);
            window.addEventListener('resize', fontChange);
            fontChange();
        }

        function fontChange() {  
            parent = document.querySelector('.photo-slot')
            uploadIcons = document.querySelectorAll('.photo-slot>i');
            for (let icon of uploadIcons) {
                fontSize = parent.offsetHeight - 50;
                icon.style.fontSize = `${fontSize}px`;
            }
        }

        function eventDelegation(e) {
            if (e.target !== document.querySelector('#burger-menu-trigger')) {
                let cb = document.getElementById('burger-menu-trigger');
                if (cb) cb.checked = false;
            }

            if (e.target.classList.contains('toggle')) {
                let nextElement = e.target.nextElementSibling?.nextElementSibling;
                if (nextElement && (nextElement.type === 'date' || nextElement.tagName === 'TEXTAREA')) {
                    nextElement.disabled = !e.target.checked;
                }
            }

            if (e.target.classList.contains('file-toggle')) {
                let fileInput = e.target.nextElementSibling?.nextElementSibling;
                let label = fileInput?.nextElementSibling;

                if (fileInput && label) {
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
            }
        }

        function provinceChange(e) {
            let selectedProvince = e.target.value;
            locationObject.showCities('#cities', selectedProvince);
        }

        init();


        if (!animalId) return;

        const { data, error } = await supabase.from("animal_listing").select("*").eq("animal_id", animalId).single();
    if (error) {
        console.error("Error fetching listing: ", error);
        return;
    }

    const { data: healthData, error: healthError } = await supabase.from("health_record").select("*").eq("animal_id", animalId).single();
    if (healthError) {
        console.error("Error fetching health records: ", healthError);
    }

    const { data: paperData, error: paperError } = await supabase.from("paperwork").select("*").eq("animal_id", animalId).single();
    if (paperError) {
        console.error("Error fetching paperwork records: ", paperError);
    }

    if (data.image_URL) {
        let imageUrls;
        try {
            imageUrls = data.image_URL.split(",").map(url => url.trim());
        } catch (e) {
            console.error("Failed to parse image_URL:", e);
            imageUrls = [];
        }

        const slots = document.querySelectorAll(".photo-slot");
        imageUrls.slice(0, 6).forEach((url, index) => {
            if (slots[index]) {
                slots[index].innerHTML = `<img src="${url}" width="100%" height="100%"> \
                    <button class="remove-btn" type="button">&#10006;</button>`;
                slots[index].dataset.imageUrl = url;
                slots[index].classList.add("has-image");
            }
        });
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

    if (data.region) {
        provinceChange({ target: document.getElementById("provinces") });
    }

    if (data.sex) document.querySelector(`input[name='sex'][value='${data.sex}']`).checked = true;
    if (data.activeness) document.querySelector(`input[name='activeness'][value='${data.activeness}']`).checked = true;
    if (data.temperament) document.querySelector(`input[name='temperament'][value='${data.temperament}']`).checked = true;
     document.querySelector(`input[name='neutered'][value='${data.Is_neutered.toString()}']`).checked = true;

    

    // Health data
    if (healthData) {
        if (healthData.last_vet_visit) {
            document.getElementById("vet-visit-cb").checked = true;
            document.getElementById("vet-visit-date").value = healthData.last_vet_visit;
            document.getElementById("vet-visit-date").disabled = false;
        }

        if (healthData.health_desc) {
            document.getElementById("other-health-cb").checked = true;
            document.getElementById("other-health").value = healthData.health_desc;
            document.getElementById("other-health").disabled = false;
        }

        if (healthData.rabies_date) {
            document.getElementById("rabies-cb").checked = true;
            document.getElementById("rabies-date").value = healthData.rabies_date;
            document.getElementById("rabies-date").disabled = false;
        }

        if (healthData["5-in-1_date"]) {
            document.getElementById("5-in-1-cb").checked = true;
            document.getElementById("5-in-1-date").value = healthData["5-in-1_date"];
            document.getElementById("5-in-1-date").disabled = false;
        }

        if (healthData["3-in-1_date"]) {
            document.getElementById("3-in-1-cb").checked = true;
            document.getElementById("3-in-1-date").value = healthData["3-in-1_date"];
            document.getElementById("3-in-1-date").disabled = false;
        }

        if (healthData.deworm_date) {
            document.getElementById("deworm-cb").checked = true;
            document.getElementById("deworm-date").value = healthData.deworm_date;
            document.getElementById("deworm-date").disabled = false;
        }

        if (healthData.vacc_desc) {
            document.getElementById("other-vaccine-cb").checked = true;
            document.getElementById("vaccination-other").value = healthData.vacc_desc;
            document.getElementById("vaccination-other").disabled = false;
        }
    }

    // Paperwork data
    if (paperData) {
        if (paperData.vac_card_url) {
            document.getElementById("p-vaccination-cb").checked = true;
            const vacLabel = document.querySelector('label[for="p-vaccination"]');
            vacLabel.textContent = "File uploaded";
            vacLabel.classList.add('file-selected');
            document.getElementById("p-vaccination").disabled = false;
        }

        if (paperData.med_cert_url) {
            document.getElementById("p-medical-certificate-cb").checked = true;
            const medLabel = document.querySelector('label[for="p-medical-certificate"]');
            medLabel.textContent = "File uploaded";
            medLabel.classList.add('file-selected');
            document.getElementById("p-medical-certificate").disabled = false;
        }

        if (paperData.ped_cert_url) {
            document.getElementById("p-pedigree-cb").checked = true;
            const pedLabel = document.querySelector('label[for="p-pedigree"]');
            pedLabel.textContent = "File uploaded";
            pedLabel.classList.add('file-selected');
            document.getElementById("p-pedigree").disabled = false;
        }
    }
}


    //update record
    async function updateListing(){
        let name = document.getElementById("name").value;
        let dob = document.getElementById("dob")?.value ? new Date(document.getElementById("dob").value).toISOString().slice(0, 10) : null;
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


        let images = [];
        document.querySelectorAll(".photo-slot").forEach(slot => {
            if (slot.dataset.imageUrl){
                images.push(slot.dataset.imageUrl);
            }
        });

        const { data, error } = await supabase
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
            image_URL: images.join(","),
        })
        .eq("animal_id", animalId);

    if (error) {
        console.error("Error updating listing:", error);
        alert("Failed to update listing.");
    
    let vetcb = document.getElementById("vet-visit-cb");
    let healthcb = document.getElementById("other-health-cb");
    let rabiescb = document.getElementById("rabies-cb");
    let fivenonecb = document.getElementById("5-in-1-cb");
    let threenonecb = document.getElementById("3-in-1-cb");
    let dewormcb = document.getElementById("deworm-cb");
    let othercb = document.getElementById("other-vaccine-cb");

     if (vetcb.checked || healthcb.checked || rabiescb.checked || fivenonecb.checked || threenonecb.checked || dewormcb.checked || othercb.checked) {
        let last_vet_visit = document.getElementById("vet-visit-date")?.value ? new Date(document.getElementById("vet-visit-date").value).toISOString().slice(0,10) : null;
        let health_desc = document.getElementById("other-health").value;
        let rabies_date = document.getElementById("rabies-date")?.value ? new Date(document.getElementById("rabies-date").value).toISOString().slice(0,10) : null;
        let fiveinone_date = document.getElementById("5-in-1-date")?.value ? new Date(document.getElementById("5-in-1-date").value).toISOString().slice(0,10) : null;
        let threeinone_date = document.getElementById("3-in-1-date")?.value ? new Date(document.getElementById("3-in-1-date").value).toISOString().slice(0,10) : null;
        let deworm_date = document.getElementById("deworm-date")?.value ? new Date(document.getElementById("deworm-date").value).toISOString().slice(0,10) : null;
        let vacc_desc = document.getElementById("vaccination-other").value;

        // Try to update first, if no record exists, insert new one
        let { data: existingHealth, error: checkError } = await supabase
            .from("health_record")
            .select("hr_id")
            .eq("animal_id", animalId)
            .single();

        if (existingHealth) {
            // Update existing record
            let { error: healthUpdateError } = await supabase
                .from("health_record")
                .update({
                    last_vet_visit,
                    health_desc,
                    rabies_date,
                    ["5-in-1_date"]: fiveinone_date,
                    ["3-in-1_date"]: threeinone_date,
                    deworm_date,
                    vacc_desc
                })
                .eq("animal_id", animalId);

            if (healthUpdateError) {
                console.error("Health record update error: ", healthUpdateError);
            }
        } else {
            // Insert new record
            let { error: healthInsertError } = await supabase
                .from("health_record")
                .insert([{
                    animal_id: animalId,
                    last_vet_visit,
                    health_desc,
                    rabies_date,
                    ["5-in-1_date"]: fiveinone_date,
                    ["3-in-1_date"]: threeinone_date,
                    deworm_date,
                    vacc_desc
                }]);

            if (healthInsertError) {
                console.error("Health record insert error: ", healthInsertError);
            }
        }
    }

    // Update paperwork
    let pvaccb = document.getElementById("p-vaccination-cb");
    let medcb = document.getElementById("p-medical-certificate-cb");
    let pedcb = document.getElementById("p-pedigree-cb");

    let user = await getUser();
    let medCertURL = null;
    let vacCardURL = null;
    let pedCertURL = null;

    let { data: existingPaperwork } = await supabase
        .from("paperwork")
        .select("*")
        .eq("animal_id", animalId)
        .single();

    let pvaccine = document.getElementById("p-vaccination")?.files[0];
    let pmed = document.getElementById("p-medical-certificate")?.files[0];
    let pped = document.getElementById("p-pedigree")?.files[0];

    if (pvaccb.checked) {
        if (pvaccine) {
            vacCardURL = await uploadImage(pvaccine, user.id);
        } else if (existingPaperwork?.vac_card_url) {
            vacCardURL = existingPaperwork.vac_card_url;
        }
    }

    if (medcb.checked) {
        if (pmed) {
            medCertURL = await uploadImage(pmed, user.id);
        } else if (existingPaperwork?.med_cert_url) {
            medCertURL = existingPaperwork.med_cert_url;
        }
    }

    if (pedcb.checked) {
        if (pped) {
            pedCertURL = await uploadImage(pped, user.id);
        } else if (existingPaperwork?.ped_cert_url) {
            pedCertURL = existingPaperwork.ped_cert_url;
        }
    }

    // Update or insert paperwork record
    if (existingPaperwork) {
        let { error: paperworkUpdateError } = await supabase
            .from("paperwork")
            .update({
                med_cert_url: medCertURL,
                vac_card_url: vacCardURL,
                ped_cert_url: pedCertURL
            })
            .eq("animal_id", animalId);

        if (paperworkUpdateError) {
            console.error("Paperwork update error:", paperworkUpdateError);
        }
    } else {
        let { error: paperworkInsertError } = await supabase
            .from("paperwork")
            .insert([{
                animal_id: animalId,
                med_cert_url: medCertURL,
                vac_card_url: vacCardURL,
                ped_cert_url: pedCertURL
            }]);

        if (paperworkInsertError) {
            console.error("Paperwork insert error:", paperworkInsertError);
        }
    }
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

    const save = document.querySelector(".save-create-btn");

    save.addEventListener("click", async function(event){
        event.preventDefault();
        if(animalId){
            await updateListing();
        }

    });

    fetchListings();
});
