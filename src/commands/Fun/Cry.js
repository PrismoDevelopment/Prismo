const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');

const nekoClient = new ActionsClient();

module.exports = class Cry extends Command {
    constructor(...args) {
        super(...args, {
            name: "cry",
            aliases: ["cry"],
            description: "Cry with a user",
            usage: ["cry <user>"],
            image: "https://i.imgur.com/WLYHJbc.png",
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 2,
            options: [
                {
                    name: "user",
                    description: "The user to cry with",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        const user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to cry with!");

        const member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to cry with!");

        if (member.id === message?.author.id)
            return message?.reply("You can't cry with yourself!");

        if (member.id === this.client.user.id)
            return message?.reply("You can't cry with me!");

        const cry = await nekoClient.sfw.cry();

        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} is crying!`)
            .setImage(cry.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to cry with!");

        const member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to cry with!");

        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't cry with yourself!");

        if (member.id === this.client.user.id)
            return interaction?.reply("You can't cry with me!");

        const cry = await nekoClient.sfw.cry();

        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} is crying!`)
            .setImage(cry.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
