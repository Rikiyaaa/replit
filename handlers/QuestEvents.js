const GQuest = require('../settings/models/profile.js'); 
const cron = require("node-cron");

module.exports = async (client) => {
    async function resetQuest() {
        const profile = await GQuest.find();
        for (const data of profile) {
            data.quest = [];
            await renewQuest(data);
        }
        profile.save();
    }

    cron.schedule("0 0 * * *", async () => {
        resetQuest();
    });
}

async function renewQuest(data){
    data.quest.push({
        type: "message",
        name: "Talk with friends.",
        current: 0,
        goal: 5,
        reward: 15000
    });

    data.quest.push({
        type: "feed",
        name: "Feed your pet.",
        current: 0,
        goal: 2,
        reward: 25000
    })

    data.quest.push({
        type: "edit",
        name: "Edit you house.",
        current: 0,
        goal: 1,
        reward: 25000
    })
}