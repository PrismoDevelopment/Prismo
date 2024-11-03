const Command = require("../../abstract/command");

module.exports = class AntiNuke extends Command {
    constructor(...args) {
        super(...args, { 
            name: "antinuke",
            aliases: ["antiwizz"],
            description: "Protects your server form raiders/nukers",
            usage: ["antinuke <enable/disable>"],
            category: "Moderation",
            userPerms: ["Administrator"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages", "Administrator"],
            cooldown: 5,
            image: "https://imgur.com/e5Mct2G",
            options: [
                {
                    type: 1,
                    name: "enable",
                    description: "Enable Antinuke",
                },
                {
                    type: 1,
                    name: "disable",
                    description: "Disable Antinuke",
                },
            ],
        });
    }

    async run({message, args}) {
        let antiNukeData = await this.client.database.antiNukeData.get(message.guild.id);
        let oscheck = this.client.util.checkOwner(message.author.id);
        if (!oscheck) {
        if (message.author.id != message.guild.ownerId) return message.reply({content: "Only the **server owner** can use this command."});
        }
        if (!args[0]) {
            const embed = this.client.util.embed()
                .setTitle("Anti Nuke")
                .setDescription(
                    `**Enabled:** ${antiNukeData.enabled ? "Yes" : "No"}\n**Log Channel:** ${antiNukeData.logchannelid ? `<#${antiNukeData.logchannelid}>` : "None"}\n**Whitelisted Users:** ${antiNukeData.whitelistusers.length ? antiNukeData.whitelistusers.map((x) => `<@${x}>`).join(", ") : "None"}`
                )
                .setColor(this.client.PrimaryColor)
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        }
        if (args[0].toLowerCase() == "enable") {
            if (antiNukeData.enabled) {
                const embed = this.client.util.embed()
                    .setTitle("Antinuke")
                    .setDescription(`${this.client.config.Client.emoji.tick} | Antinuke is already **enabled**.`)
                    .setColor(this.client.PrimaryColor)
                    .setTimestamp();
                return message.channel.send({embeds: [embed]});
            }
            if(!oscheck) {
            if (message.guild.memberCount < 25) {
                const embed = this.client.util.embed()
                    .setTitle("Anti Nuke")
                    .setDescription("Anti Nuke can only be enabled on servers with **25+ members**.")
                    .setColor(this.client.PrimaryColor)
                    .setTimestamp();
                return message.channel.send({embeds: [embed]});
            }
        }
            let logChannel = await message.guild.channels.create({
                name: "Prismo-logs",
                type: 0,
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: ["ViewChannel"],
                    },
                    {
                        id: this.client.user.id,
                        allow: ["ViewChannel", "SendMessages", "ManageMessages"],
                    },
                ],
            });
            antiNukeData.enabled = true;
            antiNukeData.logchannelid = logChannel.id;
            await this.client.database.antiNukeData.post(message.guild.id, antiNukeData);
            const embed = this.client.util.embed()
                .setTitle("Anti Nuke")
                .setDescription(`${this.client.config.Client.emoji.tick} | Anti Nuke has been **enabled**.`)
                .setColor(this.client.PrimaryColor)
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        }
        if (args[0].toLowerCase() == "disable") {
            if (!antiNukeData.enabled) {
                const embed = this.client.util.embed()
                    .setTitle("Anti Nuke")
                    .setDescription(`${this.client.config.Client.emoji.tick} | Anti Nuke is already **disabled**.`)
                    .setColor(this.client.PrimaryColor)
                    .setTimestamp();
                return message.channel.send({embeds: [embed]});
            }
            antiNukeData.enabled = false;
            antiNukeData.logchannelid = '';
            let logChannel = message.guild.channels.cache.get(antiNukeData.logchannelid);
            if (logChannel) logChannel.delete();
            await this.client.database.antiNukeData.post(message.guild.id, antiNukeData);
            const embed = this.client.util.embed()
                .setTitle("Anti Nuke")
                .setDescription(`${this.client.config.Client.emoji.tick} | Anti Nuke has been **disabled**.`)
                .setColor(this.client.PrimaryColor)
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        }
    }

    async exec({interaction}) {
        let antiNukeData = await this.client.database.antiNukeData.get(interaction.guild.id);
        let oscheck = this.client.util.checkOwner(interaction.user.id);
        if (!oscheck) {
        if (interaction.user.id != interaction.guild.ownerId) return interaction.reply({content: "Only the **server owner** can use this command.", ephemeral: true});
    }
        if (!interaction.options.getSubcommand()) {
            const embed = this.client.util.embed()
                .setTitle("Anti Nuke")
                .setDescription(
                    `**Enabled:** ${antiNukeData.enabled ? "Yes" : "No"}\n**Log Channel:** ${antiNukeData.logchannelid ? `<#${antiNukeData.logchannelid}>` : "None"}\n**Whitelisted Users:** ${antiNukeData.whitelistusers.length ? antiNukeData.whitelistusers.map((x) => `<@${x}>`).join(", ") : "None"}`
                )
                .setColor(this.client.PrimaryColor)
                .setTimestamp();
            return interaction.reply({embeds: [embed]});
        }
        if (interaction.options.getSubcommand() == "enable") {
            if (antiNukeData.enabled) {
                const embed = this.client.util.embed()
                    .setTitle("Antinuke")
                    .setDescription(`${this.client.config.Client.emoji.tick} | Anti Nuke is already **enabled**.`)
                    .setColor(this.client.PrimaryColor)
                    .setTimestamp();
                return interaction.reply({embeds: [embed]});
            }
            if(!oscheck) {
            if (interaction.guild.memberCount < 25) {
                const embed = this.client.util.embed()
                    .setTitle("Anti Nuke")
                    .setDescription("Anti Nuke can only be enabled on servers with **25+ members**.")
                    .setColor(this.client.PrimaryColor)
                    .setTimestamp();
                return interaction.reply({embeds: [embed]});
            }
        }
            let logChannel = await interaction.guild.channels.create({
                name: "Prismo-logs",
                type: 0,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                    },
                    {
                        id: this.client.user.id,
                        allow: ["ViewChannel", "SendMessages", "ManageMessages"],
                    },
                ],
            });
            antiNukeData.enabled = true;
            antiNukeData.logchannelid = logChannel.id;
            await this.client.database.antiNukeData.post(interaction.guild.id, antiNukeData);
            const embed = this.client.util.embed()
                .setTitle("Antinuke")
                .setDescription(`${this.client.config.Client.emoji.tick} | Antinuke has been **enabled**.`)
                .setColor(this.client.PrimaryColor)
                .setTimestamp();
            return interaction.reply({embeds: [embed]});
        }
        if (interaction.options.getSubcommand() == "disable") {
            if (!antiNukeData.enabled) {
                const embed = this.client.util.embed()
                    .setTitle("Antinuke")
                    .setDescription(`${this.client.config.Client.emoji.tick} | Antinuke is already **disabled**.`)
                    .setColor(this.client.PrimaryColor)
                    .setTimestamp();
                return interaction.reply({embeds: [embed]});
            }
            antiNukeData.enabled = false;
            antiNukeData.logchannelid = null;
            let logChannel = interaction.guild.channels.cache.get(antiNukeData.logchannelid);
            if (logChannel) logChannel.delete();
            await this.client.database.antiNukeData.post(interaction.guild.id, antiNukeData);
            const embed = this.client.util.embed()
                .setTitle("Anti Nuke")
                .setDescription(`${this.client.config.Client.emoji.tick} | Anti Nuke has been **disabled**.`)
                .setColor(this.client.PrimaryColor)
                .setTimestamp();
            return interaction.reply({embeds: [embed]});
        }
    }
}