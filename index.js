const express = require('express');
const {engine} = require('express-edge');
const bodyParser = require('body-parser');


app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(engine);
app.set('views', `${__dirname}/views`);

app.post('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/main', (req, res) => {
    res.render('main');
});

app.post('/main', (req, res) => {
    console.log('-------------------------------------------------------------------------->');
    console.log(req.body);
    res.render('main');
});

app.get('/progress', (req, res) => {
    res.render('progress');
});

app.listen(8000, () => {
    console.log(`Server running at http://${'127.0.0.1'}:${8000}/`);
});