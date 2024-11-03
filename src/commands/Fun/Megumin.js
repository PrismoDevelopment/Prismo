const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Megumin extends Command {
    constructor(...args) {
        super(...args, {
            name: "megumin",
            aliases: ["megumin"],
            description: "Megumin a user",
            usage: ["megumin <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            image: "https://i.imgur.com/ce2Acco.png",
            options: [
                {
                    name: "user",
                    description: "The user to megumin",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to megumin!");
        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to megumin!");
        if (member.id === message?.author.id)
            return message?.reply("You can't megumin yourself!");
        if (member.id === this.client.user.id)
            return message?.reply("You can't megumin me!");

        const megumin = await nekoClient.sfw.megumin();
        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} is Megumin!`)
            .setImage(megumin.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to megumin!");
        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to megumin!");
        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't megumin yourself!");
        if (member.id === this.client.user.id)
            return interaction?.reply("You can't megumin me!");

        const megumin = await nekoClient.sfw.megumin();
        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} is Megumin!`)
            .setImage(megumin.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
