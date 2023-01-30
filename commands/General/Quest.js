const { EmbedBuilder } = require("discord.js");
const GInv = require("../../settings/models/inventory.js");
const GProfile = require("../../settings/models/profile.js");

module.exports = {
    name: ["quest", "progress"],
    description: "Get your daily quest.",
    category: "General",
    run: async (client, interaction) => {
        const profile = await GProfile.findOne({ guild: interaction.guild.id, user: interaction.user.id });

        const str = [];
        let num = 1;
        for (let i = 0; i < profile.quest.length; i++) {
            const quest = profile.quest[i];
            str.push(`**${num++}.** Quest: ${quest.name} | Progress: ${quest.current}/${quest.goal} | Reward: ${Commas(quest.reward)}`)
        }

        const slice = str.join("\n")

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Daily Quests", iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${slice}`)
            .setFooter({ text: `Quest Reset 00:00 Every Day` })
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}

function Commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
