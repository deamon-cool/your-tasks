const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    password: String,
    groupIds: mongoose.Types.ObjectId
});

const User = mongoose.model('Users', UserSchema);

module.exports = User;