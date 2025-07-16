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

function init() {
      window.addEventListener('click', eventDelegation);
    }

function eventDelegation(e) {
    console.log(e.target)
            
    if (e.target == document.getElementById('tnc-open-btn')) {
      let tnc = document.getElementById('tnc-wrapper');
      tnc.classList.remove('hidden');
      tnc.classList.add('flex');
    }
            
    if (e.target == document.getElementById('close-tnc-btn')) {
      let tnc = document.getElementById('tnc-wrapper');
      tnc.classList.add('hidden');
      tnc.classList.remove('flex');
    }
}

init();

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
    const tncCheckbox = document.getElementById("tnc-cb");

    if (!tncCheckbox.checked) {
    return alert("You must agree to the Terms and Conditions before signing up.");
    }

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
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .limit(1);

      if (fetchError) {
        throw fetchError;
      }

      if (existingUsers.length > 0) {
        return alert("An account with this email already exists. Please use a different email or log in.");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
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

// popup for recovering account
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

function showAccountRecoveryPopup() {
  return new Promise((resolve) => {
    createPopup(
      'Account Deactivated',
      'Your account has been deactivated. Would you like to recover your account?',
      [
        { text: 'Cancel', primary: false, onClick: () => resolve(false) },
        { text: 'Restore Account', primary: true, onClick: () => resolve(true) }
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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

      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("username, contact_number, is_deleted")
        .eq("user_id", userId)
        .single();

     if (existingUser?.is_deleted) {
        await supabase.auth.signOut();

       const wantsToRecover = await showAccountRecoveryPopup(email, password);
      if (!wantsToRecover) return;

      try {
        const { error: updateError } = await supabase
          .from("users")
          .update({ is_deleted: false })
          .eq("user_id", userId);

        if (updateError) throw updateError;

        showMessage('Success', 'Your account has been successfully reactivated!', true);

        setTimeout(() => {
          window.location.href = "../pages/signin_Furever.html";
        }, 2000);
      } catch (err) {
        console.error("Account recovery error:", err);
        showMessage('Error', 'Failed to reactivate account. Please try again.', false);
      }

        return;
      }
      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert([{
          user_id: userId,
          email,
          username: data.user.user_metadata?.username || '',
          contact_number: data.user.user_metadata?.contact_number || '',
        }]);

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
