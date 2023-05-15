const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "autorole",
            aliases: ["roleauto"],
            description: "Add/Remove/Show Roles To Autorole",
            usage: ["autorole"],
            category: "Welcome",
            userPerms: ["ManageGuild"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            options: [
                {
                    type: 1,
                    name: "add",
                    description: "Add Role To Autorole",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "Role To Add",
                            required: true,
                        },
                        {
                            type: 3,
                            name: "type",
                            description: "Type Of Role",
                            choices: [
                                {
                                    name: "Human",
                                    value: "human",
                                },
                                {
                                    name: "Bot",
                                    value: "bot",
                                },
                            ],
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "remove",
                    description: "Remove Role From Autorole",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "Role To Remove",
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "show",
                    description: "Show Roles In Autorole",
                },
            ],
        });
    }

    async run({ message, args }) {
        try {
            if (!args[0])
                return message.reply({
                    content: "You Must Choose: `add`, `remove`, `show`",
                    ephemeral: true,
                });
            if (args[0].toLowerCase() === "add") {
                if (!args[1])
                    return message.reply({
                        content: "You Must Specify **Bot** Or **Human**!",
                        ephemeral: true,
                    });
                if (args[1].toLowerCase() === "bot") {
                    const role =
                        message.mentions.roles.first() ||
                        message.guild.roles.cache.get(args[1]) ||
                        message.guild.roles.cache.find(
                            (r) =>
                                r.name.toLowerCase() ===
                                args.slice(1).join(" ").toLowerCase()
                        );
                    if (!role)
                        return message.reply({
                            content: "You Must Mention A Valid Role",
                            ephemeral: true,
                        });
                    if (
                        role.permissions.has([
                            "Administrator",
                            "ManageGuild",
                            "ManageRoles",
                            "ManageChannels",
                            "ManageMessages",
                            "ManageNicknames",
                            "ManageEmojisAndStickers",
                            "ManageWebhooks",
                            "ManageThreads",
                        ])
                    )
                        return message.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Has Dangerous Permissions",
                            ephemeral: true,
                        });
                    if (
                        role.position >=
                        message.guild.members.cache.get(this.client.user.id)
                            .roles.highest.position
                    )
                        return message.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Is Higher Than My Highest Role",
                            ephemeral: true,
                        });
                    if (role.position >= message.member.roles.highest.position)
                        return message.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Is Higher Than Your Highest Role",
                            ephemeral: true,
                        });
                    const data = await this.client.database.guildData.get(
                        message.guild.id
                    );
                    if (data.autorole.botRoles.includes(role.id))
                        return message.reply({
                            content: "This Role Is Already In Bot Autorole",
                            ephemeral: true,
                        });
                    data.autorole.botRoles.push(role.id);
                    if (
                        data.autorole.botRoles.length > 0 ||
                        data.autorole.humanRoles.length > 0
                    )
                        data.autorole.enabled = true;
                    this.client.database.guildData.putAutorole(
                        message.guild.id,
                        data.autorole
                    );
                    return message.reply({
                        content: `Added **${role.name}** To Bot Autorole`,
                        ephemeral: true,
                    });
                } else if (args[1].toLowerCase() === "human") {
                    const role =
                        message.mentions.roles.first() ||
                        message.guild.roles.cache.get(args[1]) ||
                        message.guild.roles.cache.find(
                            (r) =>
                                r.name.toLowerCase() ===
                                args.slice(1).join(" ").toLowerCase()
                        );
                    if (!role)
                        return message.reply({
                            content: "You Must Mention A Valid Role",
                            ephemeral: true,
                        });
                    if (
                        role.permissions.has([
                            "Administrator",
                            "ManageGuild",
                            "ManageRoles",
                            "ManageChannels",
                            "ManageMessages",
                            "ManageNicknames",
                            "ManageEmojisAndStickers",
                            "ManageWebhooks",
                            "ManageThreads",
                        ])
                    )
                        return message.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Has Dangerous Permissions",
                            ephemeral: true,
                        });
                    if (
                        role.position >=
                        message.guild.members.cache.get(this.client.user.id)
                            .roles.highest.position
                    )
                        return message.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Is Higher Than My Highest Role",
                            ephemeral: true,
                        });
                    if (role.position >= message.member.roles.highest.position)
                        return message.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Is Higher Than Your Highest Role",
                            ephemeral: true,
                        });
                    const data = await this.client.database.guildData.get(
                        message.guild.id
                    );
                    if (data.autorole.humanRoles.includes(role.id))
                        return message.reply({
                            content: "This Role Is Already In Human Autorole",
                            ephemeral: true,
                        });
                    data.autorole.humanRoles.push(role.id);
                    if (
                        data.autorole.botRoles.length > 0 ||
                        data.autorole.humanRoles.length > 0
                    )
                        data.autorole.enabled = true;
                    this.client.database.guildData.putAutorole(
                        message.guild.id,
                        data.autorole
                    );
                    return message.reply({
                        content: `Added **${role.name}** To Human Autorole`,
                        ephemeral: true,
                    });
                } else {
                    message.reply({
                        content: "You Must Specify **Bot** Or **Human**!",
                        ephemeral: true,
                    });
                }
            }
            if (args[0].toLowerCase() === "remove") {
                const role =
                    message.mentions.roles.first() ||
                    message.guild.roles.cache.get(args[1]) ||
                    message.guild.roles.cache.find(
                        (r) =>
                            r.name.toLowerCase() ===
                            args.slice(1).join(" ").toLowerCase()
                    );
                if (!role)
                    return message.reply({
                        content: "You Must Mention A Valid Role",
                        ephemeral: true,
                    });
                const data = await this.client.database.guildData.get(
                    message.guild.id
                );
                if (
                    !data.autorole.botRoles.includes(role.id) &&
                    !data.autorole.humanRoles.includes(role.id)
                )
                    return message.reply({
                        content: "This Role Is Not In Autorole",
                        ephemeral: true,
                    });
                data.autorole.botRoles = data.autorole.botRoles.filter(
                    (r) => r !== role.id
                );
                data.autorole.humanRoles = data.autorole.humanRoles.filter(
                    (r) => r !== role.id
                );
                if (
                    data.autorole.botRoles.length == 0 ||
                    data.autorole.humanRoles.length == 0
                )
                    data.autorole.enabled = false;
                this.client.database.guildData.putAutorole(
                    message.guild.id,
                    data.autorole
                );
                return message.reply({
                    content: `Removed **${role.name}** From Autorole`,
                    ephemeral: true,
                });
            }
            if (args[0].toLowerCase() === "show") {
                const data = await this.client.database.guildData.get(
                    message.guild.id
                );
                const botRoles = data.autorole.botRoles
                    .map((r) => message.guild.roles.cache.get(r))
                    .join(", ");
                const humanRoles = data.autorole.humanRoles
                    .map((r) => message.guild.roles.cache.get(r))
                    .join(", ");
                const embed = this.client.util
                    .embed()
                    .setAuthor({
                        name: message.guild.name,
                        iconURL: message.guild.iconURL({ dynamic: true }),
                    })
                    .setDescription(
                        `**Autorole Bot Roles List:**\n${
                            botRoles.length > 0
                                ? botRoles
                                : "No Roles In Autorole"
                        }\n\n**Autorole Human Roles List:**\n${
                            humanRoles.length > 0
                                ? humanRoles
                                : "No Roles In Autorole"
                        }`
                    )
                    .setColor("#00FFFF")
                    .setTimestamp();
                message.reply({ embeds: [embed] });
            }
        } catch (e) {
            console.error(e);
            message.reply({
                content: `An error occured: ${e.message}`,
                ephemeral: true,
            });
        }
    }
    async exec({ interaction }) {
        try {
            const args = interaction.options.getSubcommand();
            if (args === "add") {
                const type = interaction.options.getString("type");
                const role = interaction.options.getRole("role");
                if (type === "bot") {
                    if (
                        role.permissions.has([
                            "Administrator",
                            "ManageGuild",
                            "ManageRoles",
                            "ManageChannels",
                            "ManageMessages",
                            "ManageNicknames",
                            "ManageEmojisAndStickers",
                            "ManageWebhooks",
                            "ManageThreads",
                        ])
                    )
                        return interaction.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Has Dangerous Permissions",
                            ephemeral: true,
                        });
                    if (
                        role.position >=
                        interaction.guild.members.cache.get(this.client.user.id)
                            .roles.highest.position
                    )
                        return interaction.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Is Higher Than My Highest Role",
                            ephemeral: true,
                        });
                    if (
                        role.position >=
                        interaction.member.roles.highest.position
                    )
                        return interaction.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Is Higher Than Your Highest Role",
                            ephemeral: true,
                        });
                    const data = await this.client.database.guildData.get(
                        interaction.guild.id
                    );
                    if (data.autorole.botRoles.includes(role.id))
                        return interaction.reply({
                            content: "This Role Is Already In Bot Autorole",
                            ephemeral: true,
                        });
                    data.autorole.botRoles.push(role.id);
                    if (
                        data.autorole.botRoles.length > 0 ||
                        data.autorole.humanRoles.length > 0
                    )
                        data.autorole.enabled = true;
                    this.client.database.guildData.putAutorole(
                        interaction.guild.id,
                        data.autorole
                    );
                    return interaction.reply({
                        content: `Added **${role.name}** To Bot Autorole`,
                        ephemeral: true,
                    });
                } else if (type === "human") {
                    if (
                        role.permissions.has([
                            "Administrator",
                            "ManageGuild",
                            "ManageRoles",
                            "ManageChannels",
                            "ManageMessages",
                            "ManageNicknames",
                            "ManageEmojisAndStickers",
                            "ManageWebhooks",
                            "ManageThreads",
                        ])
                    )
                        return interaction.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Has Dangerous Permissions",
                            ephemeral: true,
                        });
                    if (
                        role.position >=
                        interaction.guild.members.cache.get(this.client.user.id)
                            .roles.highest.position
                    )
                        return interaction.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Is Higher Than My Highest Role",
                            ephemeral: true,
                        });
                    if (
                        role.position >=
                        interaction.member.roles.highest.position
                    )
                        return interaction.reply({
                            content:
                                "You Can't Add This Role To Autorole As This Role Is Higher Than Your Highest Role",
                            ephemeral: true,
                        });
                    const data = await this.client.database.guildData.get(
                        interaction.guild.id
                    );
                    if (data.autorole.humanRoles.includes(role.id))
                        return interaction.reply({
                            content: "This Role Is Already In Human Autorole",
                            ephemeral: true,
                        });
                    data.autorole.humanRoles.push(role.id);
                    if (
                        data.autorole.botRoles.length > 0 ||
                        data.autorole.humanRoles.length > 0
                    )
                        data.autorole.enabled = true;
                    this.client.database.guildData.putAutorole(
                        interaction.guild.id,
                        data.autorole
                    );
                    return interaction.reply({
                        content: `Added **${role.name}** To Human Autorole`,
                        ephemeral: true,
                    });
                }
            }
            if (args === "remove") {
                const role = interaction.options.getRole("role");
                const data = await this.client.database.guildData.get(
                    interaction.guild.id
                );
                if (
                    !data.autorole.botRoles.includes(role.id) &&
                    !data.autorole.humanRoles.includes(role.id)
                )
                    return interaction.reply({
                        content: "This Role Is Not In Autorole",
                        ephemeral: true,
                    });
                data.autorole.botRoles = data.autorole.botRoles.filter(
                    (r) => r !== role.id
                );
                data.autorole.humanRoles = data.autorole.humanRoles.filter(
                    (r) => r !== role.id
                );
                if (
                    data.autorole.botRoles.length == 0 ||
                    data.autorole.humanRoles.length == 0
                )
                    data.autorole.enabled = false;
                this.client.database.guildData.putAutorole(
                    interaction.guild.id,
                    data.autorole
                );
                return interaction.reply({
                    content: `Removed **${role.name}** From Autorole`,
                    ephemeral: true,
                });
            }
            if (args === "show") {
                const data = await this.client.database.guildData.get(
                    interaction.guild.id
                );
                const botRoles = data.autorole.botRoles
                    .map((r) => interaction.guild.roles.cache.get(r))
                    .join(", ");
                const humanRoles = data.autorole.humanRoles
                    .map((r) => interaction.guild.roles.cache.get(r))
                    .join(", ");
                const embed = this.client.util
                    .embed()
                    .setAuthor({
                        name: interaction.guild.name,
                        iconURL: interaction.guild.iconURL({ dynamic: true }),
                    })
                    .setDescription(
                        `**Autorole Bot Roles List:**\n${
                            botRoles.length > 0
                                ? botRoles
                                : "No Roles In Autorole"
                        }\n\n**Autorole Human Roles List:**\n${
                            humanRoles.length > 0
                                ? humanRoles
                                : "No Roles In Autorole"
                        }`
                    )
                    .setColor("#00FFFF")
                    .setTimestamp();
                interaction.reply({ embeds: [embed] });
            }
        } catch (e) {
            console.error(e);
            interaction.reply({
                content: `An error occured: ${e.message}`,
                ephemeral: true,
            });
        }
    }
};
