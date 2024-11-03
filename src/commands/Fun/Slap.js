const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Slap extends Command {
    constructor(...args) {
        super(...args, {
            name: "slap",
            aliases: ["slap"],
            description: "Slap a user",
            usage: ["slap <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 5,
            image: "https://i.imgur.com/Y0S96mS.png",
            options: [
                {
                    name: "user",
                    description: "The user to slap",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        const user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to slap!");

        const member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to slap!");
        if (member.id === message?.author.id)
            return message?.reply("You can't slap yourself!");
        if (member.id === this.client.user.id)
            return message?.reply("You can't slap me!");

        const slap = await nekoClient.sfw.slap();
        const embed = this.client.util.embed()
            .setTitle(`${message?.author.username} slapped ${member.user.username}!`)
            .setImage(slap.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to slap!");

        const member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to slap!");
        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't slap yourself!");
        if (member.id === this.client.user.id)
            return interaction?.reply("You can't slap me!");

        const slap = await nekoClient.sfw.slap();
        const embed = this.client.util.embed()
            .setTitle(`${interaction?.user.username} slapped ${member.user.username}!`)
            .setImage(slap.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
