const Command = require("../../abstract/command");

module.exports = class Blacklistchannel extends Command {
    constructor(...args) {
        super(...args, {
            name: "blacklistchannel",
            aliases: ["blc", "ignorechannel" ],
            description: "Blacklist a channel from using commands",
            usage: [
                "blacklistchannel <channel>",
                "blacklistchannel list",
                "blacklistchannel clear",
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
                    type: 7,
                    name: "channel",
                    description: "The channel to blacklist.",
                    required: false,
                },
            ],
        });
    }
    async run({ message, args }) {
        let data = await this.client.database.guildData.get(message.guild.id);
        if (args[0] == "list" || args[0] == "show") {
            let list = data.disabledChannels.map((c) => `<#${c}>`).join(", ");
            if (!list)
                return message.channel.send({
                    content: "There are no blacklisted channels.",
                });
            let embed = this.client.util
                .embed()
                .setTitle("Blacklisted Channels")
                .setDescription(`${list}`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message.channel.send({
                content: `The following channels are blacklisted ${this.client.config.Client.Emoji.Down}`,
                embeds: [embed],
            });
        }
        if (args[0] == "clear") {
            data.disabledChannels = [];
            await this.client.database.guildData.set(message.guild.id, data);
            return message.channel.send({
                content: `I have cleared the blacklist.`,
            });
        }
        let channel = args[0]
            ? await message.mentions.channels.first()
            : message.channel;
        if (!channel)
            return message.channel.send({
                content: "I couldn't find that channel.",
            });
        if (data.disabledChannels.includes(channel.id)) {
            data.disabledChannels = data.disabledChannels.filter(
                (c) => c !== channel.id
            );
            await this.client.database.guildData.set(message.guild.id, data);
            return message.channel.send({
                content: `I have removed ${channel} from the blacklist.`,
            });
        } else {
            data.disabledChannels.push(channel.id);
            await this.client.database.guildData.set(message.guild.id, data);
            return message.channel.send({
                content: `I have added ${channel} to the blacklist.`,
            });
        }
    }

    async exec({ interaction }) {
        let data = await this.client.database.guildData.get(
            interaction.guild.id
        );
        if (interaction.options.getString("type") == "list") {
            let list = data.disabledChannels.map((c) => `<#${c}>`).join(", ");
            if (!list)
                return interaction.reply({
                    content: "There are no blacklisted channels.",
                });
            let embed = this.client.util
                .embed()
                .setTitle("Blacklisted Channels")
                .setDescription(`${list}`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction.reply({
                content: `The following channels are blacklisted ${this.client.config.Client.Emoji.Down}`,
                embeds: [embed],
            });
        }
        if (interaction.options.getString("type") == "clear") {
            data.disabledChannels = [];
            await this.client.database.guildData.set(
                interaction.guild.id,
                data
            );
            return interaction.reply({
                content: `I have cleared the blacklist.`,
            });
        }
        let channel =
            interaction.options.getChannel("channel") || interaction.channel;
        if (!channel)
            return interaction.reply({
                content: "I couldn't find that channel.",
            });
        if (data.disabledChannels.includes(channel.id)) {
            data.disabledChannels = data.disabledChannels.filter(
                (c) => c !== channel.id
            );
            await this.client.database.guildData.set(
                interaction.guild.id,
                data
            );
            return interaction.reply({
                content: `I have removed ${channel} from the blacklist.`,
            });
        } else {
            data.disabledChannels.push(channel.id);
            await this.client.database.guildData.set(
                interaction.guild.id,
                data
            );
            return interaction.reply({
                content: `I have added ${channel} to the blacklist.`,
            });
        }
    }
};
