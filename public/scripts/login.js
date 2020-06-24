let container = document.querySelector('#container');

container.innerHTML = `
<div class="window">
    <h1>Login:</h1>

    <form action="/register/store/user" method="POST">
        <label for="email">Email:</label>
        <input type="text" name="email" placeholder="Email">

        <label for="password">Password:</label>
        <input type="password" name="password" placeholder="Password">

        <div class="warning"></div>

        <div class="row">
            <input type="submit" value="✔">
        </div>
    </form>

    <p class="redirect"><a href="/register">Register...</a></p>

    <p><a href="/info">Info</a></p>
</div>
`;

// Global variables
let timeout;
let messageTime = 15000; // 15000ms = 15s
let tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

// DOM
let email = container.querySelector('.window input[name=email]');
let password = container.querySelector('.window input[name=password]');
let submit = container.querySelector('.window .row input[type=submit]');
let warning = container.querySelector('.window .warning');

// Listeners
submit.addEventListener('click', (e) => {
    e.preventDefault();

    let state = isFormValidated();

    if (state) {
        data = {
            email: email.value,
            password: password.value
        };

        sendData(data);
    }
});

// Sends login data to the server
async function sendData(data) {
    let url = '/login/verify';
    let init = {
        method: 'POST',
        redirect: 'follow',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }

    try {
        let response = await fetch(url, init);

        if (response.redirected) {
            window.location.href = response.url;

            return;
        }

        let newData = await response.json();

        if (!newData.error) {
            warning.textContent = '';
        } else {
            warningMessage(newData.serverOutput, messageTime);

            clearPasswordValue();
        }
    } catch (e) {
        warningMessage('Login error. Try later', messageTime);
    }
}

// Checks form validation
function isFormValidated() {
    if (email.value === '' || password.value === '') {
        warningMessage('Fill out Email and Password');

        return false;
    }

    if(!isEmailValidate(email.value)) {
        warningMessage('Wrong Email');

        return false;
    }

    return true;
}

// Adds to DOM warning message
function warningMessage(msg) {
    clearTimeout(timeout);

    password.value = '';

    warning.textContent = msg;

    timeout = setTimeout(removeWarning, messageTime);
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

// Clears password value
function clearPasswordValue() {
    password.value = '';
}