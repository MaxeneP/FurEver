const supabase =  window.supabase.createClient("https://idiqjlywytsddktbcvvc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaXFqbHl3eXRzZGRrdGJjdnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDAyMjQsImV4cCI6MjA1NTcxNjIyNH0.Q4HGFs832rIw2jhlKvFg2LsCgQuA7hEw91eedAApY60");


console.log("Supabase success.", supabase);


async function createUserFolder(userId){
    const folderPath = `user_${userId}/placeholder.txt`;

    const placeholderContent = new Blob(["This is a placeholder file."], { type: "text/plain" });

    const { error } = await supabase.storage
        .from("images")
        .upload(folderPath, placeholderContent, { upsert: false });

    if (error) {
        console.error("Error creating user folder:", error);
        alert("Error creating user folder: " + error.message);
    } else {
        console.log(`Folder created for user: ${userId}`);
    }

}

// SIGN UP
const submit = document.getElementById('signup-submit');
if (submit) {
  submit.addEventListener('click', async function (event) {
    event.preventDefault();

    const username = document.getElementById("display-name").value;
    const phone = document.getElementById("contact_number").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("signup-password").value;
    const conpassword = document.getElementById("confirm-password").value;

    if (password !== conpassword) {
      return alert("Your passwords do not match!");
    }

    if (!email || !password || !username) {
      return alert("Please enter an email, password, and username");
    }

    if (
      !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@()\\/~$!%^*?&+\-])[A-Za-z\d@$!%^*?&~()\\/+]{6,}$/)
    ) {
      return alert("Password must have at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 digit, and be at least 6 characters long.");
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "https://maxenep.github.io/FurEver/pages/signin_Furever.html",
          data: {
            username,
            contact_number: phone,
          },
        },
      });

      if (error) throw error;

      alert("A verification email has been sent to your inbox. Please verify your email before logging in.");
    } catch (error) {
      alert(error.message);
      console.error("Signup error:", error);
    }
  });
}

// SIGN IN
const signIn = document.getElementById("signin-submit");
if (signIn) {
  signIn.addEventListener("click", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("signin-password").value;

    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        alert("User does not exist. Please sign up.");
        return;
      }

      if (!data.user.email_confirmed_at) {
        alert("Please verify your email before logging in.");
        await supabase.auth.signOut();
        return;
      }

      const userId = data.user.id;

      // Check if user already exists in DB
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("username, contact_number")
        .eq("user_id", userId)
        .single();

      // If not in DB, insert user now (after verification)
      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            user_id: userId,
            email: email,
            username: data.user.user_metadata?.username || '',
            contact_number: data.user.user_metadata?.contact_number || '',
          },
        ]);
        if (insertError) throw insertError;

        await createUserFolder(userId);
      }

      alert("Account successfully logged in!");
      if (email === "systemadmin@gmail.com" && password === "root123") {
        alert("Admin Login Authorized.");
        window.location.href = "../pages/admin-dash.html";
      } else {
        window.location.href = "../pages/home.html";
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      alert(error.message);
    }
  });
}


//sign out user
const signOut = document.getElementById('sign-out');
if(signOut){
    signOut.addEventListener("click", async function(event){
        event.preventDefault();

        const { error } = await supabase.auth.signOut()

        alert("You have signed out.");
        window.location.href = "../pages/signin_Furever.html";
        if (error){
            throw error;
        }

    })
}
