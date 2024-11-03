const { Slots } = require('discord-gamecord');
const Command = require("../../abstract/command");

module.exports = class Slot extends Command {
    constructor(...args) {
        super(...args, {
            name: "slot",
            aliases: ["slot"],
            description: "Play a game of slots.",
            category: "Fun",
            usage: ["slot"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/0FDidz1.png",
        });
    }

    async run({ message }) {
        const Game = new Slots({
            message: message,
            embed: {
                title: 'Slots',
                color: this.client.config.Client.PrimaryColor,
                timestamp: true,
            },
            emojis: {
                active: '🎰',
                inactive: '🎲',
            },
            slots: ['🍇', '🍊', '🍋', '🍌'],
            othersMessage: 'Only <@{{author}}> can use the buttons!',
        });

        Game.startGame();
    }

    async exec({ interaction }) {
        const Game = new Slots({
            message: interaction,
            embed: {
                title: 'Slots',
                color: this.client.config.Client.PrimaryColor,
                timestamp: true,
            },
            emojis: {
                active: '🎰',
                inactive: '🎲',
            },
            slots: ['🍇', '🍊', '🍋', '🍌'],
            othersMessage: 'Only <@{{author}}> can use the buttons!',
            isSlashGame: true,
        });

        Game.startGame();
    }
};
