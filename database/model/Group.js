const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({
    position: Number,
    name: String,
    listIds: [mongoose.Types.ObjectId]
});

const Group = mongoose.model('Groups', GroupSchema);

module.exports = Group;