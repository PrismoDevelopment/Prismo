const Command = require("../../abstract/command");

module.exports = class Dare extends Command {
    constructor(...args) {
        super(...args, {
            name: "gdelete",
            aliases: ["giveawaydelete"],
            description: "Deletes a giveaway.",
            category: "Giveaways",
            usage: ["gdelete <giveaway message id>"],
            userPerms: ["ViewChannel", "SendMessages", "ManageGuild"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://imgur.com/dhjZOeB",
            options: [
                {
                    name: "id",
                    description: "Message ID of the giveaway.",
                    type: 3,
                    required: true
                }
            ]
        });
    }
    async run({ message, args }) {
        const hasPerm = message?.member.permissions.has("ManageGuild") || message?.member.roles.cache.some(r => r.name.toLowerCase() === 'giveaways') || message?.guild.ownerId === message?.author.id || this.client.util.checkOwner(message?.author.id) || message?.member.roles.cache.some(r => r.name.toLowerCase() === 'giveaway');
        if (!hasPerm) return message?.reply({ embeds: [this.client.util.embed().setDescription(`You don't have permission to use this command.`).setColor(this.client.config.Client.ErrorColor)] })
        let id = args[0];
        if (!id) return message?.reply({ embeds: [this.client.util.embed().setDescription(`You have missed an option \`id\`. Example:\n\`\`\`yml\n${message?.guild.config.prefix}gend <id>\n\`\`\``).setColor(this.client.config.Client.ErrorColor)] })
        let giveaway = this.client.giveawayManager.giveaways.find(g => g.messageId === id);
        if (!giveaway) return message?.reply({ embeds: [this.client.util.embed().setDescription(`I could not find a giveaway with that ID.`).setColor(this.client.config.Client.ErrorColor)] })
        this.client.giveawayManager.delete(giveaway.messageId);
        message?.reply({ content: `Giveaway deleted.` })
    }

    async exec({ interaction }) {
        let id = interaction?.options.getString('id');
        let giveaway = this.client.giveawayManager.giveaways.find(g => g.messageId === id);
        if (!giveaway) return interaction?.reply({ embeds: [this.client.util.embed().setDescription(`I could not find a giveaway with that ID.`).setColor(this.client.config.Client.ErrorColor)] })
        this.client.giveawayManager.delete(giveaway.messageId);
        interaction?.reply({ content: `Giveaway deleted.` })
    }
}