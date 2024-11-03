const Command = require("../../abstract/command");

module.exports = class Vcrole extends Command {
    constructor(...args) {
        super(...args, {
            name: "vcrole",
            aliases: ["rolevc"],
            description: "Sets role for vc",
            usage: ["vcrole set <role>", "vcrole reset"],
            category: "Utilities",
            examples: ["vcrole set @Role", "vcrole reset"],
            userPerms: ["SendMessages", "ManageRoles"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages", "ManageRoles"],
            cooldown: 5,
            options: [
                {
                    type: 1,
                    name: "set",
                    description: "Set a role for vc",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "Role To Set",
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "reset",
                    description: "Reset role for vc",
                },
                {
                    type: 1,
                    name: "show",
                    description: "Show role for vc",
                }
            ],
        });
    }

    async run({ message, args }) {
        try {
            if (!args[0]) {
                return message?.reply({
                    content: "Please Provide A Valid Option! (set/reset)",
                    ephemeral: true,
                });
            }
            if (args[0] === "set") {
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
                        content: "Please Provide A Valid Role!",
                        ephemeral: true,
                    });
                let check = await this.client.util.checkPerms(message, role);
                if(check) return;
                await this.client.database.guildData.putVcrole(
                    message?.guild.id, role.id
                );
                return message?.reply({
                    content: `Successfully Set ${role} As Vc Role!`,
                    ephemeral: true,
                });
            } else if ((args[0] === "reset") || (args[0] === "remove")) {
                await this.client.database.guildData.putVcrole(message?.guild.id, null);
                return message?.reply({
                    content: `Successfully Reset Vc Role!`,
                    ephemeral: true,
                });
            } else if (args[0] === "show") {
                let data = await this.client.cache.get(message?.guild.id + "1")
                if (!data) {
                    data = await this.client.database.guildData.get(
                        message?.guild?.id
                    );
                    if (data != null) await this.client.cache.set(message?.guild.id + "1", message.guild.config);
                }
                if (data.vcrole != null) {
                    const role = message?.guild.roles.cache.get(data.vcrole);
                    return message?.reply({
                        content: `The Vc Role Is ${role}`,
                        ephemeral: true,
                    });
                } else {
                    return message?.reply({
                        content: `There Is No Vc Role Set!`,
                        ephemeral: true,
                    });
                }
            }
        } catch (err) {
            console.error(err);
            return;
        }
    }

    async exec({ interaction }) {
        try {
            if (!interaction?.options?.getSubcommand()) {
                return interaction?.reply({
                    content: "Please Provide A Valid Option! (set/reset)",
                    ephemeral: true,
                });
            }
            if (interaction?.options?.getSubcommand() === "set") {
                const role =
                    interaction?.options?.getRole("role");
                if (!role)
                    return interaction?.reply({
                        content: "Please Provide A Valid Role!",
                        ephemeral: true,
                    });
                let check = await this.client.util.checkPerms(interaction, role, true);
                if(check) return;
                await this.client.database.guildData.putVcrole(
                    interaction?.guild.id, role.id
                );
                return interaction?.reply({
                    content: `Successfully Set ${role} As Vc Role!`,
                    ephemeral: true,
                });
            } else if ((interaction?.options?.getSubcommand() === "reset") || (interaction?.options?.getSubcommand() === "remove")) {
                await this.client.database.guildData.putVcrole(interaction?.guild.id, null);
                return interaction?.reply({
                    content: `Successfully Reset Vc Role!`,
                    ephemeral: true,
                });
            } else if (interaction?.options?.getSubcommand() === "show") {
                let data = await this.client.cache.get(interaction?.guild.id + "1")
                if (!data) {
                    data = await this.client.database.guildData.get(
                        interaction?.guild?.id
                    );
                    if (data != null) await this.client.cache.set(interaction?.guild.id + "1", interaction.guild.config);
                }
                if (data.vcrole != null) {
                    const role = interaction?.guild.roles.cache.get(data.vcrole);
                    return interaction?.reply({
                        content: `The Vc Role Is ${role}`,
                        ephemeral: true,
                    });
                } else {
                    return interaction?.reply({
                        content: `There Is No Vc Role Set!`,
                        ephemeral: true,
                    });
                }
            }
        } catch (err) {
            console.error(err);
            return;
        }
    }
}