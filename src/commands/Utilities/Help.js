const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "help",
            aliases: ["h", "commands"],
            description: "To get information about all commands.",
            usage: ["help", "help [command]"],
            category: "Utilities",
            examples: ["help"],
            userPerms: ["SendMessages"],
            guildOnly: true,
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image:"https://i.imgur.com/RXOQeMA.png",
        });
    }

    async run({ message, args }) {
        message.guild.config = await this.client.database.guildData.get(
            message?.guild.id
        );
        let helpmenu;
        if (!args[0]) {
            const embed = this.client.util
            .embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setAuthor({
                name: message?.member.user.username,
                iconURL: message?.member.user.displayAvatarURL({
                    dynamic: true,
                }),
            })
            .setDescription(
                `${this.client.config.Client.emoji.prismoemo}  Hey bud! I'm **${this.client.user.username}**, a bot, here to make your discord experience even better. Need help with commands? Type \`${message?.guild.config.prefix}help\` to see what I can do.`
            )
            // .setTimestamp();
            helpmenu = await message?.reply({
                embeds: [embed],
                // content: `${this.client.config.Client.emoji.prismoemo} My prefix for this server is **\`${message?.guild.config.prefix}\`**`,
                components: [
                    this.client.util.row().setComponents(
                        this.client.util
                            .menu()
                            .setCustomId("select")
                            .setPlaceholder("Select A Category To Get Started")
                            .addOptions([
                                {
                                    label: "Welcome",
                                    value: "help_welcome",
                                    emoji: this.client.config.Client.emoji
                                        .welcome,
                                },
                                {
                                    label: "Moderation",
                                    value: "help_moderation",
                                    emoji: this.client.config.Client.emoji
                                        .moderation,
                                },
                                {
                                    label: "Utility",
                                    value: "help_utility",
                                    emoji: this.client.config.Client.emoji
                                        .utility,
                                },
                                {
                                    label: "Fun",
                                    value: "help_fun",
                                    emoji: this.client.config.Client.emoji.fun,
                                },
                                {
                                    label: "Image",
                                    value: "help_image",
                                    emoji: this.client.config.Client.emoji.image,
                                },
                                {
                                    label: "Giveaway",
                                    value: "help_giveaway",
                                    emoji: this.client.config.Client.emoji.giveaway,
                                },
                                {
                                    label: "Invite",
                                    value: "help_invite",
                                    emoji: this.client.config.Client.emoji.add,
                                }
                            ])
                    ),
                    // create 2 button one for invite and other setEmojifor support 
                    this.client.util.row().setComponents(
                        this.client.util
                            .button()
                            .setStyle(5)
                            .setLabel("Invite Me")
                            .setEmoji(this.client.config.Client.emoji.invite)
                            .setURL(
                                `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands`
                            ),
                        this.client.util
                            .button()
                            .setStyle(5)
                            .setLabel("Support")
                            .setEmoji(this.client.config.Client.emoji.support)
                            .setURL(this.client.config.Url.SupportURL),
                        // this.client.util
                        //     .button()
                        //     .setStyle(5)
                        //     .setLabel("Guide")
                        //     .setEmoji(this.client.config.Client.emoji.guide)
                        //     .setURL(this.client.config.Url.GuideURL),
                        this.client.util
                            .button()
                            .setStyle(5)
                            .setLabel("Premium")
                            .setEmoji(this.client.config.Client.emoji.invite)
                            .setURL(this.client.config.Url.GuideURL),
                    ),
                ],
            });
        }
        const collector = message?.channel.createMessageComponentCollector({
            time: 600000,
        });
        collector.on("collect", async (interaction) => {
            if (interaction?.customId === "select") {
                if (interaction?.values[0] === "help_welcome") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message?.author.username}`,
                            iconURL: message?.author.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Welcome `[" +
                                    this.client.commands
                                        .filter((c) => c.category == "Welcome")
                                        .size.toString() +
                                    "]`",
                                value: this.client.commands
                                    .filter((c) => c.category == "Welcome")
                                    .map((c) => `\`${c.name}\``)
                                    .join(", "),
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_moderation") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message?.author.username}`,
                            iconURL: message?.author.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Moderation `[" +
                                    this.client.commands
                                        .filter(
                                            (c) => c.category == "Moderation"
                                        )
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter(
                                        (cmd) => cmd.category === "Moderation"
                                    )
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_utility") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message?.author.username}`,
                            iconURL: message?.author.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Utility `[" +
                                    this.client.commands
                                        .filter(
                                            (c) => c.category == "Utilities"
                                        )
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter(
                                        (cmd) => cmd.category === "Utilities"
                                    )
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_fun") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message?.author.username}`,
                            iconURL: message?.author.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Fun `[" +
                                    this.client.commands
                                        .filter((c) => c.category == "Fun")
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter((cmd) => cmd.category === "Fun")
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_image") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message?.author.username}`,
                            iconURL: message?.author.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Image `[" +
                                    this.client.commands
                                        .filter((c) => c.category == "Image")
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter((cmd) => cmd.category === "Image")
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_giveaway") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message?.author.username}`,
                            iconURL: message?.author.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Giveaway `[" +
                                    this.client.commands
                                        .filter((c) => c.category == "Giveaways")
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter((cmd) => cmd.category === "Giveaways")
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_invite") {
                    const embed = this.client.util
                    .embed()
                    .setThumbnail(this.client.user.displayAvatarURL())
                    .setColor(this.client.config.Client.PrimaryColor)
                    .setAuthor({
                        name: this.client.user.username,
                        iconURL: this.client.user.displayAvatarURL(),
                    })
                    .setFooter({
                        text: `Requested by ${message?.author.username}`,
                        iconURL: message?.author.displayAvatarURL(),
                    })
                    .addFields({name: `Invites [${this.client.commands.filter((c) => c.category == "Invites").size.toString()}]`, 
                        value: `${this.client.commands.filter((c) => c.category == "Invites").map((c) => `\`${c.name}\``).join(", ") || "No Commands Found!"}`});
                interaction?.reply({ embeds: [embed], ephemeral: true });
                }
            }
        });
        collector.on("end", async (interaction) => {
            helpmenu?.delete();
        });
        if (!args[0]) return;
        let command =
            this.client.commands.get(args[0].toLowerCase()) ||
            this.client.commands.get(
                this.client.aliases.get(args[0].toLowerCase())
            );

        if (!command || command.category.includes("Owners")) {
            return this.client.util
                .errorDelete(
                    message,
                    `No Command Found - ${args[0].charAt(0).toUpperCase() + args[0].slice(1)
                    }!`
                )
                .catch((e) => {
                    return;
                });
        }
        const Embededinfo = this.client.util
            .embed()
            .setThumbnail(message?.guild?.iconURL({ dynamic: true }))
            .setColor(this.client.config.Client.PrimaryColor)
            .setAuthor({
                name: `${command.name} Command`,
                iconURL: this.client.user.displayAvatarURL({ format: "png" }),
                url: this.client.config.Url.SupportURL,
            })
            .setDescription(
                command.description
                    ? `> ${command.description}`
                    : "> No Description"
            )
            .setFooter({
                text: `Requested by ${message?.author.username}`,
                iconURL: message?.author.displayAvatarURL(),
            })
            .addFields([
                {
                    name: "Category",
                    value: `\`${command.category}\``,
                },
            ]);
        if (command.aliases.length) {
            Embededinfo.addFields([
                {
                    name: "Aliases",
                    value: `${command.aliases
                        .map((alis) => "`" + alis + "`")
                        .join(", ")}`,
                },
            ]);
        }
        if (command.usage) {
            Embededinfo.addFields([
                {
                    name: "Example",
                    value: `\`${message?.guild.config.prefix}${command.usage}\``,
                },
            ]);
        }
        if (command.cooldown) {
            Embededinfo.addFields([
                {
                    name: "Cooldown",
                    value: `\`${command.cooldown}\``,
                },
            ]);
        }
        await message?.reply({ embeds: [Embededinfo] }).catch((e) => {
            return;
        });
    }

    async exec({ interaction, args }) {
        interaction.guild.config = await this.client.database.guildData.get(
            interaction?.guild.id
        );
        let helpmenu = await interaction?.reply({
            content: `${this.client.config.Client.emoji.prismoemo} My prefix for this server is **\`${interaction?.guild.config.prefix}\`**`,
            components: [
                this.client.util.row().setComponents(
                    this.client.util
                        .menu()
                        .setCustomId("select_xd")
                        .setPlaceholder("Select A Category")
                        .addOptions([
                            {
                                label: "Welcome",
                                value: "help_welcomeslash",
                                emoji: this.client.config.Client.emoji.welcome,
                            },
                            {
                                label: "Moderation",
                                value: "help_moderationslash",
                                emoji: this.client.config.Client.emoji
                                    .moderation,
                            },
                            {
                                label: "Utility",
                                value: "help_utilityslash",
                                emoji: this.client.config.Client.emoji.utility,
                            },
                            {
                                label: "Fun",
                                value: "help_funslash",
                                emoji: this.client.config.Client.emoji.fun,
                            },
                            {
                                label: "Image",
                                value: "help_imageslash",
                                emoji: this.client.config.Client.emoji.image,
                            },
                            {
                                label: "Giveaway",
                                value: "help_giveawayslash",
                                emoji: this.client.config.Client.emoji.giveaway,
                            },
                            {
                                label: "Invites",
                                value: "help_inviteslash",
                                emoji: this.client.config.Client.emoji.add,
                            },

                        ]),
                ),
                this.client.util.row().setComponents(
                    this.client.util
                        .button()
                        .setStyle(5)
                        .setLabel("Invite Me")
                        .setEmoji(this.client.config.Client.emoji.invite)
                        .setURL(
                            `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands`
                        ),
                    this.client.util
                        .button()
                        .setStyle(5)
                        .setLabel("Support")
                        .setEmoji(this.client.config.Client.emoji.support)
                        .setURL(this.client.config.Url.SupportURL),
                    this.client.util
                        .button()
                        .setStyle(5)
                        .setLabel("Guide")
                        .setEmoji(this.client.config.Client.emoji.guide)
                        .setURL(this.client.config.Url.GuideURL),
                ),
            ],
        });
        const filter = (i) => i.user.id === interaction?.member.user.id;
        const collector = interaction?.channel.createMessageComponentCollector({
            time: 900000,
        });
        /**
         * @param {
         */
        collector.on("collect", async (interaction) => {
            if (interaction?.customId === "select_xd") {
                if (interaction?.values[0] === "help_welcomeslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction?.user.username}`,
                            iconURL: interaction?.user.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Welcome `[" +
                                    this.client.commands
                                        .filter((c) => c.category == "Welcome")
                                        .size.toString() +
                                    "]`",
                                value: this.client.commands
                                    .filter((c) => c.category == "Welcome")
                                    .map((c) => `\`${c.name}\``)
                                    .join(", "),
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_moderationslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction?.user.username}`,
                            iconURL: interaction?.user.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Moderation `[" +
                                    this.client.commands
                                        .filter(
                                            (c) => c.category == "Moderation"
                                        )
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter(
                                        (cmd) => cmd.category === "Moderation"
                                    )
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_utilityslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction?.user.username}`,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Utility `[" +
                                    this.client.commands
                                        .filter(
                                            (c) => c.category == "Utilities"
                                        )
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter(
                                        (cmd) => cmd.category === "Utilities"
                                    )
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_funslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction?.user.username}`,
                            iconURL: interaction?.user.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Fun `[" +
                                    this.client.commands
                                        .filter((c) => c.category == "Fun")
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter((cmd) => cmd.category === "Fun")
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_imageslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction?.user.username}`,
                            iconURL: interaction?.user.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Image `[" +
                                    this.client.commands
                                        .filter((c) => c.category == "Image")
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter((cmd) => cmd.category === "Image")
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_giveawayslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction?.user.username}`,
                            iconURL: interaction?.user.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Giveaway `[" +
                                    this.client.commands
                                        .filter((c) => c.category == "Giveaways")
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter(
                                        (cmd) => cmd.category === "Giveaways"
                                    )
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction?.values[0] === "help_inviteslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction?.user.username}`,
                            iconURL: interaction?.user.displayAvatarURL(),
                        })
                        .addFields([
                            {
                                name:
                                    "Invites `[" +
                                    this.client.commands
                                        .filter((c) => c.category == "Invites")
                                        .size.toString() +
                                    "]`",
                                value: `${this.client.commands
                                    .filter(
                                        (cmd) => cmd.category === "Invites"
                                    )
                                    .map((cmd) => `\`${cmd.name}\``)
                                    .join(", ")}`,
                            },
                        ]);
                    interaction?.reply({ embeds: [embed], ephemeral: true });
                }
            }
        });
    }
};
