const Event = require("../abstract/event");
const { Collection } = require("@discordjs/collection");
module.exports = class messageCreate extends Event {
    constructor(...args) {
        super(...args);
        this.ratelimits = new Collection();
    }
    get name() {
        return "messageCreate";
    }
    get once() {
        return false;
    }
    async run(message) {
        try {
            if (message.author.bot || message.channel.type == 1) return;
            if (!message.guild.config) {
                message.guild.config = await this.client.database.guildData.get(
                    message.guild.id
                );
            }
            message.guild.config = await this.client.database.guildData.get(
                message.guild.id
            );
            const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
            if (message.content.match(mentionRegex)) {
                return message.channel.send(
                    `My prefix is \`${message.guild.config.prefix}\``
                );
            }
            const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}>`);
            const prefix = message.content.match(mentionRegexPrefix)
                ? message.content.match(mentionRegexPrefix)[0]
                : message.guild.config.prefix;
            const checkNoPrefix = noprefixdata.userids.includes(
                message.author.id
            );
            if (
                !message.content.toLowerCase().startsWith(prefix) &&
                !checkNoPrefix
            )
                return;
            const args = message.content.slice(prefix.length).trim().split(/ +/)
            let cmd = args.shift().toLowerCase();
            const command =
                this.client.commands.get(cmd) ||
                this.client.commands.get(this.client.aliases.get(cmd));
            if (!command) return;
            if (
                command.ownerOnly &&
                !this.client.util.checkOwner(message.author.id)
            )
                return;
            if (!this.client.util.checkOwner(message.author.id)) {
                if (
                    message.guild.config.disabledCommands.includes(command.name)
                ) {
                    return message.channel
                        .send(`This command is disabled in this server!`)
                        .then((m) => {
                            setTimeout(() => {
                                m.delete();
                            }, 5000);
                        });
                }
                if (
                    message.guild.config.disabledChannels.includes(
                        message.channel.id
                    )
                ) {
                    return message.channel
                        .send(`This command is disabled in this channel!`)
                        .then((m) => {
                            setTimeout(() => {
                                m.delete();
                            }, 5000);
                        });
                }
                if (message.guild.config.blacklisted) {
                    return message.channel.send({
                        content:
                            "This guild is blacklisted from using this bot.",
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        label: "Contact Support",
                                        style: 5,
                                        url: this.client.config.Url.SupportURL,
                                    },
                                ],
                            },
                        ],
                    });
                }

                const rateLimits = this.ratelimit(message, cmd);
                if (typeof rateLimits === "string") {
                    return message
                        .reply({
                            content: `You are being ratelimited. Please wait \`${rateLimits}\` before using this command again.`,
                        })
                        .then((m) => setTimeout(() => m.delete(), 4000));
                }
                const userPermCheck = command.userPerms
                    ? this.client.userPerms.add(command.userPerms)
                    : this.client.userPerms;
                if (
                    userPermCheck &&
                    !this.client.util.checkOwner(message.author.id)
                ) {
                    const missing = message.channel
                        .permissionsFor(message.member)
                        .missing(userPermCheck);
                    if (missing.length) {
                        return this.client.util.errorDelete(
                            message,
                            `You Are Missing The Following Permissions: ${this.client.util.formatArray(
                                missing.map(this.client.util.formatPerms)
                            )}`
                        );
                    }
                }
                if (
                    command.guildOwnerOnly &&
                    message.guild.ownerId != message.author.id
                ) {
                    return this.client.util.errorDelete(
                        message,
                        `This Command Can Only Be Run By The Server Owner!`
                    );
                }
                if (
                    command.upFromMe &&
                    message.member.roles.highest.position <
                        message.guild.members.resolve(this.client.user).roles
                            .highest.position
                ) {
                    return this.client.util.errorDelete(
                        message,
                        `This Command Can Only Be Run By Someone Higher Than Me!`
                    );
                }
                const botPermCheck = command.botPerms
                    ? this.client.defaultPerms.add(command.botPerms)
                    : this.client.defaultPerms;
                if (botPermCheck) {
                    const missing = message.channel
                        .permissionsFor(this.client.user)
                        .missing(botPermCheck);
                    if (missing.length) {
                        return this.client.util.errorButtonEmbed(
                            message,
                            `I Don't Have Enough Permission! Click The Button Below To Fix`,
                            botPermCheck.bitfield.toString()
                        );
                    }
                }

                if (
                    (!message.guild.config.premium && command?.vote) ||
                    (!message.guild.config.premium && command?.premium)
                ) {
                    let voted = await this.client.util.checkVote(
                        message.author.id
                    );
                    if (!voted) {
                        let embed = this.client.util
                            .embed()
                            .setTitle(`Vote For Me!`)
                            .setDescription(
                                `You Need To Vote For Me To Use This Command!`
                            )
                            .setColor(this.client.config.Client.PrimaryColor);
                        return message.channel.send({
                            embeds: [embed],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            style: 5,
                                            label: `Vote`,
                                            url: `https://top.gg/bot/${this.client.user.id}/vote`,
                                        },
                                    ],
                                },
                            ],
                        });
                    }
                }
            }
            command.run({ message, args });
        } catch (error) {
            console.error(error);
        }
    }
};
