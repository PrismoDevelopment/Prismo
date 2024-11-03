const Command = require("../../abstract/command");

module.exports = class Pat extends Command {
    constructor(...args) {
        super(...args, {
            name: "pat",
            aliases: ["pat"],
            description: "Pat someone.",
            category: "Fun",
            usage: ["pat @user"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/guPSfAO.png",
            options: [
                {
                    name: "user",
                    description: "The user you want to pat.",
                    type: 6,
                    required: true,
                }
            ]
        });
    }

    async run({ message, args }) {
        let gifs = ["https://media.tenor.com/YroVxwiL2dcAAAAC/ao-haru-ride-anime-boy.gif",
        "https://media.tenor.com/Bps4SVOb8JkAAAAC/head-petting.gif",
        "https://media.tenor.com/PqT70paf394AAAAC/pat.gif",
        "https://media.tenor.com/GC9rg-v-wvMAAAAC/anime-pat.gif",
        "https://media.tenor.com/o0re0DQzkd8AAAAC/anime-head-rub.gif",
        "https://media.tenor.com/oGbO8vW_eqgAAAAC/spy-x-family-anya.gif",
        "https://media.tenor.com/TDqVQaQWcFMAAAAC/anime-pat.gif",
        "https://media.tenor.com/DCMl9bvSDSwAAAAC/pat-head-gakuen-babysitters.gif",
        "https://media.tenor.com/fvUdTeAF95oAAAAC/pat.gif",
        "https://media.tenor.com/E6fMkQRZBdIAAAAC/kanna-kamui-pat.gif",
        "https://media.tenor.com/Dbg-7wAaiJwAAAAC/aharen-aharen-san.gif",
        "https://media.tenor.com/7xrOS-GaGAIAAAAC/anime-pat-anime.gif",
        "https://media.tenor.com/E7Ll04_an30AAAAC/anime-pat.gif",
        "https://media.tenor.com/Z-28SFKJaIsAAAAC/anime-pat.gif",
        "https://media.tenor.com/8o4fWGwBY1EAAAAC/aharensan-aharen.gif",
        "https://media.tenor.com/0mdj-zud0RAAAAAC/tohru-kobayashi.gif",
        "https://media.tenor.com/3PjRNS8paykAAAAC/pat-pat-head.gif",
        "https://media.tenor.com/N41zKEDABuUAAAAC/anime-head-pat-anime-pat.gif",
        "https://media.tenor.com/6dyxfdQx--AAAAAC/anime-senko-san.gif",
        "https://media.tenor.com/TRxNL32jtEIAAAAC/anime-pat.gif",
        "https://media.tenor.com/YMRmKEdwZCgAAAAC/anime-hug-anime.gif",
        "https://media.tenor.com/lnoDyTqMk24AAAAC/anime-anime-headrub.gif",
        "https://media.tenor.com/o_E-CURRMwYAAAAC/anya-forger-loid-forger.gif",
        "https://media.tenor.com/xQB7RKbQcsUAAAAC/rika-tomitake.gif",
        "https://media.tenor.com/jpx4HDUyBLoAAAAC/anime-pat.gif",
        "https://media.tenor.com/2VVGNLi-EV4AAAAC/anime-cute.gif",
        "https://media.tenor.com/tKCbZBKCpAcAAAAC/yes-pat-pat.gif",
        "https://media.tenor.com/aZFqg65KvssAAAAC/pat-anime.gif",
        "https://media.tenor.com/Y7B6npa9mXcAAAAC/rikka-head-pat-pat-on-head.gif",
        "https://media.tenor.com/Nc6VJPpj_NsAAAAC/anime-pat.gif",
        "https://media.tenor.com/RDfGm9ftwx0AAAAC/anime-pat.gif",
        "https://media.tenor.com/XZEbFWdMTlcAAAAC/shikimori-pat.gif",
        "https://media.tenor.com/Hgt-mT0KXN0AAAAC/chtholly-tiat.gif",
        "https://media.tenor.com/EYhRCNjiyIYAAAAC/momokuri-anime-pat.gif",
        "https://media.tenor.com/YNIe4tRbcCUAAAAC/pat.gif",
        "https://media.tenor.com/_BAcJM-rrMMAAAAC/anime-pat.gif",
        "https://media.tenor.com/Av63tpT8Y14AAAAC/pat-head.gif",
        "https://media.tenor.com/CIF_Pa3yepwAAAAC/rika-higurashi.gif",
        "https://media.tenor.com/bdhDKq7U7ycAAAAC/anime-aldnoah.gif",
        "https://media.tenor.com/Ls2uiad4RRUAAAAC/anime-anime-headpat.gif",]
        let user = args[0] ? await this.client.util.userQuery(args[0], message?.guild) : null;
        if (!user) return message?.reply("Please provide a valid user.");
        let gif = gifs[Math.floor(Math.random() * gifs.length)];
        let member = message?.guild.members.cache.get(user);
        if (!member) return message?.reply("Please provide a valid user.");
        if (member.id === message?.author.id) return message?.reply("You can't pat yourself.");
        let embed = this.client.util.embed()
        .setAuthor({ name: `${message?.author.username} pats ${member.user.username}`, iconURL: message?.author.displayAvatarURL({ dynamic: true }) })
        .setImage(gif)
        .setColor(this.client.config.Client.PrimaryColor)
        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let gifs = ["https://media.tenor.com/YroVxwiL2dcAAAAC/ao-haru-ride-anime-boy.gif",
        "https://media.tenor.com/Bps4SVOb8JkAAAAC/head-petting.gif",
        "https://media.tenor.com/PqT70paf394AAAAC/pat.gif",
        "https://media.tenor.com/GC9rg-v-wvMAAAAC/anime-pat.gif",
        "https://media.tenor.com/o0re0DQzkd8AAAAC/anime-head-rub.gif",
        "https://media.tenor.com/oGbO8vW_eqgAAAAC/spy-x-family-anya.gif",
        "https://media.tenor.com/TDqVQaQWcFMAAAAC/anime-pat.gif",
        "https://media.tenor.com/DCMl9bvSDSwAAAAC/pat-head-gakuen-babysitters.gif",
        "https://media.tenor.com/fvUdTeAF95oAAAAC/pat.gif",
        "https://media.tenor.com/E6fMkQRZBdIAAAAC/kanna-kamui-pat.gif",
        "https://media.tenor.com/Dbg-7wAaiJwAAAAC/aharen-aharen-san.gif",
        "https://media.tenor.com/7xrOS-GaGAIAAAAC/anime-pat-anime.gif",
        "https://media.tenor.com/E7Ll04_an30AAAAC/anime-pat.gif",
        "https://media.tenor.com/Z-28SFKJaIsAAAAC/anime-pat.gif",
        "https://media.tenor.com/8o4fWGwBY1EAAAAC/aharensan-aharen.gif",
        "https://media.tenor.com/0mdj-zud0RAAAAAC/tohru-kobayashi.gif",
        "https://media.tenor.com/3PjRNS8paykAAAAC/pat-pat-head.gif",
        "https://media.tenor.com/N41zKEDABuUAAAAC/anime-head-pat-anime-pat.gif",
        "https://media.tenor.com/6dyxfdQx--AAAAAC/anime-senko-san.gif",
        "https://media.tenor.com/TRxNL32jtEIAAAAC/anime-pat.gif",
        "https://media.tenor.com/YMRmKEdwZCgAAAAC/anime-hug-anime.gif",
        "https://media.tenor.com/lnoDyTqMk24AAAAC/anime-anime-headrub.gif",
        "https://media.tenor.com/o_E-CURRMwYAAAAC/anya-forger-loid-forger.gif",
        "https://media.tenor.com/xQB7RKbQcsUAAAAC/rika-tomitake.gif",
        "https://media.tenor.com/jpx4HDUyBLoAAAAC/anime-pat.gif",
        "https://media.tenor.com/2VVGNLi-EV4AAAAC/anime-cute.gif",
        "https://media.tenor.com/tKCbZBKCpAcAAAAC/yes-pat-pat.gif",
        "https://media.tenor.com/aZFqg65KvssAAAAC/pat-anime.gif",
        "https://media.tenor.com/Y7B6npa9mXcAAAAC/rikka-head-pat-pat-on-head.gif",
        "https://media.tenor.com/Nc6VJPpj_NsAAAAC/anime-pat.gif",
        "https://media.tenor.com/RDfGm9ftwx0AAAAC/anime-pat.gif",
        "https://media.tenor.com/XZEbFWdMTlcAAAAC/shikimori-pat.gif",
        "https://media.tenor.com/Hgt-mT0KXN0AAAAC/chtholly-tiat.gif",
        "https://media.tenor.com/EYhRCNjiyIYAAAAC/momokuri-anime-pat.gif",
        "https://media.tenor.com/YNIe4tRbcCUAAAAC/pat.gif",
        "https://media.tenor.com/_BAcJM-rrMMAAAAC/anime-pat.gif",
        "https://media.tenor.com/Av63tpT8Y14AAAAC/pat-head.gif",
        "https://media.tenor.com/CIF_Pa3yepwAAAAC/rika-higurashi.gif",
        "https://media.tenor.com/bdhDKq7U7ycAAAAC/anime-aldnoah.gif",
        "https://media.tenor.com/Ls2uiad4RRUAAAAC/anime-anime-headpat.gif",]
        let user = interaction?.options.getUser("user")
        if (!user) return interaction?.reply({ content: "Please provide a valid user.", ephemeral: true });
        let gif = gifs[Math.floor(Math.random() * gifs.length)];
        let member = interaction?.guild.members.cache.get(user);
        if (!member) return interaction?.reply({ content: "Please provide a valid user.", ephemeral: true });
        if (member.id === interaction?.user.id) return interaction?.reply({ content: "You can't pat yourself.", ephemeral: true });
        let embed = this.client.util.embed()
        .setAuthor({ name: `${interaction?.user.username} pats ${member.user.username}`, iconURL: interaction?.user.displayAvatarURL({ dynamic: true }) })
        .setImage(gif)
        .setColor(this.client.config.Client.PrimaryColor)
        interaction?.reply({ embeds: [embed] });
    }
}