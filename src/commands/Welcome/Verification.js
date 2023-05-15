const Command = require("../../abstract/command");
const { EmbedBuilder } = require("discord.js");

module.exports = class Verification extends Command {
    constructor(...args) {
        super(...args, {
            name: "verification",
            aliases: ["verification"],
            description: "Set up a verification system for your server.",
            category: "Welcome",
            usage: ["verification <set|remove> <channel> <role>"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
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
        if (args[0] === "set") {
            const guild = message.guild;
            let channel = message.mentions.channels.first() ||
                message.guild.channels.cache.get(args[1]) ||
                message.guild.channels.cache.find(
                    (r) =>
                        r.name.toLowerCase() ==
                        args.slice(1).join(" ").toLowerCase()
                );
            if (!channel)
                return message.reply({
                    content: "Please provide a valid channel.",
                });
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find((r) => r.name.toLowerCase() == args.slice(2).join(" ").toLowerCase()); if (!role) return message.reply({ content: "Please provide a valid role." });
            const verification = await this.client.database.guildVerificationData.get(guild.id);
            if (verification.enabled) {
                return message.reply("Verification is already enabled for this server.");
            }
            verification.enabled = true;
            verification.channel = channel.id;
            verification.role = role.id;
            message.reply({
                content: `Successfully enabled verification for this server. Please check ${channel} for more information.

**Note:** use \`hide all\` to hide all Channels`,
            });
            let embed = this.client.util.embed()
                .setDescription(`Welcome to ${guild.name}! Please react to this message to verify yourself.`)
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
        } else if (args[0] === "remove") {
            const guild = message.guild;
            const verification = await this.client.database.guildVerificationData.get(guild.id);
            if (!verification.enabled) {
                return message.reply("Verification is already disabled for this server.");
            }
            verification.enabled = false;
            verification.channel = null;
            verification.role = null;
            message.reply({
                content: `Successfully disabled verification for this server.`,
            });
            await this.client.database.guildVerificationData.post(guild.id, verification);
        } else {
            message.reply({
                content: "Please provide a valid option. \`(set/remove)\`",
            });
        }
    }

    async exec({ interaction }) {
        const guild = interaction.guild;
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === "set") {
            const channel = interaction.options.getChannel("channel");
            const role = interaction.options.getRole("role");
            const verification = await this.client.database.guildVerificationData.get(guild.id);
            if (verification.enabled) {
                return interaction.reply("Verification is already enabled for this server.");
            }
            verification.enabled = true;
            verification.channel = channel.id;
            verification.role = role.id;
            interaction.reply({
                content: `Successfully enabled verification for this server. Please check ${channel} for more information.

**Note:** use \`hide all\` to hide all Channels`,
            });
            let embed = this.client.util.embed()
                .setDescription(`Welcome to ${guild.name}! Please react to this message to verify yourself.`)
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
                                custom_id: "verify",
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
                return interaction.reply("Verification is already disabled for this server.");
            }
            verification.enabled = false;
            verification.channel = null;
            verification.role = null;
            interaction.reply({
                content: `Successfully disabled verification for this server.`,
            });
            await this.client.database.guildVerificationData.post(guild.id, verification);
        }
    }
}
