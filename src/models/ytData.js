/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const { Schema, model } = require("mongoose");

const ytData = new Schema({
    id: { type: String, required: true },
    ytchannel: { type: String, default: null },
    channel: { type: String, default: null },
    ping: { type: Boolean, default: false },
    postedvids: { type: Array, default: [] },

});

module.exports = model("ytData", ytData);
