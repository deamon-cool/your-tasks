const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    password: String,
    groupIds: [mongoose.Types.ObjectId]
});

// const UserSchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Fill out Username'],
//         unique: [true, 'This User exists. Change Username']
//     },
//     password: {
//         type: String,
//         required: [true, 'Fill out Password']
//     },
//     groupIds: [mongoose.Types.ObjectId]
// });

const User = mongoose.model('Users', UserSchema);

module.exports = User;