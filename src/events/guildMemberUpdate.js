const Event = require("../abstract/event");

module.exports = class guildMemberUpdate extends Event {
    get name() {
        return "guildMemberUpdate";
    }
    get once() {
        return false;
    }
    /**
     *
     * @param {import('discord.js').GuildMember} oldMember
     * @param {import('discord.js').GuildMember} newMember
     */
    async run(oldMember, newMember) {
        if (oldMember.nickname != newMember?.nickname) {
            const data = await this.client.database.stickynickData.get(
                newMember?.id,
                newMember?.guild.id
            );
            if (data) {
                const nick = data.nick;
                if (newMember?.nickname != nick) {
                    newMember?.setNickname(nick);
                }
            }
        }
        let antiNukeData = await this.client.cache.get(newMember?.guild.id);
        if (!antiNukeData) {
            antiNukeData = await this.client.database.antiNukeData.get(newMember?.guild.id);
            await this.client.cache.set(newMember?.guild.id, antiNukeData);
        }
        if (!antiNukeData.enabled) return;
        const logs = await newMember?.guild.fetchAuditLogs({
            type: 25,
            limit: 1
        }).catch(() => { });
        if(!logs) return;
        const log = logs.entries.first();
        if (!log) return;
        let user = log.executor;
        if (antiNukeData?.whitelistusers?.includes(user.id)) return;
        let exeMember;
        try {
            exeMember = newMember?.guild.members.cache.get(user.id);
        } catch (err) {
            exeMember = await newMember?.guild.members.fetch(user.id);
        }
        if (this.client.util.checkOwner(user.id)) return;
        if (user.id == this.client.user.id) return;
        if (user.id == newMember?.guild.ownerId) return;
        if (exeMember?.roles.highest.position > newMember?.guild.members.resolve(this.client.user).roles.highest.position) {
            const Check = newMember?._roles.filter((r) => !oldMember._roles.includes(r));
            if (Check.length == 0) return;
            const roles = newMember?.guild.roles.cache.filter((r) => Check.includes(r.id));
            const perms = roles.map((r) => r.permissions.toArray());

            const dangerousPerms = [
                "Administrator",
                "ManageGuild",
                "ManageRoles",
                "ManageChannels",
                "ManageMessages",
                "ManageNicknames",
                "ManageEmojisAndStickers",
                "ManageWebhooks",
                "ManageThreads",
            ];
            // now get the dengerous roles and remove them from the member
            const dangerousRoles = roles.filter((r) => {
                const perms = r.permissions.toArray();
                for (const perm of perms) {
                    if (dangerousPerms.includes(perm)) return true;
                }
                return false;
            }
            );
            if (dangerousRoles.size == 0) return;
            newMember?.roles.remove(dangerousRoles, `Anti Role Add | Prismo Antinuke`);
            const logChannel = newMember?.guild.channels.cache.get(antiNukeData.logchannelid);
            if (!logChannel) return;
            const embed = this.client.util.embed()
                .setTitle(`Anti Role Add`)
                .setDescription(`**User:** ${user.username} (${user.id})\n**Member:** ${newMember?.user.username} (${newMember?.id})\n**Roles:** ${dangerousRoles.map((r) => r.name).join(", ")}\n**Action:** Removed`)
                .setColor(this.client.ErrorColor)
                .setTimestamp();
            logChannel.send({ embeds: [embed] });
        }
        const Check = newMember?._roles.filter((r) => !oldMember._roles.includes(r));
        if (Check.length == 0) return;
        const roles = newMember?.guild.roles.cache.filter((r) => Check.includes(r.id));
        const perms = roles.map((r) => r.permissions.toArray());
        const dangerousPerms = [
            "Administrator",
            "ManageGuild",
            "ManageRoles",
            "ManageChannels",
            "ManageMessages",
            "ManageWebhooks",
        ];
        const dangerousRoles = roles.filter((r) => {
            const perms = r.permissions.toArray();
            for (const perm of perms) {
                if (dangerousPerms.includes(perm)) return true;
            }
            return false;
        }
        );
        if (dangerousRoles.size == 0) return;
        newMember?.roles.remove(dangerousRoles, `Anti Role Add`);
        this.client.eventRestrict(antiNukeData.punishment, user.id, newMember?.guild.id, `Anti Member Update | Prismo Antinuke`);
    }
};
