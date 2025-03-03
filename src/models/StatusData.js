/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const { Schema, model } = require("mongoose");

const statusRole = new Schema({
        id: { type: String, default: null },
        enabled: { type: Boolean, default: false },
        role: { type: String, default: null },
        status: { type: String, default: null },
});

module.exports = model("statusRole", statusRole);
