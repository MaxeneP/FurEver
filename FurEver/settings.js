const supabase =  window.supabase.createClient("https://idiqjlywytsddktbcvvc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaXFqbHl3eXRzZGRrdGJjdnZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDE0MDIyNCwiZXhwIjoyMDU1NzE2MjI0fQ.erJ4RgCMIN3Z9KYvzjeoJ9XU8yCzX7UjV3xU4SccbA0");
//DO NOT CHANGE THE KEY!

document.addEventListener("DOMContentLoaded", async function(){
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
  //display user data
  if (!user.id){
    alert("No user ID");
  }
  const {data, error} = await supabase.from("users").select("*").eq("user_id", user.id).single();
  if (error){
    console.error("Error fetching user data:", error);
  }

  document.getElementById("name").value = data.username || "";
  document.getElementById("contact").value = data.contact_number || "";
  
  //security

  const submit = document.getElementById("submit");
  submit.addEventListener("click", async function(event){
    event.preventDefault();
    let newPass = document.getElementById("new-password").value;
    let conPass =  document.getElementById("con-password").value;

    if(newPass !== conPass){
      alert("Passwords do not match.");
    }
    if (!(newPass.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@\(\)\\\/~$!%^*?&+\-])[A-Za-z\d@$!%^*?&~\(\)\\\/+\-]{6,}$/))) {
      alert("Passwords should have at least one one uppercase character, one lowercase character, one special character, one digit, and be 6 characters long.");
      return;
    }

    const {data, error} = await supabase.auth.updateUser({
      password: newPass
    });

    if (error){
      console.error("Error updating password: ", error)
    }else{
      alert("Password updated successfully.");
    }
  });

});

async function updateAccount() {
  let username = document.getElementById("name").value || "";
  let contact_number = document.getElementById("contact").value || "";

  let user_id = localStorage.getItem("user_id");
  if (!user_id) {
    console.error("Error: User ID not found in local storage.");
  }
  const { data, error } = await supabase
    .from("users")
    .update({
      username,
      contact_number
    })
    .eq("user_id", user_id);

  if (error) {
    console.error("Error updating account information: ", error);
    alert("Failed to update account.");
  } else {
    alert("Account updated successfully.");
  }
}



document.addEventListener("DOMContentLoaded", function () {
  const remove = document.getElementById("delete");

 remove.addEventListener("click", async function (event) {
  event.preventDefault();
  console.log("Button clicked");

  let user_id = localStorage.getItem("user_id");
  let confirmText = document.getElementById("confirm").value;

  if (confirmText !== "DELETE") {
    alert("You must enter 'DELETE' to proceed.");
    return;
  }

  if (!user_id) {
    console.error("Error: User ID not found.");
    return;
  }

  const confirmed = await showConfirmationPopup();
  if (!confirmed) return;

  try {
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_deleted: true })
      .eq("user_id", user_id);

    if (updateError) throw updateError;

    localStorage.clear();
    showMessage('Your account has been deactivated.', "We'll miss you. Come back to us soon!", true);
    setTimeout(() => {
        window.location.href = "/FurEver/";
      }, 4000);
  } catch (error) {
    console.error("Error during account soft-delete:", error);
    alert("Failed to mark account as deleted.");
  }
});

 const cancel = document.getElementById("cancel");
    if (cancel) {
      cancel.addEventListener("click", function () {
        document.getElementById("new-password").value = "";
        document.getElementById("con-password").value = "";
      });
    } else {
      console.warn("Cancel button not found.");
    }

});

function createPopup(title, content, buttons) {
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';

  const popup = document.createElement('div');
  popup.className = 'popup-box';

  const titleElement = document.createElement('h3');
  titleElement.className = 'popup-title';
  titleElement.textContent = title;

  const contentElement = document.createElement('div');
  contentElement.className = 'popup-content';
  contentElement.innerHTML = content;

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'popup-buttons';

  buttons.forEach(button => {
    const btn = document.createElement('button');
    btn.textContent = button.text;
    btn.className = button.primary ? 'popup-btn primary' : 'popup-btn secondary';

    btn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      button.onClick();
    });

    buttonContainer.appendChild(btn);
  });

  popup.appendChild(titleElement);
  popup.appendChild(contentElement);
  popup.appendChild(buttonContainer);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

function showConfirmationPopup() {
  return new Promise((resolve) => {
    createPopup(
      'Are you sure?',
      'Your account will be deactivated and permanently deleted in 30 days. Would you like to proceed?',
      [
        { text: 'Cancel', primary: false, onClick: () => resolve(false) },
        { text: 'Deactivate Account', primary: true, onClick: () => resolve(true) }
      ]
    );
  });
}

function showMessage(title, message, isSuccess = true) {
  const content = `<div class="popup-message ${isSuccess ? 'success' : 'error'}">${message}</div>`;
  createPopup(title, content, [
    { text: 'OK', primary: true, onClick: () => {} }
  ]);
}

 function selectMenuItem(item, sectionId) {
  document.querySelectorAll('.menu-item').forEach(el => {
    el.classList.remove('active');
    el.querySelector('span').style.fontWeight = 'normal'; 
  });

  item.classList.add('active');
  item.querySelector('span').style.fontWeight = 'bold';
  document.querySelectorAll('.section').forEach(el => {
    el.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

function enableEditing(id) {
  const input = document.getElementById(id);
  input.removeAttribute('readonly');
  input.classList.add('border-b-2', 'border-gray-300');
  input.focus();
  document.getElementById(`edit-${id}`).classList.add('hidden');
  document.getElementById(`save-${id}`).classList.remove('hidden');
}

async function saveChanges(id) {
  const input = document.getElementById(id);
  input.setAttribute('readonly', true);
  input.classList.remove('border-b-2', 'border-gray-300');
  document.getElementById(`edit-${id}`).classList.remove('hidden');
  document.getElementById(`save-${id}`).classList.add('hidden');

  
 await updateAccount();

}
