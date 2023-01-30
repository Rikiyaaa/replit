const GProfile = require("../../settings/models/profile.js");

module.exports = async(client, message) => {
    if (!message.guild) return;
    if (message.author.bot) return;

    await client.createHome(message.guild.id, message.author.id);
    await client.createProfile(message.guild.id, message.author.id);
    await client.createInv(message.guild.id, message.author.id);

    const profiles = await GProfile.findOne({ guild: message.guild.id, user: message.author.id });
    if(profiles.quest.length === 0) return;

    await client.questMsg(message.guild.id, message.author.id, message);

}