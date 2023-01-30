const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, SelectMenuOptionBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const GProfile = require("../../settings/models/profile.js");
const GInv = require("../../settings/models/inventory.js");
const { wallpaper } = require("../../settings/default.js");

const selectSide = async (client, interaction, msg, item) => {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');
    
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("wall_left")
                .setLabel("Left")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("wall_right")
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

        await msg.edit({ content: "Please Select Side Wallpaper To Buy.", embeds: [embed], components: [button], files: [attc] });

        let filter = (m) => m.user.id === interaction.user.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async (menu) => {
            if (menu.isButton()) {
                await menu.deferUpdate();

                if(menu.customId === "wall_left") {

                await shopWallpaper_left(client, interaction, msg, item)
                collector.stop();
                } else if (menu.customId === "wall_right") {

                await shopWallpaper_right(client, interaction, msg, item)
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

const shopWallpaper_left = async (client, interaction, msg, item) => {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

        //this returns the values
        const object = Object.values(wallpaper).filter(x => x.side === "left");

        const row = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("shop_wallpaper_left")
                .setPlaceholder(`Please selection item to buy.`)
                .setMaxValues(1)
                .setMinValues(1)
                /// Map the categories to the select menu
                .setOptions(object.map(key => {
                    return new SelectMenuOptionBuilder()
                        .setLabel(`${toOppositeCase(key.name.replace("_", " "))} | Cost: ${Commas(key.price)} (Lvl.${key.level})`)
                        .setValue(key.name)
                    }
                ))
            ])

        const profile = await GProfile.findOne({ guild: interaction.guild.id, user: interaction.user.id });
        const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

        const canvas = Canvas.createCanvas(450, 300);
        const ctx = canvas.getContext("2d");

        const shop = await Canvas.loadImage("./assests/shop/two.png");
        ctx.drawImage(shop, 0, 0, canvas.width, canvas.height);

        const attc = new AttachmentBuilder(await canvas.encode("png"), { name: `two.png` })

        const embed = new EmbedBuilder()
            .setImage("attachment://two.png")
            .setColor(client.color)

        await msg.edit({ content: " ", embeds: [embed], components: [row], files: [attc] });

        let filter = (m) => m.user.id === interaction.user.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async (menu) => {
            if(menu.isSelectMenu()) {
                if(menu.customId === "shop_wallpaper_left") {
                    await menu.deferUpdate();
                    let [ directory ] = menu.values;

                    const item = wallpaper.find(x => x.name === directory);

                    if (profile.money < item.price) return menu.followUp({ content: "You not have money to buy this. Price: " + item.price });
                    if (profile.level < item.level) return menu.followUp({ content: "Requirement Level: " + item.level });
                    if (inv.item.length > profile.inventory) return menu.followUp({ content: "You backpack is max " + profile.inventory });

                    profile.money -= item.price;

                    inv.item.push({
                        name: item.name,
                        type: item.type,
                        side: item.side,
                        price: item.price,
                        level: item.level,
                        id: generateID()
                    });

                    const embed = new EmbedBuilder()
                        .setDescription("You Successafully to buy " + item.name)
                        .setColor(client.color)

                    await profile.save();
                    await inv.save();
                    await msg.edit({ embeds: [embed], components: [], files: [] })
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

const shopWallpaper_right = async (client, interaction, msg, item) => {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

        //this returns the values
        const object = Object.values(wallpaper).filter(x => x.side === "right");

        const row = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("shop_wallpaper_right")
                .setPlaceholder(`Please selection item to buy.`)
                .setMaxValues(1)
                .setMinValues(1)
                /// Map the categories to the select menu
                .setOptions(object.map(key => {
                    return new SelectMenuOptionBuilder()
                        .setLabel(`${toOppositeCase(key.name.replace("_", " "))} | Cost: ${Commas(key.price)} (Lvl.${key.level})`)
                        .setValue(key.name)
                    }
                ))
            ])

        const profile = await GProfile.findOne({ guild: interaction.guild.id, user: interaction.user.id });
        const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

        const canvas = Canvas.createCanvas(450, 300);
        const ctx = canvas.getContext("2d");

        const shop = await Canvas.loadImage("./assests/shop/two.png");
        ctx.drawImage(shop, 0, 0, canvas.width, canvas.height);

        const attc = new AttachmentBuilder(await canvas.encode("png"), { name: `two.png` })

        const embed = new EmbedBuilder()
            .setImage("attachment://two.png")
            .setColor(client.color)

        await msg.edit({ content: " ", embeds: [embed], components: [row], files: [attc] });

        let filter = (m) => m.user.id === interaction.user.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async (menu) => {
            if(menu.isSelectMenu()) {
                if(menu.customId === "shop_wallpaper_right") {
                    await menu.deferUpdate();
                    let [ directory ] = menu.values;

                    const item = wallpaper.find(x => x.name === directory);

                    if (profile.money < item.price) return menu.followUp({ content: "You not have money to buy this. Price: " + item.price });
                    if (profile.level < item.level) return menu.followUp({ content: "Requirement Level: " + item.level });
                    if (inv.item.length > profile.inventory) return menu.followUp({ content: "You backpack is max " + profile.inventory });

                    profile.money -= item.price;

                    inv.item.push({
                        name: item.name,
                        type: item.type,
                        side: item.side,
                        price: item.price,
                        level: item.level,
                        id: generateID()
                    });

                    const embed = new EmbedBuilder()
                        .setDescription("You Successafully to buy " + item.name)
                        .setColor(client.color)

                    await profile.save();
                    await inv.save();
                    await collector.stop();
                    await msg.edit({ embeds: [embed], components: [], files: [] })
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

function Commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}

const crypto = require('crypto');
function generateID() {
    return crypto.randomBytes(16).toString('base64');
};

module.exports = { shopWallpaper_left, selectSide, shopWallpaper_right };