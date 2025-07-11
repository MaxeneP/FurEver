document.addEventListener("DOMContentLoaded", async function () {
  const supabase =  window.supabase.createClient("https://idiqjlywytsddktbcvvc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaXFqbHl3eXRzZGRrdGJjdnZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDE0MDIyNCwiZXhwIjoyMDU1NzE2MjI0fQ.erJ4RgCMIN3Z9KYvzjeoJ9XU8yCzX7UjV3xU4SccbA0");
//DO NOT CHANGE THE KEY!
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
function init() {
    window.addEventListener('click', eventDelegation);
    showMetrics();
    loadMetrics();
    updateMetrics();
}

let selectedTable = 1;
const searchInput = document.getElementById("searchbar");
if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
        if(event.key=="Enter"){
            event.preventDefault();
            const query = searchInput.value.toLowerCase();
            fetchTable(selectedTable, query);
        }
    });
    
}

// function called on table change, table has 3 values
// if table == 1 we fetch user tables
// if table == 2 we fetch animal tables
// if table == 3 we fetch adoption tables
async function fetchTable(table, searchQuery="") {
    let data, error;

    switch(table){
        case 1: // users
            ({data, error} = await supabase.from("users").select("*").eq("is_deleted", false));
            if (error){
                console.error("Error fetching users: ", error);
            }
            if (searchQuery) {
                data = data.filter(user => 
                    String(user.user_id).includes(searchQuery) ||
                    user.username.includes(searchQuery) ||
                    user.email.includes(searchQuery) ||
                    String(user.contact_number).includes(searchQuery)
                );

                if (data.length === 0) {
                    alert("No matching records found.");
                    return;
                    }
                }
                clearTable();
                data.forEach(users => { 
                    createUserRecordTile(users.user_id, users.username, users.email, users.contact_number);
                });
            break;
        
        case 2: //animal_listing
            ({data, error} = await supabase.from("animal_listing").select("animal_id, user_id, animal_name, species, breed, sex, dob, size, activeness, temperament, Is_neutered, contact_info, region, city, is_deleted").eq("is_deleted", false));
            if(error){
                console.error("Error fetching animal listings: ", error);
            }
            if (searchQuery) {
                console.log("Search Query:", searchQuery);
                data = data.filter(animal =>
                    String(animal.animal_id).toLowerCase().includes(searchQuery) ||
                    String(animal.user_id).toLowerCase().includes(searchQuery) ||
                    animal.animal_name.toLowerCase().includes(searchQuery) ||
                    animal.species.toLowerCase().includes(searchQuery) ||
                    animal.breed.toLowerCase().includes(searchQuery) ||
                    animal.sex.toLowerCase().includes(searchQuery) ||
                    animal.dob.toLowerCase().includes(searchQuery) ||
                    animal.size.toLowerCase().includes(searchQuery) ||
                    String(animal.activeness).includes(searchQuery) ||
                    String(animal.temperament).includes(searchQuery) ||
                    String(animal.Is_neutered).toLowerCase().includes(searchQuery) ||
                    String(animal.contact_info).toLowerCase().includes(searchQuery) ||
                    animal.region.toLowerCase().includes(searchQuery) ||
                    animal.city.toLowerCase().includes(searchQuery)
                );
                console.log("Fetched Data:", data);
                if (data.length === 0) {
                    alert("No matching records found.");
                    return;
                    }
                }
                 clearTable();
                data.forEach(animal => {
                createAnimalRecordTile(animal.animal_id, animal.user_id, animal.animal_name, animal.species, animal.breed, animal.sex, animal.dob, animal.size, animal.activeness, animal.temperament, animal.Is_neutered, animal.contact_info, animal.region, animal.city);
            });
            break;
        
        case 3: //adoption table
            ({data, error} = await supabase.from("adoption").select("adoption_id, user_id, animal_id"));
            if(error){
                console.error("Error fetching adoption records: ", error);
            }
            if (searchQuery) {
                data = data.filter(adoption =>
                    String(adoption.adoption_id).toLowerCase().includes(searchQuery) ||
                    String(adoption.user_id).toLowerCase().includes(searchQuery) ||
                    String(adoption.animal_id).toLowerCase().includes(searchQuery)
                );
                if (data.length === 0) {
                    alert("No matching records found.");
                    return;
                    }
            }
            clearTable();
            data.forEach(adoption => {
                createAdoptionRecordTile(adoption.adoption_id, adoption.animal_id, adoption.user_id);
            });
            break;
        
        case 4: // Health records
            ({ data, error } = await supabase.from("health_record").select("*"));
            if (error) {
                console.error("Error fetching health records: ", error);
            }
            clearTable();
            data.forEach(health => {
                createHealthRecordTile(health.hr_id, health.animal_id, health.last_vet_visit, health.rabies_date, health["5-in-1_date"], health["3-in-1_date"], health.deworm_date, health.vacc_desc, health.health_desc);
            });
            break;

        case 5: //paperwork records
            ({data, error} = await supabase.from("paperwork").select("*"));
            if(error){
                console.error("Error fetching paperwork records: ", error);
            }
            clearTable();
            data.forEach(paper => {
                createPaperworkRecordTile(paper.record_id, paper.animal_id, paper.med_cert_url, paper.ped_cert_url, paper.vac_card_url);
            });
            break;
        
        case 6: // user records that are deleted
            ({data, error} = await supabase.from("users").select("*").eq("is_deleted", true));
            if (error){
                console.error("Error fetching users: ", error);
            }
            if (searchQuery) {
                data = data.filter(user => 
                    String(user.user_id).includes(searchQuery) ||
                    user.username.includes(searchQuery) ||
                    user.email.includes(searchQuery) ||
                    String(user.contact_number).includes(searchQuery)
                );

                if (data.length === 0) {
                    alert("No matching records found.");
                    return;
                    }
                }
                clearTable();
                data.forEach(users => { 
                    createUserRecordTile2(users.user_id, users.username, users.email, users.contact_number);
                });
            break;

        case 7: // animal records that are deleted
            ({data, error} = await supabase.from("animal_listing").select("animal_id, user_id, animal_name, species, breed, sex, dob, size, activeness, temperament, Is_neutered, contact_info, region, city, is_deleted").eq("is_deleted", true));
            if(error){
                console.error("Error fetching animal listings: ", error);
            }
            if (searchQuery) {
                console.log("Search Query:", searchQuery);
                data = data.filter(animal =>
                    String(animal.animal_id).toLowerCase().includes(searchQuery) ||
                    String(animal.user_id).toLowerCase().includes(searchQuery) ||
                    animal.animal_name.toLowerCase().includes(searchQuery) ||
                    animal.species.toLowerCase().includes(searchQuery) ||
                    animal.breed.toLowerCase().includes(searchQuery) ||
                    animal.sex.toLowerCase().includes(searchQuery) ||
                    animal.dob.toLowerCase().includes(searchQuery) ||
                    animal.size.toLowerCase().includes(searchQuery) ||
                    String(animal.activeness).includes(searchQuery) ||
                    String(animal.temperament).includes(searchQuery) ||
                    String(animal.Is_neutered).toLowerCase().includes(searchQuery) ||
                    String(animal.contact_info).toLowerCase().includes(searchQuery) ||
                    animal.region.toLowerCase().includes(searchQuery) ||
                    animal.city.toLowerCase().includes(searchQuery)
                );
                console.log("Fetched Data:", data);
                if (data.length === 0) {
                    alert("No matching records found.");
                    return;
                    }
                }
            clearTable();
            data.forEach(animal => {
                createAnimalRecordTile2(animal.animal_id, animal.user_id, animal.animal_name, animal.species, animal.breed, animal.sex, animal.dob, animal.size, animal.activeness, animal.temperament, animal.Is_neutered, animal.contact_info, animal.region, animal.city);
            });
            break;

        default:
            console.error("Invalid table selection.");
    }
}

