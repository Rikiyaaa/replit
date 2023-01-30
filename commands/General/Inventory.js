const { EmbedBuilder } = require("discord.js");
const GInv = require("../../settings/models/inventory.js");
const GProfile = require("../../settings/models/profile.js");

module.exports = {
    name: ["inventory"], // Base Commands! // Sub Commands!
    description: "Display your all items in inventory.",
    category: "General",
    run: async (client, interaction) => {

        const inv = await GInv.findOne({ guild: interaction.guild.id, user: interaction.user.id });
        const profile = await GProfile.findOne({ guild: interaction.guild.id, user: interaction.user.id });

        // Filter to Duplicate from Object
        const result = [...inv.item.reduce( (mp, o) => {
            const key = JSON.stringify([o.name, o.type]);
            if (!mp.has(key)) mp.set(key, { ...o, count: 0 });
            mp.get(key).count++;
            return mp;
        }, new Map).values()];

        const sFood = [];
        const sFur = [];
        const sFloor = [];
        const sWall = [];

        for (let i = 0; i < result.length; i++) {
            const type = result[i].type;
            if (type == "furniture") {
                sFur.push(`${toOppositeCase(result[i].name)} (x${result[i].count})`)
            } else if (type == "food") {
                sFood.push(`${toOppositeCase(result[i].name)} (x${result[i].count})`)
            } else if (type == "floor") {
                sFloor.push(`${toOppositeCase(result[i].name)} (x${result[i].count})`)
            } else if (type == "wallpaper") {
                sWall.push(`${toOppositeCase(result[i].name)} (x${result[i].count})`)
            }
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}'s Inventory`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(`Backpack: (${inv.item.length}/${profile.inventory})`)
            .addFields(
                { name: "Food", value: `${(sFood.join("\n") || "No items!")}`, inline: false },
                { name: "Wallpaper", value: `${(sWall.join("\n") || "No items!")}`, inline: false },
                { name: "Floor", value: `${(sFloor.join("\n") || "No items!")}` , inline: false },
                { name: "Furniture", value: `${(sFur.join("\n") || "No items!")}`, inline: false },
            )
            .setColor(client.color)

        return interaction.reply({ embeds: [embed] });
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}