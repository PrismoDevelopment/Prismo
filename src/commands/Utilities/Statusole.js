const Command = require("../../abstract/command");

module.exports = class statusrole extends Command {
    constructor(...args) {
        super(...args, {
            name: "statusrole",
            description: "Assigning a role to you by fetching your status information.",
            category: "Utilities",
            aliases: ["statusrole"],
            usage: "statusrole <enable/disable> <role> <status>",
            cooldown: 5,
            image: "https://imgur.com/34I3wSk",
            userPerms: ['ManageGuild'],
            botPerms: ['EmbedLinks', 'ViewChannel', 'SendMessages'],
            vote: false,
            options: [
                {
                    type: 1,
                    name: "enable",
                    description: "Enable the status role",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "The role to give",
                            required: true
                        },
                        {
                            type: 3,
                            name: "status",
                            description: "The status to give the role to",
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: "disable",
                    description: "Disable the status role"
                }
            ]
        });
    }

    async run({ message, args }) {
        if (!args[0]) return message.reply({ content: "Please specify a subcommand (enable/disable)." });
        if (args[0] == "enable") {
            if (!args[1]) return message.reply({ content: "Please specify a role." });
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.reply({ content: "Please specify a valid role." });
            const perms = await this.client.util.rolePerms(role);
            if (perms) return message.reply({ content: "You can't use roles with dengeurous permissions." });
            let status = args.join(" ").slice(args[0].length + args[1].length + 2);
            if (!status) return message.reply({ content: "Please specify a status." });
            let data = await this.client.database.statusData.get(message.guild.id);
            data.enabled = true;
            data.role = role.id;
            data.status = status;
            await this.client.database.statusData.post(message.guild.id, data);
            message.reply({ content: `The status role has been enabled with the role ${role} and the status ${status}.` });
        } else if (args[0] == "disable") {
            let data = await this.client.database.statusData.get(message.guild.id);
            data.enabled = false;
            data.role = null;
            data.status = null;
            await this.client.database.statusData.post(message.guild.id, data);
            message.reply({ content: "The status role has been disabled." });
        }
    }

    async exec({ interaction }) {
        let subcommand = interaction.options.getSubcommand();
        if (subcommand == "enable") {
            let role = interaction.options.getRole("role");
            const perms = await this.client.util.rolePerms(role);
            if (perms) return interaction.reply({ content: "You can't use roles with dengeurous permissions.", ephemeral: true });
            let status = interaction.options.getString("status");
            let data = await this.client.database.statusData.get(interaction.guild.id);
            data.enabled = true;
            data.role = role.id;
            data.status = status;
            await this.client.database.statusData.post(interaction.guild.id, data);
            interaction.reply({ content: `The status role has been enabled with the role ${role} and the status ${status}.` });
        } else if (subcommand == "disable") {
            let data = await this.client.database.statusData.get(interaction.guild.id);
            data.enabled = false;
            data.role = null;
            data.status = null;
            await this.client.database.statusData.post(interaction.guild.id, data);
            interaction.reply({ content: "The status role has been disabled." });
        }
    }
}