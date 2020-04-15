const mongoose = require('mongoose');

const ListSchema = mongoose.Schema({
    position: Number,
    name: String,
    taskIds: [mongoose.Types.ObjectId]
});

const List = mongoose.model('Lists', ListSchema);

module.exports = List;