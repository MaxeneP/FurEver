document.addEventListener("DOMContentLoaded", async function(){
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

        document.getElementById("name").textContent = listing.animal_name;
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
        let imageContainer = document.getElementById("pic-right-slider");
        let image = document.createElement('img');
        image.setAttribute('src', listing.image_URL);
        imageContainer.appendChild(image);
    
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
});
