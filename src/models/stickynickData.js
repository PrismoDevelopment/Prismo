const { model, Schema } = require("mongoose");
const stickynickData = new Schema({
    userId: { type: String, required: true },
    nick: { type: String, required: true },
    guildId: { type: String, required: true },
});

module.exports = model("stickynickData", stickynickData);
