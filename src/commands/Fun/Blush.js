/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');

const nekoClient = new ActionsClient();

module.exports = class Blush extends Command {
    constructor(...args) {
        super(...args, {
            name: "blush",
            aliases: ["blush"],
            description: "Blush a user",
            usage: ["blush <user>"],
            image: "https://i.imgur.com/cOsmvto.png",
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 2,
            options: [
                {
                    name: "user",
                    description: "The user to blush",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        const user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to blush!");

        const member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to blush!");

        if (member.id === message?.author.id)
            return message?.reply("You can't blush yourself!");

        if (member.id === this.client.user.id)
            return message?.reply("You can't blush me!");

        const blush = await nekoClient.sfw.blush();

        const embed = this.client.util.embed()
            .setTitle(`${message?.author.username} blushed at ${member.user.username}`)
            .setImage(blush.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to blush!");

        if (user.id === interaction?.user.id)
            return interaction?.reply("You can't blush yourself!");

        if (user.id === this.client.user.id)
            return interaction?.reply("You can't blush me!");

        const blush = await nekoClient.sfw.blush();

        const embed = this.client.util.embed()
            .setTitle(`${interaction?.user.username} blushed at ${user.username}`)
            .setImage(blush.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
