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
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }

    async run({ message, args }) {
        message.guild.config = await this.client.database.guildData.get(
            message.guild.id
        );
        const embed = this.client.util
            .embed()
            .setThumbnail(this.client.user.displayAvatarURL())
            .setColor(this.client.config.Client.PrimaryColor)
            .setAuthor({
                name: this.client.user.username,
                iconURL: this.client.user.displayAvatarURL(),
            })
            .setFooter({
                text: `Requested by ${message.author.username}`,
                iconURL: message.author.displayAvatarURL(),
            })
            .setDescription(
                `${this.client.user.username
                } Is A Multi-Purpose Discord Bot With Many Features. You Can Use The ${"`" + message.guild.config.prefix
                }help [Command name]${"`"} To Get Information About A Command.`
            )
            .addFields([
                {
                    name: "Links",
                    value: `**[Prismo](${this.client.config.Url.InviteURL})**\n**[Support Server](${this.client.config.Url.SupportURL})**`,
                },
                {
                    name: "Commands Category",
                    value: `${this.client.config.Client.Emoji.Welcome} **Welcome**\n${this.client.config.Client.Emoji.Moderation} **Moderation**\n${this.client.config.Client.Emoji.Utility} **Utility**\n${this.client.config.Client.Emoji.Fun} **Fun**\n${this.client.config.Client.Emoji.Image} **Image**`,
                },
            ]);
        if (!args[0]) {
            message.reply({
                embeds: [embed],
                components: [
                    this.client.util.row().setComponents(
                        this.client.util
                            .menu()
                            .setCustomId("select")
                            .setPlaceholder("Select A Category")
                            .addOptions([
                                {
                                    label: "Welcome",
                                    value: "help_welcome",
                                    emoji: this.client.config.Client.Emoji
                                        .Welcome,
                                },
                                {
                                    label: "Moderation",
                                    value: "help_moderation",
                                    emoji: this.client.config.Client.Emoji
                                        .Moderation,
                                },
                                {
                                    label: "Utility",
                                    value: "help_utility",
                                    emoji: this.client.config.Client.Emoji
                                        .Utility,
                                },
                                {
                                    label: "Fun",
                                    value: "help_fun",
                                    emoji: this.client.config.Client.Emoji.Fun,
                                },
                                {
                                    label: "Image",
                                    value: "help_image",
                                    emoji: this.client.config.Client.Emoji.Image,
                                },
                            ])
                    ),
                ],
            });
        }
        const filter = (i) => i.user.id === message.member.user.id;
        const collector = message.channel.createMessageComponentCollector({
            time: 900000,
        });
        collector.on("collect", async (interaction) => {
            if (interaction.customId === "select") {
                if (interaction.values[0] === "help_welcome") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message.author.username}`,
                            iconURL: message.author.displayAvatarURL(),
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
                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction.values[0] === "help_moderation") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message.author.username}`,
                            iconURL: message.author.displayAvatarURL(),
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
                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction.values[0] === "help_utility") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message.author.username}`,
                            iconURL: message.author.displayAvatarURL(),
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
                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction.values[0] === "help_fun") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message.author.username}`,
                            iconURL: message.author.displayAvatarURL(),
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
                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction.values[0] === "help_image") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${message.author.username}`,
                            iconURL: message.author.displayAvatarURL(),
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
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }
        });
        if (!args[0]) return;
        let command =
            this.client.commands.get(args[0].toLowerCase()) ||
            this.client.commands.get(
                this.client.aliases.get(args[0].toLowerCase())
            );

        if (!command || command.category.includes("Owners")) {
            return this.client.util
                .doDeletesend(
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
            .setThumbnail(this.client.user.displayAvatarURL())
            .setColor(this.client.config.Client.PrimaryColor)
            .setAuthor({
                name: `${command.category}`,
                iconURL: this.client.user.displayAvatarURL({ format: "png" }),
                url: this.client.config.Url.SupportURL,
            })
            .setDescription(
                command.description
                    ? `> ${command.description}`
                    : "> No Description"
            )
            .setFooter({
                text: `Requested by ${message.author.username}`,
                iconURL: message.author.displayAvatarURL(),
            })
            .addFields([
                {
                    name: "Name",
                    value: `\`${command.name}\``,
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
                    name: "Usage",
                    value: `\`${command.usage}\``,
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
        await message.reply({ embeds: [Embededinfo] }).catch((e) => {
            return;
        });
    }

    async exec({ interaction, args }) {
        interaction.guild.config = await this.client.database.guildData.get(
            interaction.guild.id
        );
        const embed = this.client.util
            .embed()
            .setThumbnail(this.client.user.displayAvatarURL())
            .setColor(this.client.config.Client.PrimaryColor)
            .setAuthor({
                name: this.client.user.username,
                iconURL: this.client.user.displayAvatarURL(),
            })
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
                `${this.client.user.username
                } Is A Multi-Purpose Discord Bot With Many Features. You Can Use The ${"`" + interaction.guild.config.prefix
                }help [Command name]${"`"} To Get Information About A Command.`
            )
            .addFields([
                {
                    name: "Links",
                    value: `**[Prismo](${this.client.config.Url.InviteURL})**\n**[Support Server](${this.client.config.Url.SupportURL})**`,
                },
                {
                    name: "Commands Category",
                    value: `${this.client.config.Client.Emoji.Welcome} **Welcome**\n${this.client.config.Client.Emoji.Moderation} **Moderation**\n${this.client.config.Client.Emoji.Utility} **Utility**\n${this.client.config.Client.Emoji.Fun} **Fun**\n${this.client.config.Client.Emoji.Image} **Image**`,
                },
            ]);
        interaction.reply({
            embeds: [embed],
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
                                emoji: this.client.config.Client.Emoji.Welcome,
                            },
                            {
                                label: "Moderation",
                                value: "help_moderationslash",
                                emoji: this.client.config.Client.Emoji
                                    .Moderation,
                            },
                            {
                                label: "Utility",
                                value: "help_utilityslash",
                                emoji: this.client.config.Client.Emoji.Utility,
                            },
                            {
                                label: "Fun",
                                value: "help_funslash",
                                emoji: this.client.config.Client.Emoji.Fun,
                            },
                            {
                                label: "Image",
                                value: "help_imageslash",
                                emoji: this.client.config.Client.Emoji.Image,
                            },
                        ])
                ),
            ],
        });
        const filter = (i) => i.user.id === interaction.member.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            time: 900000,
        });
        /**
         * @param {
         */
        collector.on("collect", async (interaction) => {
            if (interaction.customId === "select_xd") {
                if (interaction.values[0] === "help_welcomeslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL(),
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
                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction.values[0] === "help_moderationslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL(),
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
                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction.values[0] === "help_utilityslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
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
                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction.values[0] === "help_funslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL(),
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
                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else if (interaction.values[0] === "help_imageslash") {
                    const embed = this.client.util
                        .embed()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor(this.client.config.Client.PrimaryColor)
                        .setAuthor({
                            name: this.client.user.username,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL(),
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
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }
        });
    }
};
