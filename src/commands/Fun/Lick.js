const Command = require("../../abstract/command");

module.exports = class Lick extends Command {
    constructor(...args) {
        super(...args, {
            name: "lick",
            aliases: ["lick"],
            description: "Lick someone.",
            category: "Fun",
            usage: ["lick @user"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            options: [
                {
                    name: "user",
                    description: "The user you want to lick.",
                    type: 6,
                    required: true,
                }
            ]
        });
    }

    async run({message, args}) {
        let gifs = ["https://media.tenor.com/35yvpL5feAIAAAAC/lick-anime.gif",
        "https://media.tenor.com/WAh7_pooGSgAAAAC/lick-anime.gif",
        "https://media.tenor.com/rWtIltahEoAAAAAC/kawaii-lick.gif",
        "https://media.tenor.com/Ee5spYRObJoAAAAC/shikimoris-not-just-cute-anime-lick.gif",
        "https://media.tenor.com/al640NjsUccAAAAC/lick-intimate.gif",
        "https://media.tenor.com/jRHZv5jNgKIAAAAC/echidna-ekidona.gif",
        "https://media.tenor.com/kVDKuAE-XaUAAAAC/aurelius465387-toji.gif",
        "https://media.tenor.com/0LMxPQdFBKAAAAAC/nekopara-kiss.gif",
        "https://media.tenor.com/7P2NiwpYJlMAAAAC/anime-shikimoris-not-just-cute.gif",
        "https://media.tenor.com/Ja6awViaQkUAAAAC/anime-lick.gif",
        "https://media.tenor.com/E0awWnyNt0wAAAAC/hololive-kiryu-coco.gif",
        "https://media.tenor.com/PAkHgyYWQI4AAAAC/kuroka-dxd.gif",
        "https://media.tenor.com/Jel-MDAH0ucAAAAC/anime-zero-two.gif",
        "https://media.tenor.com/o5YDW53RaQkAAAAC/kurumi-anime.gif",
        "https://media.tenor.com/gn6-OlTEZLYAAAAC/echidna-rezero.gif",
        "https://media.tenor.com/zT7-z9gYxiEAAAAC/kiss-anime.gif",
        "https://media.tenor.com/BVFbvCZKNEsAAAAC/princess-connect-anime-bite.gif",
        "https://media.tenor.com/g1HYBQGPEVYAAAAC/anime-lick.gif",
        "https://media.tenor.com/YpEwKpuqrgYAAAAC/anime-lick-lips.gif",
        "https://media.tenor.com/jptyXW9sR7cAAAAC/oreimo-animelick.gif",
        "https://media.tenor.com/dbLZE2ebPQ8AAAAC/shachiku-san-anime-lick.gif",
        "https://media.tenor.com/y1ZzQkSmy_oAAAAC/denpa-onna.gif",
        "https://media.tenor.com/IZoJ7z5nBzgAAAAC/lick.gif",
        "https://media.tenor.com/fJ_wJB6LhQ0AAAAC/nerdere-yandere.gif",
        "https://media.tenor.com/Xe57tAOMYO8AAAAC/fubuki-lick.gif",
        "https://media.tenor.com/oF5U0vQI6s0AAAAC/shikimoris-not-just-cute-shikimori.gif",
        "https://media.tenor.com/9iv5CUU5dNEAAAAC/anime-lick.gif",
        "https://media.tenor.com/SLKjKWuCa6sAAAAC/finger-lick-anime.gif",
        "https://media.tenor.com/_Mdo1U57HmQAAAAC/hologra-hololive.gif",
        "https://media.tenor.com/deoKcrsaruEAAAAC/oreimo-lick-lips.gif",
        "https://media.tenor.com/shoUM2k9h5UAAAAC/tohru-lick.gif",
        "https://media.tenor.com/RwDVMVWjC8AAAAAC/anime-lick.gif",
        "https://media.tenor.com/30jarFTFk5kAAAAC/anime-girl.gif",
        "https://media.tenor.com/v4UGxvqSvQoAAAAC/gakkou-anime.gif",
        "https://media.tenor.com/y8ZX_kwwTiUAAAAC/starving-hungry.gif",
        "https://media.tenor.com/Go7wnhOWjSkAAAAC/anime-lick-face.gif",
        "https://media.tenor.com/zIU_JbsnMQ8AAAAC/zatch-bell-golden-gash.gif",
        "https://media.tenor.com/4lSG6T_VUkcAAAAC/shikimoris-not-just-cute-anime-lick.gif",
        "https://media.tenor.com/74HCjRFV_sAAAAAC/delicious-lick-lips.gif",
        "https://media.tenor.com/BGKTRiL0Ho8AAAAC/anime-girl.gif",]
        
        let gif = gifs[Math.floor(Math.random() * gifs.length)];
        let user = args[0] ? await this.client.util.userQuery(args[0]) : null;
        if (!user) return message.reply("Please provide a valid user.");
        if (user === message.author.id) return message.reply("You can't lick yourself.");
        if (user === this.client.user.id) return message.reply("You can't lick me.");
        let member = await this.client.users.fetch(user);
        if (member.bot) return message.reply("You can't lick a bot.");
        if(!member) return message.reply("Please provide a valid user.");
        let embed = this.client.util.embed()
        .setAuthor({name: `${message.author.tag} licked ${member.tag}`, iconURL: message.author.displayAvatarURL()})
        .setImage(gif)
        .setColor(this.client.config.Client.PrimaryColor)
        message.channel.send({ embeds: [embed] });
    }

    async exec({interaction}) {
        let gifs = ["https://media.tenor.com/35yvpL5feAIAAAAC/lick-anime.gif",
        "https://media.tenor.com/WAh7_pooGSgAAAAC/lick-anime.gif",
        "https://media.tenor.com/rWtIltahEoAAAAAC/kawaii-lick.gif",
        "https://media.tenor.com/Ee5spYRObJoAAAAC/shikimoris-not-just-cute-anime-lick.gif",
        "https://media.tenor.com/al640NjsUccAAAAC/lick-intimate.gif",
        "https://media.tenor.com/jRHZv5jNgKIAAAAC/echidna-ekidona.gif",
        "https://media.tenor.com/kVDKuAE-XaUAAAAC/aurelius465387-toji.gif",
        "https://media.tenor.com/0LMxPQdFBKAAAAAC/nekopara-kiss.gif",
        "https://media.tenor.com/7P2NiwpYJlMAAAAC/anime-shikimoris-not-just-cute.gif",
        "https://media.tenor.com/Ja6awViaQkUAAAAC/anime-lick.gif",
        "https://media.tenor.com/E0awWnyNt0wAAAAC/hololive-kiryu-coco.gif",
        "https://media.tenor.com/PAkHgyYWQI4AAAAC/kuroka-dxd.gif",
        "https://media.tenor.com/Jel-MDAH0ucAAAAC/anime-zero-two.gif",
        "https://media.tenor.com/o5YDW53RaQkAAAAC/kurumi-anime.gif",
        "https://media.tenor.com/gn6-OlTEZLYAAAAC/echidna-rezero.gif",
        "https://media.tenor.com/zT7-z9gYxiEAAAAC/kiss-anime.gif",
        "https://media.tenor.com/BVFbvCZKNEsAAAAC/princess-connect-anime-bite.gif",
        "https://media.tenor.com/g1HYBQGPEVYAAAAC/anime-lick.gif",
        "https://media.tenor.com/YpEwKpuqrgYAAAAC/anime-lick-lips.gif",
        "https://media.tenor.com/jptyXW9sR7cAAAAC/oreimo-animelick.gif",
        "https://media.tenor.com/dbLZE2ebPQ8AAAAC/shachiku-san-anime-lick.gif",
        "https://media.tenor.com/y1ZzQkSmy_oAAAAC/denpa-onna.gif",
        "https://media.tenor.com/IZoJ7z5nBzgAAAAC/lick.gif",
        "https://media.tenor.com/fJ_wJB6LhQ0AAAAC/nerdere-yandere.gif",
        "https://media.tenor.com/Xe57tAOMYO8AAAAC/fubuki-lick.gif",
        "https://media.tenor.com/oF5U0vQI6s0AAAAC/shikimoris-not-just-cute-shikimori.gif",
        "https://media.tenor.com/9iv5CUU5dNEAAAAC/anime-lick.gif",
        "https://media.tenor.com/SLKjKWuCa6sAAAAC/finger-lick-anime.gif",
        "https://media.tenor.com/_Mdo1U57HmQAAAAC/hologra-hololive.gif",
        "https://media.tenor.com/deoKcrsaruEAAAAC/oreimo-lick-lips.gif",
        "https://media.tenor.com/shoUM2k9h5UAAAAC/tohru-lick.gif",
        "https://media.tenor.com/RwDVMVWjC8AAAAAC/anime-lick.gif",
        "https://media.tenor.com/30jarFTFk5kAAAAC/anime-girl.gif",
        "https://media.tenor.com/v4UGxvqSvQoAAAAC/gakkou-anime.gif",
        "https://media.tenor.com/y8ZX_kwwTiUAAAAC/starving-hungry.gif",
        "https://media.tenor.com/Go7wnhOWjSkAAAAC/anime-lick-face.gif",
        "https://media.tenor.com/zIU_JbsnMQ8AAAAC/zatch-bell-golden-gash.gif",
        "https://media.tenor.com/4lSG6T_VUkcAAAAC/shikimoris-not-just-cute-anime-lick.gif",
        "https://media.tenor.com/74HCjRFV_sAAAAAC/delicious-lick-lips.gif",
        "https://media.tenor.com/BGKTRiL0Ho8AAAAC/anime-girl.gif",]
        let gif = gifs[Math.floor(Math.random() * gifs.length)];
        let user = interaction.options.getUser("user").id;
        if (user === this.client.user.id) return interaction.reply("You can't lick me.");
        if (user === interaction.user.id) return interaction.reply("You can't lick yourself.");
        let member = await this.client.users.fetch(user);
        if (!member) return interaction.reply("Please mention a valid user.");
        let embed = this.client.util.embed()
        .setAuthor({name: `${interaction.user.username} licked ${member.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
        .setImage(gif)
        .setColor(this.client.config.Client.PrimaryColor)
        interaction.reply({embeds: [embed]})
    }
}