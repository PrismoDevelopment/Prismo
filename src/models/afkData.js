/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const { model, Schema } = require("mongoose");

const afkData = new Schema({
    id: { type: String, required: true },
    reason: { type: String, required: true, default: "No reason provided" },
    time: { type: Number, required: true, default: Date.now() },
});


module.exports = model("afkData", afkData);
