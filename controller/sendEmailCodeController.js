const bcrypt = require('bcrypt');
const ActivationCode = require('../database/model/ActivationCode');

module.exports = async (req, res) => {
    try {
        const email = req.body.email;

        const activationCode = await bcrypt.hash(email, 10);

        await ActivationCode.create({
            email,
            activationCode
        });

        // send email

        console.log(`Sent email to ${email}`);

        return res.send({ error: false, serverOutput: 'Check your email and type in your Activation Code' });
    } catch (e) {
        console.log('Err for: sendEmailCodeController ----------------------------------------------------->\n' + e);

        return res.redirect(400, '/error');
    }
};