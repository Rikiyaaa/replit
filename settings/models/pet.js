const { Schema, model } = require('mongoose');

const pet = Schema({
    guild: String,
    user: String,
    name: String,
    type: String,
    id: String,
    price: Number,
    exp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    nextexp: Number,
    health: {
        type: Number,
        default: 20
    },
    hungry: {
        type: Number,
        default: 20
    }
});

module.exports = model('pets', pet);

