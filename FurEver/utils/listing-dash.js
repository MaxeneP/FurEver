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
        }
        data.forEach(listing => { // check if adopted
            let name = listing.Is_adopted? `${listing.animal_name} (ADOPTED)` : listing.animal_name;
            createEntry(name, listing.animal_id);
        });
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
            popup = e.target.closest('.listing-settings-button').nextElementSibling;
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
    function createEntry(name, id) {
        let pane = document.getElementById('body-bottom');
        let listing = document.createElement('div');
        listing.classList.add('listing');
        listing.id = id;

        let listingName = document.createElement('div');
        listing.classList.add('listing-name');
        listingName.textContent = name;

        let btnWrapper = document.createElement('div');
        let btn = document.createElement('i');
        let popupWrapper = document.createElement('div');
        let view = document.createElement('div');
        let edit = document.createElement('div');
        let mark = document.createElement('div');
    
        listing.setAttribute('class', 'listing');
        listingName.setAttribute('class', 'listing-name');
        btnWrapper.setAttribute('class', 'listing-settings-button');
        btn.setAttribute('class', 'fa fa-ellipsis-h');
        btn.setAttribute('aria-hidden', 'true');
        popupWrapper.setAttribute('class', 'listing-settings-popup');
        view.setAttribute('class', 'view-listing');
        edit.setAttribute('class', 'edit');
        mark.setAttribute('class', 'mark-adopted');
    
        listingName.textContent = name;
        listing.id = id;
        view.textContent = "View";
        edit.textContent = "Edit";
        mark.textContent = "Mark as Adopted";
    
        popupWrapper.appendChild(view);
        popupWrapper.appendChild(edit);
        popupWrapper.appendChild(mark);
        btnWrapper.appendChild(btn);
        listing.appendChild(listingName);
        listing.appendChild(btnWrapper);
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
    
    // function called when mark Adopted is clicked
    async function markAdopted(id) {
        console.log("Attempting to mark as adopted, Animal ID:", id);

        const userId = localStorage.getItem("user_id");
    
        //show as adopted
        let listingElement = document.getElementById(id);
    
        const {error} = await supabase.from("adoption").insert([{user_id: userId, animal_id: id}]);

        if (error){
            alert("Cannot insert into table");
        }

        const { error: updateError } = await supabase
        .from("animal_listing")
        .update({ Is_adopted: true })
        .eq("animal_id", id);
        
        if (updateError) {
            console.error("Error updating adoption status:", updateError);
            alert("Failed to update adoption status.");
        } else {
            alert("Animal is adopted!");
        }

    }
});
