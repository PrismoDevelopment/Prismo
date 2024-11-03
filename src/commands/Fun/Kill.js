const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Kill extends Command {
    constructor(...args) {
        super(...args, {
            name: "kill",
            aliases: ["kill"],
            description: "Kill a user.",
            usage: ["kill <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 2,
            image: "https://i.imgur.com/z6KzPtr.png",
            options: [
                {
                    name: "user",
                    description: "The user to kill.",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to kill!");
        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to kill!");
        if (member.id === message?.author.id) return message?.reply("You can't kill yourself!");
        if (member.id === this.client.user.id) return message?.reply("You can't kill me!");
        const kill = await nekoClient.sfw.kill();
        const embed = this.client.util.embed()
            .setTitle(`${message?.author.username} killed ${member.user.username}`)
            .setImage(kill.url)
            .setColor(this.client.config.Client.PrimaryColor);
        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to kill!");
        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to kill!");
        if (member.id === interaction?.user.id) return interaction?.reply("You can't kill yourself!");
        if (member.id === this.client.user.id) return interaction?.reply("You can't kill me!");
        const kill = await nekoClient.sfw.kill();
        const embed = this.client.util.embed()
            .setTitle(`${interaction?.user.username} kills ${member.user.username}!`)
            .setImage(kill.url)
            .setColor(this.client.config.Client.PrimaryColor);
        interaction?.reply({ embeds: [embed] });
    }
};
