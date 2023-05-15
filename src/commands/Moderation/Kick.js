const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "kick",
            aliases: ["getlost"],
            description: "Kick A User",
            usage: ["Kick <user> [reason]"],
            category: "Moderation",
            userPerms: ["KickMembers"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "KickMembers",
            ],
            cooldown: 20,
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "User To Kick",
                    required: true,
                },
                {
                    type: 3,
                    name: "reason",
                    description: "Reason To Kick",
                    required: false,
                },
            ],
        });
    }

    async run({ message, args }) {
        let owner = this.client.util.checkOwner(message.author.id);
        if (!args)
            return message.reply({ content: "Please provide a user to kick!" });
        const user = await this.client.util.userQuery(args[0]);
        if (!user)
            return message.reply({
                content: "Please mention a user or provide a valid user ID",
            });
        const member = await message.guild.members.fetch(user); // Get the member from the guild
        if (!member)
            return message.reply({ content: "That user isn't in this guild!" });
        let membercheckowner = this.client.util.checkOwner(member.user.id);
        if (membercheckowner)
            return message.reply({ content: "You can't kick the bot owner!" });
        if (owner) {
            if (member.id === message.author.id)
                return message.reply({
                    content: "Is it Possble that I can kick you?",
                });
            if (member.id === this.client.user.id)
                return message.reply({
                    content:
                        "You wanted to kick me? Rude owner <:FHT_godfather_Huh:1047391502751506462> I knew that you don't love me at all",
                });
        } else {
            if (member.id === message.author.id)
                return message.reply({ content: "You can't kick yourself!" });
            if (member.id === this.client.user.id)
                return message.reply({ content: "You can't kick me!" });
        }
        if (!owner) {
            if (
                message.member.roles.highest.position <=
                message.guild.members.cache.get(this.client.user.id).roles
                    .highest.position
            )
                return message.reply({
                    content:
                        "You need a role higher than me to kick this user!",
                });
            if (member.id === message.guild.ownerId)
                return message.reply({
                    content: "You can't kick the server owner!",
                });
            if (
                member.roles.highest.position >=
                message.member.roles.highest.position
            )
                return message.reply({
                    content:
                        "You can't kick a user with same or higher roles as you!",
                });
        }
        if (!member.kickable)
            return message.reply({ content: "I can't kick that user!" });
        const reason = args.slice(1).join(" ") || "No reason provided";
        await member.kick({ reason: reason });
        const embed = this.client.util
            .embed()
            .setDescription(`**${member.user.username}** has been kicked!`)
            .setColor(this.client.config.Client.PrimaryColor);
        message.reply({ embeds: [embed] });
        member
            .send({
                content: `You have been kicked from **${message.guild.name}** for **${reason}**`,
            })
            .catch(() => {});
    }

    async exec({ interaction }) {
        const user = interaction.options.getMember("user");
        const member = interaction.guild.members.cache.get(user.id); // Get the member from the guild
        if (!member)
            return interaction.reply({
                content: "That user isn't in this guild!",
                ephemeral: true,
            });
        let membercheckowner = this.client.util.checkOwner(member.user.id);
        if (membercheckowner)
            return interaction.reply({
                content: "You can' t ban the bot owner!",
                ephemeral: true,
            });
        if (member.id === interaction.user.id)
            return interaction.reply({
                content: "You can't kick yourself!",
                ephemeral: true,
            });
        if (member.id === this.client.user.id)
            return interaction.reply({
                content: "You can't kick me!",
                ephemeral: true,
            });
        if (member.id === interaction.guild.ownerId)
            return interaction.reply({
                content: "You can't kick the server owner!",
                ephemeral: true,
            });
        if (
            message.member.roles.highest.position <=
            message.guild.members.cache.get(this.client.user.id).roles.highest
                .position
        )
            return message.reply({
                content: "You need a role higher than me to kick this user!",
                ephemeral: true,
            });
        if (
            member.roles.highest.position >=
            interaction.member.roles.highest.position
        )
            return interaction.reply({
                content:
                    "You can't kick a user with same or higher roles as you!",
                ephemeral: true,
            });
        if (!member.kickable)
            return interaction.reply({
                content: "I can't kick that user!",
                ephemeral: true,
            });
        const reason =
            interaction.options.getString("reason") || "No reason provided";
        await member.kick({ reason: reason });
        const embed = this.client.util
            .embed()
            .setDescription(`**${member.user.username}** has been kickned!`)
            .setColor(this.client.config.Client.PrimaryColor);
        interaction.reply({ embeds: [embed] });
        member
            .send({
                content: `You have been kicked from **${interaction.guild.name}** for **${reason}**`,
            })
            .catch(() => {});
    }
};
