const { EmbedBuilder } = require("discord.js");
const GInv = require("../../settings/models/inventory.js");
const GProfile = require("../../settings/models/profile.js");

module.exports = {
    name: ["dailyquest"],
    description: "Get your daily quest.",
    category: "General",
    run: async (client, interaction) => {
        
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}