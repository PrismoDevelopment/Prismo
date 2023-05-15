const { model, Schema } = require("mongoose");
const config = require("../../config");
const guildData = new Schema({
    id: { type: String, required: true },
    prefix: { type: String, default: config.Client.Prefix },
    disabledCommands: { type: Array, default: [] },
    disabledChannels: { type: Array, default: [] },
    premium: { type: Boolean, default: false },
    premiumUntil: { type: Date, default: null },
    blacklisted: { type: Boolean, default: false },
    welcome: {
        type: Object,
        default: {
            channel: null,
            content: " ",
            embeds: {},
        },
    },
    autorole: {
        type: Object,
        default: {
            enabled: false,
            botRoles: [],
            humanRoles: [],
        },
    },
    greet: {
        type: Object,
        default: {
            enabled: false,
            channel: [],
            content: "Welcome $user_mention to $guild_name!",
            deletetime: 5000,
        },
    },
});

module.exports = model("guildData", guildData);
