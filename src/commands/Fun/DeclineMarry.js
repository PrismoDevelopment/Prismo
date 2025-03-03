/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Command = require("../../abstract/command");

module.exports = class DeclineMarry extends Command {
    constructor(...args) {
        super(...args, {
            name: "declinemarry",
            aliases: ["declinemarry", "dm"],
            description: "Declines a marriage proposal.",
            category: "Fun",
            usage: ["dm"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }

    async run({ message }) {
        let data = await this.client.database.marryData.get(message?.author.id);
        if (!data) return message?.reply("<:nobody_cares:1066336605926862928> You don't have any pending proposals.");
        if (!data.pendingproposal) return message?.reply("<:nobody_cares:1066336605926862928> You don't have any pending proposals.");
        let proposer = data.proposer ? await this.client.users.fetch(data.proposer) : null;
        if (!proposer) return message?.reply("<:nobody_cares:1066336605926862928> You don't have any pending proposals.");
        let proposerdata = await this.client.database.marryData.get(proposer.id);
        data.pendingproposal = false;
        data.proposer = null;
        data.proposedAt = null;
        await this.client.database.marryData.post(message?.author.id, data);
        await this.client.database.marryData.post(proposer.id, proposerdata);
        return message?.reply(`<:nobody_cares:1066336605926862928> You declined **${proposer.username}**'s marriage proposal.`);
    }

    async exec({ interaction }) {
        let data = await this.client.database.marryData.get(interaction?.user.id);
        if (!data) return interaction?.reply("<:nobody_cares:1066336605926862928> You don't have any pending proposals.");
        if (!data.pendingproposal) return interaction?.reply("<:nobody_cares:1066336605926862928> You don't have any pending proposals.");
        let proposer = data.proposer ? await this.client.users.fetch(data.proposer) : null;
        if (!proposer) return interaction?.reply("<:nobody_cares:1066336605926862928> You don't have any pending proposals.");
        let proposerdata = await this.client.database.marryData.get(proposer.id);
        data.pendingproposal = false;
        data.proposer = null;
        data.proposedAt = null;
        await this.client.database.marryData.post(interaction?.user.id, data);
        await this.client.database.marryData.post(proposer.id, proposerdata);
        return interaction?.reply(`<:nobody_cares:1066336605926862928> You declined **${proposer.username}**'s marriage proposal.`);
    }
};
