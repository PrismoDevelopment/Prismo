const Command = require("../../abstract/command");

module.exports = class unban extends Command {
    constructor(...args) {
        super(...args, {
            name: "unban",
            aliases: ["uban"],
            description: "UnBan A User",
            usage: ["Unban <user> [reason]"],
            category: "Moderation",
            userPerms: ["BanMembers"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "BanMembers",
            ],
            cooldown: 20,
        });
    }

    async run({ message, args }) {
        try {
            if (!args[0])
                return message.reply({
                    content: "Please provide a user to unban!",
                });
            const user = await this.client.users.fetch(
                args[0].replace(/[\\<>@#&!]/g, "")
            );
            if (!user)
                return message.reply({
                    content: "Please provide a valid user to unban!",
                });
            const reason = args.slice(1).join(" ") || "No reason provided";
            const bans = await message.guild.bans.fetch();
            if (!bans.has(user.id))
                return message.reply({
                    content: "That user isn't banned!",
                });
            await message.guild.members.unban(user.id, reason);
            const embed = this.client.util
                .embed()
                .setDescription(`**${user.username}** has been unbanned!`)
                .setColor(this.client.config.Client.PrimaryColor);
            message.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    }

    async exec({ interaction }) {
        try {
            const user = interaction.options.getUser("user");
            const bans = await interaction.guild.bans.fetch();
            if (!bans.has(user.id))
                return interaction.reply({
                    content: "That user isn't banned!",
                    ephemeral: true,
                });
            const reason =
                interaction.options.getString("reason") || "No reason provided";
            await interaction.guild.members.unban(user.id, reason);
            const embed = this.client.util
                .embed()
                .setDescription(`**${user.username}** has been unbanned!`)
                .setColor(this.client.config.Client.PrimaryColor);
            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    }
};
