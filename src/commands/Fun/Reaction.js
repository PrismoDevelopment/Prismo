const { max } = require("moment");
const Command = require("../../abstract/command");

module.exports = class Reaction extends Command {
    constructor(...args) {
        super(...args, {
            name: "reaction",
            aliases: ["react"],
            description: "See how fast you can get the correct emoji.",
            category: "Fun",
            cooldown: 10,
            usage: ["reaction"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            image: "https://i.imgur.com/Sd9EumY.png",
        });
    }

    async run({ message }) {
        const emojis = [
            "🍊",
            "🍓",
            "🍇",
            "🍑",
            "🍉",
        ];

        let embed = this.client.util.embed()
            .setTitle("Reaction Time")
            .setDescription("After 1-10 seconds, I will reveal an emoji.")
            .setColor(this.client.config.Client.PrimaryColor);

        const msg = await message?.channel.send({ embeds: [embed] });

        for (let single_emoji of emojis) {
            await msg.react(single_emoji);
        }

        const random = Math.floor(Math.random() * 8) + 1;
        const random_emoji = emojis[Math.floor(Math.random() * emojis.length)];

        setTimeout(async () => {
            embed.setDescription(`React to the ${random_emoji} emoji as fast as you can!`);
            await msg.edit({ embeds: [embed] });
            msg.reactionStartTimeStamp = Date.now();
        }, random * 1000);

        const collector = msg.createReactionCollector({ time: 15000 });

        collector.on("collect", (reaction, user) => {
            if (user.bot) return;

            if (reaction.emoji.name === random_emoji) {
                collector.stop();
                msg.reactionEndTimeStamp = Date.now();
                let timeTaken = ((msg.reactionEndTimeStamp - msg.reactionStartTimeStamp) / 1000);
                embed.setDescription(`${user.toString()} reacted to the emoji in ${timeTaken} seconds!`);
                embed.setColor(this.client.config.Client.SuccessColor);
                msg.edit({ embeds: [embed] });
            }
        });
    }

    async exec({ interaction }) {
        const emojis = [
            "🍊",
            "🍓",
            "🍇",
            "🍑",
            "🍉",
        ];

        let embed = this.client.util.embed()
            .setTitle("Reaction Time")
            .setDescription("After 1-10 seconds, I will reveal an emoji.")
            .setColor(this.client.config.Client.PrimaryColor);

        const msg = await interaction?.reply({ embeds: [embed], fetchReply: true });

        for (let single_emoji of emojis) {
            await msg.react(single_emoji);
        }

        const random = Math.floor(Math.random() * 8) + 1;
        const random_emoji = emojis[Math.floor(Math.random() * emojis.length)];

        setTimeout(async () => {
            embed.setDescription(`React to the ${random_emoji} emoji as fast as you can!`);
            await msg.edit({ embeds: [embed] });
            msg.reactionStartTimeStamp = Date.now();
        }, random * 1000);

        const collector = msg.createReactionCollector({ time: 15000 });

        collector.on("collect", (reaction, user) => {
            msg.reactionEndTimeStamp = Date.now();

            if (user.bot) return;

            if (reaction.emoji.name === random_emoji) {
                collector.stop();
                let timeTaken = ((msg.reactionEndTimeStamp - msg.reactionStartTimeStamp) / 1000);
                embed.setDescription(`${user.toString()} reacted to the emoji in ${timeTaken} seconds!`);
                embed.setColor(this.client.config.Client.SuccessColor);
                msg.edit({ embeds: [embed] });
            }
        });
    }
};