// event delegation for click events
function eventDelegation(e) {
    // console.log(e.target);
    if (e.target != document.getElementById('user-dropdown-trigger') && e.target != document.getElementById('user-btn')) {
        let trigger = document.getElementById('user-dropdown-trigger');
        trigger.checked = false;
    }
    if (!(e.target.closest('#table-dropdown-btn')) && e.target != document.getElementById('dropdown-trigger')) {
        let trigger = document.getElementById('dropdown-trigger');
        trigger.checked = false;
    }
    if (!(e.target.closest('#table-dropdown-btn2')) && e.target != document.getElementById('dropdown-trigger2')) {
        let trigger = document.getElementById('dropdown-trigger2');
        trigger.checked = false;
    }
    if (e.target == document.getElementById('users')) {
        clearTable();
        changeTableHeaders(0);
        selectedTable = 1;
        fetchTable(1);
        hideMetrics();
    }
    if (e.target == document.getElementById('animals')) {
        clearTable();
        changeTableHeaders(1);
        selectedTable = 2;
        fetchTable(2);
        hideMetrics();
    }
    if (e.target == document.getElementById('adoption')) {
        clearTable();
        changeTableHeaders(2);
        selectedTable = 3;
        fetchTable(3);
        hideMetrics();
    }
    if (e.target == document.getElementById('healthrecord')){
        clearTable();
        changeTableHeaders(3);
        selectedTable = 4;
        fetchTable(4);
        hideMetrics();
    }
    if (e.target == document.getElementById('paperwork')){
        clearTable();
        changeTableHeaders(4);
        selectedTable = 5;
        fetchTable(5);
        hideMetrics();
    }
    if (e.target == document.getElementById('users2')){
        clearTable();
        changeTableHeaders(5);
        selectedTable = 1;
        fetchTable(6);
        hideMetrics();
    }
    if (e.target == document.getElementById('animals2')){
        clearTable();
        changeTableHeaders(6);
        selectedTable = 2;
        fetchTable(7);
        hideMetrics();
    }

    if (e.target.closest('.delete-record-btn')) { //for archive records
        if (e.target.closest('.user-record')) {
            console.log("soft deleted user");
            markDeleted(1, e.target.closest('.user-record').id);
        } else if (e.target.closest('.animal-record')) {
            console.log("soft deleted animal");
            markDeleted(2, e.target.closest('.animal-record').id);
        } else if (e.target.closest('.adoption-record')) {
            console.log("deleted adoption");
            deleteRecord(3, e.target.closest('.adoption-record').id);
        } else if (e.target.closest('.health-record')) {
            console.log("deleted health record");
            deleteRecord(4, e.target.closest('.health-record').id);
        } else if (e.target.closest('.paper-record')) {
            console.log("deleted paperwork");
            deleteRecord(5, e.target.closest('.paper-record').id);
        }
    }

     if (e.target.closest('.restore-record-btn')) { //restore records
        if (e.target.closest('.user-record2')) {
            console.log("restored user");
            unmarkDeleted(1, e.target.closest('.user-record2').id);
        } else if (e.target.closest('.animal-record2')) {
            console.log("restored animal");
            unmarkDeleted(2, e.target.closest('.animal-record2').id);
        }
    }
     if (e.target.closest('.perm-delete-record-btn')) { //permanently delete records
        if (e.target.closest('.user-record2')) {
            console.log("permanent delete user");
            confirmPermanentDelete(1, e.target.closest('.user-record2').id);
        } else if (e.target.closest('.animal-record2')) {
            console.log("permanent delete animal");
            confirmPermanentDelete(2, e.target.closest('.animal-record2').id);
        }
    }
}

