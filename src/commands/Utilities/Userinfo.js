const Command = require("../../abstract/command");
const { GuildMember } = require("discord.js");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = class about extends Command {
    constructor(...args) {
        super(...args, {
            name: "userinfo",
            description: "Get all information about a user.",
            aliases: ["ui", "uinfo", "whois"],
            usage: ["userinfo <@user>"],
            category: "Utilities",
            userPerms: ["SendMessages"],
            botPerms: ["SendMessages", "EmbedLinks"],
            cooldown: 5,
            image:"https://i.imgur.com/09yyTmo.png",
            guildOnly: true,
            options: [
                {
                    name: "member",
                    description: "The user you want to get information about.",
                    type: ApplicationCommandOptionType.User,
                },
            ],
        });
        this.flags = {
            BotHTTPInteractions:
                this.client.config.Client.Emojis.Flags.SupportCommands,
            BugHunterLevel1: this.client.config.Client.Emojis.Flags.BugHunter1,
            BugHunterLevel2: this.client.config.Client.Emojis.Flags.BugHunter2,
            CertifiedModerator:
                this.client.config.Client.Emojis.Flags.CertifiedModerator,
            HypeSquadOnlineHouse1:
                this.client.config.Client.Emojis.Flags.HyperSquadBravery,
            HypeSquadOnlineHouse2:
                this.client.config.Client.Emojis.Flags.HyperSquadBrilliance,
            HypeSquadOnlineHouse3:
                this.client.config.Client.Emojis.Flags.HyperSquadBalance,
            Hypesquad: this.client.config.Client.Emojis.Flags.HyperSquadEvent,
            Partner: this.client.config.Client.Emojis.Flags.PartnerServerOwner,
            PremiumEarlySupporter:
                this.client.config.Client.Emojis.Flags.EarlySupporter,
            Staff: this.client.config.Client.Emojis.Flags.Exployee,
            VerifiedBot: this.client.config.Client.Emojis.Flags.VerifiedBot,
            VerifiedDeveloper:
                this.client.config.Client.Emojis.Flags
                    .EarlyVerifiedBotDeveloper,
        };
    }

    async run({ message, args, serverData, messageData }) {
        let permissionsArray = [];
        let acknowledgements = "Member";
        let member = args[0]
            ? await this.client.util.userQuery(args[0])
            : message?.member;
        if (typeof member === "string") {
            let nopeMember = null;
            try {
                nopeMember = await message?.guild.members.fetch(member);
            } catch (e) {
                try {
                    nopeMember = await this.client.users.fetch(member);
                } catch (err) {
                    nopeMember = null;
                }
            }
            if (!nopeMember) return;
            member = nopeMember;
        }
        const badges = member.user
            ? member.user.flags.toArray()
            : member.flags.toArray();
        const embed = this.client.util
            .embed()
            .setFooter({
                text: message?.author.username,
                iconURL: message?.author.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
        if (member instanceof GuildMember) {
            if (member.permissions.has("Administrator"))
                permissionsArray.push("Administrator");
            if (member.permissions.has("BanMembers"))
                permissionsArray.push("Ban Members");
            if (member.permissions.has("ChangeNickname"))
                permissionsArray.push("Change Nickname");
            if (member.permissions.has("CreateInstantInvite"))
                permissionsArray.push("Create Instant Invite");
            if (member.permissions.has("DeafenMembers"))
                permissionsArray.push("Deafen Members");
            if (member.permissions.has("KickMembers"))
                permissionsArray.push("Kick Members");
            if (member.permissions.has("ManageChannels"))
                permissionsArray.push("Manage Channels");
            if (member.permissions.has("ManageEmojisAndStickers"))
                permissionsArray.push("Manage Emojis");
            if (member.permissions.has("ManageGuild"))
                permissionsArray.push("Manage Guild");
            if (member.permissions.has("ManageMessages"))
                permissionsArray.push("Manage Messages");
            if (member.permissions.has("ManageNicknames"))
                permissionsArray.push("Manage Nicknames");
            if (member.permissions.has("ManageRoles"))
                permissionsArray.push("Manage Roles");
            if (member.permissions.has("ManageWebhooks"))
                permissionsArray.push("Manage Webhooks");
            if (member.permissions.has("MentionEveryone"))
                permissionsArray.push("Mention Everyone");
            if (member.permissions.has("MoveMembers"))
                permissionsArray.push("Move Members");
            if (member.permissions.has("MuteMembers"))
                permissionsArray.push("Mute Members");
            if (member.permissions.has("ViewAuditLog"))
                permissionsArray.push("View Audit Logs");
            if (member.permissions.has("ManageGuild"))
                acknowledgements = "Moderator";
            if (member.permissions.has("Administrator"))
                acknowledgements = "Administrator";
            if (member.id == message?.guild.ownerId)
                acknowledgements = "Server Owner";
            embed.setAuthor({
                name: `${member.user.username}#${member.user.discriminator}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true }),
            });
            embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
            embed.setColor(this.client.config.Client.PrimaryColor);
            embed.addFields([
                {
                    name: "__**Informations**__",
                    value: `**Username:** ${member.user.username}
**ID:** ${member.id}
**Nickname:** ${member.nickname ? member.nickname : "None"}
**Bot:** ${
                        member.user.bot
                            ? "Yes " + this.client.config.Client.emoji.tick
                            : "No " + this.client.config.Client.emoji.cross
                    }
**Badges:** ${
                        badges.length != 0
                            ? badges.map((c) => this.flags[c]).join(", ")
                            : "None"
                    }
**Joined At:** <t:${Math.floor(member.joinedTimestamp / 1000.0)}:R>
**Created At:** <t:${Math.floor(member.user.createdTimestamp / 1000.0)}:R>`,
                },
                {
                    name: "__**Extra**__",
                    value: `**Highest Role:** ${member.roles.highest}
**Boosting Since:** ${
                        member.premiumSince
                            ? `<t:${Math.floor(
                                  member.premiumSinceTimestamp / 1000.0
                              )}:R>`
                            : "None"
                    }
**Voice Channel:** ${member.voice.channel ? member.voice.channel : "None"}`,
                },
                {
                    name: "__**Key Permissions**__",
                    value:
                        permissionsArray.length != 0
                            ? permissionsArray.join(", ")
                            : "No Key Permissions Available",
                },
                {
                    name: "__**Acknowledgements**__",
                    value: `${acknowledgements ? acknowledgements : "None"}`,
                },
            ]);
            return messageData == null
                ? await message?.reply({
                      embeds: [
                          embed.setImage(
                              await member.user
                                  .fetch()
                                  .then((u) =>
                                      u.bannerURL({ dynamic: true, size: 2048 })
                                  )
                          ),
                      ],
                  })
                : await messageData.edit({
                      embeds: [
                          embed.setImage(
                              await member.user
                                  .fetch()
                                  .then((u) =>
                                      u.bannerURL({ dynamic: true, size: 2048 })
                                  )
                          ),
                      ],
                      components: [],
                      content: " ",
                  });
        }
        embed.setAuthor({
            name: `${member.username}#${member.discriminator}`,
            iconURL: member.displayAvatarURL({ dynamic: true }),
        });
        embed.setThumbnail(member.displayAvatarURL({ dynamic: true }));
        embed.setColor(this.client.config.Client.PrimaryColor);
        embed.addFields([
            {
                name: "__Informations__",
                value: `**Username:** ${member.username}
**ID:** ${member.id}
**Bot:** ${
                    member.bot
                        ? "Yes " + this.client.config.Client.emoji.tick
                        : "No " + this.client.config.Client.emoji.cross
                }
**Badges:** ${
                    badges.length != 0
                        ? badges.map((c) => this.flags[c]).join(", ")
                        : "None"
                }
**Created At:** <t:${Math.floor(member.createdTimestamp / 1000.0)}:R>`,
            },
        ]);
        embed.setImage(
            (await member.fetch()).bannerURL({ dynamic: true, size: 2048 })
        );
        return messageData == null
            ? await message?.reply({
                  embeds: [embed],
              })
            : await messageData.edit({
                  embeds: [embed],
                  content: " ",
                  components: [],
              });
    }
    async exec({ interaction, serverData }) {
        await interaction?.deferReply();
        let permissionsArray = [];
        let acknowledgements = "Member";
        let member = interaction?.options.getUser("member");
        if (member) {
            try {
                member = await interaction?.guild.members.fetch(member.id);
            } catch (e) {
                try {
                    member = await this.client.users.fetch(member.id);
                } catch (e) {
                    member = interaction?.member;
                }
            }
        }
        if (!member) member = interaction?.member;
        const badges = member.user
            ? member.user.flags.toArray()
            : member.flags.toArray();
        const embed = this.client.util
            .embed()
            .setFooter({
                text: interaction?.user.username,
                iconURL: interaction?.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
        interaction?.deferReply();
        if (member instanceof GuildMember) {
            if (member.permissions.has("Administrator"))
                permissionsArray.push("Administrator");
            if (member.permissions.has("BanMembers"))
                permissionsArray.push("Ban Members");
            if (member.permissions.has("ChangeNickname"))
                permissionsArray.push("Change Nickname");
            if (member.permissions.has("CreateInstantInvite"))
                permissionsArray.push("Create Instant Invite");
            if (member.permissions.has("DeafenMembers"))
                permissionsArray.push("Deafen Members");
            if (member.permissions.has("KickMembers"))
                permissionsArray.push("Kick Members");
            if (member.permissions.has("ManageChannels"))
                permissionsArray.push("Manage Channels");
            if (member.permissions.has("ManageEmojisAndStickers"))
                permissionsArray.push("Manage Emojis");
            if (member.permissions.has("ManageGuild"))
                permissionsArray.push("Manage Guild");
            if (member.permissions.has("ManageMessages"))
                permissionsArray.push("Manage Messages");
            if (member.permissions.has("ManageNicknames"))
                permissionsArray.push("Manage Nicknames");
            if (member.permissions.has("ManageRoles"))
                permissionsArray.push("Manage Roles");
            if (member.permissions.has("ManageWebhooks"))
                permissionsArray.push("Manage Webhooks");
            if (member.permissions.has("MentionEveryone"))
                permissionsArray.push("Mention Everyone");
            if (member.permissions.has("MoveMembers"))
                permissionsArray.push("Move Members");
            if (member.permissions.has("MuteMembers"))
                permissionsArray.push("Mute Members");
            if (member.permissions.has("PrioritySpeaker"))
                permissionsArray.push("Priority Speaker");
            if (member.permissions.has("UseVAD"))
                permissionsArray.push("Use VAD");
            if (member.permissions.has("ManageGuild"))
                acknowledgements = "Moderator";
            if (member.permissions.has("Administrator"))
                acknowledgements = "Administrator";
            if (member.id == interaction?.guild.ownerId)
                acknowledgements = "Server Owner";
            embed.setAuthor({
                name: `${member.user.username}#${member.user.discriminator}`,
                iconURL: member.user.displayAvatarURL({ dynamic: true }),
            });
            embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
            embed.setImage(
                (await member.user.fetch()).bannerURL({
                    dynamic: true,
                    size: 2048,
                })
            );
            embed.setColor(this.client.config.Client.PrimaryColor);
            embed.addFields([
                {
                    name: "__**Informations**__",
                    value: `**Username:** ${member.user.username}
**ID:** ${member.id}
**Nickname:** ${member.nickname ? member.nickname : "None"}
**Bot:** ${
                        member.user.bot
                            ? "Yes " + this.client.config.Client.emoji.tick
                            : "No " + this.client.config.Client.emoji.cross
                    }
**Badges:** ${
                        badges.length != 0
                            ? badges.map((c) => this.flags[c]).join(", ")
                            : "None"
                    }
**Joined At:** <t:${Math.floor(member.joinedTimestamp / 1000.0)}:R>
**Created At:** <t:${Math.floor(member.user.createdTimestamp / 1000.0)}:R>`,
                },
                {
                    name: "__**Extra**__",
                    value: `**Highest Role:** ${member.roles.highest}
**Boosting Since:** ${
                        member.premiumSince
                            ? `<t:${Math.floor(
                                  member.premiumSinceTimestamp / 1000.0
                              )}:R>`
                            : "None"
                    }
**Voice Channel:** ${member.voice.channel ? member.voice.channel : "None"}`,
                },
                {
                    name: "__**Key Permissions**__",
                    value:
                        permissionsArray.length != 0
                            ? permissionsArray.join(", ")
                            : "No Key Permissions Available",
                },
                {
                    name: "__**Acknowledgements**__",
                    value: `${acknowledgements ? acknowledgements : "None"}`,
                },
            ]);
            return interaction?.editReply({
                embeds: [
                    embed.setImage(
                        await member.user
                            .fetch()
                            .then((u) =>
                                u.bannerURL({ dynamic: true, size: 2048 })
                            )
                    ),
                ],
            });
        }
        embed.setAuthor({
            name: `${member.username}#${member.discriminator}`,
            iconURL: member.displayAvatarURL({ dynamic: true }),
        });
        embed.setThumbnail(member.displayAvatarURL({ dynamic: true }));
        embed.setColor(this.client.config.Client.PrimaryColor);
        embed.addFields([
            {
                name: "__Informations__",
                value: `**Username:** ${member.username}
**ID:** ${member.id}
**Bot:** ${
                    member.bot
                        ? "Yes " + this.client.config.Client.emoji.tick
                        : "No " + this.client.config.Client.emoji.cross
                }
**Badges:** ${
                    badges.length != 0
                        ? badges.map((c) => this.flags[c]).join(", ")
                        : "None"
                }
**Created At:** <t:${Math.floor(member.createdTimestamp / 1000.0)}:R>`,
            },
        ]);
        embed.setImage(
            (await member.fetch()).bannerURL({ dynamic: true, size: 2048 })
        );
        interaction?.editReply({
            embeds: [embed],
        });
    }
};
