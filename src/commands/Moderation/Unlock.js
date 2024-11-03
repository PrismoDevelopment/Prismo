const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "unlock",
            aliases: ["unlock"],
            description: "Unlocks A Channel",
            usage: ["Unlock <channel>"],
            category: "Moderation",
            userPerms: ["ManageChannels"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "ManageChannels",
            ],
            cooldown: 3,
            image:"https://i.imgur.com/Wrgl6ZB.png",
            options: [
                {
                    type: 7,
                    name: "channel",
                    description: "Channel To Unlock",
                    required: true,
                },
            ],
        });
    }
    async run({ message, args }) {
        let channel =
            message?.mentions.channels.first() ||
            message?.guild.channels.cache.get(args[0]) ||
            message?.guild.channels.cache.find(
                (r) =>
                    r.name.toLowerCase() ==
                    args.slice(0).join(" ").toLowerCase()
            ) ||
            message?.channel;
        if (!channel)
            return message?.reply({
                content: "I would appreciate it if you provided a valid channel.",
            });
        await channel.permissionOverwrites
            .edit(message?.guild.id, {
                SendMessages: true,
            })
            .catch(() => { });
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully Unlocked ${channel.name}.`)
            .setColor(this.client.config.Client.PrimaryColor);
        return message?.reply({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let channel = interaction?.options.getChannel("channel");
        if (!channel)
            return interaction?.reply({
                content: "I would appreciate it if you provided a valid channel.",
                ephemeral: true,
            });
        await channel.permissionOverwrites
            .edit(interaction?.guild.id, {
                SendMessages: true,
            })
            .catch(() => { });
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully Unlocked ${channel}.`)
            .setColor(this.client.config.Client.PrimaryColor);
        return interaction?.reply({ embeds: [embed] });
    }
};
