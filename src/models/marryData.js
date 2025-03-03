/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const { model, Schema } = require("mongoose");

const marryData = new Schema({
    id: { type: String, required: true },
    married: { type: Boolean, default: false },
    partner: { type: String, default: null },
    marriedAt: { type: Date, default: null },
    pendingproposal: { type: Boolean, default: false },
    proposer: { type: String, default: null },
    proposedAt: { type: Date, default: null },
});


module.exports = model("marryData", marryData);
