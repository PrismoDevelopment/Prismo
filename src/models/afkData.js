const { model, Schema } = require("mongoose");

const afkData = new Schema({
    id: { type: String, required: true },
    reason: { type: String, required: true, default: "No reason provided" },
    time: { type: Number, required: true, default: Date.now() },
});


module.exports = model("afkData", afkData);