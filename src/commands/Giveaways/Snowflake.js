const Command = require("../../abstract/command");

module.exports = class Snowflake extends Command {
    constructor(...args) {
        super(...args, {
            name: "snowflake",
            aliases: ["timediff"],
            description: "Shows the time difference between between replied message and message ID.",
            category: "Giveaways",
            usage: ["snowflake <id>"],
            userPerms: ["ViewChannel", "SendMessages", "ManageGuild"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://imgur.com/COCmznE",
            options: [
                {
                    name: "1d1",
                    description: "Snowflake to get information about.",
                    type: 3,
                    required: true,
                },
                {
                    name: "id2",
                    description: "Snowflake to get information about.",
                    type: 3,
                    required: true,
                }
            ]
        });
    }
    async run({ message, args }) {
        let repliedmsgid = message?.reference?.messageId;
        if (!repliedmsgid) return message?.reply(`You have to reply to a message to use this command.`)
        let msgid = args[0];
        if (!msgid) return message?.reply(`You have to provide a message ID to use this command.`)
        let msgtime = parseInt(msgid) / 4194304 + 1420070400000;
        msgtime = msgtime / 1000
        let repliedmsgtime = parseInt(repliedmsgid) / 4194304 + 1420070400000;
        repliedmsgtime = repliedmsgtime / 1000
        let seconds = msgtime - repliedmsgtime;
        let minutes = null;
        let hours = null;
        let days = null;
        if (seconds > 60) {
            minutes = seconds / 60;
            seconds = seconds % 60;
        }
        if (minutes > 60) {
            hours = minutes / 60;
            minutes = minutes % 60;
        }
        if (hours > 24) {
            days = hours / 24;
            hours = hours % 24;
        }
        if (days) days = days.toFixed(0)
        if (hours) hours = hours.toFixed(0)
        if (minutes) minutes = minutes.toFixed(0)
        seconds = seconds.toFixed(2)
        let embed = this.client.util.embed()
            .setTitle("Snowflake")
            .setDescription(`**${days ? `${days}** days, **` : ""}${hours ? `${hours}** hours, **` : ""}${minutes ? `${minutes}** minutes, **` : ""}${seconds}** seconds`)
            .addFields({ name: msgid, value: `Sent at <t:${msgtime.toFixed(0)}:D> (<t:${msgtime.toFixed(0)}:T>)`, inline: true }, { name: repliedmsgid, value: `Sent at <t:${repliedmsgtime.toFixed(0)}:D> (<t:${repliedmsgtime.toFixed(0)}:T>)`, inline: true })
            .setColor(this.client.config.Client.PrimaryColor)
            .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Requested by ${message?.author.username}`, iconURL: message?.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
        message?.reply({ embeds: [embed] })
    }

    async exec({ interaction }) {
        let repliedmsgid = interaction?.options.getString("1d1")
        let msgid = interaction?.options.getString("id2")
        if (!repliedmsgid) return interaction?.reply(`You have to provide a message ID to use this command.`)
        if (!msgid) return interaction?.reply(`You have to provide a message ID to use this command.`)
        let msgtime = parseInt(msgid) / 4194304 + 1420070400000;
        msgtime = msgtime / 1000
        let repliedmsgtime = parseInt(repliedmsgid) / 4194304 + 1420070400000;
        repliedmsgtime = repliedmsgtime / 1000
        let seconds = msgtime - repliedmsgtime;
        let minutes = null;
        let hours = null;
        let days = null;
        if (seconds > 60) {
            minutes = seconds / 60;
            seconds = seconds % 60;
        }
        if (minutes > 60) {
            hours = minutes / 60;
            minutes = minutes % 60;
        }
        if (hours > 24) {
            days = hours / 24;
            hours = hours % 24;
        }
        if (days) days = days.toFixed(0)
        if (hours) hours = hours.toFixed(0)
        if (minutes) minutes = minutes.toFixed(0)
        seconds = seconds.toFixed(2)
        let embed = this.client.util.embed()
            .setTitle("Snowflake")
            .setDescription(`**${days ? `${days}** days, **` : ""}${hours ? `${hours}** hours, **` : ""}${minutes ? `${minutes}** minutes, **` : ""}${seconds}** seconds`)
            .addFields({ name: msgid, value: `Sent at <t:${msgtime.toFixed(0)}:D> (<t:${msgtime.toFixed(0)}:T>)`, inline: true }, { name: repliedmsgid, value: `Sent at <t:${repliedmsgtime.toFixed(0)}:D> (<t:${repliedmsgtime.toFixed(0)}:T>)`, inline: true })
            .setColor(this.client.config.Client.PrimaryColor)
            .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Requested by ${interaction?.user.username}`, iconURL: interaction?.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
        interaction?.reply({ embeds: [embed] })
    }
}