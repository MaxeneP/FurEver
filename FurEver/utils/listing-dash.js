document.addEventListener("DOMContentLoaded", async function () {
    const supabase =  window.supabase.createClient("https://idiqjlywytsddktbcvvc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaXFqbHl3eXRzZGRrdGJjdnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDAyMjQsImV4cCI6MjA1NTcxNjIyNH0.Q4HGFs832rIw2jhlKvFg2LsCgQuA7hEw91eedAApY60");
    console.log("Supabase success.", supabase);

    let user = await getUser();
    if(!user){
        alert("You must be logged in to access this page.");
        window.location.href="../pages/signin_Furever.html";
    }

    async function getUser(){
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            return null;
        }

        localStorage.setItem("user_id", data.user.id);
        
        return data.user;
    
    }

    document.getElementById("new-listing-btn").addEventListener("click", function(event){
        event.preventDefault();
        
        window.location.href = "../pages/createlist.html";
    });

    async function fetchListings(){
        const {data, error} = await supabase
            .from("animal_listing")
            .select("animal_id, animal_name, Is_adopted")
            .eq("user_id", user.id);
        
        if (error){
            console.error("Error fetching listings: ", error);
            return;
        } /*
        data.forEach(listing => { // check if adopted
            let name = listing.Is_adopted? `${listing.animal_name} (ADOPTED)` : listing.animal_name;
            createEntry(name, listing.animal_id);
        }); */
    }

    function init(){
        window.addEventListener('click', eventDelegation);
        fetchListings();
    }
    
    
    // event delegation for click events // buttons per record
    function eventDelegation(e) {
        if (e.target != document.querySelector('#burger-menu-trigger')) {
            let cb = document.getElementById('burger-menu-trigger')
            cb.checked = false;
        }
        if (e.target.closest('.listing-settings-button')) {
            popup = e.target.closest('.listing-action').nextElementSibling;
            popup.setAttribute('style', 'display: flex');
        }
        if (e.target.classList.contains('view-listing')) {
            id = e.target.closest('.listing').id
            viewListing(id);
        }
        if (e.target.classList.contains('edit')) {
            id = e.target.closest('.listing').id
            editListing(id);
        }
        if (e.target.classList.contains('mark-adopted')) {
            id = e.target.closest('.listing').id
            markAdopted(id);
        }
        if (e.target.classList.contains('delete-listing')) {
            id = e.target.closest('.listing').id
            deleteListing(id);
        }
        document.querySelectorAll('.listing').forEach(listing => {
            if (e.target.closest('.listing') != listing) {
                listing.lastElementChild.setAttribute('style', 'display: none');
            }
        })
    }
    
    init();
    
    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
    
    
    // removes all listings displayed
    function clearListings() {
        let pane = document.getElementById('body-bottom');
        while (pane.firstElementChild) {
            pane.removeChild(pane.firstElementChild);
        }
    }
    
    
    // creates an entry for a listing
    // can be used when initially fetching data
    // id is id of listing in db, name is name of listing
    // view is how many clicks
    // save is how many bookmarks
    // image is main picture
    function createEntry(name, image, view, save, description, id) {
        // creating listing and setting listing id to id
        let pane = document.getElementById('body-bottom');
        let listing = document.createElement('div');
        listing.classList.add('listing');
        listing.id = id;

        let pictureWrapper = document.createElement('div');
        pictureWrapper.classList.add('listing-picture');

        // for setting image
        let listingPicture = document.createElement('img');
        listingPicture.src = image; // image set here
        pictureWrapper.appendChild(listingPicture);

        let listingContent = document.createElement('div');
        listingContent.classList.add('listing-content');

        // for setting listing name
        let listingName = document.createElement('div');
        listingName.classList.add('listing-name');
        listingName.textContent = name;

        // for setting listing description
        let listingDescription = document.createElement('div');
        listingDescription.classList.add('listing-description');
        listingDescription.textContent = description;

        let listingStats = document.createElement('div');
        listingStats.classList.add('listing-stats');
        
        // for setting view number
        let stat1 = document.createElement('div');
        stat1.classList.add('stat');
        let eyeIcon = document.createElement('i')
        eyeIcon.classList.add('fa')
        eyeIcon.classList.add('fa-eye')
        let viewNumber = document.createElement('p')
        viewNumber.textContent = view // set here
        stat1.appendChild(eyeIcon);
        stat1.appendChild(viewNumber);

        // for setting save number
        let stat2 = document.createElement('div');
        stat2.classList.add('stat');
        let saveIcon = document.createElement('i')
        saveIcon.classList.add('fa')
        saveIcon.classList.add('fa-bookmark')
        let saveNumber = document.createElement('p')
        saveNumber.textContent = save // set here
        stat2.appendChild(saveIcon);
        stat2.appendChild(saveNumber);

        listingStats.appendChild(stat1);
        listingStats.appendChild(stat2);

        listingContent.appendChild(listingName);
        listingContent.appendChild(listingDescription);
        listingContent.appendChild(listingStats);

        let listingAction = document.createElement('div');
        listingAction.classList.add('listing-action');
        
        let actionBtn = document.createElement('i');
        actionBtn.classList.add('fa');
        actionBtn.classList.add('fa-ellipsis-h');
        actionBtn.classList.add('listing-settings-button');
 
        listingAction.appendChild(actionBtn);

        let popupWrapper = document.createElement('div');
        let pview = document.createElement('div');
        let pedit = document.createElement('div');
        let pmark = document.createElement('div');
        let pdelete = document.createElement('div');
    
        popupWrapper.setAttribute('class', 'listing-settings-popup');
        pview.setAttribute('class', 'view-listing');
        pedit.setAttribute('class', 'edit');
        pmark.setAttribute('class', 'mark-adopted');
        pdelete.setAttribute('class', 'delete-listing');

        pview.textContent = "View";
        pedit.textContent = "Edit";
        pmark.textContent = "Mark as Adopted";
        pdelete.textContent = "Delete";
    
        popupWrapper.appendChild(pview);
        popupWrapper.appendChild(pedit);
        popupWrapper.appendChild(pmark);
        popupWrapper.appendChild(pdelete);

        listing.appendChild(pictureWrapper);
        listing.appendChild(listingContent);
        listing.appendChild(listingAction);
        listing.appendChild(popupWrapper);
        pane.appendChild(listing);   
    }
    
    // function called when view listing is clicked 
    function viewListing(id) {
        console.log(id);
        window.location.href = `../pages/view-lising.html?animal_id=${id}`;
    }
    
    // function called when edit listing is clicked
    function editListing(id) {
        console.log(id);
        window.location.href = `../pages/editlist.html?animal_id=${id}`;
    }

    // function called when delete listing is called
    function deleteListing(id) {
        console.log(id);
    }
    
    // function called when mark Adopted is clicked
        // function called when mark Adopted is clicked
    async function markAdopted(id) {
        console.log("Attempting to mark as adopted, Animal ID:", id);

        const userId = localStorage.getItem("user_id");
    
        const { error: insertError } = await supabase
        .from("adoption")
        .insert([{ user_id: userId, animal_id: id }]);

        if (insertError) {
            console.error("Error inserting into adoption table:", insertError);
            alert("Cannot insert into table");
            return;
        }

        const { error: updateError1 } = await supabase
            .from("animal_listing")
            .update({ Is_adopted: true })
            .eq("animal_id", id);

        if (updateError1) {
            console.error("Error updating adoption status in animal_listing:", updateError1);
            alert("Failed to update adoption status.");
            return;
        }


        const { data: updatedWishlist, error: updateError2 } = await supabase
            .from("wishlist")
            .update({ Is_adopted: true })
            .eq("animal_id", id)

            if (updateError2) {
                console.error("Error updating adoption status in wishlist:", updateError2);
            } else {
                console.log("Wishlist updated successfully:", updatedWishlist);
            }

        alert("Animal is adopted!");
        location.reload();
    }
});
