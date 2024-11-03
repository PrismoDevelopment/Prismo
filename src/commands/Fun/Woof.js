const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Woof extends Command {
    constructor(...args) {
        super(...args, {
            name: "woof",
            aliases: ["woof"],
            description: "Woof at a user",
            usage: ["woof <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 5,
            image: "https://i.imgur.com/4WmVIrH.png",
            options: [
                {
                    name: "user",
                    description: "The user to woof at",
                    type: 6,
                    required: false,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to woof at!");

        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to woof at!");

        if (member.id === message?.author.id)
            return message?.reply("You can't woof at yourself!");
        if (member.id === this.client.user.id)
            return message?.reply("You can't woof at me!");

        const woof = await nekoClient.sfw.woof();
        const embed = this.client.util.embed()
            .setTitle(`${message?.author.username} is woofing at ${member.user.username}!`)
            .setImage(woof.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to woof at!");

        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to woof at!");

        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't woof at yourself!");
        if (member.id === this.client.user.id)
            return interaction?.reply("You can't woof at me!");

        const woof = await nekoClient.sfw.woof();
        const embed = this.client.util.embed()
            .setTitle(`${interaction?.user.username} is woofing at ${member.user.username}!`)
            .setImage(woof.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
