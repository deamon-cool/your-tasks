const express = require('express');
const {engine} = require('express-edge');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Group = require('./database/model/Group');
const List = require('./database/model/List');


// Database connection
mongoose.connect('mongodb://localhost/to-do-list-db', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :|'));
db.once('open', () => console.log('connected to db :)'));

// Express configuration
app = express();
app.use(bodyParser.urlencoded({extended: true}));
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

app.get('/main', (req, res) => {
    Group.find({})
    .then(groups => {
        res.render('main', {groups: groups});
    });
});

// Store new group in Db
app.post('/main/store/group', (req, res) => {
    Group.find({})
    .then(groups => {
        Group.create({
            position: groups.length,
            name: req.body.name
        })
        .then(() => {
            res.redirect(302, '/main');
        })
        .catch(e => {
            console.log('Err :| ------>' + e);

            res.redirect('/error');
        });
    });
});

// Store new list in Db
app.post('/main/store/list/:id', (req, res) => {
    const groupId = req.url.slice(req.url.search(':') + 1);

    Group.findOne({_id: groupId})
    .then(group => {
        let position = group.listIds.length;

        List.create({
            position: position,
            name: req.body.name
        })
        .then(list => {
            Group.update(group, {$push:{listIds: list._id}})
            .then(() => {
                res.redirect(302, '/main');
            });
        });
    });
});

app.get('/progress', (req, res) => {
    res.render('progress');
});

// Run server
app.listen(8000, () => {
    console.log(`Server running at http://${'127.0.0.1'}:${8000}/`);
});