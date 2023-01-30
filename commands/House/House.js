const { EmbedBuilder } = require("discord.js");
const GHome = require("../../settings/models/house.js")

module.exports = {
    name: ["house", "display"],
    description: "Display my home.",
    category: "House",
    run: async (client, interaction) => {
        const home = await GHome.findOne({ guild: interaction.guild.id, user: interaction.user.id });

        const embed = new EmbedBuilder()
            .setDescription(`Display home by: ${interaction.user}`)
            .setImage(home.house)
            .setColor(client.color)

        return interaction.reply({ embeds: [embed] });
    }
}
