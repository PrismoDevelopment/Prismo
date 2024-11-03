const Command = require("../../abstract/command");

module.exports = class slowmode extends Command {
    constructor(...args) {
        super(...args, {
            name: "slowmode",
            description: "Sets slowmode in a channel",
            category: "Moderation",
            aliases: ["slowmode"],
            usage: ["slowmode <time> <channel>"],
            cooldown: 5,
            image: "https://imgur.com/nQHCDEE",
            userPerms: ["ManageChannels"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            options: [
                {
                    type: 4,
                    name: "time",
                    description: "Time to set slowmode to",
                    required: true,
                },
                {
                    type: 7,
                    name: "channel",
                    description: "Channel to set slowmode in",
                    required: false,
                },
            ],
        });
    }

    async run({ message, args }) {
        if (!args[0]) return message.channel.send(`You need to provide a time to set slowmode to!`);
        let timeArg = args[0];
        if (timeArg === "off" || timeArg === "disable" || timeArg === "remove") {
            await message.channel.edit({ rateLimitPerUser: 0 });
            return message.channel.send(`Successfully removed slowmode in ${message.channel}`);
        }
        let muteTime;
        const channel = message.mentions.channels.first() || message.channel;
        // max time is 6 hrs
        let maxMuteTime = 21600000;
        if (!timeArg) timeArg = "600";
        else if (timeArg.includes("s")) timeArg = timeArg.replace("s", "");
        else if (timeArg.includes("m")) timeArg = timeArg.replace("m", "") * 60;
        else if (timeArg.includes("h")) timeArg = timeArg.replace("h", "") * 60 * 60;
        else if (timeArg.includes("d")) timeArg = timeArg.replace("d", "") * 60 * 60 * 24;
        muteTime = timeArg * 1000;
        if (muteTime > maxMuteTime) return message.channel.createMessage(`You can't set slowmode to more than 6 hours!`);
        await channel.edit({ rateLimitPerUser: timeArg });
        timeArg = args[0]
        message.channel.send(`Successfully set slowmode to ${timeArg} seconds in ${channel}`);
    }

    async exec({ interaction }) {
        if (!interaction.data.options[0]) return interaction.reply(`You need to provide a time to set slowmode!`);
        let timeArg = interaction.data.options[0].value;
        let muteTime;
        const channel = interaction.data.options[1] ? interaction.data.options[1].value : interaction.channel_id;
        // max time is 6 hrs
        let maxMuteTime = 21600000;
        if (!timeArg) timeArg = "600";
        else if (timeArg.includes("s")) timeArg = timeArg.replace("s", "");
        else if (timeArg.includes("m")) timeArg = timeArg.replace("m", "") * 60;
        else if (timeArg.includes("h")) timeArg = timeArg.replace("h", "") * 60 * 60;
        else if (timeArg.includes("d")) timeArg = timeArg.replace("d", "") * 60 * 60 * 24;
        muteTime = timeArg * 1000;
        if (muteTime > maxMuteTime) return interaction.createMessage(`You can't set slowmode to more than 6 hours!`);
        await this.client.editChannel(channel, { rateLimitPerUser: timeArg });
        timeArg = interaction.data.options[0].value
        interaction.send(`Successfully set slowmode to ${timeArg} seconds in <#${channel}>`);
    }
}