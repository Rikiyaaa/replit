const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const GInv = require("../../settings/models/inventory.js");
const GHouse = require("../../settings/models/house.js");
const { replaceHouse } = require("../../structures/replace.js");
const { saveL1, saveL2, saveL3, saveL4, saveR1, saveR2, saveR3, saveR4 } = require("../../structures/edit/confirm.js");

const editWallL = async function (client, interaction, msg, item, type, id) {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

    const canvas = Canvas.createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    const placer = await Canvas.loadImage("./assests/select.png");
    ctx.drawImage(placer, 0, 0, canvas.width, canvas.height);

    const attc = new AttachmentBuilder(await canvas.encode("png"), { name: `select.png` })

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setImage("attachment://select.png")
        .setDescription("*Please Select a Postion*")

    const select = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("wallplace_l")
                .setPlaceholder("Placing a furniture.")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions([
                    {
                        label: "Ⓛ➀",
                        description: "Place on position L1",
                        value: "place_lone"
                    },
                    {
                        label: "Ⓛ➁",
                        description: "Place on position L2",
                        value: "place_ltwo"
                    },
                    {
                        label: "Ⓛ➂",
                        description: "Place on position L3",
                        value: "place_lthree"
                    },
                    {
                        label: "Ⓛ➃",
                        description: "Place on position L4",
                        value: "place_lfour"
                    }
                ])
            ])

    await msg.edit({ embeds: [embed], components: [select], files: [attc] });

    let filter = (m) => m.user.id === interaction.user.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

    const home = await GHouse.findOne({ guild: interaction.guild.id, user: interaction.user.id });
    const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

    collector.on('collect', async (menu) => {
        if(menu.isStringSelectMenu()) {
            // id select menus
            if(menu.customId === "wallplace_l") {
                await menu.deferUpdate();
                /// value id
                let [ directory ] = menu.values;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const place_on = await Canvas.loadImage("./assests/default.png");
                ctx.drawImage(place_on, 0, 0, canvas.width, canvas.height); // and place
                
                if (directory === "place_lone") {
                    /// checking position
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.WALL_DATA.L1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.WALL_DATA.L2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.WALL_DATA.L1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }

                    // save and replace
                    if(check.area === 2) {
                        home.WALL_DATA.L1 = true
                        home.WALL_DATA.L1I = check.name;
                        /// save A2
                        home.WALL_DATA.L2 = true
                    } else {
                        home.WALL_DATA.L1 = true
                        home.WALL_DATA.L1I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveL1(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_ltwo") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.WALL_DATA.L2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.WALL_DATA.L3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.WALL_DATA.L2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    // save and replace
                    if(check.area === 2) {
                        home.WALL_DATA.L2 = true
                        home.WALL_DATA.L2I = check.name;
                        /// save A3
                        home.WALL_DATA.L3 = true
                    } else {
                        home.WALL_DATA.L2 = true
                        home.WALL_DATA.L2I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveL2(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_lthree") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.WALL_DATA.L3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.WALL_DATA.L4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.WALL_DATA.L3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    
                    // save and replace
                    if(check.area === 2) {
                        home.WALL_DATA.L3 = true
                        home.WALL_DATA.L3I = check.name;
                        // save A4
                        home.WALL_DATA.L4 = true
                    } else {
                        home.WALL_DATA.L3 = true
                        home.WALL_DATA.L3I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveL3(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_lfour") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.WALL_DATA.L4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.WALL_DATA.L4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    if(check.area === 2) return menu.followUp({ content: `You can't place ${check.name} on this position`, ephemeral: true })

                    // save and replace
                    home.WALL_DATA.L4 = true;
                    home.WALL_DATA.L4I = check.name;
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)
                    
                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveL4(interaction, id, msg, message, check);
                    });
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

            msg.edit({ embeds: [timed], components: [] });
        }
    });

    return;
}

const editWallR = async function (client, interaction, msg, item, type, id) {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

    const canvas = Canvas.createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    const placer = await Canvas.loadImage("./assests/select.png");
    ctx.drawImage(placer, 0, 0, canvas.width, canvas.height);

    const attc = new AttachmentBuilder(await canvas.encode("png"), { name: `select.png` })

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setImage("attachment://select.png")
        .setDescription("*Please Select a Position*")

    const select = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("wallplace_r")
                .setPlaceholder("Placing a wallpaper.")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions([
                    {
                        label: "Ⓡ➀",
                        description: "Place on position R1",
                        value: "place_rone"
                    },
                    {
                        label: "Ⓡ➁",
                        description: "Place on position R2",
                        value: "place_rtwo"
                    },
                    {
                        label: "Ⓡ➂",
                        description: "Place on position R3",
                        value: "place_rthree"
                    },
                    {
                        label: "Ⓡ➃",
                        description: "Place on position R4",
                        value: "place_rfour"
                    }
                ])
            ])

    await msg.edit({ embeds: [embed], components: [select], files: [attc] });

    let filter = (m) => m.user.id === interaction.user.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

    const home = await GHouse.findOne({ guild: interaction.guild.id, user: interaction.user.id });
    const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

    collector.on('collect', async (menu) => {
        if(menu.isStringSelectMenu()) {
            // id select menus
            if(menu.customId === "wallplace_r") {
                await menu.deferUpdate();
                /// value id
                let [ directory ] = menu.values;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const place_on = await Canvas.loadImage("./assests/default.png");
                ctx.drawImage(place_on, 0, 0, canvas.width, canvas.height); // and place
                
                if (directory === "place_rone") {
                    /// checking position
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.WALL_DATA.R1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.WALL_DATA.R2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.WALL_DATA.R1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }

                    // save and replace
                    if(check.area === 2) {
                        home.WALL_DATA.R1 = true
                        home.WALL_DATA.R1I = check.name;
                        /// save A2
                        home.WALL_DATA.R2 = true
                    } else {
                        home.WALL_DATA.R1 = true
                        home.WALL_DATA.R1I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveR1(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_rtwo") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.WALL_DATA.R2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.WALL_DATA.R3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.WALL_DATA.R2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    // save and replace
                    if(check.area === 2) {
                        home.WALL_DATA.R2 = true
                        home.WALL_DATA.R2I = check.name;
                        /// save A3
                        home.WALL_DATA.R3 = true
                    } else {
                        home.WALL_DATA.R2 = true
                        home.WALL_DATA.R2I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveR2(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_rthree") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.WALL_DATA.R3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.WALL_DATA.R4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.WALL_DATA.R3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    
                    // save and replace
                    if(check.area === 2) {
                        home.WALL_DATA.R3 = true
                        home.WALL_DATA.R3I = check.name;
                        // save A4
                        home.WALL_DATA.R4 = true
                    } else {
                        home.WALL_DATA.R3 = true
                        home.WALL_DATA.R3I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveR3(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_rfour") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.WALL_DATA.R4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.WALL_DATA.R4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    if(check.area === 2) return menu.followUp({ content: `You can't place ${check.name} on this position`, ephemeral: true })

                    // save and replace
                    home.WALL_DATA.R4 = true;
                    home.WALL_DATA.R4I = check.name;
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)
                    
                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveR4(interaction, id, msg, message, check);
                    });
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

            msg.edit({ embeds: [timed], components: [] });
        }
    });

    return;
}

module.exports = { editWallL, editWallR };