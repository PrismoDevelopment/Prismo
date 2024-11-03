const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Kiss extends Command {
    constructor(...args) {
        super(...args, {
            name: "kiss",
            aliases: ["kiss"],
            description: "Kiss a user.",
            usage: ["kiss <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 2,
            image: "https://i.imgur.com/nELAszY.png",
            options: [
                {
                    name: "user",
                    description: "The user to kiss.",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to kiss!");
        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to kiss!");
        if (member.id === message?.author.id) return message?.reply("You can't kiss yourself!");
        if (member.id === this.client.user.id) return message?.reply("You can't kiss me!");
        const kiss = await nekoClient.sfw.kiss();
        const embed = this.client.util.embed()
            .setTitle(`${message?.author.username} kissed ${member.user.username}`)
            .setImage(kiss.url)
            .setColor(this.client.config.Client.PrimaryColor);
        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to kiss!");
        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to kiss!");
        if (member.id === interaction?.user.id) return interaction?.reply("You can't kiss yourself!");
        if (member.id === this.client.user.id) return interaction?.reply("You can't kiss me!");
        const kiss = await nekoClient.sfw.kiss();
        const embed = this.client.util.embed()
            .setTitle(`${interaction?.user.username} kissed ${member.user.username}!`)
            .setImage(kiss.url)
            .setColor(this.client.config.Client.PrimaryColor);
        interaction?.reply({ embeds: [embed] });
    }
};
