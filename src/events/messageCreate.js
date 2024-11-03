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
            if (!message.guild) return;
            const afkdata = await this.client.database.afkData.get(message?.author.id);
            if(afkdata) {
                await this.client.database.afkData.deleteAfk(message.author.id);
                return message?.channel.send(`**${message.author.username}**, Your AFK has been removed!`);
            }
            if (message.content.includes("@everyone") || message.content.includes("@here")) {
                let antiNukeData = await this.client.cache.get(message?.guild.id);
                if (!antiNukeData) {
                    antiNukeData = await this.client.database.antiNukeData.get(message?.guild.id);
                    await this.client.cache.set(message?.guild.id, antiNukeData);
                }
                if (!antiNukeData.enabled) return;
                if (message.author.id == this.client.user.id) return;
                if (this.client.util.checkOwner(message.author.id)) return;
                if (antiNukeData?.whitelistusers?.includes(message.author.id)) return;
                if (message?.author.id == message?.guild?.ownerId) return;
                if (!message.member.permissions.has("MentionEveryone")) return;
                await Promise.all([
                    message.channel.permissionOverwrites
                        .edit(
                            message?.guild.id,
                            {
                                ViewChannel: false,
                            },
                            { reason: "Prismo - Anti Ping" }
                        )
                        .catch(() => {}),
                    this.client.eventRestrict(antiNukeData.punishment, message.author.id, message?.guild.id, `Anti Ping | Prismo Antinuke`),
                ]);
            }
            if (message?.author.bot || message?.channel.type == 1) return;
            message.guild.config = await this.client.cache.get(message?.guild.id + "1");
            if (!message.guild.config) {
                message.guild.config = await this.client.database.guildData.get(message?.guild?.id);
                if (message.guild.config != null) await this.client.cache.set(message?.guild.id + "1", message.guild.config);
            }
            const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
            if (message?.content.match(mentionRegex)) {
                return message?.channel.send({
                    content: `My prefix for this Server is \`${message?.guild.config.prefix}\``,
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: "Invite Me",
                                    style: 5,
                                    url: this.client.config.Url.InviteURL,
                                },
                                {
                                    type: 2,
                                    label: "Support Server",
                                    style: 5,
                                    url: this.client.config.Url.SupportURL,
                                },
                            ],
                        },
                    ],
                });
            }
            const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}>`);
            let noprefixdata = await this.client.cache.get(this.client.user.id);
            if (!noprefixdata) {
                noprefixdata = await this.client.database.noprefixUserData.get(this.client.user.id);
                if (noprefixdata != null) await this.client.cache.set(this.client.user.id, noprefixdata);
            }
            const prefix = message?.content.match(mentionRegexPrefix) ? message?.content.match(mentionRegexPrefix)[0] : message?.guild.config.prefix;
            const checkNoPrefix = noprefixdata.userids.includes(message?.author.id);
            if (!message?.content.toLowerCase().startsWith(prefix) && !checkNoPrefix) return;

            const args = message?.content.startsWith(prefix) ? message?.content.slice(prefix.length).trim().split(/ +/) : message?.content.trim().split(/ +/);
            let cmd = args.shift().toLowerCase();
            let mapedCustomRole = message.guild.config.CustomRoles.map((x) => x.name.toLowerCase());
            if (mapedCustomRole.includes(cmd) && cmd != "manager") {
                let role = message.guild.config.CustomRoles.find((x) => x.name.toLowerCase() == cmd);
                if (role && message.guild.roles.cache.get(role.roleId)) {
                    let user = await this.client.util.userQuery(args[0]);
                    if (!user) return message.reply({ content: `Please provide a valid user!` });
                    user = await message.guild.members.fetch(user);
                    let managerRole = message.guild.config.manager;
                    if (!user) return message.reply({ content: `Please provide a valid user!` });
                    if (user.id == message.author.id)
                        return message.reply({
                            content: `You can't give yourself a custom role!`,
                        });
                    if (user.id == message.guild.ownerId)
                        return message.reply({
                            content: `You can't give the owner a custom role!`,
                        });
                    if (user.id == this.client.user.id)
                        return message.reply({
                            content: `You can't give me a custom role!`,
                        });
                    if (message.member.permissions.has("ManageRoles")) {
                        if(managerRole && !message.member.roles.cache.has(managerRole) ){
                            return message.reply({
                                content: `You don't have the required permissions to give custom roles!`,
                            });
                        }
                        if (message.member.roles.highest.position < message.guild.roles.cache.get(role.roleId).position) {
                            return message.reply({
                                content: `You can't give a role higher than your highest role!`,
                            });
                        }
                    } else {
                        return message.reply({
                            content: `You don't \`Manage Roles\` permission to give custom roles!`,
                        });
                    }
                    role = message.guild.roles.cache.get(role.roleId);
                    if (user.roles.cache.has(role.id)) {
                        await user.roles.remove(role.id);
                        return message.reply({
                            content: `Removed ${role.name} from ${user.user.username}`,
                        });
                    }
                    await user.roles.add(role.id);
                    return message.reply({
                        content: `Added ${role.name} to ${user.user.username}`,
                    });
                }
            }

            const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd));
            if (!command) return;
            if (command.ownerOnly && !this.client.util.checkOwner(message?.author.id)) return;
            if (!this.client.util.checkOwner(message?.author.id)) {
                !message?.channel.permissionsFor(message?.member).has(["Administrator", "ManageGuild", "ManageRoles", "ManageChannels", "ManageMessages", "ManageNicknames", "ManageEmojisAndStickers", "ManageWebhooks", "ManageThreads", "BanMembers", "KickMembers"]);
                {
                    if (message?.guild?.config?.disabledCommands?.includes(command?.name)) {
                        return message?.channel.send(`This command is disabled in this server!`).then((m) => {
                            setTimeout(() => {
                                m.delete();
                            }, 5000);
                        });
                    }
                    if (message?.guild?.config?.disabledChannels?.includes(message?.channel?.id)) {
                        return message?.channel.send(`This command is disabled in this channel!`).then((m) => {
                            setTimeout(() => {
                                m.delete();
                            }, 5000);
                        });
                    }
                }
                if (message?.guild.config.blacklisted) {
                    return message?.channel.send({
                        content: "This guild is blacklisted from using this bot.",
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
                let userdata = await this.client.database.welcomeUserData.get(message?.author.id);
                if (userdata?.blacklist) {
                    return message?.channel?.send({
                        content: "You are blacklisted from using this bot.",
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
                const userPermCheck = command.userPerms ? this.client.userPerms.add(command.userPerms) : this.client.userPerms;
                if (userPermCheck && !this.client.util.checkOwner(message?.author.id)) {
                    const missing = message?.channel.permissionsFor(message?.member).missing(userPermCheck);
                    if (missing.length) {
                        return this.client.util.errorDelete(message, `You Are Missing The Following Permissions: ${this.client.util.formatArray(missing.map(this.client.util.formatPerms))}`);
                    }
                }
                if (command.guildOwnerOnly && message?.guild.ownerId != message?.author.id) {
                    return this.client.util.errorDelete(message, `This Command Can Only Be Run By The Server Owner!`);
                }
                if (command.upFromMe && message?.member.roles.highest.position < message?.guild.members.resolve(this.client.user).roles.highest.position) {
                    return this.client.util.errorDelete(message, `This Command Can Only Be Run By Someone Higher Than Me!`);
                }
                const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms;
                if (botPermCheck) {
                    const missing = message?.channel.permissionsFor(this.client.user).missing(botPermCheck);
                    if (missing.length) {
                        return this.client.util.errorButtonEmbed(message, `I Don't Have Enough Permission! Click The Button Below To Fix`, botPermCheck.bitfield.toString());
                    }
                }

                if ((!message?.guild.config.premium && command?.vote) || (!message?.guild.config.premium && command?.premium)) {
                    let voted = await this.client.util.checkVote(message?.author.id);
                    if (!voted) {
                        let embed = this.client.util.embed().setTitle(`Vote For Me!`).setDescription(`You Need To Vote For Me To Use This Command!`).setColor(this.client.config.Client.PrimaryColor);
                        return message?.channel.send({
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
            let cmdr = command.run({ message, args });
        } catch (error) {
            return;
        }
    }
    ratelimit(message, cmd) {
        const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd));
        if (!command?.cooldown) return false;
        const cooldown = command.cooldown * 1000;
        const ratelimits = this.ratelimits.get(message?.author.id) || {};
        if (!ratelimits[command.name]) ratelimits[command.name] = Date.now() - cooldown;
        const difference = Date.now() - ratelimits[command.name];
        if (difference < cooldown) {
            let duration = cooldown - difference;
            return this.client.util.millisToDuration(duration);
        } else {
            ratelimits[command.name] = Date.now();
            this.ratelimits.set(message?.author.id, ratelimits);
            return true;
        }
    }
};
