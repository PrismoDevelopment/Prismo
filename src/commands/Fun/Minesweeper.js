const { Minesweeper } = require('discord-gamecord');
const Command = require("../../abstract/command");

module.exports = class Mine extends Command {
    constructor(...args) {
        super(...args, {
            name: "minesweeper",
            aliases: ["mine", "mines", "minesweeper"],
            description: "Play a game of minesweeper.",
            category: "Fun",
            usage: ["minesweeper"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }
    async run({ message }) {
        const Game = new Minesweeper({
            message: message,
            embed: {
                title: 'Minesweeper',
                color: this.client.config.Client.PrimaryColor,
                timestamp: true,
                description: 'Click on the buttons to reveal the blocks except mines.',
            },
            emojis: { flag: '🚩', mine: '💣' },
            mines: 5,
            timeoutTime: 60000,
            winMessage: 'You won the Game! You successfully avoided all the mines.',
            loseMessage: 'You lost the Game! Beaware of the mines next time.',
            othersMessage: 'Only <@{{author}}> can use the buttons!',
        })
        Game.startGame();
    }

    async exec({ interaction  }) {
        const Game = new Minesweeper({
            message: interaction,
            embed: {
                title: 'Minesweeper',
                color: this.client.config.Client.PrimaryColor,
                timestamp: true,
                description: 'Click on the buttons to reveal the blocks except mines.',
            },
            emojis: { flag: '🚩', mine: '💣' },
            mines: 4,
            timeoutTime: 60000,
            winMessage: 'You won the Game! You successfully avoided all the mines.',
            loseMessage: 'You lost the Game! Beaware of the mines next time.',
            othersMessage: 'Only <@{{author}}> can use the buttons!',
            isSlashGame: true,
        })
        Game.startGame();
    }
}