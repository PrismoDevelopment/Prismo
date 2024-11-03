const request = new (require('rss-parser'))();
const Command = require("../../abstract/command");

module.exports = class notificatiom extends Command {
    constructor(...args) {
        super(...args, {
            name: "ytnotifier",
            aliases: ["ytnotification", "ytchannel", "ytchannelnotifier", "ytchannelnotificat"],
            description: "Set a notification for a youtube channel.",
            usage: ["ytnotifier"],
            category: "Utilities",
            examples: ["ytnotifier https://www.youtube.com/channel/UCpEhnqL0y41EpW2TvWAHD7Q #general true"],
            userPerms: ["SendMessages", "Administrator"],
            guildOnly: true,
            botPerms: ["SendMessages", "EmbedLinks"],
            cooldown: 20,
            image: "https://imgur.com/iEZrusL",
            options: [
                {
                    type: 1,
                    name: "enable",
                    description: "Enable notifications for a channel.",
                    options: [
                        {
                            name: "link",
                            description: "The youtube channel to set notifications for.",
                            type: 3,
                            required: true
                        },
                        {
                            name: "channel",
                            description: "The channel to send notifications in.",
                            type: 7,
                            required: true
                        },
                        {
                            name: "everyone",
                            description: "Whether to ping everyone or not.",
                            type: 5,
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: "disable",
                    description: "Disable notifications for a channel.",
                }
            ]
        });
    }

    async run({ message, args }) {
        let guildData = await this.client.database.ytData.get(message.guild.id);
        let buttons = [];
        if (!guildData?.ytchannel) {
            buttons.push({
                type: 2,
                label: "Enable",
                style: 1,
                custom_id: "enable"
            });
        } else {
            buttons.push({
                type: 2,
                label: "Disable",
                style: 4,
                custom_id: "disable"
            });
        }
        let msg = await message.channel.send({ content: `Youtube notifications are currently ${guildData?.ytchannel ? "enabled" : "disabled"} for this server.`, components: [{ type: 1, components: buttons }] });
        let collector = msg.createMessageComponentCollector((button) => button.clicker.user.id === message.author.id, { time: 30000 });
        collector.on("collect", async (button) => {
            if (button.customId === "enable") {
                await button.deferUpdate();
                let nuinuimsg = await message.channel.send({ content: "Please provide the youtube channel url." });
                let nuinuicollector = nuinuimsg.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 30000 });
                await new Promise((resolve) => {
                    nuinuicollector.on("collect", async (m) => {
                        if (m.content.toLowerCase() === "cancel") return nuinuicollector.stop("cancelled");
                        let channelid;
                        if (m.content.startsWith('https')) {
                            channelid = m.content.split("/")[4];
                        } else {
                            channelid = m.content;
                        }
                        request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelid}`).then(async (data) => {
                            if (!data.title) return nuinuicollector.stop("invalid");
                            let id = data?.items[0]?.id
                            if (guildData.postedvids.includes(id)) return nuinuicollector.stop("already");
                            if (id) guildData.postedvids.push(id);
                        }).catch(() => {
                            return;
                        });
                        nuinuicollector.stop();
                        nuinuimsg.delete().catch(() => { });
                        guildData.ytchannel = channelid;
                        resolve()
                    });
                });
                nuinuicollector.on("end", async (collected, reason) => {
                    if (reason === "time") return nuinuimsg.edit({ content: "You took too long to respond." });
                });

                let nuinuimsg2 = await message.channel.send({ content: "Please provide the channel to send notifications in." });
                let nuinuicollector2 = nuinuimsg2.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 30000 });
                await new Promise((resolve) => {
                    nuinuicollector2.on("collect", async (m) => {
                        if (m.content.toLowerCase() === "cancel") return nuinuicollector2.stop("cancelled");
                        let channel = m.mentions.channels.first() || message.guild.channels.cache.get(m.content);
                        if (!channel) return nuinuicollector2.stop("invalid");
                        nuinuicollector2.stop();
                        nuinuimsg2.delete().catch(() => { });
                        guildData.channel = channel.id;
                        resolve()
                    });
                });
                nuinuicollector2.on("end", async (collected, reason) => {
                    if (reason === "time") return nuinuimsg2.edit({ content: "You took too long to respond." });
                    if (reason === "invalid") return nuinuimsg2.edit({ content: "Invalid channel provided." });
                });
                let nuinuimsg3 = await message.channel.send({ content: "Please provide whether to ping everyone or not.", components: [{ type: 1, components: [{ type: 2, label: "Yes", style: 3, custom_id: "yes" }, { type: 2, label: "No", style: 4, custom_id: "no" }] }] });
                let nuinuicollector3 = nuinuimsg3.createMessageComponentCollector((button) => button.clicker.user.id === message.author.id, { time: 30000 });
                nuinuicollector3.on("collect", async (button) => {
                    if (button.customId === "yes") {
                        await button.deferUpdate();
                        guildData.ping = true;
                        await this.client.database.ytData.post(message.guild.id, guildData);
                        nuinuimsg3.delete().catch(() => { });
                        nuinuicollector3.stop();
                        msg.edit({ content: "Youtube notifications have been enabled for this server.", components: [] });
                    } else if (button.customId === "no") {
                        await button.deferUpdate();
                        guildData.ping = false;
                        await this.client.database.ytData.post(message.guild.id, guildData);
                        msg.edit({ content: "Youtube notifications have been enabled for this server.", components: [] });
                        nuinuimsg3.delete().catch(() => { });
                        nuinuicollector3.stop();
                    }
                });
                nuinuicollector3.on("end", async (collected, reason) => {
                    if (reason === "time") return nuinuimsg3.edit({ content: "You took too long to respond." });
                    nuinuimsg3.edit({ content: "Youtube notifications have been enabled for this server." });
                });
            } else if (button.customId === "disable") {
                await button.deferUpdate();
                guildData.ytchannel = null;
                guildData.channel = null;
                guildData.ping = null;
                await this.client.database.ytData.post(message.guild.id, guildData);
                msg.edit({ content: "Youtube notifications have been disabled for this server.", components: [] });
            }
        });
        collector.on("end", async (collected, reason) => {
            if (reason === "time") return msg.edit({ content: "You took too long to respond." });
            msg.edit({ content: `Youtube notifications are currently ${guildData?.ytchannel ? "enabled" : "disabled"} for this server.`, components: [] });
        });
    }

    async exec({ interaction }) {
        let guildData = await this.client.database.ytData.get(interaction.guild.id);
        let subcommand = interaction.options.getSubcommand();
        if (subcommand === "enable") {
            if(guildData.ytchannel) return interaction.reply({ content: "Youtube notifications are already enabled for this server.", ephemeral: true } );
            let channel = interaction.options.getChannel("channel");
            let ping = interaction.options.getBoolean("everyone");
            let channelid = interaction.options.getString("link");
            if (channelid.startsWith('https')) {
                channelid = channelid.split("/")[4];
            }
            request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelid}`).then(async (data) => {
                if (!data.title) return interaction.reply({ content: "Invalid channel provided.", ephemeral: true });
                let id = data?.items[0]?.id
                if (guildData.postedvids.includes(id)) return interaction.reply({ content: "This channel is already enabled.", ephemeral: true });
                if (id) guildData.postedvids.push(id);
            }
            ).catch(() => {
                return interaction.reply({ content: "Invalid channel provided.", ephemeral: true });
            });
            guildData.ytchannel = channelid;
            guildData.channel = channel.id;
            guildData.ping = ping;
            await this.client.database.ytData.post(interaction.guild.id, guildData);
            interaction.reply({ content: "Youtube notifications have been enabled for this server." });
        } else if (subcommand === "disable") {
            if(!guildData.ytchannel) return interaction.reply({ content: "Youtube notifications are already disabled for this server.", ephemeral: true } );
            guildData.ytchannel = null;
            guildData.channel = null;
            guildData.ping = null;
            await this.client.database.ytData.post(interaction.guild.id, guildData);
            interaction.reply({ content: "Youtube notifications have been disabled for this server." });
        }
    }
}


