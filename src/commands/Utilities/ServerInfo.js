const Command = require("../../abstract/command");
const verificationLevels = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Very High",
};
const verificationLevelsStage = {
    0: "Unrestricted",
    1: "Must Have Verified Email On Account",
    2: "Must Be Registered On Discord For Longer Than 5 Minutes",
    3: "Must Be A Member Of The Guild For Longer Than 10 Minutes",
    4: "Must Have A Verified Phone Number",
};
const explicitContentFilter = {
    0: "Off",
    1: "Member With Role",
    2: "All Members",
};
const defaultMessageNotifications = {
    0: "All Messages",
    1: "Only @mentions",
};
const mfaLevels = {
    0: "No",
    1: "Yes",
};

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "serverinfo",
            aliases: ["si"],
            description: "Shows Server Information",
            category: "Utilities",
            userPerms: ["SendMessages"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image:"https://i.imgur.com/BJV0OgG.png",
        });
    }

    async run({ message, args }) {
        message?.guild.members.fetch();
        const embed = this.client.util.embed();
        embed.setColor(this.client.util.color(message));
        embed.setThumbnail(
            message?.guild.iconURL({ dynamic: true, size: 2048 })
        );
        embed.setAuthor({
            name: message?.guild.name,
            iconURL: message?.guild.iconURL({ dynamic: true }),
        });
        embed.setTitle("Server Information");
        embed.setDescription(
            `${message?.guild.description || "No Description"}`
        );
        embed.addFields([
            {
                name: "ID",
                value: message?.guild.id,
            },
            {
                name: "Created At",
                value: `<t:${Math.floor(
                    message?.guild.createdTimestamp / 1000.0
                )}:f> | <t:${Math.floor(
                    message?.guild.createdTimestamp / 1000.0
                )}:R>`,
            },
            {
                name: "Owner",
                value: `<@${(await message?.guild.fetchOwner()).user.id}>`,
            },
        ]);
        embed.setTimestamp();
        const msg = await message?.reply({
            embeds: [embed],
            components: [
                this.client.util.row().setComponents(
                    this.client.util
                        .menu()
                        .setCustomId("serverinfo")
                        .setPlaceholder("Server Info Panel")
                        .addOptions([
                            {
                                label: "Members",
                                value: "members",
                                emoji: {
                                    id: "1010827460050432052",
                                },
                            },
                            {
                                label: "Channels",
                                value: "channels",
                                emoji: {
                                    id: "1010055725076193341",
                                },
                            },
                            {
                                label: "Boosts",
                                value: "boosts",
                                emoji: {
                                    id: "1010827952310718514",
                                },
                            },
                            {
                                label: "Features",
                                value: "feature",
                                emoji: {
                                    id: "1010828183202963526",
                                },
                            },
                            {
                                label: "Moderation",
                                value: "moderation",
                                emoji: {
                                    id: "1001043689088503838",
                                },
                            },
                        ])
                ),
            ],
            fetchReply: true,
        });
        const filter = (interaction) =>
            interaction?.user.id === message?.author.id;
        const collector = msg.createMessageComponentCollector({
            filter,
            time: 360000,
        });
        collector.on("collect", async (i) => {
            if (i.customId === "serverinfo") {
                if (i.values[0] === "members") {
                    const embed = this.client.util.embed();
                    embed.setAuthor({
                        name: message?.guild.name,
                        iconURL: message?.guild.iconURL({ dynamic: true }),
                    });
                    embed.setThumbnail(
                        message?.guild.iconURL({ dynamic: true, size: 2048 })
                    );
                    embed.setColor(this.client.util.color(message));
                    embed.addFields([
                        {
                            name: "Members",
                            value: `Total Members: ${
                                message?.guild.memberCount
                            }\nHumans: ${
                                message?.guild.members.cache.filter(
                                    (m) => m.user.bot == false
                                ).size
                            }\nBots: ${
                                message?.guild.members.cache.filter(
                                    (m) => m.user.bot == true
                                ).size
                            }`,
                        },
                    ]);
                    i.update({
                        embeds: [embed],
                    });
                } else if (i.values[0] === "channels") {
                    const embed = this.client.util.embed();
                    embed.setAuthor({
                        name: message?.guild.name,
                        iconURL: message?.guild.iconURL({ dynamic: true }),
                    });
                    embed.setColor(this.client.util.color(message));
                    embed.setThumbnail(
                        message?.guild.iconURL({ dynamic: true, size: 2048 })
                    );
                    embed.addFields([
                        {
                            name: "Text Channels",
                            value: `Total Channels: ${
                                message?.guild.channels.cache.size
                            }\nText Channels: ${
                                message?.guild.channels.cache.filter(
                                    (c) => c.type === 0
                                ).size
                            }\nVoice Channels: ${
                                message?.guild.channels.cache.filter(
                                    (c) => c.type === 2
                                ).size
                            }\nCategories: ${
                                message?.guild.channels.cache.filter(
                                    (c) => c.type === 4
                                ).size
                            }`,
                        },
                        {
                            name: "AFK Channel",
                            value: message?.guild.afkChannel
                                ? message?.guild.afkChannel
                                : "None",
                        },
                        {
                            name: "Hidden Channels",
                            value: `Total Channels: ${
                                message?.guild.channels.cache.filter(
                                    (c) =>
                                        !c
                                            .permissionsFor(message?.guild.id)
                                            .has("ViewChannel")
                                ).size
                            }\nText Channels: ${
                                message?.guild.channels.cache.filter(
                                    (c) =>
                                        c.type === 0 &&
                                        !c
                                            .permissionsFor(message?.guild.id)
                                            .has("ViewChannel")
                                ).size
                            }\nVoice Channels: ${
                                message?.guild.channels.cache.filter(
                                    (c) =>
                                        c.type === 2 &&
                                        !c
                                            .permissionsFor(message?.guild.id)
                                            .has("ViewChannel")
                                ).size
                            }\nCategories: ${
                                message?.guild.channels.cache.filter(
                                    (c) =>
                                        c.type === 4 &&
                                        !c
                                            .permissionsFor(message?.guild.id)
                                            .has("ViewChannel")
                                ).size
                            }`,
                        },
                    ]);
                    embed.setTimestamp();
                    i.update({
                        embeds: [embed],
                    });
                } else if (i.values[0] === "boosts") {
                    const embed = this.client.util.embed();
                    embed.setAuthor({
                        name: message?.guild.name,
                        iconURL: message?.guild.iconURL({ dynamic: true }),
                    });
                    embed.setColor(0xeb459e);
                    embed.setThumbnail(
                        message?.guild.iconURL({ dynamic: true, size: 2048 })
                    );
                    embed.addFields([
                        {
                            name: "Boosts",
                            value:
                                message?.guild.premiumSubscriptionCount +
                                " Boosts",
                        },
                        {
                            name: "Level",
                            value: `Level ${message?.guild.premiumTier}`,
                        },
                        {
                            name: "Boosters",
                            value:
                                message?.guild.members.cache
                                    .filter((m) => m.premiumSince != null)
                                    .map((m) => `<@${m.user.id}>`)
                                    .join(", ") || "None",
                        },
                        {
                            name: "Latest Boosters",
                            value:
                                message?.guild.members.cache
                                    .filter((m) => m.premiumSince != null)
                                    .sort(
                                        (a, b) =>
                                            b.premiumSinceTimestamp -
                                            a.premiumSinceTimestamp
                                    )
                                    .map((m) => `<@${m.user.id}>`)
                                    .slice(0, 5)
                                    .join(", ") || "None",
                        },
                    ]);
                    embed.setTimestamp();
                    i.update({
                        embeds: [embed],
                    });
                } else if (i.values[0] === "feature") {
                    let guildFeatures =
                        message?.guild.features
                            .join("\n")
                            .replace(
                                /THREADS_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Threads Enabled`
                            )
                            .replace(
                                /MEMBER_PROFILES/g,
                                `${this.client.config.Client.emoji.tick} Members Profile`
                            )
                            .replace(
                                /ENABLED_DISCOVERABLE_BEFORE/g,
                                `${this.client.config.Client.emoji.tick} Discoverable Before`
                            )
                            .replace(
                                /NEW_THREAD_PERMISSIONS/g,
                                `${this.client.config.Client.emoji.tick} New Thread Permission`
                            )
                            .replace(
                                /CHANNEL_BANNER/g,
                                `${this.client.config.Client.emoji.tick} Channel Banner`
                            )
                            .replace(
                                /ANIMATED_BANNER/g,
                                `${this.client.config.Client.emoji.tick} Animated Banner`
                            )
                            .replace(
                                /ANIMATED_ICON/g,
                                `${this.client.config.Client.emoji.tick} Animated Icon`
                            )
                            .replace(
                                /BANNER/g,
                                `${this.client.config.Client.emoji.tick} Banner`
                            )
                            .replace(
                                /COMMERCE/g,
                                `${this.client.config.Client.emoji.tick} Commerce`
                            )
                            .replace(
                                /COMMUNITY/g,
                                `${this.client.config.Client.emoji.tick} Community`
                            )
                            .replace(
                                /DISCOVERABLE/g,
                                `${this.client.config.Client.emoji.tick} Discoverable`
                            )
                            .replace(
                                /FEATURABLE/g,
                                `${this.client.config.Client.emoji.tick} Featurable`
                            )
                            .replace(
                                /INVITE_SPLASH/g,
                                `${this.client.config.Client.emoji.tick} Invite Splash`
                            )
                            .replace(
                                /MEMBER_VERIFICATION_GATE_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Member Verifaction Gate`
                            )
                            .replace(
                                /NEWS/g,
                                `${this.client.config.Client.emoji.tick} News`
                            )
                            .replace(
                                /PARTNERED/g,
                                `${this.client.config.Client.emoji.tick} Partnered`
                            )
                            .replace(
                                /PREVIEW_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Preview`
                            )
                            .replace(
                                /VANITY_URL/g,
                                `${this.client.config.Client.emoji.tick} Vanity URL`
                            )
                            .replace(
                                /VERIFIED/g,
                                `${this.client.config.Client.emoji.tick} Verified`
                            )
                            .replace(
                                /VIP_REGIONS/g,
                                `${this.client.config.Client.emoji.tick} VIP Region`
                            )
                            .replace(
                                /WELCOME_SCREEN_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Welcome Screen`
                            )
                            .replace(
                                /TICKETED_EVENTS_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Tickets Enabled`
                            )
                            .replace(
                                /MONETIZATION_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Monetization`
                            )
                            .replace(
                                /MORE_STICKERS/g,
                                `${this.client.config.Client.emoji.tick} More Stickets`
                            )
                            .replace(
                                /THREE_DAY_THREAD_ARCHIVE/g,
                                `${this.client.config.Client.emoji.tick} Three Days Thread Archive`
                            )
                            .replace(
                                /SEVEN_DAY_THREAD_ARCHIVE/g,
                                `${this.client.config.Client.emoji.tick} Seven Days Thread Archive`
                            )
                            .replace(
                                /PRIVATE_THREADS/g,
                                `${this.client.config.Client.emoji.tick} Private Threads`
                            )
                            .replace(
                                /ROLE_ICONS/g,
                                `${this.client.config.Client.emoji.tick} Role Icon`
                            )
                            .replace(
                                /HAS_DIRECTORY_ENTRY /g,
                                `${this.client.config.Client.emoji.tick} Has Directory Entry`
                            )
                            .replace(
                                /HUB/g,
                                `${this.client.config.Client.emoji.tick} Hub`
                            )
                            .replace(
                                /MONETIZATION_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Monetization`
                            )
                            .replace(
                                /MORE_STICKERS/g,
                                `${this.client.config.Client.emoji.tick} More Stickets`
                            )
                            .replace(
                                /AUTO_MODERATION/g,
                                `${this.client.config.Client.emoji.tick} Auto Moderation`
                            )
                            .replace(
                                /TEXT_IN_VOICE_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Text In Voice`
                            )
                            .replace(
                                /DEVELOPER_SUPPORT_SERVER/g,
                                `${this.client.config.Client.emoji.tick} Developer Support Server`
                            )
                            .replace(
                                /PREMIUM_SUBSCRIPTION_COUNT/g,
                                `${this.client.config.Client.emoji.tick} Premium Subscription Count`
                            )
                            .replace(
                                /APPLICATION_COMMAND_PERMISSIONS_V2/g,
                                `${this.client.config.Client.emoji.tick} Application Command Permissions`
                            )
                            .replace(
                                /SOUNDBOARD/g,
                                `${this.client.config.Client.emoji.tick} Soundboard`
                            )
                            .substr(0, 1020) + "...";
                    embed.setAuthor({
                        name: message?.guild.name,
                        iconURL: message?.guild.iconURL({ dynamic: true }),
                    });
                    embed.setColor(this.client.util.color(message));
                    embed.setThumbnail(
                        message?.guild.iconURL({ dynamic: true, size: 2048 })
                    );
                    embed.addFields([
                        {
                            name: "Features",
                            value: guildFeatures || "None",
                        },
                    ]);
                    embed.setTimestamp();
                    i.update({
                        embeds: [embed],
                    });
                } else if (i.values[0] === "moderation") {
                    const embed = this.client.util.embed();
                    embed.setAuthor({
                        name: message?.guild.name,
                        iconURL: message?.guild.iconURL({ dynamic: true }),
                    });
                    embed.setColor(this.client.util.color(message));
                    embed.setThumbnail(
                        message?.guild.iconURL({ dynamic: true, size: 2048 })
                    );
                    embed.addFields([
                        {
                            name: `Verifaction Level: ${
                                verificationLevels[
                                    message?.guild.verificationLevel
                                ] || "None"
                            }`,
                            value:
                                verificationLevelsStage[
                                    message?.guild.verificationLevel
                                ] || "None",
                        },
                        {
                            name: "Explicit Content Filter",
                            value:
                                explicitContentFilter[
                                    message?.guild.explicitContentFilter
                                ] || "None",
                        },
                        {
                            name: "Default Notifications",
                            value:
                                defaultMessageNotifications[
                                    message?.guild.defaultMessageNotifications
                                ] || "None",
                        },
                        {
                            name: "Moderators Require 2FA?",
                            value: mfaLevels[message?.guild.mfaLevel] || "No",
                        },
                    ]);
                    embed.setTimestamp();
                    i.update({
                        embeds: [embed],
                    });
                }
            }
        });
    }
    async exec({ interaction }) {
        interaction?.guild.members.fetch();
        const embed = this.client.util.embed();
        embed.setColor(this.client.util.color(interaction));
        embed.setThumbnail(
            interaction?.guild.iconURL({ dynamic: true, size: 2048 })
        );
        embed.setAuthor({
            name: interaction?.guild.name,
            iconURL: interaction?.guild.iconURL({ dynamic: true }),
        });
        embed.setTitle("Server Information");
        embed.setDescription(
            `${interaction?.guild.description || "No Description"}`
        );
        embed.addFields([
            {
                name: "ID",
                value: interaction?.guild.id,
            },
            {
                name: "Created At",
                value: `<t:${Math.floor(
                    interaction?.guild.createdTimestamp / 1000.0
                )}:f> | <t:${Math.floor(
                    interaction?.guild.createdTimestamp / 1000.0
                )}:R>`,
            },
            {
                name: "Owner",
                value: `<@${(await interaction?.guild.fetchOwner()).user.id}>`,
            },
        ]);
        embed.setTimestamp();
        const msg = await interaction?.reply({
            embeds: [embed],
            components: [
                this.client.util.row().setComponents(
                    this.client.util
                        .menu()
                        .setCustomId("serverinfo")
                        .setPlaceholder("Server Info Panel")
                        .addOptions([
                            {
                                label: "Members",
                                value: "members",
                                emoji: {
                                    id: "1010827460050432052",
                                },
                            },
                            {
                                label: "Channels",
                                value: "channels",
                                emoji: {
                                    id: "1010055725076193341",
                                },
                            },
                            {
                                label: "Boosts",
                                value: "boosts",
                                emoji: {
                                    id: "1010827952310718514",
                                },
                            },
                            {
                                label: "Features",
                                value: "feature",
                                emoji: {
                                    id: "1010828183202963526",
                                },
                            },
                            {
                                label: "Moderation",
                                value: "moderation",
                                emoji: {
                                    id: "1001043689088503838",
                                },
                            },
                        ])
                ),
            ],
            fetchReply: true,
        });
        const filter = (i) => i.user.id === interaction?.member.id;
        const collector = msg.createMessageComponentCollector({
            filter,
            time: 360000,
        });
        collector.on("collect", async (i) => {
            if (i.customId === "serverinfo") {
                if (i.values[0] === "members") {
                    const embed = this.client.util.embed();
                    embed.setAuthor({
                        name: interaction?.guild.name,
                        iconURL: interaction?.guild.iconURL({ dynamic: true }),
                    });
                    embed.setThumbnail(
                        interaction?.guild.iconURL({ dynamic: true, size: 2048 })
                    );
                    embed.setColor(this.client.util.color(interaction));
                    embed.addFields([
                        {
                            name: "Members",
                            value: `Total Members: ${
                                interaction?.guild.memberCount
                            }\nHumans: ${
                                interaction?.guild.members.cache.filter(
                                    (m) => m.user.bot == false
                                ).size
                            }\nBots: ${
                                interaction?.guild.members.cache.filter(
                                    (m) => m.user.bot == true
                                ).size
                            }`,
                        },
                    ]);
                    i.update({
                        embeds: [embed],
                    });
                } else if (i.values[0] === "channels") {
                    const embed = this.client.util.embed();
                    embed.setAuthor({
                        name: interaction?.guild.name,
                        iconURL: interaction?.guild.iconURL({ dynamic: true }),
                    });
                    embed.setColor(this.client.util.color(interaction));
                    embed.setThumbnail(
                        interaction?.guild.iconURL({ dynamic: true, size: 2048 })
                    );
                    embed.addFields([
                        {
                            name: "Text Channels",
                            value: `Total Channels: ${
                                interaction?.guild.channels.cache.size
                            }\nText Channels: ${
                                interaction?.guild.channels.cache.filter(
                                    (c) => c.type === 0
                                ).size
                            }\nVoice Channels: ${
                                interaction?.guild.channels.cache.filter(
                                    (c) => c.type === 2
                                ).size
                            }\nCategories: ${
                                interaction?.guild.channels.cache.filter(
                                    (c) => c.type === 4
                                ).size
                            }`,
                        },
                        {
                            name: "AFK Channel",
                            value: interaction?.guild.afkChannel
                                ? interaction?.guild.afkChannel
                                : "None",
                        },
                        {
                            name: "Hidden Channels",
                            value: `Total Channels: ${
                                interaction?.guild.channels.cache.filter(
                                    (c) =>
                                        !c
                                            .permissionsFor(
                                                interaction?.guild.id
                                            )
                                            .has("ViewChannel")
                                ).size
                            }\nText Channels: ${
                                interaction?.guild.channels.cache.filter(
                                    (c) =>
                                        c.type === 0 &&
                                        !c
                                            .permissionsFor(
                                                interaction?.guild.id
                                            )
                                            .has("ViewChannel")
                                ).size
                            }\nVoice Channels: ${
                                interaction?.guild.channels.cache.filter(
                                    (c) =>
                                        c.type === 2 &&
                                        !c
                                            .permissionsFor(
                                                interaction?.guild.id
                                            )
                                            .has("ViewChannel")
                                ).size
                            }\nCategories: ${
                                interaction?.guild.channels.cache.filter(
                                    (c) =>
                                        c.type === 4 &&
                                        !c
                                            .permissionsFor(
                                                interaction?.guild.id
                                            )
                                            .has("ViewChannel")
                                ).size
                            }`,
                        },
                    ]);
                    embed.setTimestamp();
                    i.update({
                        embeds: [embed],
                    });
                } else if (i.values[0] === "boosts") {
                    const embed = this.client.util.embed();
                    embed.setAuthor({
                        name: interaction?.guild.name,
                        iconURL: interaction?.guild.iconURL({ dynamic: true }),
                    });
                    embed.setColor(0xeb459e);
                    embed.setThumbnail(
                        interaction?.guild.iconURL({ dynamic: true, size: 2048 })
                    );
                    embed.addFields([
                        {
                            name: "Boosts",
                            value:
                                interaction?.guild.premiumSubscriptionCount +
                                " Boosts",
                        },
                        {
                            name: "Level",
                            value: `Level ${interaction?.guild.premiumTier}`,
                        },
                        {
                            name: "Boosters",
                            value:
                                interaction?.guild.members.cache
                                    .filter((m) => m.premiumSince != null)
                                    .map((m) => `<@${m.user.id}>`)
                                    .join(", ") || "None",
                        },
                        {
                            name: "Latest Boosters",
                            value:
                                interaction?.guild.members.cache
                                    .filter((m) => m.premiumSince != null)
                                    .sort(
                                        (a, b) =>
                                            b.premiumSinceTimestamp -
                                            a.premiumSinceTimestamp
                                    )
                                    .map((m) => `<@${m.user.id}>`)
                                    .slice(0, 5)
                                    .join(", ") || "None",
                        },
                    ]);
                    embed.setTimestamp();
                    i.update({
                        embeds: [embed],
                    });
                } else if (i.values[0] === "feature") {
                    let guildFeatures =
                        interaction?.guild.features
                            .join("\n")
                            .replace(
                                /THREADS_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Threads Enabled`
                            )
                            .replace(
                                /MEMBER_PROFILES/g,
                                `${this.client.config.Client.emoji.tick} Members Profile`
                            )
                            .replace(
                                /ENABLED_DISCOVERABLE_BEFORE/g,
                                `${this.client.config.Client.emoji.tick} Discoverable Before`
                            )
                            .replace(
                                /NEW_THREAD_PERMISSIONS/g,
                                `${this.client.config.Client.emoji.tick} New Thread Permission`
                            )
                            .replace(
                                /CHANNEL_BANNER/g,
                                `${this.client.config.Client.emoji.tick} Channel Banner`
                            )
                            .replace(
                                /ANIMATED_BANNER/g,
                                `${this.client.config.Client.emoji.tick} Animated Banner`
                            )
                            .replace(
                                /ANIMATED_ICON/g,
                                `${this.client.config.Client.emoji.tick} Animated Icon`
                            )
                            .replace(
                                /BANNER/g,
                                `${this.client.config.Client.emoji.tick} Banner`
                            )
                            .replace(
                                /COMMERCE/g,
                                `${this.client.config.Client.emoji.tick} Commerce`
                            )
                            .replace(
                                /COMMUNITY/g,
                                `${this.client.config.Client.emoji.tick} Community`
                            )
                            .replace(
                                /DISCOVERABLE/g,
                                `${this.client.config.Client.emoji.tick} Discoverable`
                            )
                            .replace(
                                /FEATURABLE/g,
                                `${this.client.config.Client.emoji.tick} Featurable`
                            )
                            .replace(
                                /INVITE_SPLASH/g,
                                `${this.client.config.Client.emoji.tick} Invite Splash`
                            )
                            .replace(
                                /MEMBER_VERIFICATION_GATE_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Member Verifaction Gate`
                            )
                            .replace(
                                /NEWS/g,
                                `${this.client.config.Client.emoji.tick} News`
                            )
                            .replace(
                                /PARTNERED/g,
                                `${this.client.config.Client.emoji.tick} Partnered`
                            )
                            .replace(
                                /PREVIEW_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Preview`
                            )
                            .replace(
                                /VANITY_URL/g,
                                `${this.client.config.Client.emoji.tick} Vanity URL`
                            )
                            .replace(
                                /VERIFIED/g,
                                `${this.client.config.Client.emoji.tick} Verified`
                            )
                            .replace(
                                /VIP_REGIONS/g,
                                `${this.client.config.Client.emoji.tick} VIP Region`
                            )
                            .replace(
                                /WELCOME_SCREEN_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Welcome Screen`
                            )
                            .replace(
                                /TICKETED_EVENTS_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Tickets Enabled`
                            )
                            .replace(
                                /MONETIZATION_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Monetization`
                            )
                            .replace(
                                /MORE_STICKERS/g,
                                `${this.client.config.Client.emoji.tick} More Stickets`
                            )
                            .replace(
                                /THREE_DAY_THREAD_ARCHIVE/g,
                                `${this.client.config.Client.emoji.tick} Three Days Thread Archive`
                            )
                            .replace(
                                /SEVEN_DAY_THREAD_ARCHIVE/g,
                                `${this.client.config.Client.emoji.tick} Seven Days Thread Archive`
                            )
                            .replace(
                                /PRIVATE_THREADS/g,
                                `${this.client.config.Client.emoji.tick} Private Threads`
                            )
                            .replace(
                                /ROLE_ICONS/g,
                                `${this.client.config.Client.emoji.tick} Role Icon`
                            )
                            .replace(
                                /HAS_DIRECTORY_ENTRY /g,
                                `${this.client.config.Client.emoji.tick} Has Directory Entry`
                            )
                            .replace(
                                /HUB/g,
                                `${this.client.config.Client.emoji.tick} Hub`
                            )
                            .replace(
                                /MONETIZATION_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Monetization`
                            )
                            .replace(
                                /MORE_STICKERS/g,
                                `${this.client.config.Client.emoji.tick} More Stickets`
                            )
                            .replace(
                                /AUTO_MODERATION/g,
                                `${this.client.config.Client.emoji.tick} Auto Moderation`
                            )
                            .replace(
                                /TEXT_IN_VOICE_ENABLED/g,
                                `${this.client.config.Client.emoji.tick} Text In Voice`
                            )
                            .replace(
                                /DEVELOPER_SUPPORT_SERVER/g,
                                `${this.client.config.Client.emoji.tick} Developer Support Server`
                            )
                            .replace(
                                /PREMIUM_SUBSCRIPTION_COUNT/g,
                                `${this.client.config.Client.emoji.tick} Premium Subscription Count`
                            )
                            .replace(
                                /APPLICATION_COMMAND_PERMISSIONS_V2/g,
                                `${this.client.config.Client.emoji.tick} Application Command Permissions`
                            )
                            .replace(
                                /SOUNDBOARD/g,
                                `${this.client.config.Client.emoji.tick} Soundboard`
                            )
                            .substr(0, 1020) + "...";
                    const embed = this.client.util.embed();
                    embed.setAuthor({
                        name: interaction?.guild.name,
                        iconURL: interaction?.guild.iconURL({ dynamic: true }),
                    });
                    embed.setColor(this.client.util.color(interaction));
                    embed.setThumbnail(
                        interaction?.guild.iconURL({ dynamic: true, size: 2048 })
                    );
                    embed.addFields([
                        {
                            name: "Features",
                            value: guildFeatures || "None",
                        },
                    ]);
                    embed.setTimestamp();
                    i.update({
                        embeds: [embed],
                    });
                } else if (i.values[0] === "moderation") {
                    const embed = this.client.util.embed();
                    embed.setAuthor({
                        name: interaction?.guild.name,
                        iconURL: interaction?.guild.iconURL({ dynamic: true }),
                    });
                    embed.setColor(this.client.util.color(interaction));
                    embed.setThumbnail(
                        interaction?.guild.iconURL({ dynamic: true, size: 2048 })
                    );
                    embed.addFields([
                        {
                            name: `Verifaction Level: ${
                                verificationLevels[
                                    interaction?.guild.verificationLevel
                                ] || "None"
                            }`,
                            value:
                                verificationLevelsStage[
                                    interaction?.guild.verificationLevel
                                ] || "None",
                        },
                        {
                            name: "Explicit Content Filter",
                            value:
                                explicitContentFilter[
                                    interaction?.guild.explicitContentFilter
                                ] || "None",
                        },
                        {
                            name: "Default Notifications",
                            value:
                                defaultMessageNotifications[
                                    interaction?.guild
                                        .defaultMessageNotifications
                                ] || "None",
                        },
                        {
                            name: "Moderators Require 2FA?",
                            value:
                                mfaLevels[interaction?.guild.mfaLevel] || "No",
                        },
                    ]);
                    embed.setTimestamp();
                    i.update({
                        embeds: [embed],
                    });
                }
            }
        });
    }
};
