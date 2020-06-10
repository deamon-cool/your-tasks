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

// Checks if hashes are suited
async function checkHashWithOriginals() {
    let checks = [];

    for (let i = 0; i < hashCodes.length; i++) {
        const hashCode = hashCodes[i];
        const email = emails[i];

        const state = await bcrypt.compare(email, hashCode);

        checks.push(state);
    }

    console.log(`----------------> Checks emails with hashCodes:\n${checks}`);
}

// Database connection
mongoose.connect('mongodb://localhost/your-tasks-db', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :|'));

let openDbPromise = db.once('open', () => {
    console.log('----------------> test: connected to db :)');

    return Promise.resolve();
});

// Wating for finish all promises
Promise.all([sampleCodesPromise, openDbPromise]).then(() => {
    createData();
});

async function createData() {
    await ActivationCode.create({
        code: code
    });
}