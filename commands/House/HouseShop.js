const { EmbedBuilder, ActionRowBuilder, AttachmentBuilder, StringSelectMenuBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const { shopFurniture } = require("../../structures/shop/furniture.js");
const { shopWallpaper, selectSide } = require("../../structures/shop/wallpaper.js");
const { shopFloor } = require("../../structures/shop/floor.js");
const { shopFood } = require("../../structures/shop/food.js");

module.exports = {
    name: ["house", "shop"], // Base Commands! // Sub Commands!
    description: "Buy shop item.",
    category: "House",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply("Loading please wait...");

        const row = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("shop_select")
                .setPlaceholder(`Please select category to see.`)
                .setMaxValues(1)
                .setMinValues(1)
                /// Map the categories to the select menu
                .setOptions([
                    {
                        label: "1️⃣ Furniture",
                        description: "Shop your furniture",
                        value: "fur"
                    },
                    {
                        label: "2️⃣ Wallpaper",
                        description: "Shop your wallpaper",
                        value: "wall"
                    },
                    {
                        label: "3️⃣ Flooring",
                        description: "Shop your floor",
                        value: "floor"
                    },
                    {
                        label: "4️⃣ Food",
                        description: "Shop your food",
                        value: "food"
                    }
                ])
            ])

        const canvas = Canvas.createCanvas(450, 300);
        const ctx = canvas.getContext("2d");

        const shop = await Canvas.loadImage("./assests/shop/select.png");
        ctx.drawImage(shop, 0, 0, canvas.width, canvas.height);

        const attc = new AttachmentBuilder(await canvas.encode("png"), { name: `select.png` })

        const embed = new EmbedBuilder()
            .setImage("attachment://select.png")
            .setColor(client.color)

        await msg.edit({ content: " ", embeds: [embed], components: [row], files: [attc] });

        let filter = (m) => m.user.id === interaction.user.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 300000 }); // 5 minute

        collector.on('collect', async (menu) => {
            if(menu.isStringSelectMenu()) {
                if(menu.customId === "shop_select") {
                    await menu.deferUpdate();
                    /// value id
                    let [ directory ] = menu.values;

                    if (directory === "fur") {
                        shopFurniture(client, interaction, msg);
                        collector.stop();
                    } else if (directory === "wall") {
                        selectSide(client, interaction, msg);
                        collector.stop();
                    } else if (directory === "floor") {
                        shopFloor(client, interaction, msg);
                        collector.stop();
                    } else if (directory === "food") {
                        shopFood(client, interaction, msg);
                        collector.stop();
                    }
                }
            }
        });

        collector.on('end', async (collected, reason) => {
            if(reason === 'time') {
                const timed = new EmbedBuilder()
                    .setDescription(`Time is Ended!`)
                    .setColor(client.color)

                msg.edit({ embeds: [timed], components: [], files: [] });
            }
        });
    }
}