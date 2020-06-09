const emailValidator = require('email-validator');
const User = require('../database/model/User');

module.exports = async (req, res, next) => {
    try {
        let email = req.body.email;
        let state = emailValidator.validate(email);

        if (state) {
            const user = await User.findOne({ email: email });

            if (user === null) {
                next();
            } else {
                return res.send({ error: true, serverOutput: 'Email exists. You should type another Email' });
            }

        } else {
            return res.send({ error: true, serverOutput: 'Wrong Email' });
        }
    } catch (e) {
        console.log('Err for: emailCheck ----------------------------------------------------->\n' + e);

        return res.redirect(400, '/error');
    }
};