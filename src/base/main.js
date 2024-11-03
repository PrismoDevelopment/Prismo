const { IntentsBitField, ActivityType, Partials } = require("discord.js");
const Cluster = require("discord-hybrid-sharding");
const {
    Guilds,
    GuildModeration,
    GuildMembers,
    GuildMessages,
    MessageContent,
    GuildMessageReactions,
    GuildEmojisAndStickers,
    GuildVoiceStates,
    GuildIntegrations,
    GuildMessageTyping,
    GuildWebhooks,
    GuildPresences,
} = IntentsBitField.Flags;
const AriaClient = require("./PrismoClient");
const { Client } = require("../../config");
require("events").defaultMaxListeners = 1000;
const client = new AriaClient({
    // disableMentions: "everyone",
    intents: [
        Guilds,
        GuildModeration,
        GuildMembers,
        GuildPresences,
        GuildMessages,
        MessageContent,
        GuildMessageReactions,
        GuildEmojisAndStickers,
        GuildVoiceStates,
        GuildIntegrations,
        GuildMessageTyping,
        GuildWebhooks,
    ],
    presence: {
        status: "idle",
        activities: [
            {
                name: "/help",
                type: ActivityType.Listening,
            },
        ],
    },
    allowedMentions: { parse: ["users"], repliedUser: false },
    // restTimeOffset: 2500,
    shards: Cluster.ClusterClient.getInfo().SHARD_LIST,
    shardCount: Cluster.ClusterClient.getInfo().TOTAL_SHARDS,
    debugger: true,
    partials: [
        Partials.Message,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.User,
    ],
});

client.login(Client.Token);
process.on('uncaughtException', (error) => {
    if (error.code == 10008) return;
    if (error.code == 4000) return;
    if (error.code == 10001) return;
    if (error.code == 10003) return;
    if (error.code == 10004) return;
    if (error.code == 10005) return;
    if (error.code == 50001) return;
    if (error.code == 10062) return;
    if (error.code == 50013) return;
    if (error.code == 50035) return;
    console.error(error);
});
process.on("triggerUncaughtException", (error) => {
    console.error(error);
});
