const Command = require("../../abstract/command");
const { MatchPairs } = require('discord-gamecord');

module.exports = class Mp extends Command {
    constructor(...args) {
        super(...args, {
            name: "matchpairs",
            aliases: ["matchpairs"],
            description: "Play a game of matchpairs.",
            category: "Fun",
            usage: ["matchpairs"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }
    async run({ message }) {
        const Game = new MatchPairs({
            message: message,
            embed: {
                title: 'Match Pairs',
                color: this.client.config.Client.PrimaryColor,
                timestamp: true,
                description: '**Click on the buttons to match emojis with their pairs.**'
            },
            timeoutTime: 60000,
            emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
            winMessage: '**You won the Game! You turned a total of `{tilesTurned}` tiles.**',
            loseMessage: '**You lost the Game! You turned a total of `{tilesTurned}` tiles.**',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        })
        Game.startGame();
    }

    async exec({ interaction  }) {
        const Game = new MatchPairs({
            message: interaction,
            embed: {
                title: 'Match Pairs',
                color: this.client.config.Client.PrimaryColor,
                timestamp: true,
                description: '**Click on the buttons to match emojis with their pairs.**'
            },
            timeoutTime: 60000,
            emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
            winMessage: '**You won the Game! You turned a total of `{tilesTurned}` tiles.**',
            loseMessage: '**You lost the Game! You turned a total of `{tilesTurned}` tiles.**',
            playerOnlyMessage: 'Only {player} can use these buttons.',
            isSlashGame: true,
        })
        Game.startGame();
    }
}