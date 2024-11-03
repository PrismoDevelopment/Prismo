const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "ping",
            aliases: ["ping"],
            description: "Shows bot ping",
            usage: ["ping"],
            category: "Utilities",
            examples: ["Ping"],
            userPerms: ["SendMessages"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image:"https://i.imgur.com/WJVzS4s.png",
            guildOnly: true,
        });
    }

    async run({ message, args }) {
        const msg = await message?.channel.send("Pinging...");
        // msg.edit(
        //     `Pong! Latency is ${
        //         msg.createdTimestamp - message?.createdTimestamp
        //     }ms. API Latency is ${Math.round(this.client.ws.ping)}ms`
        // );
        // this is ok but not the best way to do it add all typesof latency lets create there variables
        let botLatency = msg.createdTimestamp - message?.createdTimestamp;
        let apiLatency = Math.round(this.client.ws.ping);
        // lets get database latency 
        let dbstart = Date.now();
        await this.client.database.guildData.get(message?.guild.id);
        let dbend = Date.now();
        let dbLatency = dbend - dbstart;
        // lets get the latency of the message
        let msgLatency = Date.now() - msg.createdTimestamp;
        // lets send the message
        
        msg.edit(`Pong! Bot Latency is **${botLatency}ms**. API Latency is **${apiLatency}ms**\nDatabase Latency is **${dbLatency}ms**. Message Latency is **${msgLatency}ms**`);
    }
    async exec({ interaction }) {
        interaction?.reply(`Pinging...`).then(async (msg) => {
            interaction?.editReply(
                `Pong! Latency is ${
                    msg.createdTimestamp - interaction?.createdTimestamp
                }ms. API Latency is ${Math.round(this.client.ws.ping)}ms`
            );
        });
    }
};
