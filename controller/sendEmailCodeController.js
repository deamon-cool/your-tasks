const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const ActivationCode = require('../database/model/ActivationCode');
const data = require('../config/productionData.json');

// Email configuration
const transport = nodemailer.createTransport({
    host: data.email.host,
    secure: true,
    port: 465,
    auth: {
        user: data.email.auth.user,
        pass: data.email.auth.pass
    }
});

module.exports = async (req, res) => {
    try {
        const userEmail = req.body.email;

        const activationCode = await bcrypt.hash(userEmail, 1);

        await ActivationCode.create({
            email: userEmail,
            code: activationCode
        });

        // Message configuration
        const message = {
            from: data.email.auth.user,
            to: userEmail,
            subject: 'Copy Activation Code',
            text: activationCode,
            html: `
            <p>Welcome ${userEmail},</p>
            <p>It's just an email verification. We just need to know that you are you :)</p>
            <p>This is your verification code:</p>
            <h2><b>${activationCode}</b></h2>
            <p>Please type this code into <b>Activation Code</b> on our website and then fill out the rest stuff.</p>
            <p><i>You’re receiving this email because you recently created a new Your Tasks account.
            If this wasn’t you, please ignore this email.</i></p>
            `
        };

        // Sends email
        transport.sendMail(message, (err, info) => {
            if (err) {
                return res.send({ error: true, serverOutput: 'Could not send email' });
            } else {
                return res.send({ error: false, serverOutput: 'Check your email and type in your Activation Code' });
            }
        });
    } catch (e) {
        console.log('Err for: sendEmailCodeController ----------------------------------------------------->\n' + e);

        return res.redirect(400, '/error');
    }
};