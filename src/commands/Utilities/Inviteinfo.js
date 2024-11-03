const Command = require("../../abstract/command");

module.exports = class Inviteinfo extends Command {
    constructor(...args) {
        super(...args, {
            name: "inviteinfo",
            description: "Get information about an invite",
            category: "Utilities",
            aliases: ["aboutinvite", "fetchinvite", "fetchserver"],
            cooldown: 5,
            image:"https://i.imgur.com/0pKmJ1k.png",
            usage: "inviteinfo <invite>",
            botPerms: ["SendMessages", "ReadMessageHistory"],
            userPerms: [
                "SendMessages",
            ],
            guildOnly: true,
            examples: ["inviteinfo https://discord.gg/invite"],
            options: [
                {
                    name: "invite",
                    description: "The invite to get information about",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    async run({ message, args }) {
        const invite = args[0];
        // const inviteregex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/;
        // if (!inviteregex.test(invite)) return message?.channel.createMessage("Please provide a valid invite link");
        if (!invite)
            return message?.channel.send("Please provide a invite link");
        const inviteData = await this.client.getInvite(invite);
        if (!inviteData) return message?.channel.send("Invalid invite");
        if (inviteData.guild.icon == null) {
            inviteData.guild.icon =
                "https://cdn.discordapp.com/embed/avatars/0.png";
        } else if (inviteData.guild.icon.startsWith("a_")) {
            inviteData.guild.icon = `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.gif`;
        } else {
            inviteData.guild.icon = `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.png`;
        }
        if (inviteData.guild.banner == null) {
            inviteData.guild.banner = null;
        } else if (inviteData.guild.banner.startsWith("a_")) {
            inviteData.guild.banner = `https://cdn.discordapp.com/banners/${inviteData.guild.id}/${inviteData.guild.banner}.gif?size=4096`;
        } else {
            inviteData.guild.banner = `https://cdn.discordapp.com/banners/${inviteData.guild.id}/${inviteData.guild.banner}.png?size=1024`;
        }
        const embed = this.client.util
            .embed()
            .setTitle(`Invite Information for ${inviteData.guild.name}`)
            .setColor(this.client.config.Client.PrimaryColor)
            .setThumbnail(inviteData.guild.icon)
            .setDescription(
                `**Invite Code:** ${inviteData.code}
**Server Name :** ${inviteData.guild.name}
**Server ID :** ${inviteData.guild.id}
**Description :** ${inviteData.guild.description || "No description"}
**Icon :** [Click Here](${
                    inviteData.guild.icon
                        ? `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.webp?size=1024`
                        : "https://cdn.discordapp.com/embed/avatars/0.png"
                })
**Banner :** ${
                    inviteData.guild.banner
                        ? `[Click Here](https://cdn.discordapp.com/banners/${inviteData.guild.id}/${inviteData.guild.banner}.webp?size=1024)`
                        : "No banner"
                }
**Vanity URL :** ${
                    inviteData.guild.vanity_url_code
                        ? inviteData.guild.vanity_url_code
                        : "No vanity URL"
                }
**Splash :** ${
                    inviteData.guild.splash
                        ? `[Click Here](https://cdn.discordapp.com/splashes/${inviteData.guild.id}/${inviteData.guild.splash}.webp?size=1024)`
                        : "No splash"
                }
**Verification Level :** ${inviteData.guild.verification_level}
**Member Count :** ${inviteData.approximate_member_count}
**Online Member Count :** ${inviteData.approximate_presence_count}
**Boost Count :** ${inviteData.guild.premium_subscription_count}\n
**__Server Features__**
${
    inviteData.guild.features.length > 0
        ? inviteData.guild.features
              .map((f) => `${this.client.config.Client.emoji.tick}\`${f}\``)
              .join("\n")
        : "No features"
}`
            )
            .setImage(inviteData.guild.banner);
        message?.channel.send({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const invite = interaction?.options.getString("invite");
        // const inviteregex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/;
        // if (!inviteregex.test(invite)) return interaction?.reply("Please provide a valid invite link");
        if (!invite)
            return interaction?.reply("Please provide a valid invite link");
        const inviteData = await this.client.getInvite(invite);
        if (!inviteData) return interaction?.reply("Invalid invite");
        if (inviteData.guild.icon == null) {    
            inviteData.guild.icon = "https://cdn.discordapp.com/embed/avatars/0.png";
        } else if (inviteData.guild.icon.startsWith("a_")) {
            inviteData.guild.icon = `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.gif`;
        } else {
            inviteData.guild.icon = `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.png`;
        }
        if (inviteData.guild.banner == null) {
            inviteData.guild.banner = null;
        } else if (inviteData.guild.banner.startsWith("a_")) {
            inviteData.guild.banner = `https://cdn.discordapp.com/banners/${inviteData.guild.id}/${inviteData.guild.banner}.gif?size=4096`;
        } else {
            inviteData.guild.banner = `https://cdn.discordapp.com/banners/${inviteData.guild.id}/${inviteData.guild.banner}.png?size=1024`;
        }
        const embed = this.client.util
            .embed()
            .setTitle(`Invite Information for ${inviteData.guild.name}`)
            .setColor(this.client.config.Client.PrimaryColor)
            .setThumbnail(inviteData.guild.icon)
            .setDescription(
                `**Invite Code:** ${inviteData.code}
**Server Name:** ${inviteData.guild.name}
**Server ID:** ${inviteData.guild.id}
**Description :** ${inviteData.guild.description || "No description"}
**Icon :** [Click Here](${
                    inviteData.guild.icon
                        ? `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.webp?size=1024`
                        : "https://cdn.discordapp.com/embed/avatars/0.png"
                })
**Banner :** ${
                    inviteData.guild.banner
                        ? `[Click Here](https://cdn.discordapp.com/banners/${inviteData.guild.id}/${inviteData.guild.banner}.webp?size=1024)`
                        : "No banner"
                }
**Vanity URL :** ${
                    inviteData.guild.vanity_url_code
                        ? inviteData.guild.vanity_url_code
                        : "No vanity URL"
                }
**Splash :** ${
                    inviteData.guild.splash
                        ? `[Click Here](https://cdn.discordapp.com/splashes/${inviteData.guild.id}/${inviteData.guild.splash}.webp?size=1024)`
                        : "No splash"
                }
**Verification Level :** ${inviteData.guild.verification_level}
**Member Count :** ${inviteData.approximate_member_count}
**Online Member Count :** ${inviteData.approximate_presence_count}
**Boost Count :** ${inviteData.guild.premium_subscription_count}\n
**__Server Features__**
${
    inviteData.guild.features.length > 0
        ? inviteData.guild.features
              .map((f) => `${this.client.config.Client.emoji.tick}\`${f}\``)
              .join("\n")
        : "No features"
}`
            )
            .setImage(inviteData.guild.banner);
        interaction?.reply({ embeds: [embed] });
    }
};
