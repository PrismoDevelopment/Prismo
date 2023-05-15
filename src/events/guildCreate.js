const Event = require("../abstract/event");
const { EmbedBuilder } = require("discord.js");

module.exports = class guildCreate extends Event {
    get name() {
        return "guildCreate";
    }
    get once() {
        return false;
    }
    async run(guild) {
        try {
            const owner = await this.client.users.fetch(guild.ownerId);
            let embed = this.client.util
                .embed()
                .setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL({ dynamic: true }),
                })
                .setColor(this.client.config.Client.SuccessColor)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .setDescription(
                    `**Guild Name:** ${guild.name}\n**Guild ID:** ${
                        guild.id
                    }\n**Guild Owner:** ${
                        owner.tag || "Unknown"
                    }\n**Guild Owner ID:** ${
                        guild.ownerId || "Unknown"
                    }\n**Guild Member Count:** ${
                        guild.memberCount || "Unknown"
                    }`
                )
                .setTimestamp()
                .setFooter({
                    text: `Guild Add | ${this.client.user.username}`,
                });
            this.client.channels.cache
                .get(this.client.config.Client.LogsChannel)
                .send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
};
