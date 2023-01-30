const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.User, Partials.GuildMember]
});

client.config = require('./settings/config.js');
client.owner = client.config.OWNER_ID;
client.dev = client.config.DEV_ID;
client.color = client.config.EMBED_COLOR;
if(!client.token) client.token = client.config.TOKEN;

process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

["slash"].forEach(x => client[x] = new Collection());
["loadCommand", "loadEvent", "loadDatabase", "PetEvents", "QuestEvents"].forEach(x => require(`./handlers/${x}`)(client));

client.login(client.token);