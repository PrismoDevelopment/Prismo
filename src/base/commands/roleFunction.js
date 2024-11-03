module.exports = class RoleFunction {
    /**
 *
 * @param {import('../commandFunctions')} commandFunction
 */
    constructor(client, commandFunction) {
        this.client = client;
        this.commandFunction = commandFunction;
        this.inProcess = {};
    }
    async add(message, user, role, slash = false) {
        let serverowner = message?.member.id === message?.guild.ownerId;
        if (!serverowner) {
            if (message?.member.roles.highest.position <= role.position)
                return message?.reply({
                    content: `You Can't Add Role To User Because Your Role Is Lower Then **${role.name}** Role.`,
                    ephemeral: true,
                });
        }
        if (
            message?.guild.members.cache.get(this.client.user.id).roles.highest
                .position <= role.position
        )
            return message?.reply({
                content: `I Can't Add Role To User Because My Role Is Lower Then **${role.name}** Role.`,
                ephemeral: true,
            });
        if (role.managed) {
            return message?.reply(
                `I Can't Add Role To User Because **${role.name}** Is A Managed Role.`,
            );
        }
        if (user._roles.includes(role.id)) {
            await user.roles
                .remove(
                    role.id,
                    `Removed By ${message?.member.user.username} | ${this.client.user.username}`
                )
                .then(() => {
                    message?.reply({
                        content: `**${user.user.username}** Has Been Removed From **${role.name}** Role.`,
                        ephemeral: true,
                    });
                })
                .catch((e) => {
                    message?.reply({
                        content: e.message,
                        ephemeral: true,
                    });
                });
        } else {
            await user.roles
                .add(
                    role.id,
                    `Added By ${message?.member.user.username} | ${this.client.user.username}`
                )
                .then(() => {
                    message?.reply({
                        content: `**${user.user.username}** Has Been Added To **${role.name}** Role.`,
                        ephemeral: true,
                    });
                })
                .catch((e) => {
                    message?.reply({
                        content: e.message,
                        ephemeral: true,
                    });
                });
        }
    }
    async all(message, role, slash = false) {
        const serverId = message?.guild.id;
        let serverowner = message?.member.id === message?.guild.ownerId;
        if (this.inProcess[serverId])
            return message?.reply({
                content: "Please Wait Until The Previous Process Is Completed.",
                ephemeral: true,
            });
        if (!serverowner) {
            if (message?.member.roles.highest.position <= role.position)
                return message?.reply({
                    content: `You Can't Add Role To User Because Your Role Is Lower Then **${role.name}** Role.`,
                    ephemeral: true,
                });
        }
        if (
            message?.guild.members.cache.get(this.client.user.id).roles.highest
                .position <= role.position
        )
            return message?.reply({
                content: `I Can't Add Role To User Because My Role Is Lower Then **${role.name}** Role.`,
                ephemeral: true,
            });
        if (role.managed) {
            return message?.reply({
                content: `I Can't Add **${role.name}** Role Because It's Managed By Integration.`,
                ephemeral: true,
            });
        }
        const perms = await this.client.util.rolePerms(role);
        if (perms) {
            return message?.reply({
                content: `I Can't Add **${role.name}** Role Because It Has Administrator Permissions.`,
                ephemeral: true,
            });
        }
        if (
            (await message?.guild.members.fetch()).filter(
                (m) => !m.roles.cache.has(role.id)
            ).size == 0
        )
            return message?.reply({
                content: `All Members Already Have **${role.name}** Role.`,
                ephemeral: true,
            });
        this.inProcess[serverId] = true;
        const embed = this.client.util
            .embed()
            .setColor("#00FFFF")
            .setAuthor({
                name: "Role",
                iconURL: message?.member.user.displayAvatarURL({
                    dynamic: true,
                }),
            })
            .setDescription(
                `Started Adding Role To \`${(await message?.guild.members.fetch()).filter(
                    (m) => !m.roles.cache.has(role.id)
                ).size
                }\` Members!`
            )
            .setTimestamp();
        const msg = await message?.reply({
            embeds: [embed],
        });
        for (const member of (await message?.guild.members.fetch()).filter(
            (m) => !m.roles.cache.has(role.id)
        )) {
            await member[1].roles
                .add(
                    role.id,
                    `Added By ${message?.member.user.username} | ${this.client.user.username}`
                )
                .catch(() => { });
        }
        embed.setDescription(
            `<:icons_Correct:1001064958450208788> Finished Adding Role To All Members!`
        );
        slash
            ? await message?.editReply({
                embeds: [embed],
            })
            : await msg.edit({
                embeds: [embed],
            });
        return (this.inProcess[serverId] = false);
    }
    async human(message, role, slash = false) {
        const serverId = message?.guild.id;
        let serverowner = message?.member.id === message?.guild.ownerId;
        if (this.inProcess[serverId])
            return message?.reply({
                content: "Please Wait Until The Previous Process Is Completed.",
                ephemeral: true,
            });
        if (!serverowner) {
            if (message?.member.roles.highest.position <= role.position)
                return message?.reply({
                    content: `You Can't Add Role To User Because Your Role Is Lower Then **${role.name}** Role.`,
                    ephemeral: true,
                });
        }
        if (
            message?.guild.members.cache.get(this.client.user.id).roles.highest
                .position <= role.position
        )
            return message?.reply({
                content: `I Can't Add Role To User Because My Role Is Lower Then **${role.name}** Role.`,
                ephemeral: true,
            });
        if (role.managed) {
            return message?.reply({
                content: `I Can't Add **${role.name}** Role Because It's Managed By Integration.`,
                ephemeral: true,
            });
        }
        const perms = await this.client.util.rolePerms(role);
        if (perms) {
            return message?.reply({
                content: `I Can't Add **${role.name}** Role Because It Has Administrator Permissions.`,
                ephemeral: true,
            });
        }
        if (
            (await message?.guild.members.fetch()).filter(
                (m) => !m.user.bot && !m.roles.cache.has(role.id)
            ).size == 0
        )
            return message?.reply({
                content: `All Humans Already Have **${role.name}** Role.`,
                ephemeral: true,
            });
        this.inProcess[serverId] = true;
        const embed = this.client.util
            .embed()
            .setColor("#00FFFF")
            .setAuthor({
                name: "Role",
                iconURL: message?.member.user.displayAvatarURL({
                    dynamic: true,
                }),
            })
            .setDescription(
                `Started Adding Role To \`${(await message?.guild.members.fetch()).filter(
                    (m) => !m.user.bot && !m.roles.cache.has(role.id)
                ).size
                }\` Humans!`
            )
            .setTimestamp();
        const msg = await message?.reply({
            embeds: [embed],
        });
        for (const member of (await message?.guild.members.fetch()).filter(
            (m) => m.user.bot == false && !m.roles.cache.has(role.id)
        )) {
            await member[1].roles
                .add(
                    role.id,
                    `Added By ${message?.member.user.username} | ${this.client.user.username}`
                )
                .catch(() => { });
        }
        embed.setDescription(
            `<:icons_Correct:1001064958450208788> Finished Adding Role To Humans!`
        );
        slash
            ? await message?.editReply({
                embeds: [embed],
            })
            : await msg.edit({
                embeds: [embed],
            });
        return (this.inProcess[serverId] = false);
    }
    async bot(message, role, slash = false) {
        const serverId = message?.guild.id;
        let serverowner = message?.member.id === message?.guild.ownerId;
        if (this.inProcess[serverId])
            return message?.reply({
                content: "Please Wait Until The Previous Process Is Completed.",
                ephemeral: true,
            });
        if (!serverowner) {
            if (message?.member.roles.highest.position <= role.position)
                return message?.reply({
                    content: `You Can't Add Role To User Because Your Role Is Lower Then **${role.name}** Role.`,
                    ephemeral: true,
                });
        }
        if (
            message?.guild.members.cache.get(this.client.user.id).roles.highest
                .position <= role.position
        )
            return message?.reply({
                content: `I Can't Add Role To User Because My Role Is Lower Then **${role.name}** Role.`,
                ephemeral: true,
            });
        if (role.managed) {
            return message?.reply({
                content: `I Can't Add **${role.name}** Role Because It's Managed By Integration.`,
                ephemeral: true,
            });
        }
        const perms = await this.client.util.rolePerms(role);
        if (perms) {
            return message?.reply({
                content: `I Can't Add **${role.name}** Role Because It Has Administrator Permissions.`,
                ephemeral: true,
            });

        }
        if (
            (await message?.guild.members.fetch()).filter(
                (m) => m.user.bot == true && !m.roles.cache.has(role.id)
            ).size == 0
        )
            return message?.reply({
                content: `All Bots Already Have **${role.name}** Role.`,
                ephemeral: true,
            });
        this.inProcess[serverId] = true;
        const embed = this.client.util
            .embed()
            .setColor("#00FFFF")
            .setAuthor({
                name: "Role",
                iconURL: message?.member.user.displayAvatarURL({
                    dynamic: true,
                }),
            })
            .setDescription(`Started Adding Role To Bots!`)
            .setTimestamp();
        const msg = await message?.reply({
            embeds: [embed],
        });
        for (const member of (await message?.guild.members.fetch()).filter(
            (m) => m.user.bot && !m.roles.cache.has(role.id)
        )) {
            await member[1].roles
                .add(
                    role.id,
                    `Added By ${message?.member.user.username} | ${this.client.user.username}`
                )
                .catch((e) => { });
        }
        embed.setDescription(
            `<:icons_Correct:1001064958450208788> Finished Adding Role To Bots!`
        );
        slash
            ? await message?.editReply({
                embeds: [embed],
            })
            : await msg.edit({
                embeds: [embed],
            });
        return (this.inProcess[serverId] = false);
    }
};
