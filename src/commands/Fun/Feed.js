/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');
const nekoClient = new ActionsClient();

module.exports = class Feed extends Command {
    constructor(...args) {
        super(...args, {
            name: "feed",
            aliases: ["feed"],
            description: "Feed a user.",
            usage: ["feed <user>"],
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 2,
            image: "https://i.imgur.com/KhYewhg.png",
            options: [
                {
                    name: "user",
                    description: "The user to feed.",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to feed!");
        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to feed!");
        if (member.id === message?.author.id)
            return message?.reply("You can't feed yourself!");
        if (member.id === this.client.user.id)
            return message?.reply("You can't feed me!");
        const feed = await nekoClient.sfw.feed();
        const embed = this.client.util.embed()
            .setTitle(`${message?.author.username} is feeding ${member.user.username}!`)
            .setImage(feed.url)
            .setColor(this.client.config.Client.PrimaryColor);
        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to feed!");
        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to feed!");
        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't feed yourself!");
        if (member.id === this.client.user.id)
            return interaction?.reply("You can't feed me!");
        const feed = await nekoClient.sfw.feed();
        const embed = this.client.util.embed()
            .setTitle(`${interaction?.user.username} is feeding ${member.user.username}!`)
            .setImage(feed.url)
            .setColor(this.client.config.Client.PrimaryColor);
        interaction?.reply({ embeds: [embed] });
    }
};
