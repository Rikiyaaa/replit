const { replaceHouse } = require("../../structures/replace.js");
const Canvas = require("@napi-rs/canvas");
const GHome = require("../../settings/models/house.js");
const GPet = require("../../settings/models/pet.js");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: ["pet", "release"],
    description: "Release a pet.",
    category: "Pet",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply("Loading please wait...");

        const pets = await GPet.findOne({ guild: interaction.guild.id, user: interaction.user.id });

        await pets.delete();

        return msg.edit({ content: "Your are release the pet." });
    }
}
