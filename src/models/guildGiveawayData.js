/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const { model, Schema } = require("mongoose");

const data = new Schema({
    id: { type: String, required: true },
    managerRoles: { type: Array, default: [] },
    blackListedUsers: { type: Array, default: [] },
    winRoles: { type: Array, default: [] }
});

module.exports = model("guildGiveawayData", data);
