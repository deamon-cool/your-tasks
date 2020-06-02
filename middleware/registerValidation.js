module.exports = async (req, res, next) => {
    if (req.body.username === undefined || req.body.password === undefined
        || req.body.username === '' || req.body.password === '') {
        return res.redirect('/register');
    }



    next();
};