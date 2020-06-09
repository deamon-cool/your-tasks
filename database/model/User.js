const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Fill out Username'],
    },
    email: {
        type: String,
        required: [true, 'Fill out Email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Fill out Password']
    },
    groupIds: [mongoose.Types.ObjectId]
});

const User = mongoose.model('Users', UserSchema);

module.exports = User;