const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, SelectMenuOptionBuilder } = require("discord.js");
const GInv = require("../../settings/models/inventory.js");
const { petSelect } = require("../../structures/select/pet.js");

module.exports = {
    name: ["pet", "feed"],
    description: "Feed your pet.",
    category: "Pet",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply("Loading please wait...");

        const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });

        const value = Object.values(inv.item);
        const object = value.filter(x => x.type === "food");
        // if not have food return msg
        if(object.length === 0) {
            return msg.edit({ content: "You don't have any food." });
        }

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription("*Please Select a Food*")
    
        const select = new ActionRowBuilder()
            .addComponents([
                new StringSelectMenuBuilder()
                    .setCustomId("petselect")
                    .setPlaceholder("Select a pet to feed.")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setOptions(object.map(key => {
                        return new SelectMenuOptionBuilder()
                            .setLabel(`${toOppositeCase(key.name)}`)
                            .setValue(key.id)
                        }
                    ))
                ])
    
        await msg.edit({ content: " ", embeds: [embed], components: [select] });
    
        let filter = (m) => m.user.id === interaction.user.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 300000 });
    
        collector.on('collect', async (menu) => {
            if(menu.isStringSelectMenu()) {
                // id select menus
                if(menu.customId === "petselect") {
                    await menu.deferUpdate();
                    let [ directory ] = menu.values;
    
                    const item = inv.item.find(x => x.id === directory);
    
                    petSelect(client, interaction, msg, item.id);
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
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}