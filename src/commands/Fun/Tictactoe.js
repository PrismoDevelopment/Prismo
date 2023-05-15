const Command = require("../../abstract/command");
const TicTacToe = require('discord-tictactoe');

module.exports = class Tictactoe extends Command {
    constructor(...args) {
        super(...args, {
            name: "tictactoe",
            aliases: ["ttt"],
            description: "Play TicTacToe with your friends!",
            category: "Fun",
            usage: ["tictactoe <user>"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 10,
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
        if (!user) return message.reply("Please provide a valid user!");
        let member = await message.guild.members.fetch(user.id);
        if (member.id === message.author.id) return message.reply("You can't play with yourself!");
        const game = new TicTacToe({
            language: 'en',
            command: message,
            opponent: member,
            xEmoji: '❌',
            oEmoji: '⭕',
            xColor: 'RED',
            oColor: 'BLUE',
            emptyEmoji: '⬜',
            emptyColor: 'GREY',
            turnMessage: '{emoji} | It\'s {player}\'s turn!',
            winMessage: '{emoji} | {winner} won the game!',
            drawMessage: 'The game ended in a draw!',
            askMessage: '{opponent}, you have been challenged to a game of Tic Tac Toe! Do you accept the challenge?',
            cancelMessage: 'Looks like they refused to have a game of Tic Tac Toe!',
            timeEndMessage: 'Since the opponent didn\'t answer, I dropped the game!',
            othersMessage: 'Only {author} can use the buttons!',
            returnWinner: true,
            gameBoardDisableButtons: true,
        });
        game.handleMessage(message);
    }

    async exec({ interaction }) {
        const user = interaction.options.getMember('user');
        if (!user) return interaction.reply("Please provide a valid user!");
        let member = await interaction.guild.members.fetch(user.id);
        if (member.id === interaction.user.id) return interaction.reply("You can't play with yourself!");
        const game = new TicTacToe({
            language: 'en',
            command: interaction,
            opponent: member,
            xEmoji: '❌',
            oEmoji: '⭕',
            xColor: 'RED',
            oColor: 'BLUE',
            emptyEmoji: '⬜',
            emptyColor: 'GREY',
            turnMessage: '{emoji} | It\'s {player}\'s turn!',
            winMessage: '{emoji} | {winner} won the game!',
            drawMessage: 'The game ended in a draw!',
            askMessage: '{opponent}, you have been challenged to a game of Tic Tac Toe! Do you accept the challenge?',
            cancelMessage: 'Looks like they refused to have a game of Tic Tac Toe!',
            timeEndMessage: 'Since the opponent didn\'t answer, I dropped the game!',
            othersMessage: 'Only {author} can use the buttons!',
            returnWinner: true,
            gameBoardDisableButtons: true,
        });
        game.handleInteraction(interaction);
    }
};
