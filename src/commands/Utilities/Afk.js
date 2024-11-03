const Command = require("../../abstract/command");

module.exports = class Afk extends Command {
    constructor(...args) {
        super(...args, {
            name: "afk",
            description: "Set your afk status",
            category: "Utilities",
            aliases: ["afk"],
            usage: "afk <reason>",
            cooldown: 5,
            image: "https://i.imgur.com/RQHltYb.png",
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ['EmbedLinks', 'ViewChannel', 'SendMessages']
        });
    }

    async run({ message, args }) {
        let reason = args.join(" ");
        if (!reason) {
            reason = "**I'm Afk :/**";
        }
        if (reason.length > 300) {
            return message?.channel.send({ embeds: [this.client.util.errorDelete(message, "Your afk reason must be less than 100 characters!")]});
        }
        const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
        if (regex.exec(reason)) {
            return message?.channel.send({ embeds: [this.client.util.errorDelete(message, "You cannot set an invite link as your afk reason!")]});
        }
        let matches = reason.match(/<@&[0-9]+>/g);
        if (matches) {
            matches.forEach((match) => {
                const id = match.replace(/[<@&>]/g, "");
                const role = message.guild.roles.cache.get(id);
                if (role) {
                    reason = reason.replace(match, role.name);
                }
            });
        }
        const afkData = await this.client.database.afkData.get(message.author.id);
        if (!afkData) {
            await this.client.database.afkData.putAfk(message.author.id, reason);
            return message?.channel.send(`**${message.author.username}**, Your AFK is now set to: **${reason}**`);
        } else {
            await this.client.database.afkData.deleteAfk(message.author.id);
            return message?.channel.send(`**${message.author.username}**, Your AFK has been removed!`);
        }
    }

    async exec({ interaction }) {
        await interaction?.deferReply();
        let reason = interaction.options.getString("reason");
        if (!reason) {
            reason = "**I'm Afk :/**";
        }
        if (reason.length > 300) {
            return interaction?.editReply({ embeds: [this.client.util.errorDelete(interaction, "Your afk reason must be less than 100 characters!")]});
        }
        const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
        if (regex.exec(reason)) {
            return interaction?.editReply({ embeds: [this.client.util.errorDelete(interaction, "You cannot set an invite link as your afk reason!")]});
        }
        let matches = reason.match(/<@&[0-9]+>/g);
        if (matches) {
            matches.forEach((match) => {
                const id = match.replace(/[<@&>]/g, "");
                const role = interaction.guild.roles.cache.get(id);
                if (role) {
                    reason = reason.replace(match, role.name);
                }
            });
        } 
        const afkData = await this.client.database.afkData.get(interaction.user.id);
        if (!afkData) {
            await this.client.database.afkData.putAfk(interaction.user.id, reason);
            return interaction?.editReply(`**${interaction.user.username}**, Your AFK is now set to: **${reason}**`);
        } else {
            await this.client.database.afkData.deleteAfk(interaction.user.id);
            return interaction?.editReply(`**${interaction.user.username}**, Your AFK has been removed!`);
        }
    }
}