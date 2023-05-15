const Command = require("../../abstract/command");
const { PermissionsBitField } = require("discord.js");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "timeout",
            aliases: ["mute", "tmute", "stfu"],
            description: "Mutes A User",
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
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "User To Timeout",
                    required: true,
                },
                {
                    type: 4,
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
        let owner = this.client.util.checkOwner(message.author.id);
        const user = await this.client.util.userQuery(args[0]);
        if (!user)
            return message.reply({ content: "Please provide a valid user." });
        let muteTime = 60;
        let maxMuteTime = 2332800000;
        let timeArg = args[1];
        if (!timeArg) timeArg = "600";
        else if (timeArg.includes("s")) timeArg = timeArg.replace("s", "");
        else if (timeArg.includes("m")) timeArg = timeArg.replace("m", "") * 60;
        else if (timeArg.includes("h")) timeArg = timeArg.replace("h", "") * 60 * 60;
        else if (timeArg.includes("d")) timeArg = timeArg.replace("d", "") * 60 * 60 * 24;
        muteTime = timeArg * 1000;
        if (isNaN(muteTime) || 1 > muteTime)
            return message.reply({ content: "Please provide a valid time." });
        let displayMuteTime = muteTime;
        muteTime = muteTime;
        if (muteTime > maxMuteTime) {
            muteTime = maxMuteTime;
            displayMuteTime = maxMuteTime;
        }
        let reason = args.slice(2).join(" ") || "No Reason Provided";
        if (!reason)
            return message.reply({ content: "Please provide a valid reason." });
        const member = await message.guild.members.fetch(user);
        if (!member)
            return message.reply({ content: "That user isn't in this guild!" });
        let membercheckowner = this.client.util.checkOwner(member.user.id);
        if (membercheckowner)
            return message.reply({ content: "You can't mute the bot owner!" });
        if (owner) {
            if (member.id === message.author.id)
                return message.reply({
                    content: "Is it Possble that I can mute you?",
                });
            if (member.id === this.client.user.id)
                return message.reply({
                    content:
                        "You wanted to mute me? Rude owner <:FHT_godfather_Huh:1047391502751506462> I knew that you don't love me at all",
                });
        } else {
            if (member.id === message.author.id)
                return message.reply({ content: "You can't mute yourself!" });
            if (member.id === this.client.user.id)
                return message.reply({ content: "You can't mute me!" });
        }
        if (member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply({ content: "You can't timeout an admin!" });
        if (!owner) {
            if (
                member.roles.highest.position >=
                message.member.roles.highest.position
            )
                return message.reply({
                    content:
                        "You can't timeout someone with a higher role than you!",
                });
            if (
                member.roles.highest.position >=
                message.guild.members.cache.get(this.client.user.id).roles
                    .highest.position
            )
                return message.reply({
                    content:
                        "I can't timeout someone with a higher role than me!",
                });
        }
        if (!member.manageable)
            return message.reply({ content: "I can't timeout that user!" });
        if (member.communicationDisabledUntil)
            return message.reply({
                content: "That user is already timed out!",
            });
        let time = await this.client.util.gettime(this.client);
        await member.timeout(muteTime, reason);
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully timed out ${member}`)
            .setColor(this.client.config.Client.PrimaryColor);
        return message.reply({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction.options.getMember("user");
        let muteTime = 60;
        let maxMuteTime = 40320;
        let timeArg = interaction.options.getInteger("time");
        if (timeArg) muteTime = timeArg;
        if (isNaN(muteTime) || 1 > muteTime)
            return interaction.reply({
                content: "Please provide a valid time.",
            });
        let displayMuteTime = muteTime;
        muteTime = muteTime * 1000 * 60;
        if (muteTime > maxMuteTime * 60 * 1000) {
            muteTime = maxMuteTime;
            displayMuteTime = maxMuteTime;
        }
        let reason =
            interaction.options.getString("reason") || "No Reason Provided";
        if (!reason)
            return interaction.reply({
                content: "Please provide a valid reason.",
            });
        let member = interaction.guild.members.cache.get(user.id);
        if (!member)
            return interaction.reply({
                content: "That user isn't in this guild!",
            });
        let membercheckowner = this.client.util.checkOwner(member.user.id);
        if (membercheckowner)
            return interaction.reply({
                content: "You can't ban the bot owner!",
            });
        if (member.permissions.has(PermissionsBitField.Flags.Administrator))
            return interaction.reply({
                content: "You can't timeout an admin!",
            });
        if (member.id === interaction.user.id)
            return interaction.reply({
                content: "You can't timeout yourself!",
            });
        if (member.id === this.client.user.id)
            return interaction.reply({ content: "You can't timeout me!" });
        if (
            member.roles.highest.position >=
            interaction.member.roles.highest.position
        )
            return interaction.reply({
                content:
                    "You can't timeout someone with a higher role than you!",
            });
        if (
            member.roles.highest.position >=
            interaction.guild.members.cache.get(this.client.user.id).roles
                .highest.position
        )
            return interaction.reply({
                content: "I can't timeout someone with a higher role than me!",
            });
        if (!member.manageable)
            return interaction.reply({ content: "I can't timeout that user!" });
        if (member.communicationDisabledUntil)
            return interaction.reply({
                content: "That user is already timed out!",
            });
        let time = await this.client.util.gettime(this.client);
        await member.timeout(muteTime, reason);
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully timed out ${member}`)
            .setColor(this.client.config.Client.PrimaryColor);
        return interaction.reply({ embeds: [embed] });
    }
};
