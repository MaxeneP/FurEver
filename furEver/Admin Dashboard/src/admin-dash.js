function init() {
    window.addEventListener('click', eventDelegation);
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

// function called on table change, table has 3 values
// if table == 1 we fetch user tables
// if table == 2 we fetch animal tables
// if table == 3 we fetch adoption tables
function fetchTable(table) {
    switch (table) {
        case 1:
            // fetch from db usr table, call
            // ...
            // createUserRecordTile for each record

            // for testing purposes
            for (let i = 0; i < 100; ++i) {
                createUserRecordTile(i, 'Ace', 'ace@email.com', '09090909', 'password123')
            }

            break;
        case 2:
            // fetch from db, call
            // ... 
            // createAnimalRecordTile for each record

            // for testing purposes
            for (let i = 0; i < 100; ++i) {
                createAnimalRecordTile(i, i, 'Ace', 'Dog', 'Aspin', 'Medium', 'Lazy', 'Sad', 'Cavite');
            }
            
            break;
        case 3:
            // fetch from db, call
            // ...
            // createAdoptionRecordTile for each record

            // for testing purposes
            for (let i = 0; i < 100; ++i) {
                createAdoptionRecordTile(i, i, i, '04/23/2004');
            }

            break;
        default:
            console.error("error") 
            // should not be triggered
    }
}

// function called when a record is clicked to be deleted
// table has three values:
// table == 1 if current table is user table
// table == 2 if current table is animal table
// table == 3 if current table is adoption table
// id is PK of record in table
function deleteRecord(table, id) {
    //do something
    //...
    console.log(table, id);
}

// this function creates a tile for the record
// and appends it to the necessary DOM element
// id should be the PK of the record in the DB
function createUserRecordTile(id, username, email, contactNumber, password) {
    let pane = document.getElementById('body-content');
    let userRecord = document.createElement('div');
    let userId = document.createElement('div');
    let userName = document.createElement('div');
    let userEmail = document.createElement('div');
    let userContactNumber = document.createElement('div');
    let userPassword = document.createElement('div');
    let delWrapper = document.createElement('div');
    let delBtn = document.createElement('i');

    delWrapper.setAttribute('class', 'delete-record-btn');
    delBtn.setAttribute('class', 'fa fa-trash');
    userRecord.setAttribute('id', id);
    userRecord.setAttribute('class', 'user-record');
    userId.textContent = id;
    userName.textContent = username;
    userEmail.textContent = email;
    userContactNumber.textContent = contactNumber;
    userPassword.textContent = password;

    delWrapper.appendChild(delBtn);
    userRecord.appendChild(userId);
    userRecord.appendChild(userName);
    userRecord.appendChild(userEmail);
    userRecord.appendChild(userContactNumber);
    userRecord.appendChild(userPassword);
    userRecord.appendChild(delWrapper);
    pane.appendChild(userRecord);
}

// creates tile for an animal record and
// appends to  DOM
// id should be PK of record in DB
function createAnimalRecordTile(id, userId, name, species, breed, size, activeness, temperament, location) {
    let pane = document.getElementById('body-content');
    let delWrapper = document.createElement('div');
    let delBtn = document.createElement('i');
    let record = document.createElement('div');
    let animalId = document.createElement('div');
    let user = document.createElement('div');
    let animalName = document.createElement('div');
    let animalSpecies = document.createElement('div');
    let animalBreed = document.createElement('div');
    let animalSize = document.createElement('div');
    let animalActiveness = document.createElement('div');
    let animalTemperament = document.createElement('div');
    let animalLocation = document.createElement('div');

    delWrapper.setAttribute('class', 'delete-record-btn');
    delBtn.setAttribute('class', 'fa fa-trash');
    record.setAttribute('class', 'animal-record');
    record.id = id;
    animalId.textContent = id;
    user.textContent = userId;
    animalName.textContent = name;
    animalSpecies.textContent = species;
    animalBreed.textContent = breed;
    animalSize.textContent = size;
    animalActiveness.textContent = activeness;
    animalTemperament.textContent = temperament;
    animalLocation.textContent = location;
    
    record.appendChild(animalId);
    record.appendChild(user);
    record.appendChild(animalName);
    record.appendChild(animalSpecies);
    record.appendChild(animalBreed);
    record.appendChild(animalSize);
    record.appendChild(animalActiveness);
    record.appendChild(animalTemperament);
    record.appendChild(animalLocation);
    delWrapper.appendChild(delBtn);
    record.appendChild(delWrapper);
    pane.appendChild(record);
}

// creates tile for adoption record and appends
// to DOM, id should be PK of record in DB
function createAdoptionRecordTile(id, animalId, userId, date) {
    let pane = document.getElementById('body-content');
    let delWrapper = document.createElement('div');
    let delBtn = document.createElement('i');
    let record = document.createElement('div');
    let adoptionId = document.createElement('div');
    let animal = document.createElement('div');
    let user = document.createElement('div');
    let recordDate = document.createElement('div');

    delWrapper.setAttribute('class', 'delete-record-btn');
    delBtn.setAttribute('class', 'fa fa-trash');
    record.setAttribute('class', 'adoption-record');
    record.id = id;
    adoptionId.textContent = id;
    animal.textContent = animalId;
    user.textContent = userId;
    recordDate.textContent = date;
    
    record.append(adoptionId);
    record.append(animal);
    record.append(user);
    record.append(recordDate);
    delWrapper.appendChild(delBtn);
    record.appendChild(delWrapper);
    pane.appendChild(record);
}

init();