const { Schema, model } = require("mongoose");

const xhotuPermsData = new Schema({
    id: { type: String, required: true },
    xhotu: { type: Boolean, default: false },
});

module.exports = model("xhotuPermsData", xhotuPermsData);
