/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const { Schema, model } = require("mongoose");

const starboardData = new Schema({
    id: { type: Object, required: true },
    starboard: { type: Boolean, default: false },
    starboardChannel: { type: String, default: null },
    starboardEmoji: { type: String, default: "⭐" },
    starboardCount: { type: Number, default: 5 },
});

module.exports = model("starboardData", starboardData);
