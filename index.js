const express = require('express');

app = express();
app.use(express.static('public'));

app.listen(8000, () => {
    console.log(`Server running at http://${'127.0.0.1'}:${8000}/`);
});