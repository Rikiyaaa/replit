const { EmbedBuilder } = require("discord.js");
const GInv = require("../../settings/models/inventory.js");
const GProfile = require("../../settings/models/profile.js");

module.exports = {
    name: ["quest", "reset"],
    description: "Reset daily quest.",
    category: "General",
    run: async (client, interaction) => {

        //// for test remove later

        const profile = await GProfile.find();

        for (const data of profile) {
            data.quest = [];
        }
        
        profile.save();

        interaction.reply("Your has reset daily quest.");
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}