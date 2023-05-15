const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "lock",
            aliases: ["lock", "lockdown"],
            description: "Locks A Channel",
            usage: ["lock <channel>"],
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
                    description: "Channel To Lock",
                    required: true,
                },
            ],
        });
    }
    async run({ message, args }) {
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
                SendMessages: false,
            })
            .catch((e) => console.error(e));
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully Locked ${channel.name}.`)
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
                SendMessages: false,
            })
            .catch((e) => console.error(e));
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully Locked ${channel}.`)
            .setColor(this.client.config.Client.PrimaryColor);
        return interaction.reply({ embeds: [embed] });
    }
};
