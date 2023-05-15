const Command = require("../../abstract/command");

module.exports = class Kiss extends Command {
    constructor(...args) {
        super(...args, {
            name: "kiss",
            aliases: ["kiss"],
            description: "Kiss someone.",
            category: "Fun",
            usage: ["kiss @user"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            options: [
                {
                    name: "user",
                    description: "The user you want to kiss.",
                    type: 6,
                    required: true,
                }
            ]
        });
    }

    async run({ message, args }) {
        let gifs = [
            "https://media.tenor.com/jnndDmOm5wMAAAAC/kiss.gif",
"https://media.tenor.com/C96g4M5OPsYAAAAC/anime-couple.gif",
"https://media.tenor.com/4wUL9KIdlJAAAAAC/kiss.gif",
"https://media.tenor.com/Ogthkl9rYBMAAAAC/ichigo-hiro.gif",
"https://media.tenor.com/dn_KuOESmUYAAAAC/engage-kiss-anime-kiss.gif",
"https://media.tenor.com/rQ8qlj_oQ-YAAAAC/anime-kiss.gif",
"https://media.tenor.com/EP_-3YtRtBMAAAAC/yui-komori-subaru-sakamaki.gif",
"https://media.tenor.com/KlpH_uI8fH4AAAAC/anime-kiss.gif",
"https://media.tenor.com/YHxJ9NvLYKsAAAAC/anime-kiss.gif",
"https://media.tenor.com/F02Ep3b2jJgAAAAC/cute-kawai.gif",
"https://media.tenor.com/bM6UK1pmoRQAAAAC/kiss-anime.gif",
"https://media.tenor.com/2tB89ikESPEAAAAC/kiss-kisses.gif",
"https://media.tenor.com/YeitcPAdSCYAAAAC/kyo-x-tohru-kiss.gif",
"https://media.tenor.com/fiafXWajQFoAAAAC/kiss-anime.gif",
"https://media.tenor.com/06lz817csVgAAAAC/anime-anime-kiss.gif",
"https://media.tenor.com/2u67zOB43esAAAAC/cute-anime.gif",
"https://media.tenor.com/3wE3JNW0fswAAAAC/anime-kiss-love.gif",
"https://media.tenor.com/_Ayo5qqKFYgAAAAC/kiss-anime.gif",
"https://media.tenor.com/dJU8aKmPKAgAAAAC/anime-kiss.gif",
"https://media.tenor.com/3xrkm45MqkIAAAAC/anime-kiss.gif",
"https://media.tenor.com/jEqmKqupnOwAAAAC/anime-kiss.gif",
"https://media.tenor.com/2ufYUI2sVFoAAAAC/kiss.gif",
"https://media.tenor.com/LU1UJruGjAQAAAAC/tsundere-kiss.gif",
"https://media.tenor.com/Nq1WsKihygIAAAAC/anime-kiss.gif",
"https://media.tenor.com/vtOmnXkckscAAAAC/kiss.gif",
"https://media.tenor.com/8ln6Z1e-FVYAAAAC/nagumi-koushi-hozumi-serene.gif",
"https://media.tenor.com/V0nBQduEYb8AAAAC/anime-kiss-making-out.gif",
"https://media.tenor.com/9jB6M6aoW0AAAAAC/val-ally-kiss.gif",
"https://media.tenor.com/-tntwZEqVX4AAAAC/anime-kiss.gif",
"https://media.tenor.com/NMBx4P4rHL8AAAAC/vanitas-no-carte-vanitas.gif",
"https://media.tenor.com/UcnfRWqnQtEAAAAC/kiss-anime-cute.gif",
"https://media.tenor.com/KE3VW3qP4RAAAAAC/kiss.gif",
"https://media.tenor.com/wQyttVAvkF0AAAAC/forehead-kiss-anime.gif",
"https://media.tenor.com/G9V_XexWNR4AAAAC/sasuhina-anime.gif",
"https://media.tenor.com/Ko1AOLzUmyEAAAAC/kiss-anime.gif",
"https://media.tenor.com/ZIfFiEBuKsAAAAAC/kiss-anime.gif",
"https://media.tenor.com/lK1PF-Xv1O4AAAAC/yato-anime-noragami.gif",
"https://media.tenor.com/7T1cuiOtJvQAAAAC/anime-kiss.gif",
"https://media.tenor.com/tJiq6XLJccIAAAAC/kiss-couple.gif",
"https://media.tenor.com/1DHutkXy3FEAAAAC/kiss-anime.gif",];
        let gif = gifs[Math.floor(Math.random() * gifs.length)];
        let user = args[0] ? await this.client.util.userQuery(args[0], message.guild) : null;
        if (!user) return message.channel.send("Please provide a valid user.");
        if (user === message.author.id) return message.channel.send("You can't kiss yourself.");
        let member = await this.client.users.fetch(user);
        if (!member) return message.channel.send("Please provide a valid user.");
        let embed = this.client.util.embed()
        .setAuthor({ name: `${message.author.username} kisses ${member.username}'s lips~`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setImage(gif)
        .setColor(this.client.config.Client.PrimaryColor)
        message.channel.send({ embeds: [embed] })
    }

    async exec({ interaction }) {
        let gifs =[
            "https://media.tenor.com/jnndDmOm5wMAAAAC/kiss.gif",
"https://media.tenor.com/C96g4M5OPsYAAAAC/anime-couple.gif",
"https://media.tenor.com/4wUL9KIdlJAAAAAC/kiss.gif",
"https://media.tenor.com/Ogthkl9rYBMAAAAC/ichigo-hiro.gif",
"https://media.tenor.com/dn_KuOESmUYAAAAC/engage-kiss-anime-kiss.gif",
"https://media.tenor.com/rQ8qlj_oQ-YAAAAC/anime-kiss.gif",
"https://media.tenor.com/EP_-3YtRtBMAAAAC/yui-komori-subaru-sakamaki.gif",
"https://media.tenor.com/KlpH_uI8fH4AAAAC/anime-kiss.gif",
"https://media.tenor.com/YHxJ9NvLYKsAAAAC/anime-kiss.gif",
"https://media.tenor.com/F02Ep3b2jJgAAAAC/cute-kawai.gif",
"https://media.tenor.com/bM6UK1pmoRQAAAAC/kiss-anime.gif",
"https://media.tenor.com/2tB89ikESPEAAAAC/kiss-kisses.gif",
"https://media.tenor.com/YeitcPAdSCYAAAAC/kyo-x-tohru-kiss.gif",
"https://media.tenor.com/fiafXWajQFoAAAAC/kiss-anime.gif",
"https://media.tenor.com/06lz817csVgAAAAC/anime-anime-kiss.gif",
"https://media.tenor.com/2u67zOB43esAAAAC/cute-anime.gif",
"https://media.tenor.com/3wE3JNW0fswAAAAC/anime-kiss-love.gif",
"https://media.tenor.com/_Ayo5qqKFYgAAAAC/kiss-anime.gif",
"https://media.tenor.com/dJU8aKmPKAgAAAAC/anime-kiss.gif",
"https://media.tenor.com/3xrkm45MqkIAAAAC/anime-kiss.gif",
"https://media.tenor.com/jEqmKqupnOwAAAAC/anime-kiss.gif",
"https://media.tenor.com/2ufYUI2sVFoAAAAC/kiss.gif",
"https://media.tenor.com/LU1UJruGjAQAAAAC/tsundere-kiss.gif",
"https://media.tenor.com/Nq1WsKihygIAAAAC/anime-kiss.gif",
"https://media.tenor.com/vtOmnXkckscAAAAC/kiss.gif",
"https://media.tenor.com/8ln6Z1e-FVYAAAAC/nagumi-koushi-hozumi-serene.gif",
"https://media.tenor.com/V0nBQduEYb8AAAAC/anime-kiss-making-out.gif",
"https://media.tenor.com/9jB6M6aoW0AAAAAC/val-ally-kiss.gif",
"https://media.tenor.com/-tntwZEqVX4AAAAC/anime-kiss.gif",
"https://media.tenor.com/NMBx4P4rHL8AAAAC/vanitas-no-carte-vanitas.gif",
"https://media.tenor.com/UcnfRWqnQtEAAAAC/kiss-anime-cute.gif",
"https://media.tenor.com/KE3VW3qP4RAAAAAC/kiss.gif",
"https://media.tenor.com/wQyttVAvkF0AAAAC/forehead-kiss-anime.gif",
"https://media.tenor.com/G9V_XexWNR4AAAAC/sasuhina-anime.gif",
"https://media.tenor.com/Ko1AOLzUmyEAAAAC/kiss-anime.gif",
"https://media.tenor.com/ZIfFiEBuKsAAAAAC/kiss-anime.gif",
"https://media.tenor.com/lK1PF-Xv1O4AAAAC/yato-anime-noragami.gif",
"https://media.tenor.com/7T1cuiOtJvQAAAAC/anime-kiss.gif",
"https://media.tenor.com/tJiq6XLJccIAAAAC/kiss-couple.gif",
"https://media.tenor.com/1DHutkXy3FEAAAAC/kiss-anime.gif",];
        let gif = gifs[Math.floor(Math.random() * gifs.length)];
        let user = interaction.options.getUser("user");
        if (!user) return interaction.reply("Please provide a valid user.");
        if (user === interaction.user) return interaction.reply("You can't kiss yourself.");
        let member = await this.client.users.fetch(user);
        if (!member) return interaction.reply("Please provide a valid user.");
        let embed = this.client.util.embed()
        .setAuthor({ name: `${interaction.user.username} kisses ${member.username}'s lips~`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setImage(gif)
        .setColor(this.client.config.Client.PrimaryColor)
        interaction.reply({ embeds: [embed] })
    }

}