const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, SelectMenuOptionBuilder} = require("discord.js");
const GPet = require("../../settings/models/pet.js");
const GProfile = require("../../settings/models/profile.js");
const GInv = require("../../settings/models/inventory.js");
const Canvas = require("@napi-rs/canvas");
const { pet } = require("../../settings/pet.js");

module.exports = {
    name: ["pet", "shop"],
    description: "Shop your pet.",
    category: "Pet",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const msg = await interaction.editReply("Loading please wait...");

        const pets = await GPet.findOne({ guild: interaction.guild.id, user: interaction.user.id });
        if(pets) return msg.edit("You already have a pet!");

        const object = Object.values(pet);

        const row = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("shop_pets")
                .setPlaceholder(`Please selection pet to buy.`)
                .setMaxValues(1)
                .setMinValues(1)
                /// Map the categories to the select menu
                .setOptions(object.map(key => {
                    return new SelectMenuOptionBuilder()
                        .setLabel(`${toOppositeCase(key.name)} | Cost: ${Commas(key.price)} (Lvl.${key.level})`)
                        .setValue(key.type)
                    }
                ))
            ])


        const profile = await GProfile.findOne({ guild: interaction.guild.id, user: interaction.user.id });
        const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

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
                if(menu.customId === "shop_pets") {
                    await menu.deferUpdate();
                    /// value id
                    let [ directory ] = menu.values;

                    const item = pet.find(x => x.type === directory);

                    if (profile.money < item.price) return menu.followUp({ content: "You not have money to buy this. Price: " + item.price });
                    if (profile.level < item.level) return menu.followUp({ content: "Requirement Level: " + item.level });

                    profile.money -= item.price;

                    const petnew = new GPet({
                        guild: interaction.guild.id,
                        user: interaction.user.id,
                        type: item.type,
                        name: item.name,
                        price: item.price,
                        level: item.level,
                        exp: item.exp,
                        nextexp: item.nextexp,
                        health: item.health,
                        hungry: item.hungry,
                        id: generateID()
                    });

                    const embed = new EmbedBuilder()
                        .setDescription("You Successafully to buy " + item.name)
                        .setColor(client.color)

                    await profile.save();
                    await inv.save();
                    await petnew.save();

                    msg.edit({ embeds: [embed], components: [], files: [] });
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
