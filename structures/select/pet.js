const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, SelectMenuOptionBuilder } = require("discord.js");
const GPet = require("../../settings/models/pet.js");
const GInv = require("../../settings/models/inventory.js");

const petSelect = async function (client, interaction, msg, id) {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');

    const pet = await GPet.find({ guild: interaction.guild.id, user: interaction.user.id });

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription("*Please Select a Pet*")

    const select = new ActionRowBuilder()
        .addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("feedpet")
                .setPlaceholder("Feeding a Pet.")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(pet.map(key => {
                    return new SelectMenuOptionBuilder()
                        .setLabel(`${toOppositeCase(key.name)}`)
                        .setValue(key.type)
                    }
                ))
            ])

    await msg.edit({ content: " ", embeds: [embed], components: [select] });

    let filter = (m) => m.user.id === interaction.user.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

    const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

    collector.on('collect', async (menu) => {
        if(menu.isStringSelectMenu()) {
            // id select menus
            if(menu.customId === "feedpet") {
                await menu.deferUpdate();
                /// value id
                let [ directory ] = menu.values;

                const item = inv.item.find(x => x.id === id);

                //pet 
                const mypet = await GPet.findOne({ guild: interaction.guild.id, user: interaction.user.id, pet: directory });

                //
                mypet.exp += item.exp;
                mypet.hungry += item.feed;
                await mypet.save();

                if (mypet.hungry > 20) mypet.hungry = 20;
                await mypet.save();

                await client.questFeed(interaction);

                // if exp exceed nextexp = levelup
                if(mypet.exp >= mypet.nextexp) {
                    let diff = mypet.exp - mypet.nextexp;

                    mypet.level += 1;
                    mypet.nextexp = Math.floor(mypet.level * mypet.level * 1.5);
                    mypet.exp = diff;

                    await mypet.save();
                }

                inv.item.splice(inv.item.findIndex(x => x.id === id), 1);
                await inv.save();

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
                    .setDescription(`**${mypet.name}** *is now level* **${mypet.level}** *and has* **${mypet.nextexp - mypet.exp}** *exp to next level.*`)
                    .setFooter({ text: `Hungry: ${mypet.hungry}/20` })
                    .setTimestamp()

                msg.edit({ content: " ", embeds: [embed], components: [] });
                
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
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}

module.exports = { petSelect };