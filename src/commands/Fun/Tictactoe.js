const Command = require("../../abstract/command");
const TicTacToe = require('discord-tictactoe');

module.exports = class TicTacToeCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "tictactoe",
            aliases: ["ttt"],
            description: "Play TicTacToe with your friends!",
            category: "Fun",
            usage: ["tictactoe <user>"],
            userPerms: ["SendMessages", "ReadMessageHistory"],
            botPerms: ["SendMessages", "ReadMessageHistory"],
            cooldown: 10,
            image: "https://i.imgur.com/PZrLzmB.png",
            options: [
                {
                    name: "user",
                    description: "The user you want to play with",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        const user = await this.client.util.userQuery(args[0]);
        if (!user) return message?.reply("Please provide a valid user!");
        const member = await message?.guild.members.fetch(user);
        if (member.id === message?.author.id) return message?.reply("You can't play with yourself!");

        const game = new TicTacToe({
            language: 'en',
            command: message,
        });
        game.handleMessage(message);
    }

    async exec({ interaction }) {
        const user = interaction?.options.getMember('user');
        if (!user) return interaction?.reply("Please provide a valid user!");
        const member = await interaction?.guild.members.fetch(user.id);
        if (member.id === interaction?.user.id) return interaction?.reply("You can't play with yourself!");

        const game = new TicTacToe({
            language: 'en',
            command: interaction,
        });
        game.handleInteraction(interaction);
    }
};
