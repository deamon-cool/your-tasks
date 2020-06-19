const User = require('../database/model/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user === null) {
            return res.send({ error: true, serverOutput: 'Not found User' });
        }

        let passwordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!passwordCorrect) {
            return res.send({ error: true, serverOutput: 'Wrong Password' });
        }

        return res.redirect(301, '/main');
    } catch (e) {
        console.log('Err for: loginVerifyController ----------------------------------------------------->\n' + e);

        return res.redirect(401, '/error');
    }
}