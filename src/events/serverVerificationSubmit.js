const Event = require("../abstract/event");
const { EmbedBuilder } = require("discord.js");
const { ModalSubmitInteraction } = require('discord.js');
module.exports = class serverVerificationSubmit extends Event {
    get name() {
        return "serverVerificationSubmit";
    }
    get once() {
        return false;
    }
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async run(interaction) {
        await interaction?.deferReply({ ephemeral: true, fetchReply: true });
        let og_verification_code = interaction?.fields.fields.first().customId;
        let value_verification_code = interaction?.fields.fields.first().value;
        if (og_verification_code !== value_verification_code) {
            return await interaction?.editReply({ content: "RETRY! Verification code is incorrect.", ephemeral: true });
        };
        let data = await this.client.database.guildVerificationData.get(interaction?.guild.id);
        if (!data) {
            return await interaction?.editReply({ content: "Server verification data not found!", ephemeral: true });
        };
        if (!data.enabled) {
            return await interaction?.editReply({ content: "Server Verification is disabled contact server admins to get verified", ephemeral: true });
        };
        let role_to_give = null;
        try {
            role_to_give = interaction?.guild.roles.cache.has(data.role) ? interaction?.guild.roles.cache.get(data.role) : null;
        } catch (err) {
            role_to_give = null;
        };
        if (role_to_give == null)  {
            return await interaction?.editReply({ content: "Server verification role not found!", ephemeral: true });
        };
        await interaction?.member.roles.add(role_to_give, `Server Verification`);
        return await interaction?.editReply({ content: "You have been verified!", ephemeral: true });
    }

};