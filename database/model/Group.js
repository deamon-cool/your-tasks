const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({
    position: Number,
    name: String,
    listsId: [mongoose.Types.ObjectId]
});

const Group = mongoose.model('Groups', GroupSchema);

module.exports = Group;