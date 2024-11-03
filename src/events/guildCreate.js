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
            const owner = await this.client.users.fetch(guild?.ownerId);
            let embed = this.client.util
                .embed()
                .setAuthor({
                    name: guild.name || "Unknown",
                    iconURL: guild?.iconURL({ dynamic: true }) || null,
                })
                .setColor(this.client.config.Client.SuccessColor)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .setDescription(
                    `**Guild Name:** ${guild?.name}\n**Guild ID:** ${guild?.id
                    }\n**Guild Owner:** ${owner?.username || "Unknown"
                    }\n**Guild Owner ID:** ${guild?.ownerId || "Unknown"
                    }\n**Guild Member Count:** ${guild?.memberCount || "Unknown"
                    }`
                )
                .setTimestamp()
                .setFooter({
                    text: `Guild Add | ${this.client.user.username}`,
                });
            this.client.channels?.cache?.get(this.client.config.Client.LogsChannel)?.send({ embeds: [embed] }).catch(() => { });
            let embed2 = this.client.util
                .embed()
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setColor("#5865f2")
                .setTitle("Thank you for adding me to your server!")
                .setDescription(`・My prefix for your server is \`.\`
・You can use the \`.help\` command to get a brief view
・\`.setup\` command helps you to **set Prismo in 2 minutes**
・Feel free to join our [support server](${this.client.config.Url.SupportURL}) if you need any assistance regarding our bot.`);
            // get a moderator only channel or get the first channel
            let channel = guild.channels.cache.find((c) => c.name === "moderator-only" && c.permissionsFor(guild.members.cache.get(this.client.user.id)).has("SendMessages")) || guild.channels.cache.find((c) => c.type === 5 && c.permissionsFor(guild.members.cache.get(this.client.user.id)).has("SendMessages")) || guild.channels.cache.find((c) => c.type === 0 && c.permissionsFor(guild.members.cache.get(this.client.user.id)).has("SendMessages"));
            if (!channel) return;
            channel?.send({
                content: `Hello, <@${guild.ownerId}>!`, embeds: [embed2], allowedMentions: { parse: ["users"] }, components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Setup",
                                style: 3,
                                custom_id: `setup_${guild.id}`,
                            },
                            {
                                type: 2,
                                label: "Support Server",
                                style: 5,
                                url: this.client.config.Url.SupportURL,
                            },
                            {
                                type: 2,
                                label: "Website",
                                style: 5,
                                url: "https://prismo.one/",
                            },
                            {
                                type: 2,
                                label: "Invite",
                                style: 5,
                                url: this.client.config.Url.InviteURL,
                            },
                        ],
                    },
                ]
            }).catch(() => { });
        } catch (error) {
            return;
        }
    }
};
