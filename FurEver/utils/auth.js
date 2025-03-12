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

const submit = document.getElementById('signup-submit');
if (submit){
    submit.addEventListener('click', async function(event){
        event.preventDefault();
        
        const username = document.getElementById("display-name").value;
        const phone = document.getElementById("contact_number").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("signup-password").value;
        const conpassword = document.getElementById("confirm-password").value;
        if(password !== conpassword){
            alert("Your passwords do not match!");
        }

        if(!email || !password || !username){
            alert("Please enter an email, password, and username");
        }

        if (!(password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@\(\)\\\/~$!%^*?&+\-])[A-Za-z\d@$!%^*?&~\(\)\\\/+\-]{6,}$/))) {
            alert("Passwords should have at least one one uppercase character, one lowercase character, one special character, one digit, and be 6 characters long.")
        }


        try {
            const {data, error} = await supabase.auth.signUp({
                email,
                password,
            });
            if (error){
                throw error;
            }
            const userId = data.user.id;
            const {error: insertError} = await supabase
                .from("users")
                .insert([
                    {
                        user_id: userId,
                        email: email,
                        username: username,
                        contact_number: phone
                    },
                ]);
            if (insertError) {
                throw insertError;
            }
            
            await createUserFolder(userId);

            alert("Account successfully created! Redirecting to sign in...");
            window.location.href = "../pages/signin_Furever.html";
        } catch (error){
            alert(error.message);
            console.error("Signup error:", error);
        }

    });
}

//sign in user
const signIn = document.getElementById('signin-submit');
if(signIn){
    signIn.addEventListener("click", async function(event){
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('signin-password').value;

        if (!email || !password){
            alert("Please enter your email and password");
        }

        try{
            const {data, error} = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error){
                throw error;
            }

            const userId = data.user.id;

            const {data: userData, error: fetchError} = await supabase
                .from("users")
                .select("username, contact_number")
                .eq("user_id", userId)
                .single();
            
            if (fetchError){
                throw fetchError;
            }

            localStorage.setItem("username", userData.username);
            localStorage.setItem("contact_number", userData.phone);

            alert('Account successfully logged in!');
            window.location.href="../pages/home.html";
        }catch (error){
            alert(error.message);
            console.error("Sign-in error:", error);
        }

        if (email == "systemadmin@gmail.com" && password == "root123"){
            alert("Admin Login Authorized.");
            window.location.href = "../pages/admin-dash.html";
        }
    })
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
