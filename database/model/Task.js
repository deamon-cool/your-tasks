const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    position: Number,
    status: Boolean,
    startTime: String,
    endTime: String,
    title: String,
    description: String
});

const Task = mongoose.model('Tasks', TaskSchema);

module.exports = Task;