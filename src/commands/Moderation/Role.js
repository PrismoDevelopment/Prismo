const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "role",
            aliases: ["addrole"],
            description: "will give roles to server members/bots",
            usage: ["role <add/all/human/bot> <user/role>"],
            category: "Moderation",
            userPerms: ["ManageGuild", "ManageRoles"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image:"https://imgur.com/UZHqOkV",
            options: [
                {
                    type: 1,
                    name: "add",
                    description: "Add Role To User",
                    options: [
                        {
                            type: 6,
                            name: "user",
                            description: "User To Add Role",
                            required: true,
                        },
                        {
                            type: 8,
                            name: "role",
                            description: "Role To Add",
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "remove",
                    description: "Remove Role From User",
                    options: [
                        {
                            type: 6,
                            name: "user",
                            description: "User To Remove Role",
                            required: true,
                        },
                        {
                            type: 8,
                            name: "role",
                            description: "Role To Remove",
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "all",
                    description: "Role To Be Added To All Members",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "Role To Add",
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "bot",
                    description: "Role To Be Added To All Bots",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "Role To Add",
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "human",
                    description: "Role To Be Added To All Humans",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "Role To Add",
                            required: true,
                        },
                    ],
                },
            ],
        });
    }

    async run({ message, args }) {
        if (!args[0])
            return message?.reply({
                content: `Please Provide A Argument - \`add\`, \`all\`, \`bot\`, \`human\``,
                ephemeral: true,
            });
        if (args[0].toLowerCase() == "all") {
            if (!args[1])
                return message?.reply({
                    content: `Please **provide a Role**`,
                    ephemeral: true,
                });
            const role =
                message?.mentions.roles.first() ||
                message?.guild.roles.cache.get(args[1]) ||
                message?.guild.roles.cache.find(
                    (r) =>
                        r.name.toLowerCase() ==
                        args.slice(1).join(" ").toLowerCase()
                );
            if (!role)
                return message?.reply({
                    content: `Please **Provide A Valid Role**`,
                    ephemeral: true,
                });
            this.client.commandFunctions.roleFunction.all(message, role);
        } else if ((args[0].toLowerCase() == "bot") || (args[0].toLowerCase() == "bots")) {
            if (!args[1])
                return message?.reply({
                    content: `Please **Provide A Role**`,
                    ephemeral: true,
                });
            const role =
                message?.mentions.roles.first() ||
                message?.guild.roles.cache.get(args[1]) ||
                message?.guild.roles.cache.find(
                    (r) =>
                        r.name.toLowerCase() ==
                        args.slice(1).join(" ").toLowerCase()
                );
            if (!role)
                return message?.reply({
                    content: `Please Provide A Valid Role`,
                    ephemeral: true,
                });
            this.client.commandFunctions.roleFunction.bot(message, role);
        } else if ((args[0].toLowerCase() == "human") || (args[0].toLowerCase() == "humans")) {
            if (!args[1])
                return message?.reply({
                    content: `Please **Provide A Role**`,
                    ephemeral: true,
                });
            const role =
                message?.mentions.roles.first() ||
                message?.guild.roles.cache.get(args[1]) ||
                message?.guild.roles.cache.find(
                    (r) =>
                        r.name.toLowerCase() ==
                        args.slice(1).join(" ").toLowerCase()
                );
            if (!role)
                return message?.reply({
                    content: `Please Provide A Valid Role`,
                    ephemeral: true,
                });
            this.client.commandFunctions.roleFunction.human(message, role);
        } else {
            if (!args[0])
                return message?.reply({
                    content: `Please Provide A User`,
                    ephemeral: true,
                });
            if (!args[1])
                return message?.reply({
                    content: `Please **Provide A Role**`,
                    ephemeral: true,
                });
            const member = await this.client.util.userQuery(args[0]);
            if (!member)
                return message?.reply({
                    content: `Please Provide A Valid User`,
                    ephemeral: true,
                });
            const user = await message?.guild.members.fetch(member);
            const role =
            message?.guild.roles.cache.find(
                (r) =>
                    r.name.toLowerCase() ==
                    args.slice(1).join(" ").toLowerCase()
            ) ||
                message?.guild.roles.cache.find((r) => r.id == args[1]) ||
                message?.mentions.roles.first();
            if (!role)
                return message?.reply({
                    content: `Please **Provide A Valid Role**`,
                    ephemeral: true,
                });
            this.client.commandFunctions.roleFunction.add(message, user, role);
        }
    }

    async exec({ interaction }) {
        const subcommand = interaction?.options.getSubcommand();
        if (subcommand == "all") {
            const role = interaction?.options.getRole("role");
            this.client.commandFunctions.roleFunction.all(
                interaction,
                role,
                true
            );
        }
        if (subcommand == "bot") {
            const role = interaction?.options.getRole("role");
            this.client.commandFunctions.roleFunction.bot(
                interaction,
                role,
                true
            );
        }
        if (subcommand == "human") {
            const role = interaction?.options.getRole("role");
            this.client.commandFunctions.roleFunction.human(
                interaction,
                role,
                true
            );
        }
        if (subcommand == "remove") {
            const user = interaction?.options.getMember("user");
            const role = interaction?.options.getRole("role");
            this.client.commandFunctions.roleFunction.add(
                interaction,
                user,
                role,
                true
            );
        }
        if (subcommand == "add") {
            const user = interaction?.options.getMember("user");
            const role = interaction?.options.getRole("role");
            this.client.commandFunctions.roleFunction.add(
                interaction,
                user,
                role,
                true
            );
        }
    }
};
