const emailValidator = require('email-validator');

module.exports = (req, res, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const code = req.body.code;

        if (username === '' || email === '' || code === '' || req.body.password === '') {
            return res.send({
                error: true,
                serverOutput: 'Fill out Username, Email, Activation Code, Password, Confirm Password'
            });
        }

        if (!emailValidator.validate(email)) {
            return res.send({ error: true, serverOutput: 'Wrong Email' });
        }

        next();
    } catch (e) {
        console.log('Err for: registerValidation ----------------------------------------------------->\n' + e);

        return res.redirect(400, '/error');
    }
}