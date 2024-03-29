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

        <div class="info"></div>
        <div class="warning"></div>

        <div id="register-row" class="row">
            <input id="register" type="submit" value="✔">
        </div>
    </form>

    <p class="redirect"><a href="/login">Login...</a></p>

    <p><a href="/info">Info</a></p>
</div>
`;

// Global variables
let warningTimeout;
let infoTimeout;
let messageTime = 15000; // 15000ms = 15s
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

        sendEmail(data);
    } else {
        displayWarningMessage('Wrong Email', 7000);
    }

});

registerSubmit.addEventListener('click', e => {
    e.preventDefault();

    let state = isFormValidated();

    if (state) {
        let data = {
            username: username.value,
            email: email.value,
            code: activationCode.value,
            password: password.value
        };

        sendData(data);
    } else {
        clearPasswordsValues();
    }
});

// Sends email to the server
async function sendEmail(data) {
    let url = '/register/email/code';

    let init = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    };

    await fetch(url, init)
        .then(response => response.json())
        .then(newData => {
            if (!newData.error) {
                warning.textContent = '';

                displayInfoMessage(newData.serverOutput, messageTime)

                hide(sendCodeSubmit);
                showDOMELements();
            } else {
                displayWarningMessage(newData.serverOutput, messageTime)
            }
        })
        .catch(e => {
            displayWarningMessage('Error sending email. Try later', messageTime);
        });
}

// Sends user data to the server
async function sendData(data) {
    let url = '/register/store/user';

    let init = {
        method: 'POST',
        redirect: 'follow',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    };

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
            displayWarningMessage(newData.serverOutput, messageTime);

            clearPasswordsValues();
        }
    } catch (e) {
        displayWarningMessage('Register error. Try later', messageTime);
    }
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

// Checks form validation
function isFormValidated() {
    if (username.value === '' || password.value === '' || passwordConfirm.value === ''
        || email.valu === '' || activationCode.value === '') {
        displayWarningMessage('Fill out Username, Email, Activation Code, Password, Confirm Password', messageTime);

        return false;
    }

    if (!isEmailValidate(email.value)) {
        displayWarningMessage('Wrong Email', messageTime);

        return false;
    }

    if (password.value !== passwordConfirm.value) {
        displayWarningMessage('Password and Confirm Password are incorrect', messageTime);

        return false;
    }

    return true;
}

// Adds warning message to DOM element
function displayWarningMessage(msg, time) {
    clearTimeout(warningTimeout);

    warning.textContent = msg;

    warningTimeout = setTimeout(() => {
        warning.textContent = '';
    }, time);
}

// Adds info message to DOM element
function displayInfoMessage(msg, time) {
    clearTimeout(infoTimeout);

    info.textContent = msg;

    infoTimeout = setTimeout(() => {
        info.textContent = '';
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