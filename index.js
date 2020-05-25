const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./database/model/User');
const Group = require('./database/model/Group');
const List = require('./database/model/List');
const Task = require('./database/model/Task');


// Database connection
mongoose.connect('mongodb://localhost/to-do-list-db', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :|'));
db.once('open', () => console.log('connected to db :)'));

// Express configuration
app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));


// Request handlers (controllers)

app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: `${__dirname}/public` });
});

app.post('/register/store/user', async (req, res) => {
    const user = req.body;

    console.log(user);
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: `${__dirname}/public` });
});

// Load first group, its lists and its tasks
app.get('/main', async (req, res) => {
    res.sendFile('main.html', { root: `${__dirname}/public` });
});

// Download data groups, lists, tasks
app.get('/main/data/:position', async (req, res) => {
    //TEST -> creating test user
    const users = await User.find({});
    if (users === null || users.length === 0) {
        await User.create({
            name: 'Damian Hehe',
            password: '123',
        });
    }

    try {
        const position = Number(req.params.position);

        let packet = {};

        packet.user = users[0].name;

        // TEST -> For users[0]
        // if (users[0].groupIds === undefined || users[0].groupIds.length === 0) {
        //     return res.sendFile('main.html', { root: `${__dirname}/public` });
        // }

        //TEST -> load ids of group from test user
        const groupIds = users[0].groupIds;

        packet.groups = [];
        // download all Groups
        for (let i = 0; i < groupIds.length; i++) {
            const group = await Group.findOne({ _id: groupIds[i] });

            // Flag id for rendering group
            if (group.position === position) packet.renderedId = group._id;

            packet.groups[i] = {};
            packet.groups[i].id = group._id;
            packet.groups[i].position = group.position;
            packet.groups[i].name = group.name;
            packet.groups[i].lists = [];

            const listIds = group.listIds;
            // download all Lists in Group
            for (let j = 0; j < listIds.length; j++) {
                const list = await List.findOne({ _id: listIds[j] });

                packet.groups[i].lists[j] = {};
                packet.groups[i].lists[j].id = list._id;
                packet.groups[i].lists[j].position = list.position;
                packet.groups[i].lists[j].name = list.name;
                packet.groups[i].lists[j].tasks = [];

                const taskIds = list.taskIds;
                // download only Tasks belongs to Group[0]
                if (group.position === position) {

                    // download all Tasks in List
                    for (let k = 0; k < taskIds.length; k++) {
                        const task = await Task.findOne({ _id: taskIds[k] });

                        packet.groups[i].lists[j].tasks[k] = {};
                        packet.groups[i].lists[j].tasks[k].id = task._id;
                        packet.groups[i].lists[j].tasks[k].position = task.position;
                        packet.groups[i].lists[j].tasks[k].status = task.status;
                        packet.groups[i].lists[j].tasks[k].startTime = task.startTime;
                        packet.groups[i].lists[j].tasks[k].endTime = task.endTime;
                        packet.groups[i].lists[j].tasks[k].title = task.title;
                        packet.groups[i].lists[j].tasks[k].description = task.description;
                    }
                }
            }
        }

        return res.json(packet);
    } catch (e) {
        console.log('Err for: /main/data/:position ----------------------------------------------------->\n' + e);

        return res.redirect(500, '/error');
    }
});

// Store new group in Db
app.post('/main/store/group', async (req, res) => {
    if (req.body.name === '') {
        return res.redirect(302, '/main');
    }

    try {
        const groups = await Group.find({});

        const group = await Group.create({
            position: groups.length,
            name: req.body.name
        });

        //TEST -> added group id to random user
        await User.updateOne({ $expr: { name: 'Damian' } }, { $push: { groupIds: group._id } });

        return res.redirect(302, '/main');
    } catch (e) {
        console.log('Err for: /main/store/group ----------------------------------------------------->\n' + e);

        return res.redirect(500, '/error');
    }
});

// Store new list in Db
app.post('/main/store/list/:groupid', async (req, res) => {
    if (req.body.name === '') {
        return res.redirect(302, '/main');
    }

    const groupId = req.url.slice(req.url.search(':') + 1);

    try {
        const group = await Group.findOne({ _id: groupId });
        const position = group.listIds.length;

        const list = await List.create({
            position: position,
            name: req.body.name
        });

        await Group.updateOne(group, { $push: { listIds: list._id } });

        return res.redirect(302, '/main');
    } catch (e) {
        console.log('Err for: /main/store/list/:groupid ----------------------------------------------------->\n' + e);

        return res.redirect(500, '/error');
    }
});

// Store new task in Db
app.post('/main/store/task/:listId', async (req, res) => {
    const listId = req.url.slice(req.url.search(':') + 1);

    try {
        const list = await List.findOne({ _id: listId });
        const position = list.taskIds.length;

        const task = await Task.create({
            position: position,
            status: false,
            startTime: req.body.starttime,
            endTime: req.body.endtime,
            title: req.body.title,
            description: req.body.description
        });

        await List.updateOne(list, { $push: { taskIds: task._id } });

        return res.redirect(302, '/main');
    } catch (e) {
        console.log('Err for: /main/store/task/:listId ----------------------------------------------------->\n' + e);

        return res.redirect(500, '/error');
    }
});

// Update task in Db
app.post('/main/update/task/:taskid', async (req, res) => {
    const taskId = req.url.slice(req.url.search(':') + 1);

    try {
        const task = await Task.findOne({ _id: taskId });

        await Task.updateOne(task, {
            startTime: req.body.starttime,
            endTime: req.body.endtime,
            title: req.body.title,
            description: req.body.description
        });

        return res.redirect(302, '/main');
    } catch (e) {
        console.log('Err for: /main/update/task/:taskid ----------------------------------------------------->\n' + e);

        return res.redirect(500, '/error');
    }

});

// Update task status in Db
app.post('/main/update/task/status/:taskid', async (req, res) => {
    const taskId = req.url.slice(req.url.search(':') + 1);

    try {
        await Task.updateOne({ _id: taskId }, { status: req.body.status });
    } catch (e) {
        console.log('Err for: /main/update/task/status/:taskid ----------------------------------------------------->\n' + e);

        return res.redirect(500, '/error');
    }
});

// Update tasks position in Db
app.post('/main/update/tasks/position', async (req, res) => {
    try {
        for (let i = 0; i < req.body.length; i++) {
            let id = req.body[i].id;
            let position = req.body[i].position;

            await Task.updateOne({ _id: id }, { position: position });
        }
    } catch (e) {
        console.log('Err for: /main/update/tasks/position ----------------------------------------------------->\n' + e);

        return res.redirect(500, '/error');
    }
});

// Delete tasks in Db and delete tasksIds in List
app.delete('/main/delete/tasks/:listid', async (req, res) => {
    const listId = req.url.slice(req.url.search(':') + 1);

    try {
        let taskIds = req.body;

        await List.updateOne({ _id: listId }, { $pullAll: { taskIds: taskIds } });

        for (let i = 0; i < taskIds.length; i++) {
            const taskId = taskIds[i];

            await Task.deleteOne({ _id: taskId });
        }
    } catch (e) {
        console.log('Err for: /main/delete/tasks/:listid ----------------------------------------------------->\n' + e);

        return res.redirect(500, '/error');
    }
});


// app.get('/progress', (req, res) => {
//     res.render('progress');
// });


// If none reponsed then this is a difault endpoint
app.get('/*', (req, res) => {
    res.sendFile('login.html', { root: `${__dirname}/public` });
});


// Run server
app.listen(8000, () => {
    console.log(`Server running at http://${'127.0.0.1'}:${8000}/`);
});