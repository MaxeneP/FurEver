document.addEventListener("DOMContentLoaded", async function(){
   const supabase =  window.supabase.createClient("https://idiqjlywytsddktbcvvc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaXFqbHl3eXRzZGRrdGJjdnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDAyMjQsImV4cCI6MjA1NTcxNjIyNH0.Q4HGFs832rIw2jhlKvFg2LsCgQuA7hEw91eedAApY60");


    console.log("Supabase success.", supabase);

    const forgotp = document.getElementById("submit-email");

if (forgotp){
    forgotp.addEventListener('click', async function (event){
    event.preventDefault();
    const email = document.getElementById("reset-email").value;

    let { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
        alert("Error sending recovery email: " + error.message);
    } else {
        alert("Recovery email sent! Check your inbox.");
    }
    });
}

    const psub = document.getElementById("submit-password");

    if(psub){
    psub.addEventListener('click', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@()\\/~$!%^*?&+\-])[A-Za-z\d@$!%^*?&~()\\/+]{6,}$/)) {
        alert("Password must have at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and 6 characters minimum.");
        return;
    }

    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        alert("Failed to update password: " + error.message);
    } else {
        alert("Password updated successfully!");
        window.location.href = "../pages/signin_Furever.html";
    }
    });
}
});