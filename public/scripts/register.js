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

        <div class="row">
            <input type="submit" value="✔">
        </div>
    </form>

    <p><a href="/register/privacy">Privacy</a></p>
</div>
`;