const { model, Schema } = require("mongoose");

const guildVerificationData = new Schema({
    id: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    channel: { type: String, default: null },
    role: { type: String, default: null },
});

module.exports = model("guildVerificationData", guildVerificationData);