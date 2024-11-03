const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Wink extends Command {
    constructor(...args) {
        super(...args, {
            name: "wink",
            aliases: ["wink"],
            description: "Wink at a user",
            usage: ["wink <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 5,
            image: "https://i.imgur.com/YiVXYox.png",
            options: [
                {
                    name: "user",
                    description: "The user to wink at",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to wink at!");

        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to wink at!");

        if (member.id === message?.author.id)
            return message?.reply("You can't wink at yourself!");
        if (member.id === this.client.user.id)
            return message?.reply("You can't wink at me!");

        const wink = await nekoClient.sfw.wink();
        const embed = this.client.util.embed()
            .setTitle(`${message?.author.username} is winking at ${member.user.username}!`)
            .setImage(wink.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to wink at!");

        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to wink at!");

        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't wink at yourself!");
        if (member.id === this.client.user.id)
            return interaction?.reply("You can't wink at me!");

        const wink = await nekoClient.sfw.wink();
        const embed = this.client.util.embed()
            .setTitle(`${interaction?.user.username} is winking at ${member.user.username}!`)
            .setImage(wink.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
