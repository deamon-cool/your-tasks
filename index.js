const express = require('express');
const {engine} = require('express-edge');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Group = require('./database/model/Group');


// Database connection
mongoose.connect('mongodb://localhost/to-do-list-db', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :|'));
db.once('open', () => console.log('connected :)'));

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

    res.render('main');
});

// Store new group in Db
app.post('/main/store/group', (req, res) => {
    Group.find({}).then(groups => {
        Group.create({
            position: groups.length,
            name: req.body.name
        }).then(() => {
            res.redirect(302, '/main');
        }).catch(e => {
            console.log('Err :| ------>' + e);

            res.redirect('/error');
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