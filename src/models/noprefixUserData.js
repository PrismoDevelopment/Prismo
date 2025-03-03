/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const { Schema, model } = require("mongoose");

const noprefixUserData = new Schema({
    id: { type: Object, required: true },
    userids: { type: Array, default: [] },
});

module.exports = model("noprefixUserData", noprefixUserData);
