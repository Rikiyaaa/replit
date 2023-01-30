const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const GPet = require("../../settings/models/pet.js");
const Canvas = require("@napi-rs/canvas");

module.exports = {
    name: ["pet", "display"],
    description: "Display your pet.",
    category: "Pet",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const pet = await GPet.findOne({ guild: interaction.guild.id, user: interaction.user.id });
        if(!pet) return interaction.editReply("You don't have a pet yet.");

        const msg = await interaction.editReply("Loading please wait...");

        const canvas = Canvas.createCanvas(270, 110);
        const ctx = canvas.getContext("2d");

        const profile = await Canvas.loadImage("./assests/pet/profile.png");
        ctx.drawImage(profile, 0, 0, canvas.width, canvas.height);

        if (pet.hungry >= 10) {
            const happy = await Canvas.loadImage(`./assests/pet/happy/${pet.type}.png`);
            ctx.drawImage(happy, 20, 20, 49, 53);
        } else if (pet.hungry == 0) {
            const sleep = await Canvas.loadImage(`./assests/pet/sleep/${pet.type}.png`);
            ctx.drawImage(sleep, 20, 20, 49, 53);
        } else if (pet.hungry <= 10) {
            const hungry = await Canvas.loadImage(`./assests/pet/hungry/${pet.type}.png`);
            ctx.drawImage(hungry, 20, 20, 49, 53);
        }

        // persentage exp bar match nextexp
        const exp = pet.exp / pet.nextexp;
        const expbar = Math.round(159 * exp);
        ctx.fillStyle = "#EFB42E";
        ctx.fillRect(92, 20, expbar, 14);
        // write text level
        ctx.font = "bold 12px Arial";
        ctx.fillStyle = "#000001";
        ctx.fillText(`LV: ${pet.level}`, 92, 30);
        // write text exp persentage
        ctx.font = "bold 12px Arial";
        ctx.fillStyle = "#000001";
        const expbar2 = exp > 1 ? 100 : Math.round(100 * exp);
        ctx.fillText(`XP: ${expbar2 || "0"}%`, 190, 30);
        // persentage red bar heal
        const health = pet.health;
        const healthbar = (health / 20) * 57;
        ctx.fillStyle = "#AD2323";
        ctx.fillRect(108, 47, healthbar, 10);
        // persentage green bar hungry
        const hungry = pet.hungry;
        const hungrybar = (hungry / 20) * 57;
        ctx.fillStyle = "#508451";
        ctx.fillRect(187, 47, hungrybar, 10);

        const attac = new AttachmentBuilder(await canvas.encode("png"), { name: "profile.png" })

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}'s Pet`, iconURL: interaction.user.avatarURL() })
            .addFields(
                {
                    name: "Pet Health", value: `${pet.health}/20`, inline: true
                },
                {
                    name: "Pet Hunger", value: `${pet.hungry}/20`, inline: true
                },
                {
                    name: "Pet Level", value: `${pet.level}`, inline: true
                },
                {
                    name: "Pet Exp", value: `${pet.exp}/${pet.nextexp}`, inline: true
                },
            )
            .setImage("attachment://profile.png")
            .setColor(client.color)

        return msg.edit({ content: " ", embeds: [embed], files: [attac] });
    }
}
