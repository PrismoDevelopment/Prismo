const Event = require("../abstract/event");
const { EmbedBuilder } = require("discord.js");
const {  ButtonInteraction } = require('discord.js');
module.exports = class serverVerificationCreate extends Event {
    get name() {
        return "serverVerificationCreate";
    }
    get once() {
        return false;
    }
    /**
     * @param {ButtonInteraction} interaction
     */
    async run(interaction) {
        let randomsixdigit = Math.floor(100000 + Math.random() * 900000);
        const rows = [
            this.client.util.row().setComponents(
                this.client.util
                    .textInput()
                    .setCustomId(`${randomsixdigit}`)
                    .setLabel(`Verification Code - "${randomsixdigit}"`)
                    .setStyle(1)
                    .setMinLength(6)
                    .setMaxLength(6)
                    .setRequired(true)
                    .setPlaceholder("Enter Verification Code - " + randomsixdigit)
            ),
        ];
        const modal = this.client.util
        .model()
        .setCustomId(`modal_verification_sumbit`)
        .addComponents(rows)
        .setTitle(`Enter code ${randomsixdigit} to verify`)
      return  await interaction?.showModal(modal);
    }
};