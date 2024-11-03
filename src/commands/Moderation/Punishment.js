const Command = require("../../abstract/command");

module.exports = class Punishment extends Command {
    constructor(...args) {
        super(...args, {
            name: "punishment",
            aliases: ["punishment"],
            description: "Sets the punishment for Antinuke",
            usage: ["punishment <ban/kick/mute>"],
            category: "Moderation",
            userPerms: ["ManageGuild"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "ManageGuild",
            ],
            cooldown: 3,
            image: "https://imgur.com/JhyccKO",
            options: [
                {
                    type: 3,
                    name: "punishment",
                    description: "Punishment Type",
                    required: true,
                    choices: [
                        {
                            name: "Ban",
                            value: "ban",
                        },
                        {
                            name: "Kick",
                            value: "kick",
                        },
                        {
                            name: "Remove Roles",
                            value: "remove-roles",
                        },
                    ],
                },
            ],
        });
    }
    async run({ message, args }) {
        let antiNukeData = await this.client.database.antiNukeData.get(message?.guild.id);
        if (!antiNukeData.enabled) return message?.reply({ content: "Anti-Nuke is not enabled." });
        if (!args[0])
            return message?.reply({
                content: "Please provide a valid **punishment** type.",
            });
        let oscheck = this.client.util.checkOwner(message.author.id);
        if (!oscheck) {
            if (message.author.id != message.guild.ownerId) return message.reply({ content: "Only the server owner can use this command." });
        }
        if (args[0] == "ban") {
            antiNukeData.punishment = "ban";
            await this.client.database.antiNukeData.post(message?.guild.id, antiNukeData)
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully set the punishment to ban.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.reply({ embeds: [embed] });
        } else if (args[0] == "kick") {
            antiNukeData.punishment = "kick";
            await this.client.database.antiNukeData.post(message?.guild.id, antiNukeData)
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully set the punishment to kick.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.reply({ embeds: [embed] });
        } else if (args[0] == "remove-roles") {
            antiNukeData.punishment = "removeroles";
            await this.client.database.antiNukeData.post(message?.guild.id, antiNukeData)
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully set the punishment to remove roles.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.reply({ embeds: [embed] });
        } else {
            return message?.reply({
                content: "Please provide a valid **punishment** type.",
            });
        }
    }

    async exec({ interaction }) {
        let antiNukeData = await this.client.database.antiNukeData.get(interaction?.guild.id);
        if (!antiNukeData.enabled) return interaction?.reply({ content: "Anti-Nuke is not enabled." });
        if (!interaction?.options?.getString("punishment"))
            return interaction?.reply({
                content: "Please provide a valid **punishment** type.",
            });
        let oscheck = this.client.util.checkOwner(interaction?.user.id);
        if (!oscheck) {
            if (interaction.user.id != interaction.guild.ownerId) return interaction.reply({ content: "Only the server owner can use this command.", ephemeral: true });
        }
        if (interaction?.options?.getString("punishment") == "ban") {
            antiNukeData.punishment = "ban";
            await this.client.database.antiNukeData.post(interaction?.guild.id, antiNukeData)
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully set the punishment to ban.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction?.reply({ embeds: [embed] });
        } else if (interaction?.options?.getString("punishment") == "kick") {
            antiNukeData.punishment = "kick";
            await this.client.database.antiNukeData.post(interaction?.guild.id, antiNukeData)
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully set the punishment to kick.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction?.reply({ embeds: [embed] });
        } else if (interaction?.options?.getString("punishment") == "remove-roles") {
            antiNukeData.punishment = "removeroles";
            await this.client.database.antiNukeData.post(interaction?.guild.id, antiNukeData)
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully set the punishment to remove roles.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction?.reply({ embeds: [embed] });
        } else {
            return interaction?.reply({
                content: "Please provide a valid **punishment** type.",
            });
        }
    }
};