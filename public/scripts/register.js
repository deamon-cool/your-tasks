// Fills container
let container = document.querySelector('#container');

container.innerHTML = `
<div class="window">
    <h1>Register:</h1>

    <form action="/register/store/user" method="POST">
        <label for="username">Username:</label>
        <input type="text" name="username" placeholder="Username">

        <label for="email">Email:</label>
        <input type="text" name="email" placeholder="Email">

        <div class="row">
            <input id="send-code" type="submit" value="Send Code">
        </div>

        <label for="code">Code:</label>
        <input type="text" name="code" placeholder="Activation Code">

        <label for="password">Password:</label>
        <input type="password" name="password" placeholder="Password">

        <label for="confirm">Confirm Password:</label>
        <input type="password" name="confirm" placeholder="Confirm Password">

        <div class="warning"></div>

        <div id="register-row" class="row">
            <input id="register" type="submit" value="✔">
        </div>
    </form>

    <p class="redirect"><a href="/login">Login...</a></p>

    <p><a href="/register/privacy">Privacy</a></p>
</div>
`;

// Global variables
let timeout;
let tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

// DOM
let username = container.querySelector('.window input[name=username]');
let email = container.querySelector('.window input[name=email]');
let sendCode = container.querySelector('.window .row #send-code');
let codeLabel = container.querySelector('.window label[for=code]');
let activationCode = container.querySelector('.window input[name=code]');
let passwordLabel = container.querySelector('.window label[for=password]');
let password = container.querySelector('.window input[name=password]');
let passwordConfirmLabel = container.querySelector('.window label[for=confirm]');
let passwordConfirm = container.querySelector('.window input[name=confirm]');
let registerRow = container.querySelector('.window #register-row');
let register = container.querySelector('.window .row #register');
let warning = container.querySelector('.window .warning');

// Listeners
sendCode.addEventListener('click', e => {
    e.preventDefault();

    let state = isEmailValidate(email.value);

    if (state) {
        // fetching data
    } else {
        warningMessage('Wrong Email');
    }

});

register.addEventListener('click', e => {
    e.preventDefault();

    let state = isFormValidated();

    if (state) {
        // fetching data
    }
});

// Show DOM element
function show(element) {
    element.style.display = 'block';
}
// Checks form validation
function isFormValidated() {
    if (username.value === '' || password.value === '' || passwordConfirm.value === '') {
        warningMessage('Fill out Username, Password, Confirm Password');

        return false;
    }

    if (!isEmailValidate(email.value)) {
        warningMessage('Wrong Email');

        return false;
    }

    if (activationCode.value === '') {
        warningMessage('Fill Activation Code');

        return false;
    }

    if (password.value !== passwordConfirm.value) {
        warningMessage('Password and Confirm Password are incorrect');

        return false;
    }

    return true;
}

// Adds to DOM warning message
function warningMessage(msg) {
    clearTimeout(timeout);

    clearPasswordsValues();

    warning.textContent = msg;

    timeout = setTimeout(removeWarning, 7000);
}

// Clears passwords values
function clearPasswordsValues() {
    password.value = '';
    passwordConfirm.value = '';
}

// Removes text warning
function removeWarning() {
    warning.textContent = '';
}

// Checks email validation
function isEmailValidate(email) {
    if (!email) return false;

    if (email.length > 256) return false;

    if (!tester.test(email)) return false;

    // Further checking of some things regex can't handle
    let [account, address] = email.split('@');
    if (account.length > 64) return false;

    let domainParts = address.split('.');
    if (domainParts.some(function (part) {
        return part.length > 63;
    })) return false;

    return true;
}