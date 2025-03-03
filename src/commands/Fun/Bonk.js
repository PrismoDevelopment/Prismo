/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Command = require("../../abstract/command");
const ActionsClient = require('discord-actions');

const nekoClient = new ActionsClient();

module.exports = class Bonk extends Command {
    constructor(...args) {
        super(...args, {
            name: "bonk",
            aliases: ["bonk"],
            description: "Bonk a user",
            usage: ["bonk <user>"],
            image: "https://i.imgur.com/puZqmX9.png",
            category: "Fun",
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            cooldown: 2,
            options: [
                {
                    name: "user",
                    description: "The user to bonk",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        const user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message?.reply("Please provide a user to bonk!");

        const member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user to bonk!");

        if (member.id === message?.author.id)
            return message?.reply("You can't bonk yourself!");

        if (member.id === this.client.user.id)
            return message?.reply("You can't bonk me!");

        const bonk = await nekoClient.sfw.bonk();

        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} has been bonked!`)
            .setImage(bonk.url)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const user = interaction?.options.getUser("user");
        if (!user) return interaction?.reply("Please provide a user to bonk!");

        const member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user to bonk!");

        if (member.id === interaction?.user.id)
            return interaction?.reply("You can't bonk yourself!");

        if (member.id === this.client.user.id)
            return interaction?.reply("You can't bonk me!");

        const bonk = await nekoClient.sfw.bonk();

        const embed = this.client.util.embed()
            .setTitle(`${member.user.username} has been bonked!`)
            .setImage(bonk.url)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed] });
    }
};
