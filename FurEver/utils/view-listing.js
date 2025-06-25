document.addEventListener("DOMContentLoaded", async function(){
    const supabase =  window.supabase.createClient("https://idiqjlywytsddktbcvvc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaXFqbHl3eXRzZGRrdGJjdnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDAyMjQsImV4cCI6MjA1NTcxNjIyNH0.Q4HGFs832rIw2jhlKvFg2LsCgQuA7hEw91eedAApY60");
    console.log("Supabase success.", supabase);

    let user = await getUser();
    if(!user){
        alert("You must be logged in to access this page.");
        window.location.href="../pages/signin_Furever.html";
    }

    async function getUser(){
        const { data, error } = await supabase.auth.getUser();
        return error ? null : data.user;
    }

    async function fetchListingDetails(listingId){
        let { data: listing, error } = await supabase
            .from("animal_listing")
            .select("*")
            .eq("animal_id", listingId)
            .single();
        
            if (error || !listing) {
                console.error("Error fetching listing:", error);
                document.getElementById("listing-wrapper").innerHTML = "<p>Listing not found.</p>";
                return;
            }
        let name = listing.Is_adopted? `${listing.animal_name} (ADOPTED)` : listing.animal_name;
        document.getElementById("name").textContent = name;
        document.getElementById("breed").textContent = listing.breed;
        document.getElementById("size").textContent = listing.size;
        
        //date format
        let dob = listing.dob;  

        if (dob) {
            let formattedDOB = new Date(dob).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });

            document.getElementById("birthday").textContent = formattedDOB;
        }else{
            document.getElementById("birthday").textContent = "Unknown";
        }

        document.getElementById("description").textContent = listing.description;
        document.getElementById("contact-number").textContent = listing.contact_info;
        document.getElementById("location").textContent = `${listing.city}, ${listing.region}`;

        //gender icons
        if (listing.sex === "Male"){
            document.getElementById("male-trigger").checked = true;
        }else if (listing.sex === "Female"){
            document.getElementById("female-trigger").checked = true;
        }

        //activeness and temperament
        let activeness = parseInt(listing.activeness, 10);
        let temperament = parseInt(listing.temperament, 10);

        function setActiveButton(selector, level) {
            let buttons = document.querySelectorAll(`${selector} .radio-btn`);

            buttons.forEach((btn, index) => {
                if (index === (level - 1)) {
                    btn.classList.add('checked');
                }
            });
        }

        setActiveButton("#activeness", activeness);
        setActiveButton("#temperament", temperament);

        // Neutered status
        let neutered = document.getElementById("yes-neutered");
        let notNeutered = document.getElementById("no-neutered");

        if (listing.Is_neutered == true){
            neutered.classList.add('checked');
        }else{
            notNeutered.classList.add('checked');
        }
        
        // Display the uploaded image
        console.log(listing.image_URL);

        if (listing.image_URL) {
            let imageUrls;
            try {
                imageUrls = listing.image_URL.split(",").map(url => url.trim()); 
            } catch (e) {
                console.error("Failed to parse image_URL:", e);
                imageUrls = [];
            }

            let imageContainer = document.getElementById("pic-right-slider");
            let imageSlots = document.getElementById("pictures-left");
            let pictures = document.getElementById("pictures");

            imageContainer.innerHTML = "";
            imageSlots.innerHTML = "";
            
            if(imageUrls.length > 0){
                let image = document.createElement('img');
                image.setAttribute('src', imageUrls[0]);
                imageContainer.appendChild(image);
            }

           if (imageUrls.length > 1){
            imageSlots.style.display = "grid";
            pictures.style.gridTemplateColumns = "1fr 2fr";
            imageUrls.slice(1).forEach((url, index) => {
            const thumb = document.createElement("img");
            thumb.src = url;
            thumb.setAttribute("data-slot", index + 1);
            imageSlots.appendChild(thumb);
            });
            }
        }

        localStorage.setItem('listing_creator_id', listing.user_id);
        console.log(listing.user_id);
    
}

    // Get listing ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get("animal_id");

    if (listingId) {
        fetchListingDetails(listingId);
    } else {
        document.getElementById("listing-wrapper").innerHTML = "<p>Invalid listing ID.</p>";
        window.location.href = "../pages/home.html";
    }

    //wish list feature here
    async function addToWsihlist(listingId, animalName, imageUrl){
         // check if record already exists
        const { data: existingEntry, error: fetchError } = await supabase.from("wishlist").select("animal_id").eq("user_id", user.id).eq("animal_id", listingId).single();

        if (fetchError){
            console.error("Error checking wishlist: ", fetchError);
        }

        if(existingEntry){
            alert("This animal is already saved in your wish list!");
        }else{
            const {data, error} = await supabase
            .from("wishlist")
            .insert([{
                    user_id: user.id,
                    animal_id: listingId,
                    animal_name: animalName,
                    image_URL: imageUrl
                    }
                ]);
    
            if (error){
                console.error("Error adding to wishlist: ", error);
                    alert("Failed to add to wishlist.");
                }else{
                    alert("Added to wishlist!");
                }

        }
        }
    
    //wish list button listener
    const wishList = document.getElementById("add-to-wishlist-btn");
    wishList.addEventListener("click", async function() {
        const listingId = urlParams.get("animal_id"); 
        if(!listingId){
            alert("Invalid listing Id");
            return;
        }

        const {data: listing, error} = await supabase.from("animal_listing").select("animal_name, image_URL").eq("animal_id", listingId).single();

        if (error || !listing){
            console.error("Error fetching listing: ", error);
            alert("Could not retrieve listing data");
            return;
        }

        addToWsihlist(listingId, listing.animal_name, listing.image_URL);
    });
    
});