const searchbarWrapper = document.getElementById("searchbar-wrapper");
const dropdownWrapper = document.getElementById("dropdown-wrapper");
const dropdownWrapper2 = document.getElementById("dropdown-wrapper2");
const metricsSection = document.getElementById("metrics-section");
const buttonGroup = document.querySelector(".button-group");
const titleHeader = document.querySelector(".title-header");
const returnBtn = document.getElementById("return-btn");

document.getElementById("table-btn").addEventListener("click", function (e) {
    e.preventDefault();

    metricsSection.style.display = "none";
    buttonGroup.style.display = "none";
    titleHeader.style.display = "none";

    searchbarWrapper.style.display = "flex";
    dropdownWrapper.style.display = "block";
    returnBtn.style.display = "inline-block";
});

document.getElementById("archive-btn").addEventListener("click", function (e) {
    e.preventDefault();

    metricsSection.style.display = "none";
    buttonGroup.style.display = "none";
    titleHeader.style.display = "none";

    searchbarWrapper.style.display = "flex";
    dropdownWrapper2.style.display = "block";
    returnBtn.style.display = "inline-block";
});

returnBtn.addEventListener("click", function (e) {
    e.preventDefault();
    changeTableHeaders(-1);

    metricsSection.style.display = "block";
    buttonGroup.style.display = "flex";
    titleHeader.style.display = "block";

    searchbarWrapper.style.display = "none";
    dropdownWrapper.style.display = "none";
    dropdownWrapper2.style.display = "none";
    returnBtn.style.display = "none";

    clearTable();
    showMetrics();
    loadMetrics();
    updateMetrics();
    
});

