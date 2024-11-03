const Command = require("../../abstract/command");
const ms = require('ms');
const { parseEmoji } = require('discord.js');
module.exports = class Dare extends Command {
    constructor(...args) {
        super(...args, {
            name: "gstart",
            aliases: ["giveawaystart"],
            description: "Start a giveaway.",
            category: "Giveaways",
            usage: ["gstart <time> <winner count> <prize>"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages", "EmbedLinks", "AddReactions"],
            cooldown: 5,
            image: "https://imgur.com/Dq9iRSF",
            options: [
                {
                    name: "time",
                    description: "The time of the giveaway.",
                    type: 3,
                    required: true
                },
                {
                    name: "winners",
                    description: "The winners of the giveaway.",
                    type: 4,
                    required: true
                },
                {
                    name: "prize",
                    description: "The prize of the giveaway.",
                    type: 3,
                    required: true
                },
                {
                    name: "image",
                    description: "The image of the giveaway.",
                    type: 11,
                    required: false
                },
                {
                    name: "reaction",
                    description: "The reaction of the giveaway.",
                    type: 3,
                    required: false
                }
            ]
        });
    }
    async run({ message, args }) {
        // check if user have manageGuild permission or a role named "giveaways" or server owner or bot owner or role "giveaway"
        const hasPerm = message?.member.permissions.has("ManageGuild") || message?.member.roles.cache.some(r => r.name.toLowerCase() === 'giveaways') || message?.guild.ownerId === message?.author.id || this.client.util.checkOwner(message?.author.id) || message?.member.roles.cache.some(r => r.name.toLowerCase() === 'giveaway');
        if (!hasPerm) return message?.reply({ embeds: [this.client.util.embed().setDescription(`You don't have permission to use this command.`).setColor(this.client.config.Client.ErrorColor)] })
        let time = args[0];
        let winners = args[1];
        let reaction = this.client.config.Client.emoji.giveaway2;
        let prize = args.slice(2).join(" ").replace(/<a?:.+?:\d+>/g, "");
        let image = message?.attachments.first() ? message?.attachments.first().url : null;
      
        // Find the emoji in the arguments using regular expressions
        for (let i = 2; i < args.length; i++) {
          if (/^<a?:.+?:\d+>$/.test(args[i])) {
            reaction = args[i];
            break;
          }
        }      
        let emoji = parseEmoji(reaction);
        if (!emoji.id) return message?.reply({ embeds: [this.client.util.embed().setDescription(`The reaction must be a custom emoji.`).setColor(this.client.config.Client.ErrorColor)] })
        if (!time) return message?.reply({ embeds: [this.client.util.embed().setDescription(`You have missed an option \`time\`. Example:\n\`\`\`yml\n${message?.guild.config.prefix}gstart <time> <winners> <prize>\n\`\`\``).setColor(this.client.config.Client.ErrorColor)] })
        if (!winners) return message?.reply({ embeds: [this.client.util.embed().setDescription(`You have missed an option \`winners\`. Example:\n\`\`\`yml\n${message?.guild.config.prefix}gstart <time> <winners> <prize>\n\`\`\``).setColor(this.client.config.Client.ErrorColor)] })
        if (winners.endsWith("w")) winners = winners.replace("w", "")
        if (!prize) return message?.reply({ embeds: [this.client.util.embed().setDescription(`You have missed an option \`prize\`. Example:\n\`\`\`yml\n${message?.guild.config.prefix}gstart <time> <winners> <prize>\n\`\`\``).setColor(this.client.config.Client.ErrorColor)] })
        if (isNaN(ms(time)) || !ms(time)) return message?.reply({ embeds: [this.client.util.embed().setDescription(`The time must be a number.`).setColor(this.client.config.Client.ErrorColor)] })
        if (isNaN(winners)) return message?.reply({ embeds: [this.client.util.embed().setDescription(`The winners must be a number.`).setColor(this.client.config.Client.ErrorColor)] })
        if (winners > 10) return message?.reply({ embeds: [this.client.util.embed().setDescription(`The winners must be less than 10.`).setColor(this.client.config.Client.ErrorColor)] })
        this.client.giveawayManager.start(message?.channel, {
            hoster: message?.author,
            prize: prize,
            winnerCount: winners,
            duration: ms(time),
            reaction: emoji.id,
            messages: {
                image: image
            }
        })
        message?.delete().catch(() => { });
    }

    async exec({ interaction }) {
        let time = interaction?.options.getString("time");
        let winners = interaction?.options.getInteger("winners");
        let reaction = interaction?.options.getString("reaction") ? interaction?.options.getString("reaction") : this.client.config.Client.emoji.giveaway2;
        let prize = interaction?.options.getString("prize").replace(/<a?:.+?:\d+>/g, "");
        let emoji = parseEmoji(reaction);
        let image = interaction?.options.get("image") ? interaction?.options.get("image").attachment.attachment : null;
        if (!time) return interaction?.reply({ embeds: [this.client.util.embed().setDescription(`You have missed an option \`time\`. Example:\n\`\`\`yml\n${interaction?.guild.config.prefix}gstart <time> <winners> <prize>\n\`\`\``).setColor(this.client.config.Client.ErrorColor)] })
        if (!winners) return interaction?.reply({ embeds: [this.client.util.embed().setDescription(`You have missed an option \`winners\`. Example:\n\`\`\`yml\n${interaction?.guild.config.prefix}gstart <time> <winners> <prize>\n\`\`\``).setColor(this.client.config.Client.ErrorColor)] })
        if (!prize) return interaction?.reply({ embeds: [this.client.util.embed().setDescription(`You have missed an option \`prize\`. Example:\n\`\`\`yml\n${interaction?.guild.config.prefix}gstart <time> <winners> <prize>\n\`\`\``).setColor(this.client.config.Client.ErrorColor)] })
        if (isNaN(ms(time)) || !ms(time)) return interaction?.reply({ embeds: [this.client.util.embed().setDescription(`The time must be a number.`).setColor(this.client.config.Client.ErrorColor)] })
        if (isNaN(winners)) return interaction?.reply({ embeds: [this.client.util.embed().setDescription(`The winners must be a number.`).setColor(this.client.config.Client.ErrorColor)] })
        if (winners > 10) return interaction?.reply({ embeds: [this.client.util.embed().setDescription(`The winners must be less than 10.`).setColor(this.client.config.Client.ErrorColor)] })
        this.client.giveawayManager.start(interaction?.channel, {
            hoster: interaction?.user,
            prize: prize,
            winnerCount: winners,
            duration: ms(time),
            reaction: emoji.id,
            messages: {
                image: image
            }
        })
        interaction?.reply({
            content: `Giveaway started in ${interaction?.channel}`,
            ephemeral: true
        })
    }
}