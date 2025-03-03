/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const { model, Schema } = require("mongoose");
const stickynickData = new Schema({
    userId: { type: String, required: true },
    nick: { type: String, required: true },
    guildId: { type: String, required: true },
});

module.exports = model("stickynickData", stickynickData);
