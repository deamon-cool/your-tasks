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

        <div class="info"></div>

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
let usernameLabel = container.querySelector('.window label[for=username]');
let username = container.querySelector('.window input[name=username]');
let email = container.querySelector('.window input[name=email]');
let sendCodeSubmit = container.querySelector('.window .row #send-code');
let info = container.querySelector('.window .info');
let codeLabel = container.querySelector('.window label[for=code]');
let activationCode = container.querySelector('.window input[name=code]');
let passwordLabel = container.querySelector('.window label[for=password]');
let password = container.querySelector('.window input[name=password]');
let passwordConfirmLabel = container.querySelector('.window label[for=confirm]');
let passwordConfirm = container.querySelector('.window input[name=confirm]');
let registerRow = container.querySelector('.window #register-row');
let registerSubmit = container.querySelector('.window .row #register');
let warning = container.querySelector('.window .warning');

// Hide DOM elements after first load
function hideDOMElements() {
    hide(usernameLabel);
    hide(username);
    hide(activationCode);
    hide(passwordLabel);
    hide(password);
    hide(passwordConfirmLabel);
    hide(passwordConfirm);
    hide(registerSubmit);
    hide(registerRow);
    hide(codeLabel);
}

hideDOMElements();

// Listeners
sendCodeSubmit.addEventListener('click', e => {
    e.preventDefault();

    let state = isEmailValidate(email.value);

    if (state) {
        let data = {
            email: email.value
        };
        sendEmail('/register/email/code', data);

        hide(sendCodeSubmit);
        showDOMELements();
    } else {
        displayMessage(warning, 'Wrong Email', 7000);
    }

});

registerSubmit.addEventListener('click', e => {
    e.preventDefault();

    let state = isFormValidated();

    if (state) {
        // fetching data
    } else {
        clearPasswordsValues();
    }
});

// Send email to the server
async function sendEmail(url, data) {
    let init = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    await fetch(url, init)
        .then(() => {
            displayMessage(info, 'Check your email and type in your activation code here', 7000);
        })
        .catch(e => {
            console.log(e);

            displayMessage(warning, 'error', 10000);
        });
}

//Show DOM elements
function showDOMELements() {
    show(usernameLabel);
    show(username);
    show(activationCode);
    show(passwordLabel);
    show(password);
    show(passwordConfirmLabel);
    show(passwordConfirm);
    show(registerSubmit);
    show(registerRow);
    show(codeLabel);
}

// Show DOM element
function show(element) {
    element.style.display = 'block';
}

// Hide DOM elements
function hide(element) {
    element.style.display = 'none';
}

//

// Checks form validation
function isFormValidated() {
    if (username.value === '' || password.value === '' || passwordConfirm.value === ''
        || email.valu === '' || activationCode.value === '') {
        displayMessage(warning, 'Fill out Username, Email, Activation Code, Password, Confirm Password', 7000);

        return false;
    }

    if (!isEmailValidate(email.value)) {
        displayMessage(warning, 'Wrong Email', 7000);

        return false;
    }

    if (password.value !== passwordConfirm.value) {
        displayMessage(warning, 'Password and Confirm Password are incorrect', 7000);

        return false;
    }

    return true;
}

// Adds message to DOM element
function displayMessage(element, msg, time) {
    clearTimeout(timeout);

    element.textContent = msg;

    timeout = setTimeout(() => {
        element.textContent = '';
    }, time);
}

// Clears passwords values
function clearPasswordsValues() {
    password.value = '';
    passwordConfirm.value = '';
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