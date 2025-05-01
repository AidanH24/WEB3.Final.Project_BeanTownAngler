document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    function validateLoginForm() {
        let isValid = true;
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

        const username = document.getElementById('UserName').value.trim();
        if (!username) {
            const uErr = document.getElementById('usernameError');
            uErr.textContent = 'Please enter your username';
            uErr.style.display = 'block';
            isValid = false;
        }

        const password = document.getElementById('Password').value;
        if (!password) {
            const pErr = document.getElementById('passwordError');
            pErr.textContent = 'Please enter your password';
            pErr.style.display = 'block';
            isValid = false;
        } else if (password.length < 6) {
            const pErr = document.getElementById('passwordError');
            pErr.textContent = 'Password must be at least 6 characters';
            pErr.style.display = 'block';
            isValid = false;
        }

        return isValid;
    }

    loginForm.addEventListener('submit', function(event) {
        const username = document.getElementById('UserName').value.trim();
        const password = document.getElementById('Password').value;

        // Hard-coded admin check
        if (username === 'AnglerAdmin25' && password === 'Admin123') {
            event.preventDefault();
            window.location.href = '/WEB3-main/AdminPage/index.html';
            return;
        }

        // Otherwise validate and fall back to login.php
        if (!validateLoginForm()) {
            event.preventDefault();
        }
    });

    // Show any PHP-returned errors
    function checkForErrors() {
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        if (error) {
            let loginErrors = document.getElementById('loginErrors');
            if (!loginErrors) {
                loginErrors = document.createElement('div');
                loginErrors.id = 'loginErrors';
                loginErrors.style.color = '#ff6961';
                loginForm.prepend(loginErrors);
            }
            loginErrors.textContent = decodeURIComponent(error);
            loginErrors.style.display = 'block';
        }
    }
    checkForErrors();
});
