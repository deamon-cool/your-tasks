const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const ActivationCode = require('../database/model/ActivationCode');

// email configuration
const transport = nodemailer.createTransport({
    host: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: 'youremail@gmail.com',
        pass: 'password'
    }
});

module.exports = async (req, res) => {
    try {
        const email = req.body.email;

        const activationCode = await bcrypt.hash(email, 10);

        await ActivationCode.create({
            email,
            activationCode
        });

        // Message configuration
        const message = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'Copy Activation Code',
            text: activationCode
        };

        // Sends email
        transport.sendMail(message, (err, info) => {
            if (err) {
                return res.send({ error: true, serverOutput: 'Cannot sant email' });
            } else {
                return res.send({ error: false, serverOutput: 'Check your email and type in your Activation Code' });
            }
        });
    } catch (e) {
        console.log('Err for: sendEmailCodeController ----------------------------------------------------->\n' + e);

        return res.redirect(400, '/error');
    }
};