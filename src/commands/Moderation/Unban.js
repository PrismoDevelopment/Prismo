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
            image:"https://i.imgur.com/gLwF8n1.png",
            options: [
                {
                    type: 1,
                    name: "user",
                    description: "User to unban",
                    options : [
                        {
                            type : 3,
                            name : "user",
                            description : "User to unban",
                            required : true
                        },
                    ]
                },
                {
                    type: 1,
                    name: "all",
                    description: "Unban all users",
                }
            ],
        });
    }

    async run({ message, args }) {
        try {
            if (!args[0])
                return message?.reply({
                    content: "I would appreciate it if you provided a valid user!",
                });
                if(args[0] === "all") {
                    let nunu = await message.channel.send("Unbanning all users...")
                    message.guild.bans.fetch().then(bans => {
                        bans.forEach(async ban => {
                            await message.guild.members.unban(ban.user.id)
                        })
                    })
                    return nunu.edit("Unbanned all users!")
                }
            const user = await this.client.users.fetch(
                args[0].replace(/[\\<>@#&!]/g, "")
            );
            if (!user)
                return message?.reply({
                    content: "I would appreciate it if you provided a valid user!",
                });
            const reason = args.slice(1).join(" ") || "No reason provided";
            const bans = await message?.guild.bans.fetch();
            if (!bans.has(user.id))
                return message?.reply({
                    content: "That user isn't banned!",
                });
            await message?.guild.members.unban(user.id, reason);
            const embed = this.client.util
                .embed()
                .setDescription(`**${user.username}** has been unbanned!`)
                .setColor(this.client.config.Client.PrimaryColor);
            message?.reply({ embeds: [embed] });
        } catch (err) {
            return
        }
    }

    async exec({ interaction }) {
        try {
            let subcmd = interaction?.options.getSubcommand();
            if (subcmd === "all") {
                let nunu = await interaction.reply("Unbanning all users...")
                interaction.guild.bans.fetch().then(bans => {
                    bans.forEach(async ban => {
                        await interaction.guild.members.unban(ban.user.id)
                    })
                })
                return nunu.editReply("Unbanned all users!")
            }
            const user = interaction?.options.getUser("user");
            const bans = await interaction?.guild.bans.fetch();
            if (!bans.has(user.id))
                return interaction?.reply({
                    content: "That user isn't banned!",
                    ephemeral: true,
                });
            const reason =
                interaction?.options.getString("reason") || "No reason provided";
            await interaction?.guild.members.unban(user.id, reason);
            const embed = this.client.util
                .embed()
                .setDescription(`**${user.username}** has been unbanned!`)
                .setColor(this.client.config.Client.PrimaryColor);
            interaction?.reply({ embeds: [embed] });
        } catch (err) {
            return
        }
    }
};
