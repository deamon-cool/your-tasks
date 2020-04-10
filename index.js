const express = require('express');
const {engine} = require('express-edge');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


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

app.post('/main/store/group', (req, res) => {
    console.log('-------------------------------------------------------------------------->');
    console.log(req.body);
    res.render('main');
});

app.get('/progress', (req, res) => {
    res.render('progress');
});

// Run server
app.listen(8000, () => {
    console.log(`Server running at http://${'127.0.0.1'}:${8000}/`);
});