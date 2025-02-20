    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
    import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
    import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCKYsPLY9c_67iQj4VcCHhrAA5DVwF1ddg",
    authDomain: "furever-d4e0f.firebaseapp.com",
    databaseURL: "https://furever-d4e0f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "furever-d4e0f",
    storageBucket: "furever-d4e0f.firebasestorage.app",
    messagingSenderId: "957423027493",
    appId: "1:957423027493:web:282302cdc57f9bd6ff06cc",
    measurementId: "G-GYQ43H4KQ6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth=getAuth();
  const db=getFirestore();


  const submit = document.getElementById('submit');

  if(submit){
  submit.addEventListener("click", function (event) {
         event.preventDefault();
        
         //inputs
        const email=document.getElementById('email').value;
        const password = document.getElementById('signup-password').value;
        const username = document.getElementById('username').value;
        const contact_number = document.getElementById('contact_number').value;


        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            const user=userCredential.user;
            const userData={
                email: email,
                username: username,
                contact_number: contact_number
            };
            alert("Account has been created.");
            const docRef=doc(db, "users", user.uid);
            setDoc(docRef, userData)
            .then(()=>{
                window.location.href='signin_Furever.html';
            })
            .catch((error)=>{
                console.error("error writing document", error);
            });
        })
        .catch((error)=>{
            const errorCode=error.code;
            if(errorCode=='auth/email-already-in-use'){
                alert("Email already exists");
            }else{
                alert('unable to create user');
            }
        })
        });//end
    }

   //sign in
    const signIn = document.getElementById('signin-submit');
    if(signIn){
    signIn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const email = document.getElementById('email').value;
        const password = document.getElementById('signin-password').value;

        if (email == "admin" && password == "root123"){ //admin dashboard login
            alert("Administrator Login Success.");
            window.location.href="admin-dash.html";
        }

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            alert('login is successful!');
            const user=userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href='landing-page.html';
        })
        .catch((error)=>{
            const errorCode=error.code;
            if(errorCode=='auth/invalid-credential'){
                alert('Incorrect email or password');
            }else{
                alert('account does not exist');
            }
        })
    });
}

    

    


  