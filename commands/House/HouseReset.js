const { replaceHouse } = require("../../structures/replace.js");
const Canvas = require("@napi-rs/canvas");
const GHome = require("../../settings/models/house.js");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: ["house", "reset"],
    description: "Reset house to default settings. (Warn)",
    category: "House",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply("Loading please wait...");

        const home = await GHome.findOne({ guild: interaction.guild.id, user: interaction.user.id });

        home.delete();

        await msg.edit({ content: "Your house is deleted." });
    }
}
