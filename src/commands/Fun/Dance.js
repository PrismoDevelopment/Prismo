/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');

const nekoClient = new ActionsClient();

module.exports = class Dance extends Command {
    constructor(...args) {
        super(...args, {
            name: "dance",
            aliases: ["dance"],
            description: "Dance with a user",
            usage: ["dance <user>"],
            image: "https://i.imgur.com/4f8pViN.png",
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 2,
            options: [
                {
                    name: "user",
                    description: "The user to dance with",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        const user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to dance with!");

        const member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to dance with!");

        if (member.id === message?.author.id)
            return message?.reply("You can't dance with yourself!");

        if (member.id === this.client.user.id)
            return message?.reply("You can't dance with me!");

        const dance = await nekoClient.sfw.dance();

        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} is dancing with ${message?.author.username}!`)
            .setImage(dance.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to dance with!");

        const member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to dance with!");

        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't dance with yourself!");

        if (member.id === this.client.user.id)
            return interaction?.reply("You can't dance with me!");

        const dance = await nekoClient.sfw.dance();

        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} is dancing with ${interaction?.user.username}!`)
            .setImage(dance.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
