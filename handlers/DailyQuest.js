const GQuest = require('../settings/models/profile.js'); 
const cron = require("node-cron");

module.exports = async (client) => {
    const profile = await GQuest.find();
    // daily quest reset 00:00 UTC in real life
    cron.schedule("0 0 * * *", async () => {
        for (const data of profile) {
            data.quest = [];
            data.save();
        }
    });
}