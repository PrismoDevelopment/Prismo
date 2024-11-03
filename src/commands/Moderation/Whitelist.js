const Command = require("../../abstract/command");

module.exports = class Whitelist extends Command {
    constructor(...args) {
        super(...args, {
            name: "whitelist",
            aliases: ["whitelist", "wl"],
            description: "Whitelists a user from Antinuke",
            usage: ["whitelist <add|remove|show> <user>"],
            category: "Moderation",
            userPerms: ["ManageGuild"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "ManageGuild",
            ],
            cooldown: 3,
            image: "https://imgur.com/NxbT0zl",
            options: [
                {
                    type: 3,
                    name: "action",
                    description: "The action to perform (add or remove)",
                    required: true,
                    choices: [
                        {
                            name: "add",
                            value: "add",
                        },
                        {
                            name: "remove",
                            value: "remove",
                        },
                        {
                            name: "show",
                            value: "show",
                        }
                    ],
                },
                {
                    type: 6,
                    name: "user",
                    description: "User to whitelist",
                    required: false,
                },
            ],
        });
    }
    async run({ message, args }) {
        let antiNukeData = await this.client.database.antiNukeData.get(message?.guild.id);
        if (!antiNukeData.enabled) return message?.reply({ content: "Anti-Nuke is not enabled." });
        let oscheck = this.client.util.checkOwner(message.author.id);
        if (!oscheck) {
            if (message.author.id != message.guild.ownerId) return message.reply({ content: "Only the server owner can use this command." });
        }
        if (!args[0]) return message?.reply({ content: "Please provide a valid action. **(add, remove, show)**" });
        if (args[0] === "add") {
            let user = await this.client.util.userQuery(args[1]);
            if (!user)
                return message?.reply({
                    content: "I would appreciate it if you provided a valid user!",
                });
            let member = await message?.guild.members.fetch(user)
            if (!member || member == undefined || member == null || member == "Unknown Member") {
                member = await this.client.users.fetch(user);
            }
            if (!member)
                return message?.reply({ content: "That user isn't in this guild!" });
            if (antiNukeData.whitelistusers.includes(member.id)) return message?.reply({ content: "That user is already **whitelisted.**" });
            if (antiNukeData.whitelistusers.length >= 12) return message?.reply({ content: "You can only whitelist **10 users.**" });
            antiNukeData.whitelistusers.push(member.id);
            await this.client.database.antiNukeData.post(message?.guild.id, antiNukeData);
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Whitelisted ${member.user.username}.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.reply({ embeds: [embed] });
        } else if (args[0] === "remove") {
            let user = await this.client.util.userQuery(args[1]);
            if (!user)
                return message?.reply({
                    content: "I would appreciate it if you provided a valid user!",
                });
            let member = await message?.guild?.members?.fetch(user)
            if (!member || member == undefined || member == null || member == "Unknown Member") {
                member = await this.client.users.fetch(user);
            }
            if (!member)
                return message?.reply({ content: "That user isn't in this guild!" });
            if (!antiNukeData.whitelistusers.includes(member.id)) return message?.reply({ content: "That user is not whitelisted." });
            antiNukeData.whitelistusers = antiNukeData.whitelistusers.filter(id => id !== member.id);
            await this.client.database.antiNukeData.post(message?.guild.id, antiNukeData);
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully removed whitelist from ${member.user.username}.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.reply({ embeds: [embed] });
        } else if (args[0] === "show") {
            let whitelistedUsers = antiNukeData.whitelistusers.map(id => `<@${id}>`);
            if (!whitelistedUsers.length) return message?.reply({ content: "There are no whitelisted users." });
            const embed = this.client.util
                .embed()
                .setTitle("Whitelisted Users")
                .setDescription(whitelistedUsers.join("\n"))
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.reply({ embeds: [embed] });
        }
    }

    async exec({ interaction }) {
        let member = interaction?.options.getUser("user");
        let antiNukeData = await this.client.database.antiNukeData.get(interaction?.guild.id);
        if (!antiNukeData.enabled) return interaction?.reply({ content: "Antinuke is **not** enabled." });
        let oscheck = this.client.util.checkOwner(interaction?.user.id);
        if (!oscheck) {
            if (interaction.user.id != interaction.guild.ownerId) return interaction.reply({ content: "Only the **server owner can use this command.**", ephemeral: true });
        }

        if (interaction?.options.getString("action") === "add") {
            if (!member) return interaction?.reply({ content: "Please provide a valid user." });
            if (antiNukeData.whitelistusers.includes(member.id)) return interaction?.reply({ content: "That user is **already whitelisted.**" });
            if (antiNukeData.whitelistusers.length >= 12) return interaction?.reply({ content: "You can only whitelist **10 users.**" });
            antiNukeData.whitelistusers.push(member.id);
            await this.client.database.antiNukeData.post(interaction?.guild.id, antiNukeData);
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Whitelisted ${member.username}.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction?.reply({ embeds: [embed] });
        }
        if (interaction?.options.getString("action") === "remove") {
            if (!member) return interaction?.reply({ content: "That user isn't in this guild!" });
            if (!antiNukeData.whitelistusers.includes(member.id)) return interaction?.reply({ content: "That user is not whitelisted." });
            antiNukeData.whitelistusers = antiNukeData.whitelistusers.filter(id => id !== member.id);
            await this.client.database.antiNukeData.post(interaction?.guild.id, antiNukeData);
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully removed whitelist from ${member.username}.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction?.reply({ embeds: [embed] });
        }
        if (interaction?.options.getString("action") === "show") {
            let whitelistedUsers = antiNukeData.whitelistusers.map(id => `<@${id}>`);
            if (!whitelistedUsers.length) return interaction?.reply({ content: "There are no whitelisted users." })
            const embed = this.client.util
                .embed()
                .setTitle("Whitelisted Users")
                .setDescription(whitelistedUsers.join("\n"))
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction?.reply({ embeds: [embed] });
        }
    }
};
