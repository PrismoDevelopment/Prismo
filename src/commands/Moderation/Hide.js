const Command = require("../../abstract/command");
const { Message } = require('discord.js');
module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "hide",
            aliases: ["vanish"],
            description: "Hide A Channel",
            usage: ["hide <channel>"],
            category: "Moderation",
            userPerms: ["ManageChannels"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "ManageChannels",
            ],
            cooldown: 3,
            options: [
                {
                    type: 7,
                    name: "channel",
                    description: "Channel To Hide",
                    required: true,
                },
            ],
        });
    }
    /**
     * @param {Object} data hehe keeds
     * @param {Message} data.message
     */
    async run({ message, args }) {
        if (args[0] === "all") {
            const channels = await message.guild.channels.cache.filter((c) => c.permissionsFor(message.guild.id).has("ViewChannel")).map(chuuu => chuuu);
            for (let channel of channels) {
                await channel.permissionOverwrites
                    .edit(message.guild.id, {
                        ViewChannel: false,
                    })
            }
            return message.reply({
                content: "All Channels Have Been Hidden",
            });
        }
        let channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(args[0]) ||
            message.guild.channels.cache.find(
                (r) =>
                    r.name.toLowerCase() ==
                    args.slice(0).join(" ").toLowerCase()
            ) ||
            message.channel;
        if (!channel)
            return message.reply({
                content: "Please provide a valid channel.",
            });
        await channel.permissionOverwrites
            .edit(message.guild.id, {
                ViewChannel: false,
            })
            .catch((e) => console.error(e));
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully hidden ${channel.name}.`)
            .setColor(this.client.config.Client.PrimaryColor);
        return message.reply({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let channel = interaction.options.getChannel("channel");
        if (!channel)
            return interaction.reply({
                content: "Please provide a valid channel.",
                ephemeral: true,
            });
        await channel.permissionOverwrites
            .edit(message.guild.id, {
                ViewChannel: false,
            })
            .catch((e) => console.error(e));
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully hidden ${channel}.`)
            .setColor(this.client.config.Client.PrimaryColor);
        return interaction.reply({ embeds: [embed] });
    }
};
