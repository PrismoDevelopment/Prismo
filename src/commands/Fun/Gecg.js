const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Gecg extends Command {
    constructor(...args) {
        super(...args, {
            name: "gecg",
            aliases: ["gecg"],
            description: "Gecg a user.",
            usage: ["gecg <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 2,
            image: "https://i.imgur.com/fDy3SV4.png",
            options: [
                {
                    name: "user",
                    description: "The user to gecg.",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to gecg!");
        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to gecg!");
        if (member.id === message?.author.id) return message?.reply("You can't gecg yourself!");
        if (member.id === this.client.user.id) return message?.reply("You can't gecg me!");
        const gecg = await nekoClient.sfw.gecg();
        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} gecg!`)
            .setImage(gecg.url)
            .setColor(this.client.config.Client.PrimaryColor);
        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to gecg!");
        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to gecg!");
        if (member.id === interaction?.user.id) return interaction?.reply("You can't gecg yourself!");
        if (member.id === this.client.user.id) return interaction?.reply("You can't gecg me!");
        const gecg = await nekoClient.sfw.gecg();
        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} gecg!`)
            .setImage(gecg.url)
            .setColor(this.client.config.Client.PrimaryColor);
        interaction?.reply({ embeds: [embed] });
    }
};
