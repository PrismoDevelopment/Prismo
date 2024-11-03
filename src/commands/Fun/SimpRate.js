const Command = require("../../abstract/command");

module.exports = class SimpRate extends Command {
    constructor(...args) {
        super(...args, {
            name: "simprate",
            aliases: ["simprate"],
            description: "Check how much of a simp you are",
            category: "Fun",
            usage: ["simprate <user>"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/BEOBfXQ.png",
            options: [
                {
                    name: "user",
                    description: "The user to check",
                    type: 6,
                    required: false,
                },
            ],
        });
    }

    async run({ message, args }) {
        const member = args[0] ? await this.client.util.userQuery(args[0]) : message?.author.id;
        if (!member) return message?.channel.send("Please provide a user to check");

        const user = await this.client.users.fetch(member);
        const love = Math.floor(Math.random() * 100) + 1;
        const emptybar = this.client.config.Client.emoji.emptybar;
        const filledleftbar = this.client.config.Client.emoji.barleft;
        const filledrightbar = this.client.config.Client.emoji.barright;
        const filledmidbar = this.client.config.Client.emoji.barmid;
        const emptybarend = this.client.config.Client.emoji.emptybarend;
        const emptybarcount = 10 - Math.floor(love / 10) - 1;
        const filledbarcount = Math.floor(love / 10);
        let filledbar = null;

        if (filledbarcount === 0) {
            filledbar = filledleftbar;
        } else {
            filledbar = filledleftbar + filledmidbar.repeat(filledbarcount - 2) + filledrightbar;
        }

        const bar = filledbar + emptybar.repeat(emptybarcount) + emptybarend;
        const embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setTitle("SimpMeter")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields({ name: `${user.username} is ${love}% simp`, value: `${bar} ${love}%` });

        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const member = interaction?.options.getMember("user") || interaction?.member;
        const love = Math.floor(Math.random() * 100) + 1;
        const emptybar = this.client.config.Client.emoji.emptybar;
        const filledleftbar = this.client.config.Client.emoji.barleft;
        const filledrightbar = this.client.config.Client.emoji.barright;
        const filledmidbar = this.client.config.Client.emoji.barmid;
        const emptybarend = this.client.config.Client.emoji.emptybarend;
        const emptybarcount = 10 - Math.floor(love / 10) - 1;
        const filledbarcount = Math.floor(love / 10);
        let filledbar = null;

        if (filledbarcount === 0) {
            filledbar = filledleftbar;
        } else {
            filledbar = filledleftbar + filledmidbar.repeat(filledbarcount - 2) + filledrightbar;
        }

        const bar = filledbar + emptybar.repeat(emptybarcount) + emptybarend;
        const embed = this.client.util.embed()
            .setColor(this.client.config.Client.PrimaryColor)
            .setTitle("SimpMeter")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields({ name: `${member.user.username} is ${love}% simp`, value: `${bar} ${love}%` });

        interaction?.reply({ embeds: [embed] });
    }
};
