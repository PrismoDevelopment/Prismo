const { IntentsBitField, ActivityType } = require("discord.js");
const Cluster = require("discord-hybrid-sharding");
const {
    Guilds,
    GuildBans,
    GuildMembers,
    GuildMessages,
    MessageContent,
    GuildMessageReactions,
    GuildEmojisAndStickers,
    GuildVoiceStates,
    DirectMessageReactions,
    DirectMessageTyping,
    DirectMessages,
    GuildIntegrations,
    GuildInvites,
    GuildMessageTyping,
    GuildScheduledEvents,
    GuildWebhooks,
} = IntentsBitField.Flags;
const AriaClient = require("./PrismoClient");
const { Client } = require("../../config");
require("events").defaultMaxListeners = 100;
const client = new AriaClient({
    disableMentions: "everyone",
    intents: [
        Guilds,
        GuildBans,
        GuildMembers,
        GuildMessages,
        MessageContent,
        GuildMessageReactions,
        GuildEmojisAndStickers,
        GuildVoiceStates,
        DirectMessageReactions,
        DirectMessageTyping,
        DirectMessages,
        GuildIntegrations,
        GuildInvites,
        GuildMessageTyping,
        GuildScheduledEvents,
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
    restTimeOffset: 0,
    shards: Cluster.data.SHARD_LIST,
    shardCount: Cluster.data.TOTAL_SHARDS,
});
client.login(Client.Token);
process.on("uncaughtException", (error) => {
    console.error(error);
});

process.on("unhandledRejection", (error) => {
    if (error.code === "10008" || error.code === "10062") return;
    console.error(error);
});
process.on("triggerUncaughtException", (error) => {
    console.error(error);
});
