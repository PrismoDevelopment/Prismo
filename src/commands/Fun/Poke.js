const Command = require("../../abstract/command");
const ActionsClient = require("discord-actions");
const nekoClient = new ActionsClient();

module.exports = class Poke extends Command {
    constructor(...args) {
        super(...args, {
            name: "poke",
            aliases: ["poke"],
            description: "Poke a user.",
            category: "Fun",
            usage: ["poke <user>"],
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 5,
            image: "https://i.imgur.com/gKtcOKx.png",
            options: [
                {
                    name: "user",
                    description: "The user to poke.",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to poke!");

        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to poke!");

        if (member.id === message?.author.id)
            return message?.reply("You can't poke yourself!");

        if (member.id === this.client.user.id)
            return message?.reply("You can't poke me!");

        const poke = await nekoClient.sfw.poke();
        const embed = this.client.util.embed()
            .setTitle(`${message?.author.username} poked ${member.user.username}!`)
            .setImage(poke.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to poke!");

        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to poke!");

        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't poke yourself!");

        if (member.id === this.client.user.id)
            return interaction?.reply("You can't poke me!");

        const poke = await nekoClient.sfw.poke();
        const embed = this.client.util.embed()
            .setTitle(`${interaction?.user.username} poked ${member.user.username}!`)
            .setImage(poke.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
