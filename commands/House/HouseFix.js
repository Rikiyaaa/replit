const { replaceHouse } = require("../../structures/replace.js");
const Canvas = require("@napi-rs/canvas");
const GHome = require("../../settings/models/house.js");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: ["house", "fix"],
    description: "Fix house when house not show normal.",
    category: "House",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply("Loading please wait...");

        const home = await GHome.findOne({ guild: interaction.guild.id, user: interaction.user.id });

        const canvas = Canvas.createCanvas(300, 300);
        const ctx = canvas.getContext("2d");
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const place_on = await Canvas.loadImage("./assests/default.png");
        ctx.drawImage(place_on, 0, 0, canvas.width, canvas.height); // and place

        await replaceHouse(client, interaction, ctx, home);

        const build = new AttachmentBuilder(await canvas.encode("png"), { name: `fixedhouse.png` })

        await msg.edit({ content: "House is fixing now. try /house display", files: [build] }).then(message => {
            home.house = message.attachments.first().url;
            home.save();
        });
    }
}
