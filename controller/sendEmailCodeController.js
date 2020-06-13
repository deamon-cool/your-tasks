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
        const email = req.body.email;

        const activationCode = await bcrypt.hash(email, 1);

        await ActivationCode.create({
            email,
            activationCode
        });

        // Message configuration
        const message = {
            from: data.email.auth.user,
            to: email,
            subject: 'Copy Activation Code',
            text: activationCode
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