module.exports = async (req, res, next) => {
    const user = req.body;
    const userName = user.username;

    console.log(user);
}