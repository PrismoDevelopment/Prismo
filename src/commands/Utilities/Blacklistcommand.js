const Command = require("../../abstract/command");

module.exports = class Blacklistchannel extends Command {
    constructor(...args) {
        super(...args, {
            name: "blacklistcommand",
            aliases: ["blacklistcmd", "blcmd", "blcommand", "ignorecommand", "ignorecmd", "ignore"],
            description: "Blacklist a channel from using commands",
            usage: [
                "blacklistcommand <command>",
                "blacklistcommand list",
                "blacklistcommand clear",
            ],
            category: "Utilities",
            userPerms: [
                "SendMessages",
                "EmbedLinks",
                "ReadMessageHistory",
                "ManageChannels",
                "ManageGuild",
            ],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: "type",
                    description:
                        "Do you want to list, clear, or blacklist a channel?",
                    required: false,
                    choices: [
                        {
                            name: "list",
                            value: "list",
                        },
                        {
                            name: "clear",
                            value: "clear",
                        },
                    ],
                },
                {
                    type: 3,
                    name: "command",
                    description: "The command to blacklist.",
                    required: false,
                },
            ],
        });
    }
    async run({ message, args }) {
        let data = await this.client.database.guildData.get(message.guild.id);
        if (args[0] == "list" || args[0] == "show") {
            let list = data.disabledCommands.map((c) => `\`${c}\``).join(", ");
            if (!list)
                return message.channel.send({
                    content: "There are no blacklisted Commands.",
                });
            let embed = this.client.util
                .embed()
                .setTitle("Blacklisted Commands")
                .setDescription(`${list}`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message.channel.send({
                content: `The following channels are blacklisted ${this.client.config.Client.Emoji.Down}`,
                embeds: [embed],
            });
        }
        if (args[0] == "clear") {
            data.disabledCommands = [];
            await this.client.database.guildData.set(message.guild.id, data);
            return message.channel.send({
                content: `I have cleared the blacklist.`,
            });
        }
        let command = args[0]?.toLowerCase();
        if (!command)
            return message.channel.send({
                content: "Please provide a command to blacklist.",
            });
        let iscmdvalid =
            this.client.commands.get(command) ||
            this.client.commands.get(this.client.aliases.get(command));
        if (!iscmdvalid)
            return message.channel.send({
                content: "I couldn't find that command.",
            });
        if (data.disabledCommands.includes(command)) {
            data.disabledCommands = data.disabledCommands.filter(
                (c) => c !== command
            );
            await this.client.database.guildData.set(message.guild.id, data);
            return message.channel.send({
                content: `I have removed \`${command}\` from the blacklist.`,
            });
        } else {
            data.disabledCommands.push(command);
            await this.client.database.guildData.set(message.guild.id, data);
            return message.channel.send({
                content: `I have added \`${command}\` to the blacklist.`,
            });
        }
    }

    async exec({ interaction }) {
        let data = await this.client.database.guildData.get(
            interaction.guild.id
        );
        if (interaction.options.getString("type") == "list") {
            let list = data.disabledCommands.map((c) => `\`${c}\``).join(", ");
            if (!list)
                return interaction.reply({
                    content: "There are no blacklisted Commands.",
                });
            let embed = this.client.util
                .embed()
                .setTitle("Blacklisted Commands")
                .setDescription(`${list}`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction.reply({
                content: `The following channels are blacklisted ${this.client.config.Client.Emoji.Down}`,
                embeds: [embed],
            });
        }
        if (interaction.options.getString("type") == "clear") {
            data.disabledCommands = [];
            await this.client.database.guildData.set(
                interaction.guild.id,
                data
            );
            return interaction.reply({
                content: `I have cleared the blacklist.`,
            });
        }
        let command = interaction.options.getString("command")?.toLowerCase();
        if (!command)
            return interaction.reply({
                content: "Please provide a command to blacklist.",
            });
        let iscmdvalid =
            this.client.commands.get(command) ||
            this.client.commands.get(this.client.aliases.get(command));
        if (!iscmdvalid)
            return interaction.reply({
                content: "I couldn't find that command.",
            });
        if (data.disabledCommands.includes(command)) {
            data.disabledCommands = data.disabledCommands.filter(
                (c) => c !== command
            );
            await this.client.database.guildData.set(
                interaction.guild.id,
                data
            );
            return interaction.reply({
                content: `I have removed \`${command}\` from the blacklist.`,
            });
        } else {
            data.disabledCommands.push(command);
            await this.client.database.guildData.set(
                interaction.guild.id,
                data
            );
            return interaction.reply({
                content: `I have added \`${command}\` to the blacklist.`,
            });
        }
    }
};
