function togglePassword(inputId) {
    let passwordInput = document.getElementById(inputId);
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Change to normal text
    } else {
        passwordInput.type = "password"; // Change back to hidden
    }
}
