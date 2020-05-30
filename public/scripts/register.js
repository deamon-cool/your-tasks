// Fills container
let container = document.querySelector('#container');

container.innerHTML = `
<div class="window">
    <h1>Register:</h1>

    <form action="/register/store/user" method="POST">
        <label for="username">User Name:</label>
        <input type="text" name="username" placeholder="User Name">

        <label for="password">Password:</label>
        <input type="password" name="password" placeholder="Password">

        <label for="confirm">Confirm Password:</label>
        <input type="password" name="confirm" placeholder="Confirm Password">

        <div class="warning"></div>

        <div class="row">
            <input type="submit" value="✔">
        </div>
    </form>

    <p class="redirect"><a href="/login">Login...</a></p>

    <p><a href="/register/privacy">Privacy</a></p>
</div>
`;

// Global variables
let timeout;

// DOM
let username = container.querySelector('.window input[name=username]');
let password = container.querySelector('.window input[name=password]');
let passwordConfirm = container.querySelector('.window input[name=confirm]');
let submit = container.querySelector('.window .row input[type=submit]');
let warning = container.querySelector('.window .warning');

// Listeners
submit.addEventListener('click', (e) => {
    let state = isFormValidated();

    if (!state) {
        e.preventDefault();
    }
});

// Checks form validation
function isFormValidated() {
    console.log(username.value);
    console.log(password.value);
    console.log(passwordConfirm.value);

    if (username.value === '' || password.value === '' || passwordConfirm.value === '') {
        warningMessage('Fill out inputs');

        return false;
    }

    if (password.value !== passwordConfirm.value) {
        warningMessage('Confirm password is incorrect');

        return false;
    }

    return true;
}

// Adds to DOM warning message
function warningMessage(msg) {
    clearTimeout(timeout);

    warning.textContent = msg;

    timeout = setTimeout(removeWarning, 5000);
}

// Removes text warning
function removeWarning() {
    warning.textContent = '';
}