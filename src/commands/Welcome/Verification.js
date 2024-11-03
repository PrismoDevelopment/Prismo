const Command = require("../../abstract/command");

module.exports = class Verification extends Command {
    constructor(...args) {
        super(...args, {
            name: "verification",
            aliases: ["verification"],
            description: "Set up a verification system for your server.",
            category: "Welcome",
            usage: ["verification <set|remove> <channel> <role>"],
            userPerms: ["ViewChannel", "SendMessages", "ManageRoles", "ManageChannels", "ManageGuild"],
            botPerms: ["ViewChannel", "SendMessages", "ManageRoles", "ManageChannels", "ManageGuild"],
            cooldown: 5,
            image: "https://i.imgur.com/rCfu3Hb.png",
            options: [
                {
                    name: "set",
                    description: "Set up a verification system for your server.",
                    type: 1,
                    options: [
                        {
                            name: "channel",
                            description: "The channel to send the verification message in.",
                            type: 7,
                            required: true
                        },
                        {
                            name: "role",
                            description: "The role to give to the user when they verify.",
                            type: 8,
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Remove the verification system from your server.",
                    type: 1
                }
            ]
        });
    }
    async run({ message, args }) {
        if (args[0] === "set" || args[0] === "add" || args[0] === "create" || args[0] === "enable") {
            const guild = message?.guild;
            let channel = message?.mentions.channels.first() ||
                message?.guild.channels.cache.get(args[1]) ||
                message?.guild.channels.cache.find(
                    (r) =>
                        r.name.toLowerCase() ==
                        args.slice(1).join(" ").toLowerCase()
                );
            if (!channel)
                return message?.reply({
                    embeds: [this.client.util.errorDelete(message, `Please provide a valid channel.`)],
                });
            let role = message?.mentions.roles.first() || message?.guild.roles.cache.get(args[2]) || message?.guild.roles.cache.find((r) => r.name.toLowerCase() == args.slice(2).join(" ").toLowerCase()); if (!role) return message?.reply({ content: "Please provide a valid role." });
            if (role.position >= message?.guild.members.resolve(this.client.user.id).roles.highest.position)
                return message?.reply({
                    embeds: [this.client.util.errorDelete(message, `The role you provided is higher than my highest role.`)],
                });
            if (role.managed)
                return message?.reply({
                    embeds: [this.client.util.errorDelete(message, `The role you provided is managed by an integration.`)],
                });
            if (role.position >= message?.member.roles.highest.position)
                return message?.reply({
                    embeds: [this.client.util.errorDelete(message, `The role you provided is higher than your highest role.`)],
                });
                const perms = await this.client.util.rolePerms(role);
                if (perms)
                    return message?.reply({
                        embeds: [this.client.util.errorDelete(message, `The role you provided has administrator permissions.`)],
                    });
            const verification = await this.client.database.guildVerificationData.get(guild.id);
            if (verification.enabled) {
                return message?.reply({
                    embeds: [this.client.util.errorDelete(message, `Verification is already enabled for this server.`)],
                });
            }
            verification.enabled = true;
            verification.channel = channel.id;
            verification.role = role.id;
            message?.reply({
                content: `Successfully enabled verification for this server. Please check ${channel} for more information.

**Note:** use \`hide all\` to hide all Channels`,
            });
            let embed = this.client.util.embed()
                .setDescription(`To verify your account, please indicate your confirmation by reacting to this message.`)
                .setColor(this.client.config.Client.PrimaryColor)
                .setFooter({ text: `© ${guild.name} | Verification`, iconURL: guild.iconURL() });
            channel.send({
                embeds: [embed], components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 3,
                                label: "Verify",
                                custom_id: "verify_server",
                                emoji: "1047852965760868423",
                            },
                        ],
                    },
                ]
            });
            await this.client.database.guildVerificationData.post(guild.id, verification);
        } else if (args[0] === "remove" || args[0] === "delete" || args[0] === "disable" || args[0] === "off") {
            const guild = message?.guild;
            const verification = await this.client.database.guildVerificationData.get(guild.id);
            if (!verification.enabled) {
                return message?.reply({
                    embeds: [this.client.util.errorDelete(message, `Verification is already disabled for this server.`)],
                });
            }
            verification.enabled = false;
            verification.channel = null;
            verification.role = null;
            message?.reply({
                embeds: [this.client.util.doDeletesend(message, `Successfully disabled verification for this server.`)],
            });
            await this.client.database.guildVerificationData.post(guild.id, verification);
        } else {
            message?.reply({
                embeds: [this.client.util.errorDelete(message, `Please provide a valid subcommand.\n\n\`set\` - Enables verification\n\`remove\` - Disables verification.`)],
            });
        }
    }

    async exec({ interaction }) {
        const guild = interaction?.guild;
        const subcommand = interaction?.options.getSubcommand();
        if (subcommand === "set") {
            const channel = interaction?.options.getChannel("channel");
            const role = interaction?.options.getRole("role");
            if (role.position >= interaction?.guild.members.resolve(this.client.user.id).roles.highest.position)
                return interaction?.reply({
                    content: "The role you provided is higher than my highest role.",
                });
            if (role.managed)
                return interaction?.reply({
                    content: "The role you provided is managed by an integration.",
                });
            if (role.position >= interaction?.member.roles.highest.position)
                return interaction?.reply({
                    content: "The role you provided is higher than your highest role.",
                });
                const perms = await this.client.util.rolePerms(role);
                if (perms)
                return interaction?.reply({
                    content: "The role you provided has dengerous permissions.",
                });
            const verification = await this.client.database.guildVerificationData.get(guild.id);
            if (verification.enabled) {
                return interaction?.reply("Verification is already enabled for this server.");
            }
            verification.enabled = true;
            verification.channel = channel.id;
            verification.role = role.id;
            interaction?.reply({
                content: `Successfully enabled verification for this server. Please check ${channel} for more information.

**Note:** use \`hide all\` to hide all Channels`,
            });
            let embed = this.client.util.embed()
                .setDescription(`To verify your account, please indicate your confirmation by reacting to this message.`)
                .setColor(this.client.config.Client.PrimaryColor)
                .setFooter({ text: `© ${guild.name} | Verification`, iconURL: guild.iconURL() });
            channel.send({
                embeds: [embed], components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 3,
                                label: "Verify",
                                custom_id: "verify_server",
                                emoji: "1047852965760868423",
                            },
                        ],
                    },
                ]
            });
            await this.client.database.guildVerificationData.post(guild.id, verification);
        } else if (subcommand === "remove") {
            const verification = await this.client.database.guildVerificationData.get(guild.id);
            if (!verification.enabled) {
                return interaction?.reply("Verification is already disabled for this server.");
            }
            verification.enabled = false;
            verification.channel = null;
            verification.role = null;
            interaction?.reply({
                content: `Successfully disabled verification for this server.`,
            });
            await this.client.database.guildVerificationData.post(guild.id, verification);
        }
    }
}
