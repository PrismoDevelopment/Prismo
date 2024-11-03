const Command = require("../../abstract/command");

module.exports = class Premium extends Command {
    constructor(...args) {
        super(...args, {
            name: "premium",
            aliases: ["prem"],
            description: "Shows/Activates your premium.",
            usage: ["premium <activate>", "premium <show>"],
            category: "Utilities",
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image:"https://i.imgur.com/4bQaIwF.png",
            guildOnly: true,
            options: [
                {
                    type: 1,
                    name: "activate",
                    description: "Activates your premium.",
                    required: false,
                },
                {
                    type: 1,
                    name: "show",
                    description: "Shows your premium.",
                    required: false,
                },
            ],
        });
    }
    async run({ message, args }) {
        const user =
            (await this.client.util.userQuery(args[0])) || message?.author;
        const member = await this.client.users.fetch(user);
        const premium = await this.client.database.welcomeUserData.get(
            member.id
        );
        const guild = await this.client.database.guildData.get(
            message?.guild.id
        );
        if (!args[0] === "activate" || !args[0] === "show") {
            return
        }
        if (args[0] === "activate") {
            if (premium.premiumCount < 1)
                return message?.channel.send({
                    content: "You don't have any premium left.",
                });
            if (guild.premium)
                return message?.channel.send({
                    content: "This server already has premium.",
                });
            premium.premiumCount = premium.premiumCount - 1;
            await this.client.database.welcomeUserData.postAll(
                member.id,
                premium
            );
            let premiumExpires = new Date();
            premiumExpires.setMonth(premiumExpires.getMonth() + 1);
            guild.premiumUntil = premiumExpires.getTime();
            guild.premium = true;
            await this.client.database.guildData.set(message?.guild.id, guild);
            message?.channel.send({ content: "Activated premium." });
            if (premium.premiumCount < 1) {
                premium.premiumCount = 0;
                await this.client.database.welcomeUserData.postAll(
                    member.id,
                    premium
                );
            }
        } else if (args[0] === "show") {
            const embed = new this.client.embed()
                .setTitle("Premium")
                .setDescription(
                    `You have ${premium.premiumCount} premium left.`
                )
                .setColor(this.client.config.Client.PrimaryColor);
            message?.channel.send({ embeds: [embed] });
        } else {
            const embed = this.client.util
                .embed()
                .setTitle(`${member.username}'s Premium`)
                .setDescription(
                    `**Premium**: ${premium.premium ? "Yes" : "No"}
**Premium Count**: ${premium.premiumCount}`
                )
                .setColor(this.client.config.Client.PrimaryColor)
                .setThumbnail(
                    member.displayAvatarURL({ dynamic: true, size: 2048 })
                );
            let datetime = this.client.util.formatDateTime(guild.premiumUntil);
            let timestamp = this.client.util.dateToTimestamp(datetime);
            let exacttime = ~~(timestamp / 1000);

            if (guild.premium) {
                embed.addFields({
                    name: "Server Premium",
                    value: `Status: ${guild.premium ? "Yes" : "No"}
Premium Ends: <t:${exacttime}:R>`,
                });
            }
            message?.channel.send({ embeds: [embed] });
        }
    }

    async exec({ interaction }) {
        const user = interaction?.user;
        const premium = await this.client.database.welcomeUserData.get(user.id);
        const guild = await this.client.database.guildData.get(
            interaction?.guild.id
        );
        if (interaction?.options.getSubcommand() === "activate") {
            if (premium.premiumCount < 1)
                return interaction?.reply({
                    content: "You don't have any premium left.",
                    ephemeral: true,
                });
            if (guild.premium)
                return interaction?.reply({
                    content: "This server already has premium.",
                    ephemeral: true,
                });
            premium.premiumCount = premium.premiumCount - 1;
            await this.client.database.welcomeUserData.postAll(
                user.id,
                premium
            );
            let premiumExpires = new Date();
            premiumExpires.setMonth(premiumExpires.getMonth() + 1);
            guild.premiumUntil = premiumExpires.getTime();
            guild.premium = true;
            await this.client.database.guildData.set(
                interaction?.guild.id,
                guild
            );
            interaction?.reply({ content: "Activated premium." });
            if (premium.premiumCount < 1) {
                premium.premiumCount = 0;
                await this.client.database.welcomeUserData.postAll(
                    user.id,
                    premium
                );
            }
        } else if (interaction?.options.getSubcommand() === "show") {
            const embed = this.client.util.embed()
                .setTitle("Premium")
                .setDescription(
                    `You have ${premium.premiumCount} premium left.`
                )
                .setColor(this.client.config.Client.PrimaryColor);
            interaction?.reply({ embeds: [embed] });
        }
    }
};
