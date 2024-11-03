const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "greet",
            aliases: ["greetping"],
            description: "will ping the user and autodelete it",
            usage: ["greet", "greetping"],
            category: "Welcome",
            userPerms: ["ManageGuild"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/iLDFc5a.png",
            options: [
                {
                    type: 7,
                    name: "channel",
                    description: "Channel To Greet",
                    required: true,
                },
            ],
        });
    }
    async run({ message, args }) {
        const data = await this.client.database.guildData.get(message?.guild.id);
        if (args[0] === "test") {
            if (!data.greet.enabled) return message?.reply(`${this.client.config.Client.emoji.cross} Greet is not enabled!`)
            return this.client.emit("guildMemberAdd", message?.member);
        } else if (args[0] === "disable") {
            if (!data.greet.enabled) return message?.reply(`${this.client.config.Client.emoji.cross} Greet is not enabled!`)
            data.greet.enabled = false;
            this.client.database.guildData.putGreet(message?.guild.id, data.greet);
            return message?.reply(`${this.client.config.Client.emoji.tick} Greet has been disabled!`)
        } else if (args[0] === "list") {
            if (!data.greet.enabled) return message?.reply(`${this.client.config.Client.emoji.cross} Greet is not enabled!`)
            let channels = [];
            data.greet.channel.forEach((c) => {
                let channel = message?.guild.channels.cache.get(c);
                if (channel) channels.push(`<#${channel.id}>`);
            });
            if (channels.length === 0) return message?.reply(`${this.client.config.Client.emoji.cross} No channels are set!`)
            let hemuembed = this.client.util.embed()
                .setTitle("Greet Channels")
                .setDescription(channels.join("\n"))
                .setColor(`${this.client.util.color(message)}`);
            return message?.reply({ embeds: [hemuembed] });
        }
        let channel = message?.mentions.channels.first() || message?.channel;
        if (!channel) return message?.reply(`${this.client.config.Client.emoji.cross} Please mention a channel!`)
        if (data.greet.channel.includes(channel.id)) {
            data.greet.channel = data.greet.channel.filter(
                (c) => c !== channel.id
            );
            this.client.database.guildData.putGreet(
                message?.guild.id,
                data.greet
            );
            if (data.greet.channel.length === 0) {
                data.greet.enabled = false;
                this.client.database.guildData.putGreet(
                    message?.guild.id,
                    data.greet
                );
            }
            return message?.reply(`${this.client.config.Client.emoji.tick} Greet has been disabled in <#${channel.id}>`);
        } else {
            data.greet.channel.push(channel.id);
            this.client.database.guildData.putGreet(
                message?.guild.id,
                data.greet
            );
            if(data.greet.channel.length === 3) return message?.reply(`${this.client.config.Client.emoji.cross} You can only set greet in 3 channels!`)
            if (data.greet.channel.length > 0) {
                data.greet.enabled = true;
                this.client.database.guildData.putGreet(
                    message?.guild.id,
                    data.greet
                );
            }
            return message?.reply(`${this.client.config.Client.emoji.tick} Enabled greet for <#${channel.id}>`);
        }
    }

    async exec({ interaction, args }) {
        const data = await this.client.database.guildData.get(
            interaction?.guild.id
        );
        let channel = interaction?.options.getChannel("channel");
        if (!channel) return interaction?.reply(`${this.client.config.Client.emoji.cross} Please mention a channel!`);
        if (data.greet.channel.includes(channel.id)) {
            data.greet.channel = data.greet.channel.filter(
                (c) => c !== channel.id
            );
            this.client.database.guildData.putGreet(
                interaction?.guild.id,
                data.greet
            );
            if (data.greet.channel.length === 0) {
                data.greet.enabled = false;
                this.client.database.guildData.putGreet(
                    interaction?.guild.id,
                    data.greet
                );
            }
            return interaction?.reply(
                `${this.client.config.Client.emoji.tick} Greet has been disabled in <#${channel.id}>`
            );
        } else {
            data.greet.channel.push(channel.id);
            this.client.database.guildData.putGreet(
                interaction?.guild.id,
                data.greet
            );
            if (data.greet.channel.length > 0) {
                data.greet.enabled = true;
                this.client.database.guildData.putGreet(
                    interaction?.guild.id,
                    data.greet
                );
            }
            return interaction?.reply(`${this.client.config.Client.emoji.tick} Enabled greet for <#${channel.id}>`);
        }
    }
};
