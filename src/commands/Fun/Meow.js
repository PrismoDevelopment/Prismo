const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Meow extends Command {
    constructor(...args) {
        super(...args, {
            name: "meow",
            aliases: ["meow"],
            description: "Meow at a user",
            usage: ["meow <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            image: "https://i.imgur.com/ClfMRLV.png",
            options: [
                {
                    name: "user",
                    description: "The user to meow at",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to meow!");
        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to meow!");
        if (member.id === message?.author.id)
            return message?.reply("You can't meow at yourself!");
        if (member.id === this.client.user.id)
            return message?.reply("You can't meow at me!");

        const meow = await nekoClient.sfw.meow();
        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} is meowing!`)
            .setImage(meow.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to meow!");
        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to meow!");
        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't meow at yourself!");
        if (member.id === this.client.user.id)
            return interaction?.reply("You can't meow at me!");

        const meow = await nekoClient.sfw.meow();
        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} is meowing!`)
            .setImage(meow.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
