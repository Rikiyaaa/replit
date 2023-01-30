const { Schema, model } = require('mongoose');

const inventory = Schema({
    guild: String,
    user: String,
    item: Array,
});

module.exports = model('inventorys', inventory);

