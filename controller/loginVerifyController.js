const User = require('../database/model/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    try {

        return res.send({ error: true, serverOutput: 'Could not log in' });
        // return res.redirect(301, '/main');
    } catch (e) {
        console.log('Err for: loginVerifyController ----------------------------------------------------->\n' + e);

        return res.redirect(401, '/error');
    }
}