module.exports = async (req, res) => {
    try {

    } catch (e) {
        console.log('Err for: storeUserController ----------------------------------------------------->\n' + e);

        return res.redirect(400, '/error');
    }
};