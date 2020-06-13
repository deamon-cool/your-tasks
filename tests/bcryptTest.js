const bcrypt = require('bcrypt');

let hash = bcrypt.hash('some-text-123', 0)
    .then(console.log);