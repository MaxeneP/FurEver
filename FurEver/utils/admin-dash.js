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
function init() {
    window.addEventListener('click', eventDelegation);
}

// function called on table change, table has 3 values
// if table == 1 we fetch user tables
// if table == 2 we fetch animal tables
// if table == 3 we fetch adoption tables
async function fetchTable(table) {
    let data, error;

    switch(table){
        case 1: // users
            ({data, error} = await supabase.from("users").select("*"));
            if (error){
                console.error("Error fetching users: ", error);
            }
            clearTable();
            data.forEach(users => { 
                createUserRecordTile(users.user_id, users.username, users.email, users.contact_number);
            });
            break;
        
        case 2: //animal_listing
            ({data, error} = await supabase.from("animal_listing").select("animal_id, user_id, animal_name, species, breed, sex, dob, size, activeness, temperament, Is_neutered, contact_info, region, city"));
            if(error){
                console.error("Error fetching animal listings: ", error);
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
            clearTable();
            data.forEach(adoption => {
                createAdoptionRecordTile(adoption.adoption_id, adoption.animal_id, adoption.user_id);
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
    if (e.target == document.getElementById('users')) {
        clearTable();
        changeTableHeaders(0);
        fetchTable(1);
    }
    if (e.target == document.getElementById('animals')) {
        clearTable();
        changeTableHeaders(1);
        fetchTable(2);
    }
    if (e.target == document.getElementById('adoption')) {
        clearTable();
        changeTableHeaders(2);
        fetchTable(3);
    }
    if (e.target.closest('.delete-record-btn')) {
        if (e.target.closest('.user-record')) {
            deleteRecord(1, e.target.closest('.user-record').id);
        } else if (e.target.closest('.animal-record')) {
            deleteRecord(2, e.target.closest('.animal-record').id);
        } else if (e.target.closest('.adoption-record')) {
            deleteRecord(3, e.target.closest('.adoption-record').id);
        } 
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

    for (let i = children.length-1; i >= 6; i--) {
        pane.removeChild(children[i]);
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
        default:
            console.error("Invalid table selection.");
    }

    const {error} = await supabase.from(tableName).delete().eq(primaryKey, id);

    if (error){
        console.error("Error deleting record:", error);
        alert("Failed to delete record.");
    } else {
        document.getElementById(id).remove();
        console.log(`Record with ID ${id} deleted successfully.`);
    }
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

init();

});
