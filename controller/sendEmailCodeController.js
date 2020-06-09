module.exports = (req, res) => {
    try {
        let email = req.body.email;
        // send email

        console.log(`Sent email to ${email}`);

        return res.send({ error: false, serverOutput: 'Check your email and type in your Activation Code' });
    } catch (e) {
        console.log('Err for: sendEmailCodeController ----------------------------------------------------->\n' + e);

        return res.redirect(400, '/error');
    }
};