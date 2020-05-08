//---------------------------TEST creating test Db-------------------------------

const mongoose = require('mongoose');
const User = require('../database/model/User');
const Group = require('../database/model/Group');
const List = require('../database/model/List');
const Task = require('../database/model/Task');

// Database connection
mongoose.connect('mongodb://localhost/to-do-list-db', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :|'));
db.once('open', () => {
    console.log('test: connected to db :)');

    createDb().then(console.log('completed -> Database is filled :)'));
});

// Create database
async function createDb() {
    const users = await User.find({});
    if (users === null || users.length === 0) {
        await User.create({
            name: 'Damian Hehe',
            password: '123',
        });
    }

    let user = await User.findOne({ name: 'Damian Hehe' });

    // create groups
    for (let i = 3; i >= 0; i--) {
        let group = await Group.create({
            position: i,
            name: `Group ${i}`
        });

        user = await User.findOne({ _id: user._id });
        await User.updateOne(user, { $push: { groupIds: group._id } });

        // create lists
        for (let j = 3; j >= 0; j--) {
            let list = await List.create({
                position: j,
                name: `List ${j}`
            });

            group = await Group.findOne({ _id: group._id });
            await Group.updateOne(group, { $push: { listIds: list._id } });

            // create tasks
            for (let k = 3; k >= 0; k--) {
                let task = await Task.create({
                    position: k,
                    status: false,
                    startTime: `0${k}:00`,
                    endTime: `0${k + 1}:00`,
                    title: `Task title ${k}`,
                    description: `description description description description ${k}`
                });

                list = await List.findOne({ _id: list._id });
                await List.updateOne(list, { $push: { taskIds: task._id } });
            }
        }

    }
}