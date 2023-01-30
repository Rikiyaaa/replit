const { EmbedBuilder } = require("discord.js");
const GInv = require("../../settings/models/inventory.js");
const GProfile = require("../../settings/models/profile.js");

module.exports = {
    name: ["quest", "get"],
    description: "Get your daily quest.",
    category: "General",
    run: async (client, interaction) => {

        /// for test remove later

        const profile = await GProfile.findOne({ guild: interaction.guild.id, user: interaction.user.id });
        if(profile.quest.length > 3) return interaction.reply("Your can have only 3 daily quest.")

        profile.quest.push({
            type: "message",
            name: "Talk with friends.",
            current: 0,
            goal: 5,
            reward: 15000
        });

        profile.quest.push({
            type: "feed",
            name: "Feed your pet.",
            current: 0,
            goal: 2,
            reward: 25000
        })

        profile.quest.push({
            type: "edit",
            name: "Edit you house.",
            current: 0,
            goal: 1,
            reward: 25000
        })

        profile.save();

        interaction.reply("You're get daily quest success.");
        
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}