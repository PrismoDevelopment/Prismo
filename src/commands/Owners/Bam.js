const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "bam",
            aliases: [],
            description: "Bans a User from server",
            usage: ["ban <user> [reason]"],
            category: "Owners",
            userPerms: ["BanMembers"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages", "BanMembers"],
            cooldown: 20,
            ownerOnly: true,
            image: "https://i.imgur.com/rHHi6se.png",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "User To Ban",
                    required: true,
                },
                {
                    type: 3,
                    name: "reason",
                    description: "Reason To Ban",
                    required: false,
                },
            ],
        });
    }

    async run({ message, args }) {
        let owner = this.client.util.checkOwner(message?.author.id);
        if (!args) return message?.reply({ content: "Please provide a user to ban!" });
        const user = await this.client.util.userQuery(args[0]);
        if (!user)
            return message?.reply({
                content: "Please mention a user or provide a valid user ID",
            });
        const member = await message?.guild.members.fetch(user);
        if (!member) return message?.reply({ content: "That user isn't in this guild!" });
        let membercheckowner = this.client.util.checkOwner(member.id);
        if (membercheckowner) return message?.reply({ content: "You can't ban the bot owner!" });
        if (owner) {
            if (member.id === message?.author.id)
                return message?.reply({
                    content: "Is it Possble that I can ban you?",
                });
            if (member.id === this.client.user.id)
                return message?.reply({
                    content: "You wanted to ban me? Rude owner <:FHT_godfather_Huh:1047391502751506462> I knew that you don't love me at all",
                });
        } else {
            if (member.id === message?.author.id) return message?.reply({ content: "You can't ban yourself!" });
            if (member.id === this.client.user.id) return message?.reply({ content: "You can't ban me!" });
        }
        if (member.id === message?.guild.ownerId)
            return message?.reply({
                content: "You can't ban the server owner!",
            });
        if (!owner) {
            if (message?.author.id != message?.guild.ownerId) {
                if (message?.member.roles.highest.position <= message?.guild.members.cache.get(this.client.user.id).roles.highest.position)
                    return message?.reply({
                        content: "You need to be higher than me in the role hierarchy to ban this user!",
                    });
                if (member.roles.highest.position >= message?.member.roles.highest.position)
                    return message?.reply({
                        content: "You can't ban a user with same or higher roles as you!",
                    });
            }
        }
        if (!member.bannable) return message?.reply({ content: "I can't ban that user!" });
        const reason = args.slice(1).join(" ") + " | Banned By: " + message?.author.username || "No reason provided | Banned By: " + message?.author.username;
        const embed = this.client.util.embed().setDescription(`**${member.user.username}** has been banned!`).setColor(this.client.config.Client.PrimaryColor);
        message?.reply({ embeds: [embed] });
        member
            .send({
                content: `You have been banned from - **${message?.guild.name}** for reason - **${reason}**`,
            })
            .catch(() => {});
    }

    async exec({ interaction }) {
        const user = interaction?.options.getMember("user");
        const member = interaction?.guild.members.cache.get(user.id); // Get the member from the guild
        if (!member)
            return interaction?.reply({
                content: "That user isn't in this guild!",
                ephemeral: true,
            });
        let membercheckowner = this.client.util.checkOwner(member.user.id);
        let serverowner = interaction?.guild.ownerId;
        if (membercheckowner)
            return interaction?.reply({
                content: "You can't ban the bot owner!",
                ephemeral: true,
            });
        if (member.id === interaction?.user.id)
            return interaction?.reply({
                content: "You can't ban yourself!",
                ephemeral: true,
            });
        if (member.id === this.client.user.id)
            return interaction?.reply({
                content: "You can't ban me!",
                ephemeral: true,
            });
        if (interaction?.user.id !== interaction?.guild.ownerId) {
            if (interaction?.member.roles.highest.position <= interaction?.guild.members.cache.get(this.client.user.id).roles.highest.position)
                return interaction?.reply({
                    content: "If you want to ban this user, you need to be higher in the role hierarchy than me!",
                    ephemeral: true,
                });
        }
        if (member.id === interaction?.guild.ownerId)
            return interaction?.reply({
                content: "There is no way to ban the server owner!",
                ephemeral: true,
            });
        if (interaction?.member.id !== interaction?.guild.ownerId) {
            if (member.roles.highest.position >= interaction?.member.roles.highest.position)
                return interaction?.reply({
                    content: "It is not possible for you to ban a user with the same or higher roles than you!",
                    ephemeral: true,
                });
        }
        if (!member.bannable)
            return interaction?.reply({
                content: "I can't ban that user!",
                ephemeral: true,
            });
        const reason =
            interaction?.options.getString("reason") + " | Banned By: " + interaction?.user.username ||
            "No reason provided | Banned By: " + interaction?.user.username;
        const embed = this.client.util.embed().setDescription(`**${member.user.username}** has been banned!`).setColor(this.client.config.Client.PrimaryColor);
        interaction?.reply({ embeds: [embed] });
        member
            .send({
                content: `You have been banned from - **${interaction?.guild.name}** for reasson - **${reason}**`,
            })
            .catch(() => {});
    }
};
