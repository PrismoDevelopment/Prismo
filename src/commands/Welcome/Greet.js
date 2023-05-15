const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "greet",
            aliases: ["greetping"],
            description: "Greet the user",
            usage: ["greet", "greetping"],
            category: "Welcome",
            userPerms: ["ManageGuild"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
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
        const data = await this.client.database.guildData.get(message.guild.id);
        let channel = message.mentions.channels.first() || message.channel;
        if (!channel) return message.reply("Please mention a channel!");
        if (data.greet.channel.includes(channel.id)) {
            data.greet.channel = data.greet.channel.filter(
                (c) => c !== channel.id
            );
            this.client.database.guildData.putGreet(
                message.guild.id,
                data.greet
            );
            if (data.greet.channel.length === 0) {
                data.greet.enabled = false;
                this.client.database.guildData.putGreet(
                    message.guild.id,
                    data.greet
                );
            }
            return message.reply(`Greet has been disabled in <#${channel.id}>`);
        } else {
            data.greet.channel.push(channel.id);
            this.client.database.guildData.putGreet(
                message.guild.id,
                data.greet
            );
            if (data.greet.channel.length > 0) {
                data.greet.enabled = true;
                this.client.database.guildData.putGreet(
                    message.guild.id,
                    data.greet
                );
            }
            return message.reply(`Enabled greet for <#${channel.id}>`);
        }
    }

    async exec({ interaction, args }) {
        const data = await this.client.database.guildData.get(
            interaction.guild.id
        );
        let channel = args[0].channel;
        if (!channel) return interaction.reply("Please mention a channel!");
        if (data.greet.channel.includes(channel.id)) {
            data.greet.channel = data.greet.channel.filter(
                (c) => c !== channel.id
            );
            this.client.database.guildData.putGreet(
                interaction.guild.id,
                data.greet
            );
            if (data.greet.channel.length === 0) {
                data.greet.enabled = false;
                this.client.database.guildData.putGreet(
                    interaction.guild.id,
                    data.greet
                );
            }
            return interaction.reply(
                `Greet has been disabled in <#${channel.id}>`
            );
        } else {
            data.greet.channel.push(channel.id);
            this.client.database.guildData.putGreet(
                interaction.guild.id,
                data.greet
            );
            if (data.greet.channel.length > 0) {
                data.greet.enabled = true;
                this.client.database.guildData.putGreet(
                    interaction.guild.id,
                    data.greet
                );
            }
            return interaction.reply(`Enabled greet for <#${channel.id}>`);
        }
    }
};
