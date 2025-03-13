const supabase =  window.supabase.createClient("https://idiqjlywytsddktbcvvc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaXFqbHl3eXRzZGRrdGJjdnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDAyMjQsImV4cCI6MjA1NTcxNjIyNH0.Q4HGFs832rIw2jhlKvFg2LsCgQuA7hEw91eedAApY60");

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

    try {
     //delete user folder from storage
      const { data: images, error: imgError } = await supabase.storage
        .from("images")
        .list(user_id + "/");

      if (imgError) console.error("Error fetching images: ", imgError);

      if (images && images.length > 0) {
        for (let image of images) {
          await supabase.storage.from("images").remove([user_id + "/" + image.name]);
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

      localStorage.clear();
      alert("Account Successfully Deleted");
      window.location.href = "../index.html";

    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account and records.");
    }
  });

  const cancel = document.getElementById("cancel"); //cancel button
  cancel.addEventListener("click", function() {
    document.getElementById("new-password").value = "";
    document.getElementById("con-password").value = "";
  });

});

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
