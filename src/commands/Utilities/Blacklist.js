const Command = require("../../abstract/command");

module.exports = class Blacklistchannel extends Command {
    constructor(...args) {
        super(...args, {
            name: "blacklist",
            description: "Will avoid bot from that channel to run any command",
            category: "Utilities",
            ownerOnly: false,
            cooldown: 5,
            image: "https://i.imgur.com/SfzPs8i.png",
            usage: "blacklist <channel/command>",
            aliases: ["bl", "ignore"],
            userPerms: ["ManageChannels"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            options: [
                {
                    type: 1,
                    name: "channel",
                    description: "Blacklist/Unblacklist a channel",
                    options: [
                        {
                            type: 3,
                            name: "action",
                            description: "The action to perform",
                            choices: [
                                {
                                    name: "list",
                                    value: "list",
                                },
                                {
                                    name: "clear",
                                    value: "clear",
                                },
                                {
                                    name: "add",
                                    value: "add",
                                },
                                {
                                    name: "remove",
                                    value: "remove",
                                },
                            ],
                            required: true,
                        },
                        {
                            type: 7,
                            name: "channel",
                            description: "The channel to blacklist",
                            required: false,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "command",
                    description: "Blacklist/Unblacklist a command",
                    options: [
                        {
                            type: 3,
                            name: "action",
                            description: "The action to perform",
                            choices: [
                                {
                                    name: "list",
                                    value: "list",
                                },
                                {
                                    name: "clear",
                                    value: "clear",
                                },
                                {
                                    name: "add",
                                    value: "add",
                                },
                                {
                                    name: "remove",
                                    value: "remove",
                                },
                            ],
                            required: true,
                        },
                        {
                            type: 3,
                            name: "command",
                            description: "The command to blacklist",
                            required: false,
                        },
                    ],
                },
            ],
        });
    }

    async run({ message, args }) {
        let data = await this.client.database.guildData.get(message?.guild.id);
        if (!args[0]) return message?.reply({ embeds: [this.client.util.errorDelete(message, "Please specify a subcommand (channel/command).\n\n**Example:** `.blacklist channel add #channel`\n**Example:** `.blacklist command add help`")] });
        if (args[0] === "channel") {
            if (!args[1]) return message?.reply({ embeds: [this.client.util.errorDelete(message, "Please specify a subcommand (list/clear/add/remove).\n\n\`list\` - List all blacklisted channels\n\`clear\` - Clear the blacklist\n\`add\` - Add a channel to the blacklist\n\`remove\` - Remove a channel from the blacklist\n\n**Example:** `.blacklist channel add #channel`")] });
            if (args[1] === "list") {
                let list = data.disabledChannels.map((c) => `<#${c}>`).join(", ");
                if (!list)
                    return message?.reply({ embeds: [this.client.util.errorDelete(message, "There are no blacklisted channels.")] });
                let embed = this.client.util
                    .embed()
                    .setTitle("Blacklisted Channels")
                    .setDescription(`${list}`)
                    .setColor(this.client.config.Client.PrimaryColor);
                return message?.reply({
                    content: `The following channels are on the blacklist ${this.client.config.Client.emoji.down}`,
                    embeds: [embed],
                });
            }
            if (args[1] === "clear") {
                data.disabledChannels = [];
                await this.client.database.guildData.set(
                    message?.guild.id,
                    data
                );
                return message?.reply({
                    embeds: [this.client.util.doDeletesend(message, "I have cleared the blacklist.")],
                });
            }
            if (args[1] === "add") {
                let channel = message?.mentions.channels.first() || message?.guild.channels.cache.get(args[2]);
                if (!channel) return message?.reply({ embeds: [this.client.util.errorDelete(message, "I couldn't find that channel.")] });
                if (data.disabledChannels.includes(channel.id)) {
                    data.disabledChannels = data.disabledChannels.filter((c) => c !== channel.id);
                    await this.client.database.guildData.set(message?.guild.id, data);
                    return message?.reply({ embeds: [this.client.util.doDeletesend(message, `I have removed ${channel} from the blacklist.`)] });
                } else {
                    data.disabledChannels.push(channel.id);
                    await this.client.database.guildData.set(message?.guild.id, data);
                    return message?.reply({ embeds: [this.client.util.doDeletesend(message, `I have added ${channel} to the blacklist.`)] });
                }
            }
            if (args[1] === "remove") {
                let channel = message?.mentions.channels.first() || message?.guild.channels.cache.get(args[2]);
                if (!channel) return message?.reply({ embeds: [this.client.util.errorDelete(message, "I couldn't find that channel.")] });
                if (data.disabledChannels.includes(channel.id)) {
                    data.disabledChannels = data.disabledChannels.filter((c) => c !== channel.id);
                    await this.client.database.guildData.set(message?.guild.id, data);
                    return message?.reply({ embeds: [this.client.util.doDeletesend(message, `I have removed ${channel} from the blacklist.`)] });
                } else {
                    return message?.reply({ embeds: [this.client.util.errorDelete(message, "That channel isn't on the blacklist.")] });
                }
            }
        }
        if (args[0] === "command") {
            if (!args[1]) return message?.reply({ embeds: [this.client.util.errorDelete(message, "Please specify a subcommand (list/clear/add/remove).\n\n\`list\` - List all blacklisted commands\n\`clear\` - Clear the blacklist\n\`add\` - Add a command to the blacklist\n\`remove\` - Remove a command from the blacklist\n\n**Example:** `.blacklist command add help`")] });
            if (args[1] === "list") {
                let list = data.disabledCommands.map((c) => `\`${c}\``).join(", ");
                if (!list)
                    return message?.reply({
                        embeds: [this.client.util.errorDelete(message, "There are no blacklisted commands.")],
                    });
                let embed = this.client.util
                    .embed()
                    .setTitle("Blacklisted Commands")
                    .setDescription(`${list}`)
                    .setColor(this.client.config.Client.PrimaryColor);
                return message?.reply({
                    content: `The following commands are blacklisted ${this.client.config.Client.emoji.down}`,
                    embeds: [embed],
                });
            }
            if (args[1] === "clear") {
                data.disabledCommands = [];
                await this.client.database.guildData.set(
                    message?.guild.id,
                    data
                );
                return message?.reply({
                    embeds: [this.client.util.doDeletesend(message, "I have cleared the blacklist.")],
                });
            }
            if (args[1] === "add") {
                let command = args[2];
                if (!command) return message?.reply({ embeds: [this.client.util.errorDelete(message, "Please specify a command to blacklist.")] });
                if (data.disabledCommands.includes(command)) {
                    data.disabledCommands = data.disabledCommands.filter((c) => c !== command);
                    await this.client.database.guildData.set(message?.guild.id, data);
                    return message?.reply({ embeds: [this.client.util.doDeletesend(message, `I have removed \`${command}\` from the blacklist.`)] });
                } else {
                    data.disabledCommands.push(command);
                    await this.client.database.guildData.set(message?.guild.id, data);
                    return message?.reply({ embeds: [this.client.util.doDeletesend(message, `I have added \`${command}\` to the blacklist.`)] });
                }
            }
            if (args[1] === "remove") {
                let command = args[2];
                if (!command) return message?.reply({ embeds: [this.client.util.errorDelete(message, "Please specify a command to blacklist.")] });
                if (data.disabledCommands.includes(command)) {
                    data.disabledCommands = data.disabledCommands.filter((c) => c !== command);
                    await this.client.database.guildData.set(message?.guild.id, data);
                    return message?.reply({ embeds: [this.client.util.doDeletesend(message, `I have removed \`${command}\` from the blacklist.`)] });
                } else {
                    return message?.reply({ embeds: [this.client.util.errorDelete(message, "That command isn't on the blacklist.")] });
                }
            }
        }

    }

    async exec({ interaction }) {
        let data = await this.client.database.guildData.get(
            interaction?.guild.id
        );
        let subcommand = interaction?.options.getSubcommand();
        if (subcommand === "channel") {
            let action = interaction?.options.getString("action");
            if (action === "list") {
                let list = data.disabledChannels.map((c) => `<#${c}>`).join(", ");
                if (!list)
                    return interaction?.reply({
                        content: "There are no blacklisted channels.", ephemeral: true
                    });
                let embed = this.client.util
                    .embed()
                    .setTitle("Blacklisted Channels")
                    .setDescription(`${list}`)
                    .setColor(this.client.config.Client.PrimaryColor);
                return interaction?.reply({
                    content: `The following channels are blacklisted ${this.client.config.Client.emoji.down}`,
                    embeds: [embed],
                });
            }
            if (action === "clear") {
                data.disabledChannels = [];
                await this.client.database.guildData.set(
                    interaction?.guild.id,
                    data
                );
                return interaction?.reply({
                    content: `I have cleared the blacklist.`,
                });
            }
            if (action === "add") {
                let channel = interaction?.options.getChannel("channel");
                if (!channel) return interaction?.reply({ content: "please specify a channel to blacklist.", ephemeral: true });
                if (data.disabledChannels.includes(channel.id)) {
                    data.disabledChannels = data.disabledChannels.filter((c) => c !== channel.id);
                    await this.client.database.guildData.set(interaction?.guild.id, data);
                    return interaction?.reply({ content: `I have removed ${channel} from the blacklist.`, ephemeral: true });
                } else {
                    data.disabledChannels.push(channel.id);
                    await this.client.database.guildData.set(interaction?.guild.id, data);
                    return interaction?.reply({ content: `I have added ${channel} to the blacklist.`, ephemeral: true });
                }
            }
            if (action === "remove") {
                let channel = interaction?.options.getChannel("channel");
                if (!channel) return interaction?.reply({ content: "please specify a channel to blacklist.", ephemeral: true });
                if (data.disabledChannels.includes(channel.id)) {
                    data.disabledChannels = data.disabledChannels.filter((c) => c !== channel.id);
                    await this.client.database.guildData.set(interaction?.guild.id, data);
                    return interaction?.reply({ content: `I have removed ${channel} from the blacklist.`, ephemeral: true });
                } else {
                    return interaction?.reply({ content: "That channel isn't blacklisted.", ephemeral: true });
                }
            }
        }
        if (subcommand === "command") {
            let action = interaction?.options.getString("action");
            if (action === "list") {
                let list = data.disabledCommands.map((c) => `\`${c}\``).join(", ");
                if (!list)
                    return interaction?.reply({
                        content: "There are no blacklisted commands.", ephemeral: true
                    });
                let embed = this.client.util
                    .embed()
                    .setTitle("Blacklisted Commands")
                    .setDescription(`${list}`)
                    .setColor(this.client.config.Client.PrimaryColor);
                return interaction?.reply({
                    content: `The following commands are blacklisted ${this.client.config.Client.emoji.down}`,
                    embeds: [embed],
                });
            }
            if (action === "clear") {
                data.disabledCommands = [];
                await this.client.database.guildData.set(
                    interaction?.guild.id,
                    data
                );
                return interaction?.reply({
                    content: `I have cleared the blacklist.`, ephemeral: true
                });
            }
            if (action === "add") {
                let command = interaction?.options.getString("command");
                if (!command) return interaction?.reply({ content: "Please specify a command to blacklist.", ephemeral: true });
                if (data.disabledCommands.includes(command)) {
                    data.disabledCommands = data.disabledCommands.filter((c) => c !== command);
                    await this.client.database.guildData.set(interaction?.guild.id, data);
                    return interaction?.reply({ content: `I have removed \`${command}\` from the blacklist.`, ephemeral: true });
                } else {
                    data.disabledCommands.push(command);
                    await this.client.database.guildData.set(interaction?.guild.id, data);
                    return interaction?.reply({ content: `I have added \`${command}\` to the blacklist.`, ephemeral: true });
                }
            }
            if (action === "remove") {
                let command = interaction?.options.getString("command");
                if (!command) return interaction?.reply({ content: "Please specify a command to blacklist.", ephemeral: true });
                if (data.disabledCommands.includes(command)) {
                    data.disabledCommands = data.disabledCommands.filter((c) => c !== command);
                    await this.client.database.guildData.set(interaction?.guild.id, data);
                    return interaction?.reply({ content: `I have removed \`${command}\` from the blacklist.`, ephemeral: true });
                } else {
                    return interaction?.reply({ content: "That command isn't blacklisted.", ephemeral: true });
                }
            }
        }
    }
};