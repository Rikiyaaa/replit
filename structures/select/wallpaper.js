const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, SelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { editWallL, editWallR } = require("../edit/wallpaper.js")
const GInv = require("../../settings/models/inventory.js");
const Canvas = require("@napi-rs/canvas");

const selectWallSide = async function (client, interaction, msg, item , type) {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

    const button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("wall_left_e")
            .setLabel("Left")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("wall_right_e")
            .setLabel("Right")
            .setStyle(ButtonStyle.Secondary),
        )

    const canvas = Canvas.createCanvas(450, 300);
    const ctx = canvas.getContext("2d");

    const shop = await Canvas.loadImage("./assests/shop/two.png");
    ctx.drawImage(shop, 0, 0, canvas.width, canvas.height);

    const attc = new AttachmentBuilder(await canvas.encode("png"), { name: `two.png` })

    const embed = new EmbedBuilder()
        .setImage("attachment://two.png")
        .setColor(client.color)

    await msg.edit({ content: "Please Select Side Wallpaper To Place.", embeds: [embed], components: [button], files: [attc] });

    let filter = (m) => m.user.id === interaction.user.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

    collector.on('collect', async (menu) => {
        if (menu.isButton()) {
            await menu.deferUpdate();

            if(menu.customId === "wall_left_e") {

            await selectWallpaper_left(client, interaction, msg, item)
            collector.stop();
            } else if (menu.customId === "wall_right_e") {

            await selectWallpaper_right(client, interaction, msg, item)
            collector.stop();
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

    return;
}

const selectWallpaper_left = async (client, interaction, msg) => {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

    const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

    const value = Object.values(inv.item);
    const object = value.filter(x => x.type === "wallpaper" && x.side === "left");

    if(object.length === 0) {
        return msg.edit({ content: "You don't have any wallpaper.", embeds: [], files: [], components: [] });
    }

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription("*Please Select a Wallpaper*")

    const select = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("wallselect_left")
                .setPlaceholder("Select a wallpaper to placing.")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(object.map(key => {
                    return new SelectMenuOptionBuilder()
                        .setLabel(`${toOppositeCase(key.name)}`)
                        .setValue(key.id)
                    }
                ))
            ])

    await msg.edit({ content: " ", embeds: [embed], components: [select], files: [] });

    let filter = (m) => m.user.id === interaction.user.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

    collector.on('collect', async (menu) => {
        if(menu.isStringSelectMenu()) {
            // id select menus
            if(menu.customId === "wallselect_left") {
                await menu.deferUpdate();
                let [ directory ] = menu.values;

                const item = inv.item.find(x => x.id === directory);

                editWallL(client, interaction, msg, item.name, item.type, item.id);
                await collector.stop();
            }
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

   return;
}

const selectWallpaper_right = async (client, interaction, msg) => {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

    const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

    const value = Object.values(inv.item);
    const object = value.filter(x => x.type === "wallpaper" && x.side === "right");

    if(object.length === 0) {
        return msg.edit({ content: "You don't have any wallpaper.", embeds: [], files: [], components: [] });
    }

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription("*Please Select a Wallpaper*")

    const select = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("wallselect_right")
                .setPlaceholder("Select a wallpaper to placing.")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(object.map(key => {
                    return new SelectMenuOptionBuilder()
                        .setLabel(`${toOppositeCase(key.name)}`)
                        .setValue(key.id)
                    }
                ))
            ])

    await msg.edit({ content: " ", embeds: [embed], components: [select], files: [] });

    let filter = (m) => m.user.id === interaction.user.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

    collector.on('collect', async (menu) => {
        if(menu.isStringSelectMenu()) {
            // id select menus
            if(menu.customId === "wallselect_right") {
                await menu.deferUpdate();
                let [ directory ] = menu.values;

                const item = inv.item.find(x => x.id === directory);

                editWallR(client, interaction, msg, item.name, item.type, item.id);
                await collector.stop();
            }
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

   return;
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}

module.exports = { selectWallpaper_left, selectWallSide, selectWallpaper_right };