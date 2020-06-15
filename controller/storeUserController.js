const bcrypt = require('bcrypt');
const User = require('../database/model/User');

module.exports = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        return res.redirect('/login');
    } catch (e) {
        console.log('Err for: storeUserController ----------------------------------------------------->\n' + e);

        return res.redirect(400, '/error');
    }
};