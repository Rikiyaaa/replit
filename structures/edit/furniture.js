const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const GInv = require("../../settings/models/inventory.js");
const GHouse = require("../../settings/models/house.js");
const { replaceHouse } = require("../../structures/replace.js");
const { saveA1, saveA2, saveA3, saveA4, saveB1, saveB2, saveB3, saveB4, saveC1, saveC2, saveC3, saveC4, saveD1, saveD2, saveD3, saveD4 } = require("../../structures/edit/confirm.js");

const editFurnitureA = async function (client, interaction, msg, item, type, id) {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

    const canvas = Canvas.createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    const placer = await Canvas.loadImage("./assests/aone.png");
    ctx.drawImage(placer, 0, 0, canvas.width, canvas.height);

    const attc = new AttachmentBuilder(await canvas.encode("png"), { name: `aone.png` })

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setImage("attachment://aone.png")
        .setDescription("*Please Select a Postion*")

    const select = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("furplace_a")
                .setPlaceholder("Placing a furniture.")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions([
                    {
                        label: "Ⓐ➀",
                        description: "Place on position A1",
                        value: "place_aone"
                    },
                    {
                        label: "Ⓐ➁",
                        description: "Place on position A2",
                        value: "place_atwo"
                    },
                    {
                        label: "Ⓐ➂",
                        description: "Place on position A3",
                        value: "place_athree"
                    },
                    {
                        label: "Ⓐ➃",
                        description: "Place on position A4",
                        value: "place_afour"
                    }
                ])
            ])

    const button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("a_one")
            .setLabel("A1")
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("b_two")
            .setLabel("A2")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("c_three")
            .setLabel("A3")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("d_four")
            .setLabel("A4")
            .setStyle(ButtonStyle.Secondary),
        )

    await msg.edit({ embeds: [embed], components: [select, button], files: [attc] });

    let filter = (m) => m.user.id === interaction.user.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

    const home = await GHouse.findOne({ guild: interaction.guild.id, user: interaction.user.id });
    const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

    collector.on('collect', async (menu) => {
        if(menu.isStringSelectMenu()) {
            // id select menus
            if(menu.customId === "furplace_a") {
                await menu.deferUpdate();
                /// value id
                let [ directory ] = menu.values;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const place_on = await Canvas.loadImage("./assests/default.png");
                ctx.drawImage(place_on, 0, 0, canvas.width, canvas.height); // and place
                
                if (directory === "place_aone") {
                    /// checking position
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.A_DATA.A1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.A_DATA.A2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.A_DATA.A1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }

                    // save and replace
                    if(check.area === 2) {
                        home.A_DATA.A1 = true
                        home.A_DATA.A1I = check.name;
                        /// save A2
                        home.A_DATA.A2 = true
                    } else {
                        home.A_DATA.A1 = true
                        home.A_DATA.A1I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveA1(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_atwo") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.A_DATA.A2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.A_DATA.A3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.A_DATA.A2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    // save and replace
                    if(check.area === 2) {
                        home.A_DATA.A2 = true
                        home.A_DATA.A2I = check.name;
                        /// save A3
                        home.A_DATA.A3 = true
                    } else {
                        home.A_DATA.A2 = true
                        home.A_DATA.A2I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveA2(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_athree") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.A_DATA.A3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.A_DATA.A4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.A_DATA.A3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    
                    // save and replace
                    if(check.area === 2) {
                        home.A_DATA.A3 = true
                        home.A_DATA.A3I = check.name;
                        // save A4
                        home.A_DATA.A4 = true
                    } else {
                        home.A_DATA.A3 = true
                        home.A_DATA.A3I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveA3(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_afour") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.A_DATA.A4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.A_DATA.A4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    if(check.area === 2) return menu.followUp({ content: `You can't place ${check.name} on this position`, ephemeral: true })

                    // save and replace
                    home.A_DATA.A4 = true;
                    home.A_DATA.A4I = check.name;
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)
                    
                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveA4(interaction, id, msg, message, check);
                    });
                    collector.stop();
                }
            }
        } else if(menu.isButton()) {
            await menu.deferUpdate();

            if(menu.customId === "a_one") {
              //
            } else if (menu.customId === "b_two") {
                editFurnitureB(client, interaction, msg, item, type, id);
                collector.stop();
            } else if (menu.customId === "c_three") {
                editFurnitureC(client, interaction, msg, item, type, id);
                collector.stop();
            } else if (menu.customId === "d_four") {
                editFurnitureD(client, interaction, msg, item, type, id);
                collector.stop();
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

const editFurnitureB = async function (client, interaction, msg, item, type, id) {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

    const canvas = Canvas.createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    const placer = await Canvas.loadImage("./assests/btwo.png");
    ctx.drawImage(placer, 0, 0, canvas.width, canvas.height);

    const attc = new AttachmentBuilder(await canvas.encode("png"), { name: `btwo.png` })

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setImage("attachment://btwo.png")
        .setDescription("*Please Select a Postion*")

    const select = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("furplace_b")
                .setPlaceholder("Placing a furniture.")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions([
                    {
                        label: "Ⓑ➀",
                        description: "Place on position B1",
                        value: "place_bone"
                    },
                    {
                        label: "Ⓑ➁",
                        description: "Place on position B2",
                        value: "place_btwo"
                    },
                    {
                        label: "Ⓑ➂",
                        description: "Place on position B3",
                        value: "place_bthree"
                    },
                    {
                        label: "Ⓑ➃",
                        description: "Place on position B4",
                        value: "place_bfour"
                    }
                ])
            ])

    const button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("a_one")
            .setLabel("A1")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("b_two")
            .setLabel("A2")
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("c_three")
            .setLabel("A3")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("d_four")
            .setLabel("A4")
            .setStyle(ButtonStyle.Secondary),
        )

    await msg.edit({ embeds: [embed], components: [select, button], files: [attc] });

    let filter = (m) => m.user.id === interaction.user.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

    let place = await Canvas.loadImage(`./assests/furniture/${item}.png`);
    const home = await GHouse.findOne({ guild: interaction.guild.id, user: interaction.user.id });
    const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

    collector.on('collect', async (menu) => {
        if(menu.isStringSelectMenu()) {
            // id select menus
            if(menu.customId === "furplace_b") {
                await menu.deferUpdate();
                /// value id
                let [ directory ] = menu.values;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const place_on = await Canvas.loadImage("./assests/default.png");
                ctx.drawImage(place_on, 0, 0, canvas.width, canvas.height); // and place
                
                if (directory === "place_bone") {
                    /// checking position
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.B_DATA.B1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.B_DATA.B2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.B_DATA.B1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }

                    // save and replace
                    if(check.area === 2) {
                        home.B_DATA.B1 = true
                        home.B_DATA.B1I = check.name;
                        /// save A2
                        home.B_DATA.B2 = true
                    } else {
                        home.B_DATA.B1 = true
                        home.B_DATA.B1I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveB1(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_btwo") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.B_DATA.B2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.B_DATA.B3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.B_DATA.B2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    // save and replace
                    if(check.area === 2) {
                        home.B_DATA.B2 = true
                        home.B_DATA.B2I = check.name;
                        /// save A3
                        home.B_DATA.B3 = true
                    } else {
                        home.B_DATA.B2 = true
                        home.B_DATA.B2I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveB2(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_bthree") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.B_DATA.B3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.B_DATA.B4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.B_DATA.B3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    
                    // save and replace
                    if(check.area === 2) {
                        home.B_DATA.B3 = true
                        home.B_DATA.B3I = check.name;
                        // save A4
                        home.B_DATA.B4 = true
                    } else {
                        home.B_DATA.B3 = true
                        home.B_DATA.B3I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveB3(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_bfour") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.B_DATA.B4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.B_DATA.B4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    if(check.area === 2) return menu.followUp({ content: `You can't place ${check.name} on this position`, ephemeral: true })

                    // save and replace
                    home.B_DATA.B4 = true;
                    home.B_DATA.B4I = check.name;
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)
                    
                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveB4(interaction, id, msg, message, check);
                    });
                    collector.stop();
                }
            }
        } else if(menu.isButton()) {
            await menu.deferUpdate();
            if(menu.customId === "a_one") {
                editFurnitureA(client, interaction, msg, item, type, id);
                collector.stop();
            } else if (menu.customId === "b_two") {
                //
            } else if (menu.customId === "c_three") {
                editFurnitureC(client, interaction, msg, item, type, id);
                collector.stop();
            } else if (menu.customId === "d_four") {
                editFurnitureD(client, interaction, msg, item, type, id);
                collector.stop();
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

const editFurnitureC = async function (client, interaction, msg, item, type, id) {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

    const canvas = Canvas.createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    const placer = await Canvas.loadImage("./assests/cthree.png");
    ctx.drawImage(placer, 0, 0, canvas.width, canvas.height);

    const attc = new AttachmentBuilder(await canvas.encode("png"), { name: `cthree.png` })

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setImage("attachment://cthree.png")
        .setDescription("*Please Select a Postion*")

    const select = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("furplace_c")
                .setPlaceholder("Placing a furniture.")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions([
                    {
                        label: "Ⓒ➀",
                        description: "Place on position C1",
                        value: "place_cone"
                    },
                    {
                        label: "Ⓒ➁",
                        description: "Place on position C2",
                        value: "place_ctwo"
                    },
                    {
                        label: "Ⓒ➂",
                        description: "Place on position C3",
                        value: "place_cthree"
                    },
                    {
                        label: "Ⓒ➃",
                        description: "Place on position C4",
                        value: "place_cfour"
                    }
                ])
            ])

    const button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("a_one")
            .setLabel("A1")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("b_two")
            .setLabel("A2")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("c_three")
            .setLabel("A3")
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("d_four")
            .setLabel("A4")
            .setStyle(ButtonStyle.Secondary),
        )

    await msg.edit({ embeds: [embed], components: [select, button], files: [attc] });

    let filter = (m) => m.user.id === interaction.user.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

    let place = await Canvas.loadImage(`./assests/furniture/${item}.png`);
    const home = await GHouse.findOne({ guild: interaction.guild.id, user: interaction.user.id });
    const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

    collector.on('collect', async (menu) => {
        if(menu.isStringSelectMenu()) {
            // id select menus
            if(menu.customId === "furplace_c") {
                await menu.deferUpdate();
                /// value id
                let [ directory ] = menu.values;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const place_on = await Canvas.loadImage("./assests/default.png");
                ctx.drawImage(place_on, 0, 0, canvas.width, canvas.height); // and place
                
                if (directory === "place_cone") {
                    /// checking position
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.C_DATA.C1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.C_DATA.C2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.C_DATA.C1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }

                    // save and replace
                    if(check.area === 2) {
                        home.C_DATA.C1 = true
                        home.C_DATA.C1I = check.name;
                        /// save A2
                        home.C_DATA.C2 = true
                    } else {
                        home.C_DATA.C1 = true
                        home.C_DATA.C1I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveC1(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_ctwo") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.C_DATA.C2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.C_DATA.C3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.C_DATA.C2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }

                    // save and replace
                    if(check.area === 2) {
                        home.C_DATA.C2 = true
                        home.C_DATA.C2I = check.name;
                        /// save A3
                        home.C_DATA.C3 = true
                    } else {
                        home.C_DATA.C2 = true
                        home.C_DATA.C2I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveC2(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_cthree") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.C_DATA.C3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.C_DATA.C4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.C_DATA.C3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    
                    // save and replace
                    if(check.area === 2) {
                        home.C_DATA.C3 = true
                        home.C_DATA.C3I = check.name;
                        // save A4
                        home.C_DATA.C4 = true
                    } else {
                        home.C_DATA.C3 = true
                        home.C_DATA.C3I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveC3(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_cfour") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.C_DATA.C4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.C_DATA.C4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    if(check.area === 2) return menu.followUp({ content: `You can't place ${check.name} on this position`, ephemeral: true })

                    // save and replace
                    home.C_DATA.C4 = true;
                    home.C_DATA.C4I = check.name;
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)
                    
                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveC4(interaction, id, msg, message, check);
                    });
                    collector.stop();
                }
            }
        } else if(menu.isButton()) {
            await menu.deferUpdate();
            if(menu.customId === "a_one") {
                editFurnitureA(client, interaction, msg, item, type, id);
                collector.stop();
            } else if (menu.customId === "b_two") {
                editFurnitureB(client, interaction, msg, item, type, id);
                collector.stop();
            } else if (menu.customId === "c_three") {
                //
            } else if (menu.customId === "d_four") {
                editFurnitureD(client, interaction, msg, item, type, id);
                collector.stop();
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

const editFurnitureD = async function (client, interaction, msg, item, type, id) {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

    const canvas = Canvas.createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    const placer = await Canvas.loadImage("./assests/dfour.png");
    ctx.drawImage(placer, 0, 0, canvas.width, canvas.height);

    const attc = new AttachmentBuilder(await canvas.encode("png"), { name: `dfour.png` })

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setImage("attachment://dfour.png")
        .setDescription("*Please Select a Postion*")

    const select = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("furplace_d")
                .setPlaceholder("Placing a furniture.")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions([
                    {
                        label: "Ⓓ➀",
                        description: "Place on position D1",
                        value: "place_done"
                    },
                    {
                        label: "Ⓓ➁",
                        description: "Place on position D2",
                        value: "place_dtwo"
                    },
                    {
                        label: "Ⓓ➂",
                        description: "Place on position D3",
                        value: "place_dthree"
                    },
                    {
                        label: "Ⓓ➃",
                        description: "Place on position D4",
                        value: "place_dfour"
                    }
                ])
            ])

    const button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("a_one")
            .setLabel("A1")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("b_two")
            .setLabel("A2")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("c_three")
            .setLabel("A3")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("d_four")
            .setLabel("A4")
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary),
        )

    await msg.edit({ embeds: [embed], components: [select, button], files: [attc] });

    let filter = (m) => m.user.id === interaction.user.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

    let place = await Canvas.loadImage(`./assests/furniture/${item}.png`);
    const home = await GHouse.findOne({ guild: interaction.guild.id, user: interaction.user.id });
    const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

    collector.on('collect', async (menu) => {
        if(menu.isStringSelectMenu()) {
            // id select menus
            if(menu.customId === "furplace_d") {
                await menu.deferUpdate();
                /// value id
                let [ directory ] = menu.values;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const place_on = await Canvas.loadImage("./assests/default.png");
                ctx.drawImage(place_on, 0, 0, canvas.width, canvas.height); // and place
                
                if (directory === "place_done") {
                    /// checking position
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.D_DATA.D1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.D_DATA.D2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.D_DATA.D1 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }

                    if(check.area === 2) {
                        home.D_DATA.D1 = true
                        home.D_DATA.D1I = check.name;
                        /// save A2
                        home.D_DATA.D2 = true
                    } else {
                        home.D_DATA.D1 = true
                        home.D_DATA.D1I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveD1(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_dtwo") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.D_DATA.D2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.D_DATA.D3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.D_DATA.D2 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    if(check.area === 2) {
                        home.D_DATA.D2 = true
                        home.D_DATA.D2I = check.name;
                        /// save A3
                        home.D_DATA.D3 = true
                    } else {
                        home.D_DATA.D2 = true
                        home.D_DATA.D2I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveD2(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_dthree") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.D_DATA.D3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                        if (home.D_DATA.D4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.D_DATA.D3 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    
                    // save and replace
                    if(check.area === 2) {
                        home.D_DATA.D3 = true
                        home.D_DATA.D3I = check.name;
                        // save A4
                        home.D_DATA.D4 = true
                    } else {
                        home.D_DATA.D3 = true
                        home.D_DATA.D3I = check.name;
                    }
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)

                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveD3(interaction, id, msg, message, check);
                    });
                    collector.stop();
                } else if (directory === "place_dfour") {
                    const check = inv.item.find(x => x.id === id);
                    if(check.area === 2) {
                        if (home.D_DATA.D4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    } else {
                        if (home.D_DATA.D4 === true) return menu.followUp({ content: "You can't place this position.", ephemeral: true });
                    }
                    if(check.area === 2) return menu.followUp({ content: `You can't place ${check.name} on this position`, ephemeral: true })

                    // save and replace
                    home.D_DATA.D4 = true;
                    home.D_DATA.D4I = check.name;
                    await home.save();
                    //rebuild canvas sort 4-1
                    await replaceHouse(client, interaction, ctx, home)
                    
                    const build = new AttachmentBuilder(await canvas.encode("png"), { name: `${item}.png` })

                    await msg.edit({ embeds: [], components: [], files: [build] }).then(async (message) => {
                        await saveD4(interaction, id, msg, message, check);
                    });
                    collector.stop();
                }
            }
        } else if(menu.isButton()) {
            await menu.deferUpdate();
            if(menu.customId === "a_one") {
                editFurnitureA(client, interaction, msg, item, type, id);
                collector.stop();
            } else if (menu.customId === "b_two") {
                editFurnitureB(client, interaction, msg, item, type, id);
                collector.stop();
            } else if (menu.customId === "c_three") {
                editFurnitureC(client, interaction, msg, item, type, id);
                collector.stop();
            } else if (menu.customId === "d_four") {
                //
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

module.exports = { editFurnitureA, editFurnitureB, editFurnitureC, editFurnitureD };