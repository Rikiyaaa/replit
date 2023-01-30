const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const { selectFurniture } = require("../../structures/select/furniture.js");
const { selectFloor } = require("../../structures/select/floor.js");
const Canvas = require("@napi-rs/canvas");
const GHome = require("../../settings/models/house.js");
const { selectWallSide } = require("../../structures/select/wallpaper.js");

module.exports = {
    name: ["house", "edit"],
    description: "Editor of your house.",
    category: "House",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply("Loading please wait...");

        const canvas = Canvas.createCanvas(300, 300);
        const ctx = canvas.getContext("2d");

        const home = await GHome.findOne({ guild: interaction.guild.id, user: interaction.user.id });

        const homeedit = await Canvas.loadImage("./assests/modify.png");
        ctx.drawImage(homeedit, 0, 0, canvas.width, canvas.height);
        const homeatt = new AttachmentBuilder(await canvas.encode("png"), { name: "modify.png" })

        const embed = new EmbedBuilder()
            .setDescription(`Edit House: ${interaction.user}`)
            .addFields(
                {
                    name: "1️⃣ Furniture", value: "Replace or remove furniture in this room."
                },
                {
                    name: "2️⃣ Wallpaper", value: "Replace or remove your wallpaper in this room."      
                },
                {
                    name: "3️⃣ Flooring", value: "Replace or remove you flooring in this room."
                },
                {
                    name: "4️⃣ Reset House", value: "Remove all furniture and furnishing in this room."
                }
            )
            .setImage("attachment://modify.png")
            .setColor(client.color)

        const select = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("house")
                    .setPlaceholder("Make a selection")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setOptions([
                        {
                            label: "1️⃣ Furniture",
                            description: "Edit your furniture",
                            value: "fur"
                        },
                        {
                            label: "2️⃣ Wallpaper",
                            description: "Edit your wallpaper",
                            value: "wall"
                        },
                        {
                            label: "3️⃣ Flooring",
                            description: "Edit your floor",
                            value: "floor"
                        },
                        {
                            label: "4️⃣ Reset House",
                            description: "Reset your house to default",
                            value: "reset"
                        }
                    ]),
                )

            await msg.edit({ content: " ", embeds: [embed], components: [select], files: [homeatt] });

            let filter = (m) => m.user.id === interaction.user.id;
            let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

            collector.on('collect', async (menu) => {
                if(menu.isStringSelectMenu()) {
                    // id select menus
                    if(menu.customId === "house") {
                        await menu.deferUpdate();
                        /// value id
                        let [directory] = menu.values;

                        if (directory === "fur") {
                            // Run callback furniture
                            selectFurniture(client, interaction, msg);
                            collector.stop();
                        } else if (directory === "wall") {
                            // Run callback wallpaper
                            selectWallSide(client, interaction, msg);
                            collector.stop();
                        } else if (directory === "floor") {
                            // Run callback floor
                            selectFloor(client, interaction, msg);
                            collector.stop();
                        } else if (directory === "reset") {
                            const home = await GHome.findOne({ guild: interaction.guild.id, user: interaction.user.id });
                            home.delete();
                            await msg.edit({ content: "Your house is deleted.", embeds: [], components: [], files: [] });
                        }
                    }
                } else if(menu.isButton()) {
                    ////
                }
            });

        collector.on('end', async (collected, reason) => {
            if(reason === 'time') {
                const timed = new EmbedBuilder()
                    .setDescription(`Time is Ended!`)
                    .setColor(client.color)

                msg.edit({ embeds: [timed], components: [] });
            }
        });
    }
}
