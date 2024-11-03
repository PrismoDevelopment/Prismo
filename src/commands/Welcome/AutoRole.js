const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "autorole",
            aliases: ["roleauto", "autoroles"],
            description: "Gives role to user when he joins the server",
            usage: ["autorole <add|remove> <bot|human> <role>"],
            category: "Welcome",
            userPerms: ["ManageGuild"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/RbrcDwg.png",
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
                                    name: "Humans",
                                    value: "human",
                                },
                                {
                                    name: "Bots",
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
                {
                    type: 1,
                    name: "clear",
                    description: "Clear All Roles From Autorole",
                }
            ],
        });
    }

    async run({ message, args }) {
        try {
            if (!args[0])
                return message?.reply({
                    embeds: [this.client.util.errorDelete(message, "You Must Specify An Option To Use This Command\n\n**Options:**\n\n**Add** - Add Role To Autorole\n**Remove** - Remove Role From Autorole\n**Show** - Show Roles In Autorole\n**Clear** - Clear All Roles From Autorole")],
                    ephemeral: true,
                });
            if (args[0].toLowerCase() === "add" || args[0].toLowerCase() === "set") {
                if (!args[1])
                    return message?.reply({
                        embeds: [this.client.util.errorDelete(message, "You Must Specify A Type To Add Role To Autorole\n\n**Types:**\n\n**Bot** - Add Role To Bot Autorole\n**Human** - Add Role To Human Autorole")],
                        ephemeral: true,
                    });
                if (args[1].toLowerCase() === "bot") {
                    const role =
                        message?.mentions.roles.first() ||
                        message?.guild.roles.cache.get(args[2]) ||
                        message?.guild.roles.cache.find(
                            (r) =>
                                r.name.toLowerCase() ==
                                args.slice(1).join(" ").toLowerCase()
                        );
                    if (!role)
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "You Must Mention A Valid Role")],
                            ephemeral: true,
                        });
                        const perms = await this.client.util.rolePerms(role);
                        if (perms)
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "You Can't Add This Role To Autorole As This Role Has Administrator Permissions")],
                            ephemeral: true,
                        });
                    if (
                        role.position >=
                        message?.guild.members.cache.get(this.client.user.id)
                            .roles.highest.position
                    )
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "You Can't Add This Role To Autorole As This Role Is Higher Than My Highest Role")],
                            ephemeral: true,
                        });
                    if(message.member.id !== message.guild.ownerId) {
                    if (role.position >= message?.member.roles.highest.position)
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "You Can't Add This Role To Autorole As This Role Is Higher Than Your Highest Role")],
                            ephemeral: true,
                        });
                    }
                    const data = await this.client.database.guildData.get(
                        message?.guild.id
                    );
                    if (data.autorole.botRoles.includes(role.id))
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "This Role Is Already Added To Bot Autorole")],
                            ephemeral: true,
                        });
                    if (data.autorole.botRoles.length > 2) {
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "You Can't Add More Than 3 Roles To Bot Autorole")],
                            ephemeral: true,
                        });
                    }
                    data.autorole.botRoles.push(role.id);
                    if (
                        data.autorole.botRoles.length > 0 ||
                        data.autorole.humanRoles.length > 0
                    )
                        data.autorole.enabled = true;
                    this.client.database.guildData.putAutorole(
                        message?.guild.id,
                        data.autorole
                    );
                    return message?.reply({
                        embeds: [this.client.util.doDeletesend(message, `Added ${role} To Bot Autorole`)],
                        ephemeral: true,
                    });
                } else if (args[1].toLowerCase() === "human") {
                    const role =
                        message?.mentions.roles.first() ||
                        message?.guild.roles.cache.get(args[2]) ||
                        message?.guild.roles.cache.find(
                            (r) =>
                                r.name.toLowerCase() ===
                                args.slice(1).join(" ").toLowerCase()
                        );
                    if (!role)
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "You Must Mention A Valid Role")],
                            ephemeral: true,
                        });
                        const perms = await this.client.util.rolePerms(role);
                        if (perms)
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "You Can't Add This Role To Autorole As This Role Has Administrator Permissions")],
                            ephemeral: true,
                        });
                    if (
                        role.position >=
                        message?.guild.members.cache.get(this.client.user.id)
                            .roles.highest.position
                    )
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "You Can't Add This Role To Autorole As This Role Is Higher Than My Highest Role")],
                            ephemeral: true,
                        });
                    if(message.member.id !== message.guild.ownerId) {
                    if (role.position >= message?.member.roles.highest.position)
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "You Can't Add This Role To Autorole As This Role Is Higher Than Your Highest Role")],
                            ephemeral: true,
                        });
                    }
                    const data = await this.client.database.guildData.get(
                        message?.guild.id
                    );
                    if (data.autorole.humanRoles.includes(role.id))
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "This Role Is Already Added To Human Autorole")],
                            ephemeral: true,
                        });
                    if (data.autorole.humanRoles.length > 2) {
                        return message?.reply({
                            embeds: [this.client.util.errorDelete(message, "You Can't Add More Than 3 Roles To Human Autorole")],
                            ephemeral: true,
                        });
                    }
                    data.autorole.humanRoles.push(role.id);
                    if (
                        data.autorole.botRoles.length > 0 ||
                        data.autorole.humanRoles.length > 0
                    )
                        data.autorole.enabled = true;
                    this.client.database.guildData.putAutorole(
                        message?.guild.id,
                        data.autorole
                    );
                    return message?.reply({
                        embeds: [this.client.util.doDeletesend(message, `Added ${role} To Human Autorole`)],
                        ephemeral: true,
                    });
                } else {
                    message?.reply({
                        embeds: [this.client.util.errorDelete(message, "You Must Specify Whether You Want To Add Role To Bot Autorole Or Human Autorole")],
                        ephemeral: true,
                    });
                }
            }
            if (args[0].toLowerCase() === "remove" || args[0].toLowerCase() === "delete") {
                const role =
                    message?.mentions.roles.first() ||
                    message?.guild.roles.cache.get(args[1]) ||
                    message?.guild.roles.cache.find(
                        (r) =>
                            r.name.toLowerCase() ==
                            args.slice(1).join(" ").toLowerCase()
                    );
                if (!role)
                    return message?.reply({
                        embeds: [this.client.util.errorDelete(message, "You Must Mention A Valid Role")],
                        ephemeral: true,
                    });
                const data = await this.client.database.guildData.get(
                    message?.guild.id
                );
                if (
                    !data.autorole.botRoles.includes(role.id) &&
                    !data.autorole.humanRoles.includes(role.id)
                )
                    return message?.reply({
                        embeds: [this.client.util.errorDelete(message, "This Role Is Not Added To Autorole")],
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
                    message?.guild.id,
                    data.autorole
                );
                return message?.reply({
                    embeds: [this.client.util.doDeletesend(message, `Removed ${role} From Autorole`)],
                    ephemeral: true,
                });
            }
            if (args[0].toLowerCase() === "show" || args[0].toLowerCase() === "list") {
                const data = await this.client.database.guildData.get(
                    message?.guild.id
                );
                const botRoles = data.autorole.botRoles
                    .map((r) => message?.guild.roles.cache.get(r))
                    .join(", ");
                const humanRoles = data.autorole.humanRoles
                    .map((r) => message?.guild.roles.cache.get(r))
                    .join(", ");
                const embed = this.client.util
                    .embed()
                    .setAuthor({
                        name: message?.guild.name,
                        iconURL: message?.guild.iconURL({ dynamic: true }),
                    })
                    .setDescription(
                        `**Autorole Bot Roles List:**\n${botRoles.length > 0
                            ? botRoles
                            : "No Roles In Autorole"
                        }\n\n**Autorole Human Roles List:**\n${humanRoles.length > 0
                            ? humanRoles
                            : "No Roles In Autorole"
                        }`
                    )
                    .setColor(this.client.PrimaryColor)
                    .setTimestamp();
                message?.reply({ embeds: [embed] });
            }
            if (args[0].toLowerCase() === "clear") {
                const data = await this.client.database.guildData.get(
                    message?.guild.id
                );
                data.autorole.botRoles = [];
                data.autorole.humanRoles = [];
                data.autorole.enabled = false;
                this.client.database.guildData.putAutorole(
                    message?.guild.id,
                    data.autorole
                );
                return message?.reply({
                    content: `${this.client.config.Client.emoji.tick}Cleared Autorole`,
                    ephemeral: true,
                });
            }
        } catch (e) {
            message?.reply({
                content: `An error occured: ${e.message}`,
                ephemeral: true,
            });
        }
    }
    async exec({ interaction }) {
        try {
            const args = interaction?.options.getSubcommand();
            if (args === "add") {
                const type = interaction?.options.getString("type");
                const role = interaction?.options.getRole("role");
                if (type === "bot") {
                    const perms = await this.client.util.rolePerms(role);
                    if (perms) 
                        return interaction?.reply({
                            content:
                                `${this.client.config.Client.emoji.cross}You Can't Add This Role To Autorole As This Role Has Dangerous Permissions`,
                            ephemeral: true,
                        });
                    if (
                        role.position >=
                        interaction?.guild.members.cache.get(this.client.user.id)
                            .roles.highest.position
                    )
                        return interaction?.reply({
                            content: `${this.client.config.Client.emoji.cross}You Can't Add This Role To Autorole As This Role Is Higher Than My Highest Role`,
                            ephemeral: true,
                        });
                    if(interaction?.member.id !== interaction?.guild.ownerId) {
                    if (
                        role.position >=
                        interaction?.member.roles.highest.position
                    )
                        return interaction?.reply({
                            content: `${this.client.config.Client.emoji.cross}You Can't Add This Role To Autorole As This Role Is Higher Than Your Highest Role`,
                            ephemeral: true,
                        });
                    }
                    const data = await this.client.database.guildData.get(
                        interaction?.guild.id
                    );
                    if (data.autorole.botRoles.includes(role.id))
                        return interaction?.reply({
                            content: `${this.client.config.Client.emoji.cross}This Role Is Already Added To Autorole`,
                            ephemeral: true,
                        });
                    if (data.autorole.botRoles.length > 2) {
                        return interaction?.reply({
                            content: `${this.client.config.Client.emoji.cross}You Can't Add More Than 3 Roles To Autorole`,
                            ephemeral: true,
                        });
                    }
                    data.autorole.botRoles.push(role.id);
                    if (
                        data.autorole.botRoles.length > 0 ||
                        data.autorole.humanRoles.length > 0
                    )
                        data.autorole.enabled = true;
                    this.client.database.guildData.putAutorole(
                        interaction?.guild.id,
                        data.autorole
                    );
                    return interaction?.reply({
                        content: `${this.client.config.Client.emoji.tick} Added ${role} To Autorole`,
                        ephemeral: true,
                    });
                } else if (type === "human") {
                    const perms = await this.client.util.rolePerms(role);
                    if (perms)
                        return interaction?.reply({
                            content: `${this.client.config.Client.emoji.cross}You Can't Add This Role To Autorole As This Role Has Dangerous Permissions`,
                            ephemeral: true,
                        });
                    if (
                        role.position >=
                        interaction?.guild.members.cache.get(this.client.user.id)
                            .roles.highest.position
                    )
                        return interaction?.reply({
                            content: `${this.client.config.Client.emoji.cross}You Can't Add This Role To Autorole As This Role Is Higher Than My Highest Role`,
                            ephemeral: true,
                        });
                    if(interaction?.member.id !== interaction?.guild.ownerId) {
                    if (
                        role.position >=
                        interaction?.member.roles.highest.position
                    )
                        return interaction?.reply({
                            content: `${this.client.config.Client.emoji.cross}You Can't Add This Role To Autorole As This Role Is Higher Than Your Highest Role`,
                            ephemeral: true,
                        });
                    }
                    const data = await this.client.database.guildData.get(
                        interaction?.guild.id
                    );
                    if (data.autorole.humanRoles.includes(role.id))
                        return interaction?.reply({
                            content: `${this.client.config.Client.emoji.cross}This Role Is Already Added To Human Autorole`,
                            ephemeral: true,
                        });
                    if (data.autorole.humanRoles.length > 2) {
                        return interaction?.reply({
                            content: `${this.client.config.Client.emoji.cross}You Can't Add More Than 3 Roles To Human Autorole`,
                            ephemeral: true,
                        });
                    }
                    data.autorole.humanRoles.push(role.id);
                    if (
                        data.autorole.botRoles.length > 0 ||
                        data.autorole.humanRoles.length > 0
                    )
                        data.autorole.enabled = true;
                    this.client.database.guildData.putAutorole(
                        interaction?.guild.id,
                        data.autorole
                    );
                    return interaction?.reply({
                        content: `${this.client.config.Client.emoji.tick} Added ${role} To Human Autorole`,
                        ephemeral: true,
                    });
                }
            }
            if (args === "remove") {
                const role = interaction?.options.getRole("role");
                const data = await this.client.database.guildData.get(
                    interaction?.guild.id
                );
                if (
                    !data.autorole.botRoles.includes(role.id) &&
                    !data.autorole.humanRoles.includes(role.id)
                )
                    return interaction?.reply({
                        content: `${this.client.config.Client.emoji.cross}This Role Is Not Added To Autorole`,
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
                    interaction?.guild.id,
                    data.autorole
                );
                return interaction?.reply({
                    content: `${this.client.config.Client.emoji.tick} Removed ${role} From Autorole`,
                    ephemeral: true,
                });
            }
            if (args === "show") {
                const data = await this.client.database.guildData.get(
                    interaction?.guild.id
                );
                const botRoles = data.autorole.botRoles
                    .map((r) => interaction?.guild.roles.cache.get(r))
                    .join(", ");
                const humanRoles = data.autorole.humanRoles
                    .map((r) => interaction?.guild.roles.cache.get(r))
                    .join(", ");
                const embed = this.client.util
                    .embed()
                    .setAuthor({
                        name: interaction?.guild.name,
                        iconURL: interaction?.guild.iconURL({ dynamic: true }),
                    })
                    .setDescription(
                        `**Autorole Bot Roles List:**\n${botRoles.length > 0
                            ? botRoles
                            : "No Roles In Autorole"
                        }\n\n**Autorole Human Roles List:**\n${humanRoles.length > 0
                            ? humanRoles
                            : "No Roles In Autorole"
                        }`
                    )
                    .setColor(this.client.PrimaryColor)
                    .setTimestamp();
                interaction?.reply({ embeds: [embed] });
            }
            if (args === "clear") {
                const data = await this.client.database.guildData.get(
                    interaction?.guild.id
                );
                data.autorole.botRoles = [];
                data.autorole.humanRoles = [];
                data.autorole.enabled = false;
                this.client.database.guildData.putAutorole(
                    interaction?.guild.id,
                    data.autorole
                );
                return interaction?.reply({
                    content: `${this.client.config.Client.emoji.tick} Cleared Autorole`,
                    ephemeral: true,
                });
            }
        } catch (e) {
            interaction?.reply({
                content: `${this.client.config.Client.emoji.cross} An Error Occured While Running This Command`,
                ephemeral: true,
            });
        }
    }
};
