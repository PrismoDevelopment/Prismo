const Command = require("../../abstract/command");

module.exports = class Membercount extends Command {
    constructor(...args) {
        super(...args, {
            name: "membercount",
            aliases: ["mc"],
            description: "Shows the membercount of the server.",
            usage: ["mc, members"],
            category: "Utilities",
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 2,
            image:""

        });
    }

    async run({ message }) {
        try {
            const guild = message?.guild;
            const memberCount = guild.memberCount;
            const embed = this.client.util
                .embed()
                .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
                .setTitle("Membercount")
                .setColor(this.client.config.Client.PrimaryColor)
                .setDescription(`${this.client.config.Client.emoji.member} **Total Members:**\`\`\`${memberCount}\`\`\``)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields({ name: `${this.client.config.Client.emoji.online} Online`, value: `\`\`\`${guild.members.cache.filter(m => m.presence?.status === "online").size}\`\`\``, inline: true }, { name: `${this.client.config.Client.emoji.idle} Idle`, value: `\`\`\`${guild.members.cache.filter(m => m.presence?.status === "idle").size}\`\`\``, inline: true }, { name: `${this.client.config.Client.emoji.dnd} DND`, value: `\`\`\`${guild.members.cache.filter(m => m.presence?.status === "dnd").size}\`\`\``, inline: true });
            message?.reply({ embeds: [embed] });
        } catch (error) {
            return
        }
    }

    async exec({ interaction }) {
        try {
            const guild = interaction?.guild;
            const memberCount = guild.memberCount;
            const embed = this.client.util
                .embed()
                .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
                .setTitle("Membercount")
                .setColor(this.client.config.Client.PrimaryColor)
                .setDescription(`${this.client.config.Client.emoji.member} **Total Members:**\`\`\`${memberCount}\`\`\``)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields({ name: `${this.client.config.Client.emoji.online} Online`, value: `\`\`\`${guild.members.cache.filter(m => m.presence?.status === "online").size}\`\`\``, inline: true }, { name: `${this.client.config.Client.emoji.idle} Idle`, value: `\`\`\`${guild.members.cache.filter(m => m.presence?.status === "idle").size}\`\`\``, inline: true }, { name: `${this.client.config.Client.emoji.dnd} DND`, value: `\`\`\`${guild.members.cache.filter(m => m.presence?.status === "dnd").size}\`\`\``, inline: true });
            interaction?.reply({ embeds: [embed] });
        } catch (error) {
            return  
        }
    }
};
