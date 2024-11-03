const Command = require("../../abstract/command");
const { PermissionsBitField } = require("discord.js");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "timeout",
            aliases: ["mute", "tmute", "stfu"],
            description: "Mutes a User",
            usage: ["timeouts <user> <time> <reason>"],
            category: "Moderation",
            userPerms: ["ModerateMembers"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "ModerateMembers",
            ],
            cooldown: 3,
            image:"https://imgur.com/PYD1RBa",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "User To Timeout",
                    required: true,
                },
                {
                    type: 3,
                    name: "time",
                    description: "Time To Timeout",
                    required: false,
                },
                {
                    type: 3,
                    name: "reason",
                    description: "Reason For Timeout",
                    required: false,
                },
            ],
        });
    }
    async run({ message, args }) {
        const owner = this.client.util.checkOwner(message?.author.id);
        const user = await this.client.util.userQuery(args[0]);
        if (!user) return message?.reply({ content: "Please provide a valid user." });
      
        let muteTime = 600;
        const maxMuteTime = 2332800000;
        let timeArg = args[1];
      
        if (!timeArg) {
          timeArg = 600;
        } else {
          timeArg = timeArg.replace(/\D/g, '');
          if (timeArg === '') timeArg = 600;
          else if (args[1].endsWith('s') || args[1].endsWith('sec') || args[1].endsWith('second')) timeArg *= 1;
          else if (args[1].endsWith('m') || args[1].endsWith('min') || args[1].endsWith('minute')) timeArg *= 60;
          else if (args[1].endsWith('h') || args[1].endsWith('hr') || args[1].endsWith('hour')) timeArg *= 60 * 60;
          else if (args[1].endsWith('d') || args[1].endsWith('day')) timeArg *= 60 * 60 * 24;
        }
      
        muteTime = Math.min(timeArg * 1000, maxMuteTime);
      
        if (isNaN(muteTime) || muteTime < 1) {
          return message?.reply({ content: "Please provide a valid time." });
        }
        let reason = args.slice(2).join(" ") || "No Reason Provided";
        if (!reason)
            return message?.reply({ content: "Please provide a valid reason." });
        const member = await message?.guild.members.fetch(user);
        if (!member)
            return message?.reply({ content: "That user isn't in this guild!" });
        let membercheckowner = this.client.util.checkOwner(member.user.id);
        if (membercheckowner)
            return message?.reply({ content: "You can't mute the bot owner!" });
        if (owner) {
            if (member.id === message?.author.id)
                return message?.reply({
                    content: "Is it Possble that I can mute you?",
                });
            if (member.id === this.client.user.id)
                return message?.reply({
                    content:
                        "You wanted to mute me? Rude owner <:FHT_godfather_Huh:1047391502751506462> I knew that you don't love me at all",
                });
        } else {
            if (member.id === message?.author.id)
                return message?.reply({ content: "You can't mute yourself!" });
            if (member.id === this.client.user.id)
                return message?.reply({ content: "You can't mute me!" });
        }
        if (member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message?.reply({ content: "You can't timeout an admin!" });
        if (!owner && message.author.id !== message.guild.ownerId) {
            if (
                member.roles.highest.position >=
                message?.member.roles.highest.position
            )
                return message?.reply({
                    content:
                        "You can't timeout a user with same or higher roles as you!",
                });
            if (
                member.roles.highest.position >=
                message?.guild.members.cache.get(this.client.user.id).roles
                    .highest.position
            )
                return message?.reply({
                    content:
                        "I can't timeout someone with a higher role than me!",
                });
        }
        if (!member.manageable)
            return message?.reply({ content: "I can't timeout that user!" });
        if (member.communicationDisabledUntil)
            return message?.reply({
                content: "That user is already timed out!",
            });
        let time = await this.client.util.gettime(this.client);
        await member.timeout(muteTime, reason);
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully timed out ${member}`)
            .setColor(this.client.config.Client.PrimaryColor);
        return message?.reply({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const user = interaction?.options.getMember("user");
        let muteTime = 600;
        const maxMuteTime = 2332800000;
        let timeArg = interaction?.options.getString("time");
      
        if (timeArg) {
          timeArg = timeArg.replace(/\D/g, '');
          if (timeArg === '') timeArg = 600;
          else if (timeArg.endsWith('s') || timeArg.endsWith('sec') || timeArg.endsWith('second')) timeArg *= 1;
          else if (timeArg.endsWith('m') || timeArg.endsWith('min') || timeArg.endsWith('minute')) timeArg *= 60;
          else if (timeArg.endsWith('h') || timeArg.endsWith('hr') || timeArg.endsWith('hour')) timeArg *= 60 * 60;
          else if (timeArg.endsWith('d') || timeArg.endsWith('day')) timeArg *= 60 * 60 * 24;
        }
      
        muteTime = Math.min(timeArg * 1000, maxMuteTime);
      
        if (isNaN(muteTime) || muteTime < 1) {
          return interaction?.reply({ content: "Please provide a valid time." });
        }
      
        const displayMuteTime = muteTime;
        let reason =
            interaction?.options.getString("reason") || "No Reason Provided";
        if (!reason)
            return interaction?.reply({
                content: "Please provide a valid reason.",
            });
        let member = interaction?.guild.members.cache.get(user.id);
        if (!member)
            return interaction?.reply({
                content: "That user isn't in this guild!",
            });
        let membercheckowner = this.client.util.checkOwner(member.user.id);
        if (membercheckowner)
            return interaction?.reply({
                content: "You can't ban the bot owner!",
            });
        if (member.permissions.has(PermissionsBitField.Flags.Administrator))
            return interaction?.reply({
                content: "You can't timeout an admin!",
            });
        if (member.id === interaction?.user.id)
            return interaction?.reply({
                content: "You can't timeout yourself!",
            });
        if (member.id === this.client.user.id)
            return interaction?.reply({ content: "You can't timeout me!" });
        if(interaction?.member.id !== interaction?.guild.ownerId) {
        if (
            member.roles.highest.position >=
            interaction?.member.roles.highest.position
        )
            return interaction?.reply({
                content:
                    "You can't timeout a user with same or higher roles as you!",
            });
        }
        if (
            member.roles.highest.position >=
            interaction?.guild.members.cache.get(this.client.user.id).roles
                .highest.position
        )
            return interaction?.reply({
                content: "I can't timeout someone with a higher role than me!",
            });
        if (!member.manageable)
            return interaction?.reply({ content: "I can't timeout that user!" });
        if (member.communicationDisabledUntil)
            return interaction?.reply({
                content: "That user is already timed out!",
            });
        await member.timeout(muteTime, reason);
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully timed out ${member}`)
            .setColor(this.client.config.Client.PrimaryColor);
        return interaction?.reply({ embeds: [embed] });
    }
};
