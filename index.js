const express = require('express');
const { engine } = require('express-edge');
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
app.use(express.static('public'));

app.use(engine);
app.set('views', `${__dirname}/views`);

// Request handlers (controllers)
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Load first group, its lists and its tasks
app.get('/main', async (req, res) => {

    //TEST -> creating test user
    const users = await User.find({});
    if (users === null || users.length === 0) {
        await User.create({
            name: 'Damian Hehe',
            password: '123',
        });
    }

    try {
        let packet = {};

        packet.user = users[0].name;

        if (users[0].groupIds === undefined) {
            return res.render('main', { packet: packet });
        }

        //TEST -> load ids of group from test user
        const groupIds = users[0].groupIds;

        packet.groups = [];
        // download all Groups
        for (let i = 0; i < groupIds.length; i++) {
            const group = await Group.findOne({ _id: groupIds[i] });

            const listIds = group.listIds;
            delete group.listIds;

            packet.groups.push(group);

            packet.groups[i].lists = [];
            // download all Lists in Group
            for (let j = 0; j < listIds.length; j++) {
                const list = await List.findOne({ _id: listIds[j] });

                const taskIds = list.taskIds;
                delete list.taskIds;

                packet.groups[i].lists.push(list);

                packet.groups[i].lists[j].tasks = [];

                // download only Tasks belongs to Group[0]
                if(packet.group[0]) {
                    // download all Tasks in List
                    for (let k = 0; k < taskIds; k++) {
                        const task = await Task.findOne({ _id: taskIds[k] });

                        packet.groups[i].lists[j].tasks.push(task);
                    }
                }
            }
        }

        console.log(packet);

        return res.render('main', { packet: packet });
    } catch (e) {
        console.log('Err ----------------------------------------------------->' + e);

        return res.redirect(500, '/error');
    }
});

// Store new group in Db
app.post('/main/store/group', async (req, res) => {
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
        console.log('Err ----------------------------------------------------->' + e);

        return res.redirect(500, '/error');
    }
});

// Store new list in Db
app.post('/main/store/list/:id', async (req, res) => {
    const groupId = req.url.slice(req.url.search(':') + 1);

    try {
        const group = await Group.findOne({ _id: groupId });
        let position = group.listIds.length;

        const list = await List.create({
            position: position,
            name: req.body.name
        });

        await Group.updateOne(group, { $push: { listIds: list._id } });

        return res.redirect(302, '/main');
    } catch (e) {
        console.log('Err ----------------------------------------------------->' + e);

        return res.redirect(500, '/error');
    }
});

app.get('/progress', (req, res) => {
    res.render('progress');
});

// Run server
app.listen(8000, () => {
    console.log(`Server running at http://${'127.0.0.1'}:${8000}/`);
});