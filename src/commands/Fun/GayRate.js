const Command = require("../../abstract/command");

module.exports = class GayRate extends Command {
    constructor(...args) {
        super(...args, {
            name: "gayrate",
            aliases: ["gayrate"],
            description: "Check how much of a gay you are.",
            category: "Fun",
            usage: ["gayrate <user>"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/NFAtMtr.png",
            options: [
                {
                    name: "user",
                    description: "The user to check.",
                    type: 6,
                    required: false,
                },
            ],
        });
    }

    async run({ message, args }) {
        let member = args[0] ? await this.client.util.userQuery(args[0]) : message?.author.id;
        if (!member) return message?.channel.send("Please provide a user to check.");
        const user = await this.client.users.fetch(member);
        let love = Math.floor(Math.random() * 100) + 1;
        let emptybar = this.client.config.Client.emoji.emptybar;
        let filledleftbar = this.client.config.Client.emoji.barleft;
        let filledrightbar = this.client.config.Client.emoji.barright;
        let filledmidbar = this.client.config.Client.emoji.barmid;
        let emptybarend = this.client.config.Client.emoji.emptybarend;
        let emptybarcount = 10 - Math.floor(love / 10) - 1;
        let filledbarcount = Math.floor(love / 10);
        let filledbar = filledbarcount === 0 ? filledleftbar : filledleftbar + filledmidbar.repeat(filledbarcount - 2) + filledrightbar;
        let bar = filledbar + emptybar.repeat(emptybarcount) + emptybarend;
        const embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setTitle(`GayMeter`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields({ name: `${user.username} is ${love}% Gay`, value: `${bar} ${love}%` });
        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let member = interaction?.options.getMember("user") || interaction?.member;
        let love = Math.floor(Math.random() * 100) + 1;
        let emptybar = this.client.config.Client.emoji.emptybar;
        let filledleftbar = this.client.config.Client.emoji.barleft;
        let filledrightbar = this.client.config.Client.emoji.barright;
        let filledmidbar = this.client.config.Client.emoji.barmid;
        let emptybarend = this.client.config.Client.emoji.emptybarend;
        let emptybarcount = 10 - Math.floor(love / 10) - 1;
        let filledbarcount = Math.floor(love / 10);
        let filledbar = filledbarcount === 0 ? filledleftbar : filledleftbar + filledmidbar.repeat(filledbarcount - 2) + filledrightbar;
        let bar = filledbar + emptybar.repeat(emptybarcount) + emptybarend;
        const embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setTitle(`GayMeter`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields({ name: `${member.user.username} is ${love}% Gay`, value: `${bar} ${love}%` });
        interaction?.reply({ embeds: [embed] });
    }
};
