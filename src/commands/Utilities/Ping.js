const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "ping",
            aliases: ["ping"],
            description: "",
            usage: ["ping"],
            category: "Utilities",
            examples: ["Ping"],
            userPerms: ["SendMessages"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }

    async run({ message, args }) {
        const msg = await message.channel.send("Pinging...");
        msg.edit(
            `Pong! Latency is ${
                msg.createdTimestamp - message.createdTimestamp
            }ms. API Latency is ${Math.round(this.client.ws.ping)}ms`
        );
    }
    async exec({ interaction }) {
        interaction.reply(`Pinging...`).then(async (msg) => {
            interaction.editReply(
                `Pong! Latency is ${
                    msg.createdTimestamp - interaction.createdTimestamp
                }ms. API Latency is ${Math.round(this.client.ws.ping)}ms`
            );
        });
    }
};
