const Command = require("../../abstract/command");

module.exports = class Dare extends Command {
    constructor(...args) {
        super(...args, {
            name: "greroll",
            aliases: ["giveawayreroll", "reroll"],
            description: "Rerolls a giveaway.",
            category: "Giveaways",
            usage: ["greroll <giveaway message id>"],
            userPerms: ["ViewChannel", "SendMessages", "ManageGuild"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://imgur.com/kTpOgFZ",
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
        if(!id) {
            id = message?.reference?.messageId;
            if(!id) {
                let msg = await message?.channel.messages.fetch({ limit: 100 });
                msg = msg.filter(m => m.author.id === this.client.user.id && m.content.includes(`${this.client.config.Client.emoji.gift}`));
                msg = msg.first();
                if(!msg) return message?.reply({ embeds: [this.client.util.errorDelete(message, `You have missed an option \`id\`. Example:\n\`\`\`yml\n${message?.guild.config.prefix}greroll <id>\n\`\`\``)] })
                id = msg.id;
            }
        }
        if (!id) return message?.reply({ embeds: [this.client.util.errorDelete(message, `You have missed an option \`id\`. Example:\n\`\`\`yml\n${message?.guild.config.prefix}greroll <id>\n\`\`\``)] })
        let giveaway = this.client.giveawayManager.giveaways.find(g => g.messageId === id);
        if (!giveaway) return message?.reply({ embeds: [this.client.util.errorDelete(message, `I could not find a giveaway with that ID.`)] })
        if (!giveaway.ended) return message?.reply({ embeds: [this.client.util.errorDelete(message, `This giveaway is not yet ended!`)] })
        giveaway.reroll();
        message?.reply({ content: `Giveaway rerolled.` })
    }

    async exec({ interaction }) {
        let id = interaction?.options.getString('id');
        let giveaway = this.client.giveawayManager.giveaways.find(g => g.messageId === id);
        if (!giveaway) return interaction?.reply({ embeds: [this.client.util.errorDelete(interaction, `I could not find a giveaway with that ID.`)] })
        if (!giveaway.ended) return interaction?.reply({ embeds: [this.client.util.errorDelete(interaction, `This giveaway is not yet ended!`)] })
        giveaway.reroll();
        interaction?.reply({ content: `Giveaway rerolled.` })
    }
}