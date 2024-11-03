const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Nom extends Command {
    constructor(...args) {
        super(...args, {
            name: "nom",
            aliases: ["nom"],
            description: "Nom a user",
            usage: ["nom <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 5,
            image: "https://i.imgur.com/3AmmbwW.png",
            options: [
                {
                    name: "user",
                    description: "The user to nom",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to nom!");
        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to nom!");
        if (member.id === message?.author.id)
            return message?.reply("You can't nom yourself!");
        if (member.id === this.client.user.id)
            return message?.reply("You can't nom me!");

        const nom = await nekoClient.sfw.nom();
        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} is nom!`)
            .setImage(nom.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to nom!");
        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to nom!");
        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't nom yourself!");
        if (member.id === this.client.user.id)
            return interaction?.reply("You can't nom me!");

        const nom = await nekoClient.sfw.nom();
        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} is nom!`)
            .setImage(nom.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
