const ActivationCode = require('../database/model/ActivationCode');

module.exports = async (req, res, next) => {
    try {
        const email = req.body.email;
        const code = req.body.code;

        const activationCode = await ActivationCode.findOne({ email: email });

        if (activationCode === null) {
            return res.send({
                error: true,
                serverOutput: 'Correct your Email and try again. If it doesn\'t help, reload page and Send Code again' });
        }

        if (activationCode.code !== code) {
            return res.send({ error: true, serverOutput: 'Activation Code is incorrect' });
        }

        next();
    } catch (e) {
        console.log('Err for: activationCodeValidation ----------------------------------------------------->\n' + e);

        return res.redirect(400, '/error');
    }
};