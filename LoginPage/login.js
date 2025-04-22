document.addEventListener('DOMContentLoaded', function() {
    // Get the login form
    const loginForm = document.getElementById('loginForm');
    
    // Form validation function
    function validateLoginForm() {
        let isValid = true;
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        
        // Validate username
        const username = document.getElementById('UserName').value.trim();
        if (username === '') {
            document.getElementById('usernameError').textContent = 'Please enter your username';
            document.getElementById('usernameError').style.display = 'block';
            isValid = false;
        }
        
        // Validate password
        const password = document.getElementById('Password').value;
        if (password === '') {
            document.getElementById('passwordError').textContent = 'Please enter your password';
            document.getElementById('passwordError').style.display = 'block';
            isValid = false;
        } else if (password.length < 6) {
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
            document.getElementById('passwordError').style.display = 'block';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Handle form submission
    loginForm.addEventListener('submit', function(event) {
        // Prevent form submission if validation fails
        if (!validateLoginForm()) {
            event.preventDefault();
        }
    });
    
    // Check for URL parameters to display error messages from PHP
    function checkForErrors() {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
            const loginErrors = document.getElementById('loginErrors');
            loginErrors.textContent = decodeURIComponent(error);
            loginErrors.style.display = 'block';
        }
    }
    
    // Run error check on page load
    checkForErrors();
});