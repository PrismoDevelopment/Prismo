const Command = require("../../abstract/command");

module.exports = class Botinfo extends Command {
    constructor(...args) {
        super(...args, {
            name: "botinfo",
            aliases: ["botinfo"],
            description: "Get information about the bot.",
            category: "Utilities",
            usage: ["botinfo"],
            cooldown: 5,
        });
    }
    async run({ message, args }) {
        let owners = this.client.config.Client.Owners;
        let owner = owners.map((o) => this.client.users.cache.get(o)).join(", ");

        let embed = this.client.util.embed()
            .setTitle(`${this.client.config.Client.Emoji.prismoemo} __Bot Information__`)
            .setColor(this.client.config.Client.PrimaryColor)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setDescription(
                `**Name** : ${this.client.user.username}
**Bot ID** : ${this.client.user.id}
**Library** : [Discord.js](https://discord.js.org/#/)
**Shards** : ${this.client.options.shardCount}
**Uptime** : ${this.client.util.formatTime(
                    this.client.uptime,
                    "ms"
                )}
**Ping** : ${this.client.ws.ping}ms
**Servers** : ${this.client.guilds.cache.size.toLocaleString()}
**Cached Channels** : ${this.client.channels.cache.size.toLocaleString()}
**Commands** : ${this.client.commands.size.toLocaleString()}
**Users** : ${this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()}
    `)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
        message.channel.send({ embeds: [embed], components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        label: "Invite",
                        style: 5,
                        url: `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands`,
                    },
                    {
                        type: 2,
                        label: "Support",
                        style: 5,
                        url: "https://discord.gg/prismo",
                    },
                ],
            },
        ] });
    }

    async exec({ interaction }) {
        let owners = this.client.config.Client.Owners;
        let owner = owners.map((o) => this.client.users.cache.get(o)).join(", ");

        let embed = this.client.util.embed()
            .setTitle(`${this.client.config.Client.Emoji.prismoemo} __Bot Information__`)
            .setColor(this.client.config.Client.PrimaryColor)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setDescription(
                `**Name :** ${this.client.user.username}
**Bot ID :** ${this.client.user.id}
**Library :** [Discord.js](https://discord.js.org/#/)
**Shards :** ${this.client.options.shardCount}
**Uptime :** ${this.client.util.formatTime(
                    this.client.uptime,
                    "ms"
                )}
**Ping :** ${this.client.ws.ping}ms
**Servers :** ${this.client.guilds.cache.size.toLocaleString()}
**Channels :** ${this.client.channels.cache.size.toLocaleString()}
**Commands :** ${this.client.commands.size.toLocaleString()}
**Users :** ${this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()}
    `)
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        interaction.reply({ embeds: [embed] });
    }
};

