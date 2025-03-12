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
    
    async function init(){
        await getUser();
        await fetchListings();
    }
    
        //fetch records
        async function fetchListings(){
            const userId = localStorage.getItem("user_id");

            const {data, error} = await supabase.from("wishlist").select("animal_id, animal_name, image_URL, Is_adopted").eq("user_id", userId);
    
            if(error){
                console.error("Error fetching listings: ", error);
            }
    
            clearListings();
            data.forEach(listing => {
                createTile(listing.animal_name, listing.image_URL, listing.animal_id, listing.Is_adopted);
            });
        }
    
        function clearListings() {
            let ls = document.getElementById('listing-scroll');
            while (ls.firstChild) {
                ls.removeChild(ls.firstChild);
            }
        
        }
    
    // event delegation for click events
    function eventDelegation(e) {
        // console.log(e.target);
        if (e.target != document.querySelector('#burger-menu-trigger')) {
            let cb = document.getElementById('burger-menu-trigger')
            cb.checked = false;
        }
        if (e.target.classList.contains('remove-btn')) {
            animal_id = e.target.closest('.listing').getAttribute('animal_id');
            removeFromWishlist(animal_id);
        }
        if (e.target.classList.contains('listing-pic')) {
            animal_id = e.target.closest('.listing').getAttribute('animal_id');
            window.location.href = `../pages/view-lising.html?animal_id=${animal_id}`;
        }
    }

    window.addEventListener('click', eventDelegation);

    // **************************************************************************************************************
    // **************************************************************************************************************
    // **************************************************************************************************************

    // takes name of animal and cover picture of animal
    // then creates necessary HTML elements and appends output to be displayed on page
    function createTile(name, imageSrc, id, adopted) {
        let listing = document.createElement('div');
        listing.classList.add('listing');
        listing.setAttribute('animal_id', id);
    
        let listingPic = document.createElement('img');
        listingPic.setAttribute('src', imageSrc); // cover picture
        listingPic.classList.add('listing-pic');
        
        let listingName = document.createElement('div');
        listingName.classList.add('listing-name');
        listingName.textContent = name;  // name of animal
    
        let p = document.createElement('p');
        p.textContent = 'Adopted';
        let tint = document.createElement('div');
        tint.classList.add('adopted-tint');
        tint.appendChild(p);

        // remove from wishlist button
        let removeBtn = document.createElement('span');
        removeBtn.classList.add('fa');
        removeBtn.classList.add('fa-times-circle-o');
        removeBtn.classList.add('remove-btn');

        if (adopted) {
            tint.classList.add('visible');
        }
    
        listing.setAttribute('animal_id', id); 
    
        listingName.setAttribute('class', 'listing-name');
        listingPic.setAttribute('class', 'listing-pic');

        listing.appendChild(listingPic);
        listing.appendChild(listingName);
        listing.appendChild(tint);
        listing.appendChild(removeBtn);
        
        let ls = document.getElementById('listing-scroll');
        ls.appendChild(listing);
    }

    async function removeFromWishlist(animal_id) {
        // HI
        const {error} = await supabase.from("wishlist").delete().eq("animal_id", animal_id);
        if(error){
            console.error("Error deleting record.", error);
        }
        clearListings();
    }
    
    init();
    
});
