/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const { model, Schema } = require("mongoose");

const emojiData = new Schema({
    id: { type: String, required: true },
    guildName: { type: String, required: true, default: "Prismo" },
    emojiLength: { type: Number, required: true, default: 0 },
    emojis: { type: Array, required: true, default: [] },
});

module.exports = model("emojiData", emojiData);
