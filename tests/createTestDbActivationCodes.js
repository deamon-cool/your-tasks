//---------------------------TEST deleting test Db-------------------------------

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ActivationCode = require('../database/model/ActivationCode');

// Global variables
let intervalID;
let finshedIntervalCounter = 0;
let saltRounds = 10;
let hashCodes = [];
let emails = ['d@a.pl', 'd@w.eu', 'k@ap.ru'];

console.log(`----------------> Your emails:\n${emails}`);

// Creates hash codes
async function createSampleCodes() {
    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];

        const hash = await bcrypt.hash(email, saltRounds);

        hashCodes.push(hash);
    }

    await checkHashWithOriginals();

    console.log(`----------------> Your emails hash codes:\n${hashCodes}`);

    return Promise.resolve();
}

let sampleCodesPromise = createSampleCodes();
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