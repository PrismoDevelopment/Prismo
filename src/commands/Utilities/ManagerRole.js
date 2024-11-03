const Command = require("../../abstract/command");

module.exports = class managerRole extends Command {
    constructor(...args) {
        super(...args, {
            name: "managerrole",
            description: "Used to give Setuproles (bypass)",
            category: "Utilities",
            aliases: ["setmanagerrole", "manager"],
            cooldown: 5,
            image:"https://imgur.com/PAAGpox",
            usage: "managerrole <role>",
            botPerms: ["SendMessages", "ReadMessageHistory"],
            userPerms: [
                "SendMessages",
                "EmbedLinks",
                "ManageRoles"
            ],
            guildOnly: true,
            examples: ["managerrole @manager"],
            options: [
                {
                    type: 1,
                    name: "set",
                    description: "Set the manager role",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "The manager role",
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "disable",
                    description: "Disable the manager role",
                },
            ],
        });
    }

    async run({ message, args}) {
        if(!args[0]) return message.channel.send({ embeds: [this.client.util.errorDelete(message, "Please provide a valid role!\n\n**Example:**\n\`managerrole <role>\`")] });
        if(args[0] === "disable") {
            let guildData = await this.client.database.guildData.get(message.guild.id);
            guildData.manager = null;
            await this.client.database.guildData.set(message.guild.id, guildData);
            return message.channel.send({ embeds: [this.client.util.doDeletesend(message, "Successfully disabled the manager role!")] });
        }
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args[0]));
        if (!role) return message.channel.send({ embeds: [this.client.util.errorDelete(message, "Please provide a valid role!\n\n**Example:**\n\`managerrole <role>\`")] });
        let guildData = await this.client.database.guildData.get(message.guild.id);
        guildData.manager = role.id;
        await this.client.database.guildData.set(message.guild.id, guildData);
        return message.channel.send({ embeds: [this.client.util.doDeletesend(message, `Successfully set the manager role to **${role.name}**!`)] });
    }

    async exec({ interaction }) {
        await interaction.deferReply();
        let subcmd = interaction.options.getSubcommand();
        if (subcmd === "disable") {
            let guildData = await this.client.database.guildData.get(interaction.guild.id);
            guildData.manager = null;
            await this.client.database.guildData.set(interaction.guild.id, guildData);
            return interaction.editReply("Successfully disabled the manager role!");
        }
        let role = interaction.options.getRole("role");
        if (!role) return interaction.editReply("Please provide a valid role!");
        let guildData = await this.client.database.guildData.get(interaction.guild.id);
        guildData.manager = role.id;
        await this.client.database.guildData.set(interaction.guild.id, guildData);
        return interaction.editReply(`Successfully set the manager role to **${role.name}**!`);
    }
};