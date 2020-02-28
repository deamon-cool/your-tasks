const express = require('express');
const {engine} = require('express-edge');

app = express();
app.use(express.static('public'));

app.use(engine);
app.set('views', `${__dirname}/views`);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(8000, () => {
    console.log(`Server running at http://${'127.0.0.1'}:${8000}/`);
});