const { Schema, model } = require("mongoose");

const statusRole = new Schema({
        id: { type: String, default: null },
        enabled: { type: Boolean, default: false },
        role: { type: String, default: null },
        status: { type: String, default: null },
});

module.exports = model("statusRole", statusRole);