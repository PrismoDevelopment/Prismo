const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Lick extends Command {
    constructor(...args) {
        super(...args, {
            name: "lick",
            aliases: ["lick"],
            description: "Lick a user.",
            usage: ["lick <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 2,
            image: "https://i.imgur.com/sKTaXuJ.png",
            options: [
                {
                    name: "user",
                    description: "The user to lick.",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to lick!");
        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to lick!");
        if (member.id === message?.author.id) return message?.reply("You can't lick yourself!");
        if (member.id === this.client.user.id) return message?.reply("You can't lick me!");
        const lick = await nekoClient.sfw.lick();
        const embed = this.client.util.embed()
            .setTitle(`${message?.author.username} licked ${member.user.username}`)
            .setImage(lick.url)
            .setColor(this.client.config.Client.PrimaryColor);
        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to lick!");
        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to lick!");
        if (member.id === interaction?.user.id) return interaction?.reply("You can't lick yourself!");
        if (member.id === this.client.user.id) return interaction?.reply("You can't lick me!");
        const lick = await nekoClient.sfw.lick();
        const embed = this.client.util.embed()
            .setTitle(`${interaction?.user.username} licks ${member.user.username}!`)
            .setImage(lick.url)
            .setColor(this.client.config.Client.PrimaryColor);
        interaction?.reply({ embeds: [embed] });
    }
};
