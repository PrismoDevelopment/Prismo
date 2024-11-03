const Command = require("../../abstract/command");
module.exports = class rolesetup extends Command {
    constructor(...args) {
        super(...args, {
            name: "rolesetup",
            aliases: ["rs", "setuproles", "setuprole"],
            description: "Setup Roles!",
            category: "Utilities",
            userPerms: ["SendMessages", "ManageRoles"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/FRxTY8M.png",
            usage: "rolesetup <name/list/delete> <role>",
            options: [
                {
                    type: 1,
                    name: "default",
                    description: "Setup Default Role",
                    options: [
                        {
                            type: 3,
                            name: "prefix",
                            description: "Prefix To Set",
                            required: true,
                            choices: [
                                {
                                    name: 'girls',
                                    value: 'girls'
                                },
                                {
                                    name: 'guest',
                                    value: 'guest'
                                },
                                {
                                    name: 'friend',
                                    value: 'friend'
                                },
                                {
                                    name: 'vip',
                                    value: 'vip'
                                },
                                {
                                    name: 'artist',
                                    value: 'artist'
                                },
                                {
                                    name: 'staff',
                                    value: 'staff'
                                },
                                {
                                    name: 'supporter',
                                    value: 'supporter'
                                },
                                {
                                    name: 'mod',
                                    value: 'mod'
                                }
                            ]
                        },
                        {
                            type: 8,
                            name: "role",
                            description: "Role To Set",
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: "custom",
                    description: "Setup Custom Assigned Role",
                    options: [
                        {
                            type: 3,
                            name: "prefix",
                            description: "Specify The Name Of The Prefix To Assign Role",
                            required: true
                        },
                        {
                            type: 8,
                            name: "role",
                            description: "Role To Set",
                            required: true
                        }
                    ],
                }
            ],
        });

        this.presets = [
            'girls',
            'guest',
            'friend',
            'vip',
            'artist',
            'staff',
            'supporter',
            'mod',
            'manager',
            'custom'
        ]
    }

    async run({ message, args }) {
        let guildData = await this.client.database.guildData.get(message.guild.id);
        const subCommand = args[0];
        if (subCommand === "list") {
            if(guildData.CustomRoles.length < 1) return message.channel.send("No Custom Roles Setuped!");
            let embed = this.client.util.embed()
                .setTitle("Custom Roles")
                .setDescription(guildData.CustomRoles.map((x, i) => `\`${i + 1}\` **${x.name}** - <@&${x.roleId}>`).join("\n"))
                .setColor(this.client.config.Client.PrimaryColor)
                .setTimestamp()
            return message.channel.send({ embeds: [embed] })
        }
        if (subCommand === "delete") {
            let name = args[1];
            if (!name) return message.channel.send("Please provide a name!");
            let role = guildData.CustomRoles.find(x => x.name === name);
            if (!role) return message.channel.send("That role is not setuped!");
            guildData.CustomRoles = guildData.CustomRoles.filter(x => x.name !== name);
            await this.client.database.guildData.set(message.guild.id, guildData);
            await message.channel.send(`${this.client.config.Client.emoji.tick} Successfully deleted **${name}** role in this server!`);
        }
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name === args[1]) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args[1]));
        if (!role) return message.channel.send("Please Mention A Role!");
        if (role.position >= message?.member.roles.highest.position)
            return message?.reply({
                content: "The role you provided is higher than your highest role.",
            });
            const perms = await this.client.util.rolePerms(role);
            if (perms)
            return message?.reply({
                content: "The role you provided has dengerous permissions.",
            });
        if ((subCommand === "girls") || (subCommand === "girl")) {
            guildData.CustomRoles.push({
                name: 'girls',
                roleId: role.id
            })
            await this.client.database.guildData.set(message.guild.id, guildData);
            await message.channel.send(`${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Girls** role in this server!`);
        } else if (subCommand === "friend") {
            guildData.CustomRoles.push({
                name: 'friend',
                roleId: role.id
            })
            await this.client.database.guildData.set(message.guild.id, guildData);
            await message.channel.send(`${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Friend** role in this server!`);
        } else if (subCommand === "guest") {


            guildData.CustomRoles.push({
                name: 'guest',
                roleId: role.id
            })
            await this.client.database.guildData.set(message.guild.id, guildData);
            await message.channel.send(`${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Guest** role in this server!`);
        } else if (subCommand === "vip") {


            guildData.CustomRoles.push({
                name: 'vip',
                roleId: role.id
            })
            await this.client.database.guildData.set(message.guild.id, guildData);
            await message.channel.send(`${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **VIP** role in this server!`);
        } else if (subCommand === "artist") {


            guildData.CustomRoles.push({
                name: 'artist',
                roleId: role.id
            })
            await this.client.database.guildData.set(message.guild.id, guildData);
            await message.channel.send(`${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Artist** role in this server!`);
        } else if (subCommand === "staff") {


            guildData.CustomRoles.push({
                name: 'staff',
                roleId: role.id
            })
            await this.client.database.guildData.set(message.guild.id, guildData);
            await message.channel.send(`${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Staff** role in this server!`);
        } else if (subCommand === "supporter") {


            guildData.CustomRoles.push({
                name: 'supporter',
                roleId: role.id
            })
            await this.client.database.guildData.set(message.guild.id, guildData);
            await message.channel.send(`${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Supporter** role in this server!`);
        } else if (subCommand === "mod") {


            guildData.CustomRoles.push({
                name: 'mod',
                roleId: role.id
            })
            await this.client.database.guildData.set(message.guild.id, guildData);
            await message.channel.send(`${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Mod** role in this server!`);
        }
        else if (subCommand) {
            let prefix = subCommand;
            guildData.CustomRoles.push({
                name: prefix,
                roleId: role.id
            })
            await this.client.database.guildData.set(message.guild.id, guildData);
            await message.channel.send(`${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **${prefix}** role in this server! | use \`/managerrole set\` to get role assign perms `);
        }
        else if (!subCommand) {
            return message.channel.send("Please provide a subcommand! `girls`, `friend`, `guest`, `vip`, `artist`, `staff`, `supporter`, `mod`");
        }
        return;
    }

    async exec({ interaction }) {
        await interaction.deferReply();
        let subCommand = interaction.options.getSubcommand();
        let guildData = await this.client.database.guildData.get(interaction.guild.id);
        let role = interaction.options.getRole("role");
        if (!role) return interaction.editReply("Please Mention A Role!");
        if (role.position >= interaction?.member.roles.highest.position) return interaction?.editReply({
            content: "The role you provided is higher than your highest role.",
            ephemeral: true,
        });
        const perms = await this.client.util.rolePerms(role);
        if (perms)
            return interaction?.editReply({
                content: "The role you provided has dengerous permissions.",
                ephemeral: true,
            });
        if (subCommand == 'default') {
            let choices = interaction.options.getString("prefix");
            let check = guildData.CustomRoles.find(x => x.name === choices);
            if (check) return interaction.editReply({ content: `${this.client.config.Client.emoji.cross} This role is already in the database!`, ephemeral: true });
            if (choices === "girls") {
                guildData.CustomRoles.push({
                    name: 'girls',
                    roleId: role.id
                })
                await this.client.database.guildData.set(interaction.guild.id, guildData);
                interaction.editReply({ content: `${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Girls** role in this server!`, ephemeral: true });
            } else if (choices === "friend") {
                guildData.CustomRoles.push({
                    name: 'friend',
                    roleId: role.id
                })
                await this.client.database.guildData.set(interaction.guild.id, guildData);
                interaction.editReply({ content: `${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Friend** role in this server!`, ephemeral: true });
            } else if (choices === "guest") {
                guildData.CustomRoles.push({
                    name: 'guest',
                    roleId: role.id
                })
                await this.client.database.guildData.set(interaction.guild.id, guildData);
                interaction.editReply({ content: `${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Guest** role in this server!`, ephemeral: true });
            } else if (choices === "vip") {
                guildData.CustomRoles.push({
                    name: 'vip',
                    roleId: role.id
                })
                await this.client.database.guildData.set(interaction.guild.id, guildData);
                interaction.editReply({ content: `${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **VIP** role in this server!`, ephemeral: true });
            } else if (choices === "artist") {
                guildData.CustomRoles.push({
                    name: 'artist',
                    roleId: role.id
                })
                await this.client.database.guildData.set(interaction.guild.id, guildData);
                interaction.editReply({ content: `${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Artist** role in this server!`, ephemeral: true });
            } else if (choices === "staff") {
                guildData.CustomRoles.push({
                    name: 'staff',
                    roleId: role.id
                })
                await this.client.database.guildData.set(interaction.guild.id, guildData);
                interaction.editReply({ content: `${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Staff** role in this server!`, ephemeral: true });
            } else if (choices === "supporter") {
                guildData.CustomRoles.push({
                    name: 'supporter',
                    roleId: role.id
                })
                await this.client.database.guildData.set(interaction.guild.id, guildData);
                interaction.editReply({ content: `${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Supporter** role in this server!`, ephemeral: true });
            } else if (choices === "mod") {
                guildData.CustomRoles.push({
                    name: 'mod',
                    roleId: role.id
                })
                await this.client.database.guildData.set(interaction.guild.id, guildData);
                interaction.editReply({ content: `${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **Mod** role in this server!`, ephemeral: true });
            }
        } else if (subCommand == 'custom') {
            let name = interaction.options.getString("prefix");
            let check = guildData.CustomRoles.find(x => x.name === name);
            if (check) return interaction.editReply({ content: `${this.client.config.Client.emoji.cross} This role is already in the database!`, ephemeral: true });
            if (!name) return interaction.editReply({
                content: "Please provide a name for the role!",
                ephemeral: true,
            })
            if (name.length > 20) return interaction.editReply({
                content: "The name of the role must be less than 20 characters!",
                ephemeral: true,
            })
            if (this.presets.includes(name.toLowerCase())) return interaction.editReply({
                content: "You can't use this name!",
                ephemeral: true
            })
            guildData.CustomRoles.push({
                name: name.toLowerCase(),
                roleId: role.id
            })
            await this.client.database.guildData.set(interaction.guild.id, guildData);
            interaction.editReply({ content: `${this.client.config.Client.emoji.tick} Successfully setuped **${role.name}** to **${name}** role in this server! | **use \`/managerrole set\` to get role assign perms**`, ephemeral: true });
        }
        return;
    }
}