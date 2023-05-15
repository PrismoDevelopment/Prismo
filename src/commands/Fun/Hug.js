const Command = require("../../abstract/command");

module.exports = class Hug extends Command {
    constructor(...args) {
        super(...args, {
            name: "hug",
            aliases: ["hug"],
            description: "Hug someone.",
            category: "Fun",
            usage: ["hug @user"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            options: [
                {
                    name: "user",
                    description: "The user you want to hug.",
                    type: 6,
                    required: true,
                }
            ]
        });
    }

    async run({message, args}) {
        let gifs = [ "https://media.tenor.com/J7eGDvGeP9IAAAAC/enage-kiss-anime-hug.gif",
        "https://media.tenor.com/h-QhClhGTKYAAAAC/tbhk-hug.gif",
        "https://media.tenor.com/nV9t5js6BS0AAAAC/hug.gif",
        "https://media.tenor.com/Maq1tnCFd2UAAAAC/hug-anime.gif",
        "https://media.tenor.com/wUQH5CF2DJ4AAAAC/horimiya-hug-anime.gif",
        "https://media.tenor.com/RWD2XL_CxdcAAAAC/hug.gif",
        "https://media.tenor.com/iyztKN68avcAAAAC/aharen-san-aharen-san-anime.gif",
        "https://media.tenor.com/Q4GaRC6YfYoAAAAC/hug-anime.gif",
        "https://media.tenor.com/cGFtCNuJE6sAAAAC/anime-aesthetic.gif",
        "https://media.tenor.com/kCZjTqCKiggAAAAC/hug.gif",
        "https://media.tenor.com/eHEj-w2p-YMAAAAC/headpat-anime.gif",
        "https://media.tenor.com/G_IvONY8EFgAAAAC/aharen-san-anime-hug.gif",
        "https://media.tenor.com/H7i6GIP-YBwAAAAC/a-whisker-away-hug.gif",
        "https://media.tenor.com/HYkaTQBybO4AAAAC/hug-anime.gif",
        "https://media.tenor.com/3mr1aHrTXSsAAAAC/hug-anime.gif",
        "https://media.tenor.com/7oCaSR-q1kkAAAAC/alice-vt.gif",
        "https://media.tenor.com/8o4fWGwBY1EAAAAC/aharensan-aharen.gif",
        "https://media.tenor.com/mB_y2KUsyuoAAAAC/cuddle-anime-hug.gif",
        "https://media.tenor.com/qXhKSoZaetUAAAAC/anime-anime-hug.gif",
        "https://media.tenor.com/sFmoCYbNycwAAAAC/hug-anime.gif",
        "https://media.tenor.com/Ct4bdr2ZGeAAAAAC/teria-wang-kishuku-gakkou-no-juliet.gif",
        "https://media.tenor.com/NgriQrF0JbkAAAAC/anime-cuddle.gif",
        "https://media.tenor.com/m_bbfF_KS-UAAAAC/engage-kiss-anime-hug.gif",
        "https://media.tenor.com/4Bez5mC86CkAAAAC/hug.gif",
        "https://media.tenor.com/kWzhQRpqK8kAAAAC/shikimori-anime-hug.gif",
        "https://media.tenor.com/QwHSis0hNEQAAAAC/love-hug.gif",
        "https://media.tenor.com/efCURd_-pzQAAAAC/its-ok-you.gif",
        "https://media.tenor.com/fnAHjngiSwoAAAAC/bandori-hug.gif",
        "https://media.tenor.com/UWdOymsSvFkAAAAC/bna-hug-bna.gif",
        "https://media.tenor.com/PCIu5V-_c1QAAAAC/iloveyousomuch-iloveyou.gif",
        "https://media.tenor.com/4R6g5TqvXfgAAAAC/anime-hug.gif",
        "https://media.tenor.com/-Ba-jp3KQQsAAAAC/hug-anime.gif",
        "https://media.tenor.com/DQLvs_3NTkYAAAAC/establife-anime-hug.gif",
        "https://media.tenor.com/5Ob_5GPPdhwAAAAC/hug.gif",
        "https://media.tenor.com/P9QCcdH__n4AAAAC/anime.gif",
        "https://media.tenor.com/_Q9aixiFpGoAAAAC/hug.gif",
        "https://media.tenor.com/yrdaKdQ69WYAAAAC/hug.gif",
        "https://media.tenor.com/ovNCUj6S8ycAAAAC/aharen-san-anime-hug.gif",
        "https://media.tenor.com/oN-XShgf8lUAAAAC/yuusha-yamemasu.gif",
        "https://media.tenor.com/oSPZDjEf9vQAAAAC/anime-hug-anime-hugging.gif",]
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message.reply("Please provide a valid user.");
        let member = await this.client.users.fetch(user);
        if(!member) return message.reply("Please provide a valid user.");
        if (member.id === message.author.id) return message.reply("You cannot hug yourself.");
        let gif = gifs[Math.floor(Math.random() * gifs.length)];
        let embed = this.client.util.embed()
        .setAuthor({name: `${message.author.username} hugged ${member.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setImage(gif)
        .setColor(this.client.config.Client.PrimaryColor)
        message.channel.send({embeds: [embed]});
    }

    async exec({ interaction }) {
        let gifs = [ "https://media.tenor.com/J7eGDvGeP9IAAAAC/enage-kiss-anime-hug.gif",
        "https://media.tenor.com/h-QhClhGTKYAAAAC/tbhk-hug.gif",
        "https://media.tenor.com/nV9t5js6BS0AAAAC/hug.gif",
        "https://media.tenor.com/Maq1tnCFd2UAAAAC/hug-anime.gif",
        "https://media.tenor.com/wUQH5CF2DJ4AAAAC/horimiya-hug-anime.gif",
        "https://media.tenor.com/RWD2XL_CxdcAAAAC/hug.gif",
        "https://media.tenor.com/iyztKN68avcAAAAC/aharen-san-aharen-san-anime.gif",
        "https://media.tenor.com/Q4GaRC6YfYoAAAAC/hug-anime.gif",
        "https://media.tenor.com/cGFtCNuJE6sAAAAC/anime-aesthetic.gif",
        "https://media.tenor.com/kCZjTqCKiggAAAAC/hug.gif",
        "https://media.tenor.com/eHEj-w2p-YMAAAAC/headpat-anime.gif",
        "https://media.tenor.com/G_IvONY8EFgAAAAC/aharen-san-anime-hug.gif",
        "https://media.tenor.com/H7i6GIP-YBwAAAAC/a-whisker-away-hug.gif",
        "https://media.tenor.com/HYkaTQBybO4AAAAC/hug-anime.gif",
        "https://media.tenor.com/3mr1aHrTXSsAAAAC/hug-anime.gif",
        "https://media.tenor.com/7oCaSR-q1kkAAAAC/alice-vt.gif",
        "https://media.tenor.com/8o4fWGwBY1EAAAAC/aharensan-aharen.gif",
        "https://media.tenor.com/mB_y2KUsyuoAAAAC/cuddle-anime-hug.gif",
        "https://media.tenor.com/qXhKSoZaetUAAAAC/anime-anime-hug.gif",
        "https://media.tenor.com/sFmoCYbNycwAAAAC/hug-anime.gif",
        "https://media.tenor.com/Ct4bdr2ZGeAAAAAC/teria-wang-kishuku-gakkou-no-juliet.gif",
        "https://media.tenor.com/NgriQrF0JbkAAAAC/anime-cuddle.gif",
        "https://media.tenor.com/m_bbfF_KS-UAAAAC/engage-kiss-anime-hug.gif",
        "https://media.tenor.com/4Bez5mC86CkAAAAC/hug.gif",
        "https://media.tenor.com/kWzhQRpqK8kAAAAC/shikimori-anime-hug.gif",
        "https://media.tenor.com/QwHSis0hNEQAAAAC/love-hug.gif",
        "https://media.tenor.com/efCURd_-pzQAAAAC/its-ok-you.gif",
        "https://media.tenor.com/fnAHjngiSwoAAAAC/bandori-hug.gif",
        "https://media.tenor.com/UWdOymsSvFkAAAAC/bna-hug-bna.gif",
        "https://media.tenor.com/PCIu5V-_c1QAAAAC/iloveyousomuch-iloveyou.gif",
        "https://media.tenor.com/4R6g5TqvXfgAAAAC/anime-hug.gif",
        "https://media.tenor.com/-Ba-jp3KQQsAAAAC/hug-anime.gif",
        "https://media.tenor.com/DQLvs_3NTkYAAAAC/establife-anime-hug.gif",
        "https://media.tenor.com/5Ob_5GPPdhwAAAAC/hug.gif",
        "https://media.tenor.com/P9QCcdH__n4AAAAC/anime.gif",
        "https://media.tenor.com/_Q9aixiFpGoAAAAC/hug.gif",
        "https://media.tenor.com/yrdaKdQ69WYAAAAC/hug.gif",
        "https://media.tenor.com/ovNCUj6S8ycAAAAC/aharen-san-anime-hug.gif",
        "https://media.tenor.com/oN-XShgf8lUAAAAC/yuusha-yamemasu.gif",
        "https://media.tenor.com/oSPZDjEf9vQAAAAC/anime-hug-anime-hugging.gif",]
        let user = interaction.options.getUser("user");
        if (!user) return interaction.reply({content: "Please provide a valid user.", ephemeral: true});
        if (user.id === interaction.user.id) return interaction.reply({content: "You cannot hug yourself.", ephemeral: true});
        let gif = gifs[Math.floor(Math.random() * gifs.length)];
        let embed = this.client.util.embed()
        .setAuthor({name: `${interaction.user.username} hugged ${user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
        .setImage(gif)
        .setColor(this.client.config.Client.PrimaryColor)
        interaction.reply({embeds: [embed]});
    }
}
