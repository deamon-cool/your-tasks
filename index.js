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

// Load all data
app.get('/main', async (req, res) => {
    try {
        const groups = await Group.find({});

        let packets = [];

        for (let i = 0; i < groups.length; i++) {
            const listIds = groups[i].listIds;

            let lists = [];
            for (let j = 0; j < listIds.length; j++) {
                const list = await List.findOne({ _id: listIds[j] });

                lists.push(list);
            }

            const data = {
                group: groups[i],
                lists: lists
            };

            packets.push(data);
        }

        return res.render('main', { packets: packets });
    } catch (e) {
        console.log('Err ----------------------------------------------------->' + e);

        return res.redirect(500, '/error');
    }
});

// Store new group in Db
app.post('/main/store/group', async (req, res) => {
    try {
        const groups = await Group.find({});

        await Group.create({
            position: groups.length,
            name: req.body.name
        });

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