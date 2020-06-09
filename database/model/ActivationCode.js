const mongoose = require('mongoose');

const ActivationCodeSchema = mongoose.Schema({
    code: String,
    createdAt: {
        type: Date,
        expires: '2m',
        default: Date.now
    }
});

const ActivationCode = mongoose.model('ActivationCodes', ActivationCodeSchema);

module.exports = ActivationCode;