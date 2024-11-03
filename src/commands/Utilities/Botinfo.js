const Command = require("../../abstract/command");

module.exports = class Botinfo extends Command {
    constructor(...args) {
        super(...args, {
            name: "botinfo",
            aliases: ["botinfo, bi"],
            description: "Get information about the bot.",
            category: "Utilities",
            usage: ["botinfo"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            userPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/1y6V0SD.png",
        });
    }
    async run({ message, args }) {
        let owners = this.client.config.Client.Owners;
        let owner = owners.map((o) => this.client.users.cache.get(o)).join(", ");
        let totalGuilds, totalUsers;

        await this.client.Cluster.fetchClientValues('guilds.cache.size').then(results => {
            totalGuilds = results.reduce((prev, guildCount) => {
                return prev + guildCount;
            }, 0);
        });

        await this.client.Cluster.fetchClientValues('users.cache.size').then(results => {
            totalUsers = results.reduce((prev, memberCount) => {
                return prev + memberCount;
            }, 0);
        });
        
        let embed = this.client.util.embed()
            .setTitle(`${this.client.config.Client.emoji.prismoemo} __Bot Information__`)
            .setColor(this.client.config.Client.PrimaryColor)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setDescription(
                `**Name** : ${this.client.user.username}
**Bot ID** : ${this.client.user.id}
**Shards** : ${this.client.options.shardCount}
**Uptime** : Last Booted <t:${Math.floor(this.client.readyTimestamp / 1000)}:R>
**Ping** : ${this.client.ws.ping}ms
**Servers** : ${totalGuilds}
**Cached Channels** : ${this.client.channels.cache.size.toLocaleString()}
**Commands** : ${this.client.commands.size.toLocaleString()}
**Users** : ${totalUsers}
    `)
            .setFooter({ text: `Requested by ${message?.author.username}`, iconURL: message?.author.displayAvatarURL() });
        message?.channel.send({
            embeds: [embed], components: [
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
                            url: "https://discord.gg/5GWnQGbgZH",
                        },
                    ],
                },
            ]
        });
    }

    async exec({ interaction }) {
        let owners = this.client.config.Client.Owners;
        let owner = owners.map((o) => this.client.users.cache.get(o)).join(", ");
        let totalGuilds, totalUsers;
        await this.client.Cluster.fetchClientValues('guilds.cache.size').then(results => {
            totalGuilds = results.reduce((prev, guildCount) => {
                return prev + guildCount;
            }, 0);
        });

        await this.client.Cluster.fetchClientValues('users.cache.size').then(results => {
            totalUsers = results.reduce((prev, memberCount) => {
                return prev + memberCount;
            }, 0);
        });
        let embed = this.client.util.embed()
            .setTitle(`${this.client.config.Client.emoji.prismoemo} __Bot Information__`)
            .setColor(this.client.config.Client.PrimaryColor)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setDescription(
                `**Name :** ${this.client.user.username}
**Bot ID :** ${this.client.user.id}
**Shards :** ${this.client.options.shardCount}
**Uptime :** Last Booted <t:${Math.floor(this.client.readyTimestamp / 1000)}:R>
**Ping :** ${this.client.ws.ping}ms
**Servers :** ${totalGuilds}
**Channels :** ${this.client.channels.cache.size.toLocaleString()}
**Commands :** ${this.client.commands.size.toLocaleString()}
**Users :** ${totalUsers}
    `)
            .setFooter({ text: `Requested by ${interaction?.user.username}`, iconURL: interaction?.user.displayAvatarURL() });
        interaction?.reply({ embeds: [embed] });
    }
};

