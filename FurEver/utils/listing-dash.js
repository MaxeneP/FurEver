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

    let viewAdopted = false;
    let deletedListing = false;

    async function fetchListings(adoptedOnly = false, deletedOnly = false) {
        const { data: listings, error } = await supabase
            .from("animal_listing")
            .select("animal_id, animal_name, Is_adopted, description, image_URL, view_count, is_deleted")
            .eq("user_id", user.id);

        if (error) {
            console.error("Error fetching listings: ", error);
            return;
        }

        for (const listing of listings) {
            const showAdopted = adoptedOnly && listing.Is_adopted && !listing.is_deleted;
            const showDeleted = deletedOnly && listing.is_deleted;
            const showDefault = !adoptedOnly && !deletedOnly && !listing.Is_adopted && !listing.is_deleted;

            if (showAdopted || showDeleted || showDefault) {
                const { count: wishCount, error: wishError } = await supabase
                    .from("wishlist")
                    .select("*", { count: "exact", head: true })
                    .eq("animal_id", listing.animal_id);

                if (wishError) {
                    console.error(`Error fetching wishlist count for animal_id ${listing.animal_id}:`, wishError);
                    continue;
                }

                const firstImage = listing.image_URL?.split(',')[0]?.trim() || '';
                createEntry(
                    listing.animal_name,
                    firstImage,
                    listing.view_count || 0,
                    wishCount || 0,
                    listing.description,
                    listing.animal_id,
                    listing.Is_adopted,
                    listing.is_deleted
                );
            }
        }
    }

    function init(){
        window.addEventListener('click', eventDelegation);
        fetchListings();
    }

    document.getElementById("adopted-listing-btn").addEventListener("click", function (event) {
    event.preventDefault();
    clearListings();

        viewAdopted = !viewAdopted;
        deletedListing = false;
        fetchListings(viewAdopted);
        this.innerHTML = viewAdopted ? "Return to<br> Main" : "View Adopted<br> Profiles";
        document.getElementById("deleted-listing-btn").innerHTML = "Deleted<br> Profiles";
    });

    document.getElementById("deleted-listing-btn").addEventListener("click", function (event) {
        event.preventDefault();
        clearListings();

        deletedListing = !deletedListing;
        viewAdopted = false;
        fetchListings(false, deletedListing);
        this.innerHTML = deletedListing ? "Return to<br> Main" : "Deleted<br> Profiles";
    });

    let pendingDeleteId = null;

   function showDeleteConfirmation(id) {
    pendingDeleteId = id;

    const existingPopup = document.getElementById('delete-confirmation-popup');
        if (!existingPopup.hasChildNodes()) {
            existingPopup.innerHTML = `
                <div class="popup-content">
                    <h3>Confirm Deletion</h3>
                    <p>Are you sure you want to permanently delete this listing?</p>
                    <div class="popup-buttons">
                        <button id="confirm-delete-btn" class="btn-danger">Yes, Delete</button>
                        <button id="cancel-delete-btn" class="btn-secondary">Cancel</button>
                    </div>
                </div>
            `;

            document.getElementById('confirm-delete-btn').addEventListener('click', confirmPermanentDelete);
            document.getElementById('cancel-delete-btn').addEventListener('click', cancelPermanentDelete);
        }

        existingPopup.style.display = 'flex';
    }

    function confirmPermanentDelete() {
        if (pendingDeleteId) {
            deleteListing(pendingDeleteId);
            document.getElementById('delete-confirmation-popup').style.display = 'none';
            pendingDeleteId = null;
        }
    }

    function cancelPermanentDelete() {
        document.getElementById('delete-confirmation-popup').style.display = 'none';
        pendingDeleteId = null;
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
            const currentLabel = e.target.textContent;

            if (currentLabel === "Mark as Adopted"){
                markAdopted(id, e.target);
                document.getElementById(id).remove();
            }
            if (currentLabel === "Unmark as Adopted"){
                unmarkAdopted(id, e.target);
                document.getElementById(id).remove();
            }
        }
        if (e.target.classList.contains('delete-listing')) {
            id = e.target.closest('.listing').id
            const currentLabel = e.target.textContent;

            if(currentLabel === "Delete"){
                markDeleteListing(id);
                document.getElementById(id).remove();
                
            }
            if(currentLabel === "Restore"){
                unmarkDeleteListing(id, e.target);
                document.getElementById(id).remove();
            }
             if(currentLabel === "Permanently Delete"){
            showDeleteConfirmation(id);
             document.getElementById(id).remove();
        }
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
    function createEntry(name, image, view, save, description, id, isAdopted) {
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
        if (deletedListing) {
            // In deleted profiles view
            pmark.textContent = "Mark as Adopted";
            pdelete.textContent = "Permanently Delete";
            
            // Also add restore button
            let prestore = document.createElement('div');
            prestore.setAttribute('class', 'delete-listing');
            prestore.textContent = "Restore";
            popupWrapper.appendChild(pview);
            popupWrapper.appendChild(pedit);
            popupWrapper.appendChild(pmark);
            popupWrapper.appendChild(prestore);
            popupWrapper.appendChild(pdelete);
        } else {
            // In main or adopted view
            pmark.textContent = isAdopted ? "Unmark as Adopted" : "Mark as Adopted";
            pdelete.textContent = "Delete";
            
            popupWrapper.appendChild(pview);
            popupWrapper.appendChild(pedit);
            popupWrapper.appendChild(pmark);
            popupWrapper.appendChild(pdelete);
        }

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
   async function markDeleteListing(id) {
        console.log(id);
        const { error: updateError1 } = await supabase
            .from("animal_listing")
            .update({ is_deleted : true })
            .eq("animal_id", id);

        if (updateError1) {
            console.error("Error updating adoption status in animal_listing:", updateError1);
            alert("Failed to update delete status.");
            return;
        }
    }

    async function unmarkDeleteListing(id) {
        console.log(id);
        const { error: updateError } = await supabase
            .from("animal_listing")
            .update({ is_deleted : false })
            .eq("animal_id", id);

        if (updateError1) {
            console.error("Error updating adoption status in animal_listing:", updateError);
            alert("Failed to update delete status.");
            return;
        }
    }

    async function deleteListing(id){ //permanently deletes listing from the database
        console.log(id);

        const { data: listingData, error: fetchError } = await supabase
        .from("animal_listing")
        .select("image_URL")
        .eq("animal_id", id)
        .single();

        if (fetchError) {
            console.error("Failed to fetch listing for image removal:", fetchError);
        }

        if (listingData?.image_URL) {
            const imageUrl = listingData.image_URL;
            const filePath = imageUrl.split("/storage/v1/object/public/images/")[1];

            const { error: storageError } = await supabase.storage
                .from("images") 
                .remove([filePath]);

            if (storageError) {
                console.error("Failed to delete image from storage:", storageError);
            } else {
                console.log("Image deleted successfully.");
            }
        }

        const { error: healthError } = await supabase
            .from("health_record")
            .delete()
            .eq("animal_id", id);

        if (healthError) console.error("Error deleting health record:", healthError);

        const { error: paperError } = await supabase
            .from("paperwork")
            .delete()
            .eq("animal_id", id);

        if (paperError) console.error("Error deleting paperwork:", paperError);

        const { error: adoptionError } = await supabase
            .from("adoption")
            .delete()
            .eq("animal_id", id);

        if (adoptionError) {
            console.error("Error deleting adoption records:", adoptionError);
            alert("Failed to delete adoption records.");
            return;
        }

        const { error: wishError } = await supabase
            .from("wishlist")
            .delete()
            .eq("animal_id", id);

        if (wishError) {
            console.error("Error deleting wishlist records:", wishError);
            alert("Failed to delete wishlist records.");
        }

        const { error: deleteError } = await supabase
            .from("animal_listing")
            .delete()
            .eq("animal_id", id);

        if (deleteError) {
            console.error("Listing failed to delete:", deleteError);
            alert("Listing was not deleted.");
            return;
        }

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

    async function unmarkAdopted(id){
        console.log(id);
        const {error: removeError} = await supabase
            .from("adoption")
            .delete()
            .eq("animal_id", id);
        
        if(removeError){
            console.error("Error in deleting from adoption table: ", removeError);
            alert("Cannot unmark as adopted.");
            return;
        }
        
        const {error: updateError} = await supabase 
            .from("animal_listing")
            .update({Is_adopted : false})
            .eq("animal_id", id);

        if(updateError){
            console.error("Error updating animal table: ", updateError);
            alert("Failed to update listing");
            return;
        }
    }
});
