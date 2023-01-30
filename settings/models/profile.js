const { Schema, model } = require('mongoose');

const profile = Schema({
    guild: String,
    user: String,
    level: Number,
    money: Number,
    inventory: {
        type: Number,
        default: 100
    },
    quest: Array
});

module.exports = model('profiles', profile);