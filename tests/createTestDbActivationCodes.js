//---------------------------TEST deleting test Db-------------------------------

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ActivationCode = require('../database/model/ActivationCode');

// Database connection
mongoose.connect('mongodb://localhost/your-tasks-db', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :|'));
db.once('open', () => {
    console.log('test: connected to db :)');

    createData().then(console.log('completed -> Collection ActivationCodes is filled :)'));
});

async function createData() {
    await ActivationCode.create({
        code: code
    });
}