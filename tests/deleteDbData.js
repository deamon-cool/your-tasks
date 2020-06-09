//---------------------------TEST deleting test Db-------------------------------

const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb://localhost/your-tasks-db', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :|'));
db.once('open', () => {
    console.log('test: connected to db :)');

    deleteDb().then(console.log('completed -> Database is deleted :)'));
});

async function deleteDb() {
    await mongoose.connection.db.dropDatabase('your-tasks-db');
}