async function loadMetrics(){
    //user count
     let { data: users, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('is_deleted', false);
    if (userError){
        console.error("Error fetching users:", userError);
    }
    document.getElementById("user-value").textContent = users.length;
    //listing count
    let { data: animal, error: animalError } = await supabase
        .from('animal_listing')
        .select('animal_id')
        .eq('is_deleted', false);
    if (animalError){
        console.error("Error fetching users:", animalError);
    }
    document.getElementById("listing-value").textContent = animal.length;
    //adopted count
    let { data: adopted, error: adoptedError } = await supabase
        .from('adoption')
        .select('animal_id');
    if (adoptedError) console.error("Error fetching adopted:", adoptedError);
    document.getElementById("adopted-value").textContent = adopted.length;

    // available listings
    let { data: available, error: availableError } = await supabase
        .from('animal_listing')
        .select('animal_id', { count: 'exact' })
        .eq('Is_adopted', false)
        .eq('is_deleted', false);
    if (availableError) console.error("Error fetching available:", availableError);
    document.getElementById("available-value").textContent = available.length;
}

async function updateMetrics() {
    try {
       
        let { data: users, error: userError } = await supabase.from("users").select("*", { count: "exact" }).eq("is_deleted", false);
        if (userError) throw userError;

        
        let { data: listings, error: listingError } = await supabase.from("animal_listing").select("*", { count: "exact" }).eq("is_deleted", false);
        if (listingError) throw listingError;

        
        let { data: adopted, error: adoptedError } = await supabase
            .from("adoption")
            .select("*")
        if (adoptedError) throw adoptedError;

        
        let { data: available, error: availableError } = await supabase
            .from("animal_listing")
            .select("*", { count: "exact" })
            .eq("Is_adopted", false)
            .eq("is_deleted", false);
        if (availableError) throw availableError;

        
        document.getElementById("user-value").textContent = users.length;
        document.getElementById("listing-value").textContent = listings.length;
        document.getElementById("adopted-value").textContent = adopted.length;
        document.getElementById("available-value").textContent = available.length;

    } catch (err) {
        console.error("Error updating metrics:", err.message);
    }
}

/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/

// changes table column names, called when different
// table is selected from the dropdown
function changeTableHeaders(i) {
    let triggers = document.querySelectorAll('#body-content>input');
    let triggerNo = 0;
    triggers.forEach(trigger => {
        if (triggerNo == i) {
            trigger.checked = true;
        } else {
            trigger.checked = false;
        }
        triggerNo += 1;
    })
}

// removes all records currently appended to DOM
// except headers and trigger checkboxes
function clearTable() {
    let pane = document.getElementById('body-content')
    let children = pane.children;

    for (let i = children.length-1; i >= 15; i--) {
        pane.removeChild(children[i]);
    } 
}

async function markDeleted(table, id) {
    if (table === 1) { // users
        ({ error } = await supabase.from("users").update({ is_deleted: true }).eq("user_id", id));
    } else if (table === 2) { // animal_listing
        ({ error } = await supabase.from("animal_listing").update({ is_deleted: true }).eq("animal_id", id));
    }
    if (error) {
        console.error("Error marking record as deleted:", error);
    } else {
        console.log("Record marked as deleted.");
        fetchTable(table);
    }
}

// Unmark as deleted (restore)
async function unmarkDeleted(table, id){
    let tableName = "";
    let primaryKey = "";

    switch(table){
        case 1:
            tableName = "users";
            primaryKey = "user_id";
            break;
        case 2:
            tableName = "animal_listing";
            primaryKey = "animal_id";
            break;
        
        default:
            console.error("Invalid table selection.");
            return;
    }

    const {error} = await supabase.from(tableName).update({is_deleted : false}).eq(primaryKey, id);

    if(error){
        console.error("Error in restoring record: ", error);
    } else {
        document.getElementById(id).remove();
        console.log(`Record with ID ${id} restored successfully.`);
    }
}

function confirmPermanentDelete(table, id) {
    if (confirm("Are you sure you want to permanently delete this record? This action cannot be undone.")) {
        deleteRecord(table, id);
    }
}


// function called when a record is clicked to be deleted
// table has three values:
// table == 1 if current table is user table
// table == 2 if current table is animal table
// table == 3 if current table is adoption table
// id is PK of record in table
async function deleteRecord(table, id) {
    let tableName = "";
    let primaryKey = "";

    switch(table){
        case 1:
            tableName = "users";
            primaryKey = "user_id";
            break;
        case 2:
            tableName = "animal_listing";
            primaryKey = "animal_id";
            break;
        case 3:
            tableName = "adoption";
            primaryKey = "adoption_id";
            break;
        case 4:
            tableName = "health_record";
            primaryKey = "hr_id";
            break;
        case 5:
            tableName = "paperwork";
            primaryKey = "record_id";
            break;
        default:
            console.error("Invalid table selection.");
            return;
    }

    if (table === 2) {
        const { error: adoptionError } = await supabase.from("adoption").delete().eq("animal_id", id);

        if (adoptionError) {
            console.error("Error deleting related adoption records:", adoptionError);
            alert("Failed to delete related adoption records.");
            return;
        }

        const { error: wishError } = await supabase.from("wishlist").delete().eq("animal_id", id);

        if(wishError){
            console.error("Error deleting related wishlist records:", wishError);
            alert("Failed to delete related wishlist records.");
        }

        const {error: healthError} = await supabase.from("health_record").delete().eq("animal_id", id);
        if(healthError){
            console.error(healthError);
            alert("Failed to delete related record");
            return;
        }

        const {error: paperError} = await supabase.from("paperwork").delete().eq("animal_id", id);

        if(paperError){
            console.error(paperError);
            alert("Failed to delete paperwork record")
            return;
        }
    }

    if(table === 2){
        const { data: images, error: listError } = await supabase.storage
        .from("images")
        .list(user_id + "/", { limit: 100 });

        if (listError) {
        console.error("Error listing images:", listError);
        }

        if (images && images.length > 0) {
        const filePaths = images.map(img => `${user_id}/${img.name}`);
        const { error: removeError } = await supabase.storage
            .from("images")
            .remove(filePaths);

        if (removeError) {
            console.error("Error deleting image files:", removeError);
        }
        }

      await supabase.from("animal_listing").delete().eq("user_id", user_id); //delete user records from tables
      await supabase.from("adoption").delete().eq("user_id", user_id);
      await supabase.from("wishlist").delete().eq("user_id", user_id);
      await supabase.from("users").delete().eq("user_id", user_id);

      const { error: authError } = await supabase.auth.admin.deleteUser(user_id); //delete user from Auth
      if (authError) {
        console.error("Cannot delete user from authentication:", authError);
      }
    }

    const { error } = await supabase.from(tableName).delete().eq(primaryKey, id);

    if (error){
        console.error("Error deleting record:", error);
        alert("Failed to delete record.");
    } else {
        document.getElementById(id).remove();
        console.log(`Record with ID ${id} deleted successfully.`);
    }
}

function hideMetrics() {
    document.getElementById('metrics-section').style.display = 'none';
}

function showMetrics() {
    document.getElementById('metrics-section').style.display = 'block';
}
// this function creates a tile for the record
// and appends it to the necessary DOM element
// id should be the PK of the record in the DB
function createUserRecordTile(id, username, email, contact_number) {
    let pane = document.getElementById('body-content');
    let userRecord = document.createElement('div');
    let userId = document.createElement('div');
    let userName = document.createElement('div');
    let userEmail = document.createElement('div');
    let userContactNumber = document.createElement('div');
    let delWrapper = document.createElement('div');
    let delBtn = document.createElement('i');

    delWrapper.setAttribute('class', 'delete-record-btn');
    delBtn.setAttribute('class', 'fa fa-trash');
    userRecord.setAttribute('id', id);
    userRecord.setAttribute('class', 'user-record');
    userId.textContent = id;
    userName.textContent = username;
    userEmail.textContent = email;
    userContactNumber.textContent = contact_number;

    delWrapper.appendChild(delBtn);
    userRecord.appendChild(userId);
    userRecord.appendChild(userName);
    userRecord.appendChild(userEmail);
    userRecord.appendChild(userContactNumber);
    userRecord.appendChild(delWrapper);
    pane.appendChild(userRecord);
}

function createUserRecordTile2(id, username, email, contact_number) {
    let pane = document.getElementById('body-content');
    let userRecord = document.createElement('div');
    let userId = document.createElement('div');
    let userName = document.createElement('div');
    let userEmail = document.createElement('div');
    let userContactNumber = document.createElement('div');
    let delWrapper = document.createElement('div');
    let restoreWrapper = document.createElement('div');
    let delBtn = document.createElement('i');
    let restoreBtn = document.createElement('i');

    restoreWrapper.setAttribute('class', 'restore-record-btn');
    delWrapper.setAttribute('class', 'perm-delete-record-btn');
    delBtn.setAttribute('class', 'fa fa-trash');
    restoreBtn.setAttribute('class', 'fa fa-history');
    userRecord.setAttribute('id', id);
    userRecord.setAttribute('class', 'user-record2');
    userId.textContent = id;
    userName.textContent = username;
    userEmail.textContent = email;
    userContactNumber.textContent = contact_number;

    restoreWrapper.appendChild(restoreBtn);
    delWrapper.appendChild(delBtn);
    userRecord.appendChild(userId);
    userRecord.appendChild(userName);
    userRecord.appendChild(userEmail);
    userRecord.appendChild(userContactNumber);
    userRecord.appendChild(delWrapper);
    userRecord.appendChild(restoreWrapper);
    pane.appendChild(userRecord);
}

// creates tile for an animal record and
// appends to  DOM
// id should be PK of record in DB
function createAnimalRecordTile(animal_id, user_id, animal_name, species, breed, sex, dob, size, activeness, temperament, Is_neutered, contact_info, region, city) {
    let pane = document.getElementById('body-content');
    let delWrapper = document.createElement('div');
    let delBtn = document.createElement('i');
    let record = document.createElement('div');
    let animalId = document.createElement('div');
    let userId = document.createElement('div');
    let animalName = document.createElement('div');
    let animalSpecies = document.createElement('div');
    let animalBreed = document.createElement('div');
    let animalSex = document.createElement('div');
    let animalDOB = document.createElement('div');
    let animalSize = document.createElement('div');
    let animalActiveness = document.createElement('div');
    let animalTemperament = document.createElement('div');
    let animalNeutered = document.createElement('div');
    let animalCN = document.createElement('div');
    let animalRegion = document.createElement('div');
    let animalCity = document.createElement('div');

    delWrapper.setAttribute('class', 'delete-record-btn');
    delBtn.setAttribute('class', 'fa fa-trash');
    record.setAttribute('class', 'animal-record');
    record.id = animal_id;
    animalId.textContent = animal_id;
    userId.textContent = user_id;
    animalName.textContent = animal_name;
    animalSpecies.textContent = species;
    animalBreed.textContent = breed;
    animalSex.textContent = sex;
    animalDOB.textContent = dob;
    animalSize.textContent = size;
    animalActiveness.textContent = activeness;
    animalTemperament.textContent = temperament;
    animalNeutered.textContent = Is_neutered;
    animalCN.textContent = contact_info;
    animalRegion.textContent = region;
    animalCity.textContent = city;
    
    record.appendChild(animalId);
    record.appendChild(userId);
    record.appendChild(animalName);
    record.appendChild(animalSpecies);
    record.appendChild(animalBreed);
    record.appendChild(animalSex);
    record.appendChild(animalDOB);
    record.appendChild(animalSize);
    record.appendChild(animalActiveness);
    record.appendChild(animalTemperament);
    record.appendChild(animalNeutered);
    record.appendChild(animalCN);
    record.appendChild(animalRegion);
    record.appendChild(animalCity);

    delWrapper.appendChild(delBtn);
    record.appendChild(delWrapper);
    pane.appendChild(record);
}

function createAnimalRecordTile2(animal_id, user_id, animal_name, species, breed, sex, dob, size, activeness, temperament, Is_neutered, contact_info, region, city) {
    let pane = document.getElementById('body-content');
    let restoreWrapper = document.createElement('div');
    let restoreBtn = document.createElement('i');
    let delWrapper = document.createElement('div');
    let delBtn = document.createElement('i');
    let record = document.createElement('div');
    let animalId = document.createElement('div');
    let userId = document.createElement('div');
    let animalName = document.createElement('div');
    let animalSpecies = document.createElement('div');
    let animalBreed = document.createElement('div');
    let animalSex = document.createElement('div');
    let animalDOB = document.createElement('div');
    let animalSize = document.createElement('div');
    let animalActiveness = document.createElement('div');
    let animalTemperament = document.createElement('div');
    let animalNeutered = document.createElement('div');
    let animalCN = document.createElement('div');
    let animalRegion = document.createElement('div');
    let animalCity = document.createElement('div');

    restoreWrapper.setAttribute('class', 'restore-record-btn');
    restoreBtn.setAttribute('class', 'fa fa-history');
    delWrapper.setAttribute('class', 'perm-delete-record-btn');
    delBtn.setAttribute('class', 'fa fa-trash');
    record.setAttribute('class', 'animal-record2');
    record.id = animal_id;
    animalId.textContent = animal_id;
    userId.textContent = user_id;
    animalName.textContent = animal_name;
    animalSpecies.textContent = species;
    animalBreed.textContent = breed;
    animalSex.textContent = sex;
    animalDOB.textContent = dob;
    animalSize.textContent = size;
    animalActiveness.textContent = activeness;
    animalTemperament.textContent = temperament;
    animalNeutered.textContent = Is_neutered;
    animalCN.textContent = contact_info;
    animalRegion.textContent = region;
    animalCity.textContent = city;
    
    record.appendChild(animalId);
    record.appendChild(userId);
    record.appendChild(animalName);
    record.appendChild(animalSpecies);
    record.appendChild(animalBreed);
    record.appendChild(animalSex);
    record.appendChild(animalDOB);
    record.appendChild(animalSize);
    record.appendChild(animalActiveness);
    record.appendChild(animalTemperament);
    record.appendChild(animalNeutered);
    record.appendChild(animalCN);
    record.appendChild(animalRegion);
    record.appendChild(animalCity);

    delWrapper.appendChild(delBtn);
    record.appendChild(delWrapper);
    restoreWrapper.appendChild(restoreBtn);
    record.appendChild(restoreWrapper);
    pane.appendChild(record);
}

// creates tile for adoption record and appends
// to DOM, id should be PK of record in DB
function createAdoptionRecordTile(id, animalId, userId) {
    let pane = document.getElementById('body-content');
    let delWrapper = document.createElement('div');
    let delBtn = document.createElement('i');
    let record = document.createElement('div');
    let adoptionId = document.createElement('div');
    let animal = document.createElement('div');
    let user = document.createElement('div');

    delWrapper.setAttribute('class', 'delete-record-btn');
    delBtn.setAttribute('class', 'fa fa-trash');
    record.setAttribute('class', 'adoption-record');
    record.id = id;
    adoptionId.textContent = id;
    animal.textContent = animalId;
    user.textContent = userId;
    
    record.append(adoptionId);
    record.append(animal);
    record.append(user);

    delWrapper.appendChild(delBtn);
    record.appendChild(delWrapper);
    pane.appendChild(record);
}

//for paperwork records
function createPaperworkRecordTile(id, animalId, medCertURL, pedCertURL, vacCardURL){
    let pane = document.getElementById('body-content');
    let delWrapper = document.createElement('div');
    let delBtn = document.createElement('i');
    let record = document.createElement('div');
    let paperId = document.createElement('div');
    let animal = document.createElement('div');
    let medCert = document.createElement('div');
    let pedCert = document.createElement('div');
    let vacCard = document.createElement('div');

    delWrapper.setAttribute('class', 'delete-record-btn');
    delBtn.setAttribute('class', 'fa fa-trash');
    record.setAttribute('class', 'paper-record');
    record.id = id;
    paperId.textContent = id;
    animal.textContent = animalId;
    medCert.textContent = medCertURL;
    pedCert.textContent = pedCertURL;
    vacCard.textContent = vacCardURL;

    record.append(paperId);
    record.append(animal);
    record.append(medCert);
    record.append(pedCert);
    record.append(vacCard);
    record.append(threeOne);

    delWrapper.appendChild(delBtn);
    record.appendChild(delWrapper);
    pane.appendChild(record);
}

//for health records table
function createHealthRecordTile(id, animalId, vetDate, rabiesDate, fiveOneDate, threeOneDate, dewormDate, vacDesc, healthDesc){
    let pane = document.getElementById('body-content');
    let delWrapper = document.createElement('div');
    let delBtn = document.createElement('i');
    let record = document.createElement('div');
    let healthId = document.createElement('div');
    let animal = document.createElement('div');
    let vet = document.createElement('div');
    let rabies = document.createElement('div');
    let fiveOne = document.createElement('div');
    let threeOne = document.createElement('div');
    let deworm = document.createElement('div');
    let vac = document.createElement('div');
    let health = document.createElement('div');

    delWrapper.setAttribute('class', 'delete-record-btn');
    delBtn.setAttribute('class', 'fa fa-trash');
    record.setAttribute('class', 'health-record');
    record.id = id;
    healthId.textContent = id;
    animal.textContent = animalId;
    vet.textContent = vetDate;
    rabies.textContent = rabiesDate;
    fiveOne.textContent = fiveOneDate;
    threeOne.textContent = threeOneDate;
    deworm.textContent = dewormDate;
    vac.textContent = vacDesc;
    health.textContent = healthDesc;
    
    record.append(healthId);
    record.append(animal);
    record.append(vet);
    record.append(rabies);
    record.append(fiveOne);
    record.append(threeOne);
    record.append(deworm);
    record.append(vac);
    record.append(health);

    delWrapper.appendChild(delBtn);
    record.appendChild(delWrapper);
    pane.appendChild(record);
}

init();

});
