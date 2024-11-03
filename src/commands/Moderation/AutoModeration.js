const Command = require("../../abstract/command");

module.exports = class AutoModeration extends Command {
    constructor(...args) {
        super(...args, {
            name: "automoderation",
            aliases: ["automod"],
            description: "AutoModerate your server with ease",
            usage: ["automoderation <enable/disable>"],
            category: "Moderation",
            userPerms: ["ManageGuild"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            vote: false,
            cooldown: 5,
            image: "https://imgur.com/jmraDk4",
            options: [
                {
                    type: 1,
                    name: "enable",
                    description: "Enable AutoModeration",
                },
                {
                    type: 1,
                    name: "disable",
                    description: "Disable AutoModeration",
                },
            ],
        });
    }

    async run({ message, args}) {
        if (!args[0]) return this.client.util.errorDelete(message, `You Must Specify A Option! (enable/disable)`);
        if (args[0] === 'enable') {

            let engwordlist = ["*https://*", "*https://*", "*discord.gg*", "*discord.com/invite*", "-NUS*", "anal", "anus", "anus*", "ANUS*", "arse", "asshat", "asshat*", "asshole", "asshole*", "b0", "b1tch", "b1tch*", "ballsac", "ballsac*", "ballsack", "ballsack*", "bct", "bct*", "bct.", "bcta", "bcta*", "bdsm", "bdsm*", "beastiality", "beastiality*", "beefcurtains", "beefcurtains*", "biatch", "biatch*", "bitch", "bitch*", "blowjob", "blowjob*", "Blowjob", "Blowjob*", "blowjobs", "blowjobs*", "bo0b", "bollock", "bollock*", "bollok", "bollok*", "boner", "boner*", "boob", "boobs", "booty", "booty*", "Boquete", "Boquete*", "BOQUETE*", "BOSSETA*", "Brasino", "buceta", "buceta*", "BUCETA*", "Bucetão", "Bucetão*", "bucetinha", "bucetinha*", "Bucetuda", "Bucetuda*", "Bucetudinha", "Bucetudinha*", "bucta", "bucta*", "Busseta", "Busseta*", "BUSSETA*", "Buttock", "Buttock*", "buttplug", "buttplug*", "buzeta", "buzeta*", "ceu pau", "chupo paus", "clitoris", "clitoris*", "cock", "comendo a tua", "comendo o teu", "comendo teu", "comendo tua", "comerei a sua", "comerei o seu", "comerei sua", "comi a sua", "comi o seu", "comi sua", "Culhao", "Culhao*", "cum", "cunt", "cunt*", "Curalho", "Curalho*", "Cuzinho", "Cuzinho*", "Cuzuda", "Cuzuda*", "CUZUDA*", "Cuzudo", "Cuzudo*", "CUZUDO*", "da o cu", "deepthroat", "deepthroat*", "dei o cu", "dick", "dick*", "dildo", "dildov", "ecchi", "ecchi*", "ejaculate", "erection", "erection*", "f0de", "f0de*", "feck", "feck*", "felching", "felching*", "fellate", "fellate*", "fellatio", "fellatio*", "fiIho da pta", "Fiquei ate ereto", "Fiquei até ereto", "fodar", "fodar*", "fode", "fode*", "FODE*", "foder", "foder*", "FODIDA*", "FORNICA*", "fuc", "fuck*", "fucks", "fucks*", "Fucky", "FUDE¦+O*", "FUDECAO*", "FUDENDO*", "FUDIDA*", "FUDIDO*", "g0z@ndo", "g0z@ndo*", "g0z@r", "g0z@r*", "g0zando", "g0zando*", "g0zar", "g0zar*", "gemida", "gemida*", "genitals", "genitals*", "gey", "gey*", "gosei", "gosei*", "goz@r", "goz@r*", "gozando", "gozando*", "gozar", "gozar*", "Gozei", "Gozei*", "horny", "horny*", "Kudasai", "Kudasai*", "kys", "kys*", "labia", "labia*", "M.A.M.A.D.A", "M.A.M.A.D.A*", "mama", "mamado", "mamado*", "mamo", "masterbating", "masterbating*", "masturbate", "masturbate*", "memama", "memama*", "meu penis", "meu pênis", "Nadega", "Nadega*", "nakedphotos", "nakedphotos*", "P-NIS*", "p0rn", "P0rn0", "P0rn0*", "paugrand", "paugrand*", "peituda", "peituda*", "pelad0", "pelad0*", "PELAD4", "PELAD4*", "pen15", "pen15*", "pen1s", "pen1s*", "penezis", "penezis*", "penis", "piroca", "piroca*", "Piroca", "Piroca*", "Piroco", "Piroco*", "Pirocudo", "piroquinha", "piroquinha*", "piss", "porn", "PornHub", "PornHub*", "porno", "pornô", "pornohug", "pornohug*", "pu55y", "pu55y*", "PUNHET+O*", "Punheta", "Punheta*", "PUNHETA*", "PUNHETAO*", "punheteiro", "punheteiro*", "pussy", "pussy*", "r@b@", "r@b@*", "r@ba", "r@ba*", "rab@", "rab@*", "raba", "raba*", "rape", "rimjob", "rimjob*", "rule34", "rule34*", "scat", "scat*", "scrotum", "scrotum*", "seqsu", "seqsu*", "Sequisu", "Sequisu*", "seu c", "seu cu", "seu pau", "seu penis", "seu pênis", "Sex0", "Sex0*", "sexslaves", "sexslaves*", "sh1t", "shemale", "shemale*", "smegma", "smegma*", "sperm", "spunk", "spunk*", "strap-on", "strap-on*", "strapon", "strapon*", "stripper", "stripper*", "Tesao*", "testicle", "testicle*", "testicules", "testicules*", "tetinha", "tetinha*", "Tezao", "Tezao*", "Tezuda", "Tezuda*", "Tezudo", "Tezudo*", "throat", "throat*", "tits", "tits*", "titt", "titty", "titty*", "toma no cu", "tosser", "tosser*", "trannie", "trannie*", "trannies", "trannies*", "tranny", "tranny*", "Transa", "Transa*", "tubgirl", "tubgirl*", "turd", "turd*", "twat", "twat*", "vadge", "vadge*", "vagane", "vagane*", "vagina", "vagina*", "vai se foder", "vai toma no c", "vai toma no cu", "vai tomar no", "você mama", "wank", "wank*", "wanker", "wanker*", "whore", "whore*", "x-rated", "x-rated*", "Xereca*", "XERERECA*", "XEXECA*", "Xota", "Xota*", "Xoxota*", "xVideos", "xVideos*", "xVidros", "xVidros*", "Yamete", "Yamete*", "you mama", "zoophile", "zoophile*"]
            let check = await message?.guild.autoModerationRules.fetch()
            // check if automod name includes 'Prismo' if so, automod is already enabled in the server
            if (check.some(r => r.name.includes('Prismo'))) return message?.channel.send({
                embeds: [this.client.util.embed().setColor(this.client.util.color(message)).setDescription(`${this.client.config.Client.emoji.tick} | AutoMod is already **enabled** in this server!`).setTimestamp()]
            })
            if (check.size > 0) {
                // if automod is enabled but the name doesn't include 'Prismo' then delete all automod rules
                for (const rule of check) {
                    await message?.guild.autoModerationRules.delete(rule[0]).catch(err => { })
                }
            }
            await message?.guild.autoModerationRules.create({
                name: 'Prismo AutoMod Rule 1',
                eventType: 1,
                triggerType: 1,
                triggerMetadata: {
                    keywordFilter: engwordlist,
                },
                enabled: true,
                reason: `auto-moderation enabled by ${message?.author.username}`,
                actions: [
                    {
                        type: 1,
                        duration: 0,
                        reason: `${message?.author.username} was muted for using a bad word!`,
                    }
                ]
            })
            await message?.guild.autoModerationRules.create({
                name: 'Prismo AutoMod Rule 2',
                eventType: 1,
                triggerType: 5,
                triggerMetadata: {
                    mentionTotalLimit: 5,
                },
                enabled: true,
                reason: `auto-moderation enabled by ${message?.author.username}`,
                actions: [
                    {
                        type: 1,
                        duration: 0,
                        reason: `${message?.author.username} was muted for mentioning too many people!`,
                    }
                ]
            })
            await message?.guild.autoModerationRules.create({
                name: 'Prismo AutoMod Rule 3',
                eventType: 1,
                triggerType: 4,
                triggerMetadata: {
                    presets: [1, 2, 3]
                },
                enabled: true,
                reason: `auto-moderation enabled by ${message?.author.username}`,
                actions: [
                    {
                        type: 1,
                        duration: 0,
                        reason: `${message?.author.username} was muted for using a bad word!`,
                    }
                ]
            })
            await message?.guild.autoModerationRules.create({
                name: 'Prismo AutoMod Rule 4',
                eventType: 1,
                triggerType: 3,
                actions: [
                    {
                        type: 1,
                        duration: 0,
                        reason: `${message?.author.username} was muted for using a bad word!`,
                    }
                ],
                enabled: true,
                reason: `auto-moderation enabled by ${message?.author.username}`,
            })
            await message?.channel.send({
                embeds: [this.client.util.embed().setColor(this.client.util.color(message)).setDescription(`${this.client.config.Client.emoji.tick} | AutoMod has been **enabled** in this server!`).setTimestamp()]
            })
        } else if (args[0] === 'disable') {
            let check = await message?.guild.autoModerationRules.fetch()
            // check if automod name includes 'Prismo' if so, automod is already enabled in the server
            if (!check.some(r => r.name.includes('Prismo'))) return message?.channel.send({
                embeds: [this.client.util.embed().setColor(this.client.util.color(message)).setDescription(`${this.client.config.Client.emoji.tick} | AutoMod is already **disabled** in this server!`).setTimestamp()]
            })
            if (check.size > 0) {
                // if automod is enabled but the name doesn't include 'Prismo' then delete all automod rules
                for (const rule of check) {
                    await message?.guild.autoModerationRules.delete(rule[0]).catch(err => { })
                }
            }
            await message?.channel.send({
                embeds: [this.client.util.embed().setColor(this.client.util.color(message)).setDescription(`${this.client.config.Client.emoji.tick} | AutoMod has been **disabled** in this server!`).setTimestamp()]
            })
        }
    }

    async exec({ interaction }) {
        await interaction?.deferReply()
        let engwordlist = ["*https://*", "*https://*", "*discord.gg*", "*discord.com/invite*", "-NUS*", "anal", "anus", "anus*", "ANUS*", "arse", "asshat", "asshat*", "asshole", "asshole*", "b0", "b1tch", "b1tch*", "ballsac", "ballsac*", "ballsack", "ballsack*", "bct", "bct*", "bct.", "bcta", "bcta*", "bdsm", "bdsm*", "beastiality", "beastiality*", "beefcurtains", "beefcurtains*", "biatch", "biatch*", "bitch", "bitch*", "blowjob", "blowjob*", "Blowjob", "Blowjob*", "blowjobs", "blowjobs*", "bo0b", "bollock", "bollock*", "bollok", "bollok*", "boner", "boner*", "boob", "boobs", "booty", "booty*", "Boquete", "Boquete*", "BOQUETE*", "BOSSETA*", "Brasino", "buceta", "buceta*", "BUCETA*", "Bucetão", "Bucetão*", "bucetinha", "bucetinha*", "Bucetuda", "Bucetuda*", "Bucetudinha", "Bucetudinha*", "bucta", "bucta*", "Busseta", "Busseta*", "BUSSETA*", "Buttock", "Buttock*", "buttplug", "buttplug*", "buzeta", "buzeta*", "ceu pau", "chupo paus", "clitoris", "clitoris*", "cock", "comendo a tua", "comendo o teu", "comendo teu", "comendo tua", "comerei a sua", "comerei o seu", "comerei sua", "comi a sua", "comi o seu", "comi sua", "Culhao", "Culhao*", "cum", "cunt", "cunt*", "Curalho", "Curalho*", "Cuzinho", "Cuzinho*", "Cuzuda", "Cuzuda*", "CUZUDA*", "Cuzudo", "Cuzudo*", "CUZUDO*", "da o cu", "deepthroat", "deepthroat*", "dei o cu", "dick", "dick*", "dildo", "dildov", "ecchi", "ecchi*", "ejaculate", "erection", "erection*", "f0de", "f0de*", "feck", "feck*", "felching", "felching*", "fellate", "fellate*", "fellatio", "fellatio*", "fiIho da pta", "Fiquei ate ereto", "Fiquei até ereto", "fodar", "fodar*", "fode", "fode*", "FODE*", "foder", "foder*", "FODIDA*", "FORNICA*", "fuc", "fuck*", "fucks", "fucks*", "Fucky", "FUDE¦+O*", "FUDECAO*", "FUDENDO*", "FUDIDA*", "FUDIDO*", "g0z@ndo", "g0z@ndo*", "g0z@r", "g0z@r*", "g0zando", "g0zando*", "g0zar", "g0zar*", "gemida", "gemida*", "genitals", "genitals*", "gey", "gey*", "gosei", "gosei*", "goz@r", "goz@r*", "gozando", "gozando*", "gozar", "gozar*", "Gozei", "Gozei*", "horny", "horny*", "Kudasai", "Kudasai*", "kys", "kys*", "labia", "labia*", "M.A.M.A.D.A", "M.A.M.A.D.A*", "mama", "mamado", "mamado*", "mamo", "masterbating", "masterbating*", "masturbate", "masturbate*", "memama", "memama*", "meu penis", "meu pênis", "Nadega", "Nadega*", "nakedphotos", "nakedphotos*", "P-NIS*", "p0rn", "P0rn0", "P0rn0*", "paugrand", "paugrand*", "peituda", "peituda*", "pelad0", "pelad0*", "PELAD4", "PELAD4*", "pen15", "pen15*", "pen1s", "pen1s*", "penezis", "penezis*", "penis", "piroca", "piroca*", "Piroca", "Piroca*", "Piroco", "Piroco*", "Pirocudo", "piroquinha", "piroquinha*", "piss", "porn", "PornHub", "PornHub*", "porno", "pornô", "pornohug", "pornohug*", "pu55y", "pu55y*", "PUNHET+O*", "Punheta", "Punheta*", "PUNHETA*", "PUNHETAO*", "punheteiro", "punheteiro*", "pussy", "pussy*", "r@b@", "r@b@*", "r@ba", "r@ba*", "rab@", "rab@*", "raba", "raba*", "rape", "rimjob", "rimjob*", "rule34", "rule34*", "scat", "scat*", "scrotum", "scrotum*", "seqsu", "seqsu*", "Sequisu", "Sequisu*", "seu c", "seu cu", "seu pau", "seu penis", "seu pênis", "Sex0", "Sex0*", "sexslaves", "sexslaves*", "sh1t", "shemale", "shemale*", "smegma", "smegma*", "sperm", "spunk", "spunk*", "strap-on", "strap-on*", "strapon", "strapon*", "stripper", "stripper*", "Tesao*", "testicle", "testicle*", "testicules", "testicules*", "tetinha", "tetinha*", "Tezao", "Tezao*", "Tezuda", "Tezuda*", "Tezudo", "Tezudo*", "throat", "throat*", "tits", "tits*", "titt", "titty", "titty*", "toma no cu", "tosser", "tosser*", "trannie", "trannie*", "trannies", "trannies*", "tranny", "tranny*", "Transa", "Transa*", "tubgirl", "tubgirl*", "turd", "turd*", "twat", "twat*", "vadge", "vadge*", "vagane", "vagane*", "vagina", "vagina*", "vai se foder", "vai toma no c", "vai toma no cu", "vai tomar no", "você mama", "wank", "wank*", "wanker", "wanker*", "whore", "whore*", "x-rated", "x-rated*", "Xereca*", "XERERECA*", "XEXECA*", "Xota", "Xota*", "Xoxota*", "xVideos", "xVideos*", "xVidros", "xVidros*", "Yamete", "Yamete*", "you mama", "zoophile", "zoophile*"]
        if (interaction?.options.getSubcommand() === 'enable') {
            let check = await interaction?.guild.autoModerationRules.fetch()
            // check if automod name includes 'Prismo' if so, automod is already enabled in the server
            if (check.some(r => r.name.includes('Prismo'))) return interaction?.editReply({
                embeds: [this.client.util.embed().setColor(this.client.util.color(interaction)).setDescription(`${this.client.config.Client.emoji.tick} | AutoMod is already **enabled** in this server!`).setTimestamp()]
            })
            if (check.size > 0) {
                // if automod is enabled but the name doesn't include 'Prismo' then delete all automod rules
                for (const rule of check) {
                    await interaction?.guild.autoModerationRules.delete(rule[0]).catch(err => { })
                }
            }
            await interaction?.guild.autoModerationRules.create({
                name: 'Prismo AutoMod Rule 1',
                eventType: 1,
                triggerType: 1,
                triggerMetadata: {
                    keywordFilter: engwordlist,
                },
                enabled: true,
                reason: `auto-moderation enabled by ${interaction?.user.username}`,
                actions: [
                    {
                        type: 1,
                        duration: 0,
                        reason: `${interaction?.user.username} was muted for using a bad word!`,
                    }
                ]
            })
            await interaction?.guild.autoModerationRules.create({
                name: 'Prismo AutoMod Rule 2',
                eventType: 1,
                triggerType: 5,
                triggerMetadata: {
                    mentionTotalLimit: 5,
                },
                enabled: true,
                reason: `auto-moderation enabled by ${interaction?.user.username}`,
                actions: [
                    {
                        type: 1,
                        duration: 0,
                        reason: `${interaction?.user.username} was muted for mentioning too many people!`,
                    }
                ]
            })
            await interaction?.guild.autoModerationRules.create({
                name: 'Prismo AutoMod Rule 3',
                eventType: 1,
                triggerType: 4,
                triggerMetadata: {
                    presets: [1, 2, 3]
                },
                enabled: true,
                reason: `auto-moderation enabled by ${interaction?.user.username}`,
                actions: [
                    {
                        type: 1,
                        duration: 0,
                        reason: `${interaction?.user.username} was muted for using a bad word!`,
                    }
                ]
            })
            await interaction?.guild.autoModerationRules.create({
                name: 'Prismo AutoMod Rule 4',
                eventType: 1,
                triggerType: 3,
                actions: [
                    {
                        type: 1,
                        duration: 0,
                        reason: `${interaction?.user.username} was muted for using a bad word!`,
                    }
                ],
                enabled: true,
                reason: `auto-moderation enabled by ${interaction?.user.username}`,
            })
            await interaction?.editReply({
                embeds: [this.client.util.embed().setColor(this.client.util.color(interaction)).setDescription(`${this.client.config.Client.emoji.tick} | AutoMod has been **enabled** in this server!`).setTimestamp()]
            })

        } else if (interaction?.options.getSubcommand() === 'disable') {
            let check = await interaction?.guild.autoModerationRules.fetch()
            if (check.size > 0) {
                // if automod is enabled but the name doesn't include 'Prismo' then delete all automod rules
                for (const rule of check) {
                    await interaction?.guild.autoModerationRules.delete(rule[0]).catch(err => { })
                }
            }
            await interaction?.editReply({
                embeds: [this.client.util.embed().setColor(this.client.util.color(interaction)).setDescription(`${this.client.config.Client.emoji.tick} | AutoMod has been **disabled** in this server!`).setTimestamp()]
            })
        }
    }

}