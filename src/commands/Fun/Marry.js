const Command = require("../../abstract/command");

module.exports = class Marry extends Command {
    constructor(...args) {
        super(...args, {
            name: "marry",
            aliases: ["marry", "marriage"],
            description: "Marry two users.",
            category: "Fun",
            usage: ["marry"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 60,
            image: "https://i.imgur.com/6kXBHiq.png",
            options: [
                {
                    name: "user",
                    description: "The user you want to marry.",
                    type: 6,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        let newdata = await this.client.database.marryData.get(message?.author.id);
        if (!args[0] && newdata.married) {
            let partner = newdata.partner ? await this.client.users.fetch(newdata.partner) : null;
            let embedd = this.client.util.embed()
                .setThumbnail(message?.author.displayAvatarURL({ dynamic: true }))
                .setColor(this.client.config.Client.PrimaryColor)
                .setTitle(`<a:p_heart09:1066327933741969488> **${message?.author.username}** is happily married to **${partner ? partner.username : "Unknown"}**`)
                .setDescription(`You both have been married on <t:${Math.floor(convertDateToTimestamp(newdata.marriedAt) / 1000)}:f>. You have spent **${findDifference(newdata.marriedAt)}** together <a:marry_me:1066328564368146494>`)
                .setFooter({ text: `Requested by ${message?.author.username} at ${new Date().toLocaleTimeString()}`, iconURL: message?.author.displayAvatarURL({ dynamic: true }) });
            message?.channel.send({ embeds: [embedd] });
            return;
        }
        let user = args[0] ? await this.client.util.userQuery(args[0], message?.guild) : null;
        if (!user) return message?.reply("Please provide a valid user.");
        let serverdata = await this.client.database.guildData.get(message?.guild.id);
        if (user === message?.author.id) return message?.reply("You can't marry yourself.");
        let member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply("Please provide a valid user.");
        if (member.user.bot) return message?.reply("You can't marry a bot.");
        let data = await this.client.database.marryData.get(member.id);
        let selfdata = await this.client.database.marryData.get(message?.author.id);
        if (selfdata.married) {
            let partner = selfdata.partner ? await this.client.users.fetch(selfdata.partner) : null;
            message?.reply(`You are already married to **${partner ? partner.username : "Unknown"}**.`);
            return;
        }
        if (data.married) {
            let partner = data.partner ? await this.client.users.fetch(data.partner) : null;
            message?.reply(`**${member.user.username}** is already married to **${partner ? partner.username : "Unknown"}**.`);
            return;
        }
        if (data.pendingproposal) {
            let proposer = data.proposer ? await this.client.users.fetch(data.proposer) : null;
            message?.reply(`**${member.user.username}** already has a proposal from **${proposer ? proposer.username : "Unknown"}**.`);
            return;
        }
        let embed = this.client.util.embed()
            .setThumbnail(message?.author.displayAvatarURL({ dynamic: true }))
            .setColor(this.client.config.Client.PrimaryColor)
            .setTitle(`**${member.user.username}** has been proposed to by **${message?.author.username}** <a:ring:1066050452900302949>`)
            .setDescription(`<a:zZ_inc_satashi_ringlelo:1066052671431258243> To accept the proposal, type \`${serverdata.prefix}am\`, or \`${serverdata.prefix}dm\` to decline the proposal.`);
        data.pendingproposal = true;
        data.proposer = message?.author.id;
        data.proposedAt = Date.now();
        await this.client.database.marryData.post(member.id, data);
        member.send({ embeds: [embed] }).catch(() => {});
        return message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        let newdata = await this.client.database.marryData.get(interaction?.user.id);
        if (!user && newdata.married) {
            let partner = newdata.partner ? await this.client.users.fetch(newdata.partner) : null;
            let embedd = this.client.util.embed()
                .setThumbnail(interaction?.user.displayAvatarURL({ dynamic: true }))
                .setColor(this.client.config.Client.PrimaryColor)
                .setTitle(`<a:p_heart09:1066327933741969488> **${interaction?.user.username}** is happily married to **${partner ? partner.username : "Unknown"}**`)
                .setDescription(`You both have been married on <t:${Math.floor(convertDateToTimestamp(newdata.marriedAt) / 1000)}:f>. You have spent **${findDifference(newdata.marriedAt)}** together <a:marry_me:1066328564368146494>`)
                .setFooter({ text: `Requested by ${interaction?.user.username} at ${new Date().toLocaleTimeString()}`, iconURL: interaction?.user.displayAvatarURL({ dynamic: true }) });
            interaction?.reply({ embeds: [embedd] });
            return;
        }
        if (!user) return interaction?.reply("Please provide a valid user.");
        let serverdata = await this.client.database.guildData.get(interaction?.guild.id);
        if (user === interaction?.user.id) return interaction?.reply("You can't marry yourself.");
        let member = await interaction?.guild.members.fetch(user);
        if (!member) return interaction?.reply("Please provide a valid user.");
        if (member.user.bot) return interaction?.reply("You can't marry a bot.");
        let data = await this.client.database.marryData.get(member.id);
        let selfdata = await this.client.database.marryData.get(interaction?.user.id);
        if (selfdata.married) {
            let partner = selfdata.partner ? await this.client.users.fetch(selfdata.partner) : null;
            interaction?.reply(`You are already married to **${partner ? partner.username : "Unknown"}**.`);
            return;
        }
        if (data.married) {
            let partner = data.partner ? await this.client.users.fetch(data.partner) : null;
            interaction?.reply(`**${member.user.username}** is already married to **${partner ? partner.username : "Unknown"}**.`);
            return;
        }
        if (data.pendingproposal) {
            let proposer = data.proposer ? await this.client.users.fetch(data.proposer) : null;
            interaction?.reply(`**${member.user.username}** already has a proposal from **${proposer ? proposer.username : "Unknown"}**.`);
            return;
        }
        let embed = this.client.util.embed()
            .setThumbnail(interaction?.user.displayAvatarURL({ dynamic: true }))
            .setColor(this.client.config.Client.PrimaryColor)
            .setTitle(`**${member.user.username}** has been proposed to by **${interaction?.user.username}** <a:ring:1066050452900302949>`)
            .setDescription(`<a:zZ_inc_satashi_ringlelo:1066052671431258243> To accept the proposal, type \`${serverdata.prefix}am\`, or \`${serverdata.prefix}dm\` to decline the proposal.`);
        data.pendingproposal = true;
        data.proposer = interaction?.user.id;
        data.proposedAt = Date.now();
        await this.client.database.marryData.post(member.id, data);
        member.send({ embeds: [embed] }).catch(() => {});
        return interaction?.reply({ embeds: [embed] });
    }
};

// converting 2023-01-20T18:32:53.290+00:00 to a timestamp
function convertDateToTimestamp(date) {
    return new Date(date).getTime();
}

// finding the days between a date and now
function findDifference(date) {
    let now = Date.now();
    let difference = now - date;
    let days = Math.floor(difference / (1000 * 60 * 60 * 24));
    return `${days} days`;
}
