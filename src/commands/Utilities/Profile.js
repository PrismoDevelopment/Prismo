const Command = require("../../abstract/command");

module.exports = class Profile extends Command {
    constructor(...args) {
        super(...args, {
            name: "profile",
            aliases: ["pf", "pr"],
            description: "Shows your bot profile.",
            usage: ["profile"],
            category: "Utilities",
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image:"https://i.imgur.com/maCwrbA.png",
            guildOnly: true,
        });
    }
    async run({ message, args }) {
        const user = args[0] ? await this.client.util.userQuery(args[0]) : message?.author.id;
        if (!user) return message?.channel.send("User not found.");
        const member = await this.client.users.fetch(user);
        let marrydata = await this.client.database.marryData.get(member.id);
        let marry = marrydata ? marrydata.married : false;
        let marrywith = marrydata ? marrydata.partner : null;
        let marrywithuser = marrywith ? await this.client.users.fetch(marrywith) : null;
        let marrywithusername = marrywithuser ? marrywithuser.username : null;
        let marrywithuserdiscriminator = marrywithuser ? marrywithuser.discriminator : null;
        let marriedAt = marrydata ? marrydata.marriedAt : null;
        let totaldays = marriedAt ? Math.floor((Date.now() - marriedAt) / 86400000) : null;
        let badges = await this.getProfile(member.id);
        let embed = this.client.util.embed()
            .setAuthor({ name: member.username, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**__Badges__:**
${badges.length > 0 ? badges.map((badge) => badge).join("\n") : "None"}`)
            .setColor(this.client.config.Client.PrimaryColor)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Requested by ${message?.author.username}`, iconURL: message?.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
        if (marry) {
            embed.addFields({
                name: "**__Marriage__:**", value: `**Partner** : ${marrywithusername}
**Married on**: <t:${Math.floor(marriedAt / 1000)}:f>
**Days spent**: ${totaldays}
` });
        }
        message?.channel.send({ embeds: [embed] });


    }

    async getProfile(userId) {
        let badgesCollection = [];
        let badgesfetch = await this.client.util.fetchDetails(`https://badge.prismobot.xyz/getbadges?userid=${userId}`).catch(() => { });
        if (badgesfetch.isDeveloper) {
            badgesCollection.push(`${this.client.config.Client.emoji.developerEmoji} Developer`);
        };
        if (badgesfetch.isCommunityManager) {
            badgesCollection.push(`${this.client.config.Client.emoji.communitymanager} Community Manager`);
        };
        if (badgesfetch.isOwner) {
            badgesCollection.push(`${this.client.config.Client.emoji.ownerEmoji} Owner`);
        };
        if (badgesfetch.isAdmin) {
            badgesCollection.push(`${this.client.config.Client.emoji.adminEmoji} Admin`);
        };
        if (badgesfetch.isManager) {
            badgesCollection.push(`${this.client.config.Client.emoji.managerEmoji} Manager`);
        };
        if (badgesfetch.isModerator) {
            badgesCollection.push(`${this.client.config.Client.emoji.moderatorEmoji} Moderator`);
        };
        if (badgesfetch.isStaff) {
            badgesCollection.push(`${this.client.config.Client.emoji.staffEmoji} Staff`);
        };
        if (badgesfetch.isSupporter) {
            badgesCollection.push(`${this.client.config.Client.emoji.supporterEmoji} Supporter`);
        };
        if (badgesfetch.isBugHunters) {
            badgesCollection.push(`${this.client.config.Client.emoji.bughunterEmoji} Bug Hunters`);
        };
        if (badgesfetch.isSpecialOnes) {
            badgesCollection.push(`${this.client.config.Client.emoji.specialonesEmoji} Special Ones`);
        };

        return badgesCollection;
    }


    async exec({ interaction }) {
        const user = interaction?.options.getMember("user") || interaction?.member;
        let marrydata = await this.client.database.marryData.get(user.id);
        let badges = await this.getProfile(user.id);
        let marry = marrydata ? marrydata.married : false;
        let marrywith = marrydata ? marrydata.partner : null;
        let marrywithuser = marrywith ? await this.client.users.fetch(marrywith) : null;
        let marrywithusername = marrywithuser ? marrywithuser.username : null;
        let marrywithuserdiscriminator = marrywithuser ? marrywithuser.discriminator : null;
        let marriedAt = marrydata ? marrydata.marriedAt : null;
        let totaldays = marriedAt ? Math.floor((Date.now() - marriedAt) / 86400000) : null;
        let embed = this.client.util.embed()
            .setAuthor({ name: user.user.username, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**__Badges__:**
${badges.length > 0 ? badges.map((badge) => badge).join("\n") : "None"}`)
            .setColor(this.client.config.Client.PrimaryColor)
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Requested by ${interaction?.user.username}`, iconURL: interaction?.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
        if (marry) {
            embed.addFields({
                name: "**__Marriage__:**", value: `**Partner** : ${marrywithusername}
    **Married on**: <t:${Math.floor(marriedAt / 1000)}:f>
    **Days spent**: ${totaldays}
    ` });
        }
        interaction?.reply({ embeds: [embed] });
    }
};