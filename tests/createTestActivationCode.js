const mongoose = require('mongoose');
const ActivationCode = require('../database/model/ActivationCode');

// Database connection
mongoose.connect('mongodb://localhost/your-tasks-db', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :|'));
db.once('open', () => {
    console.log('test: connected to db :)');

    createActivationCodeInDb().then(console.log('completed -> Database is filled :)'));
});

async function createActivationCodeInDb() {
    await ActivationCode.create({
        email: 'w@w.pl',
        code: 'a'
    });

    return Promise.resolve();
}