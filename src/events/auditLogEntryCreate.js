const Event = require("../abstract/event");
const fetch = require("node-fetch");

module.exports = class GuildAuditLogEntryCreate extends Event {
    get name() {
        return 'guildAuditLogEntryCreate';
    }

    get once() {
        return false;
    }

    async run(entry, guild) {
        try {
            let logs, log, antiNukeData, user, exeMember, bot, logChannel, embed;

            if (entry.action == 21) {
                logs = await guild?.fetchAuditLogs({
                    type: 21,
                    limit: 1
                }).catch(() => {});
                log = logs.entries.first();
                if (!log) return;

                antiNukeData = await this.client.database.antiNukeData.get(guild?.id);
                if (!antiNukeData.enabled) return;

                user = log.executor;
                if (antiNukeData?.whitelistusers?.includes(user.id)) return;

                exeMember = await guild?.members.fetch(user.id);
                if (this.client.util.checkOwner(user.id) || user.id == this.client.user.id || user.id == guild?.ownerId || exeMember?.roles.highest.position > guild?.members.resolve(this.client.user).roles.highest.position) return;

                this.client.eventRestrict(antiNukeData.punishment, user.id, guild?.id, `Anti Member Prune | Prismo Antinuke`);

                logChannel = guild?.channels.cache.get(antiNukeData.logchannelid);
                if (!logChannel) return;

                embed = this.client.util.embed()
                    .setTitle(`Anti Member Prune`)
                    .setDescription(`**User:** ${user.username} (${user.id})\n**Action:** Punished`)
                    .setColor(this.client.ErrorColor)
                    .setTimestamp();

                logChannel.send({ embeds: [embed] }).catch(() => {});
                return;
            }

            if (entry.action == 80) {
                logs = await guild?.fetchAuditLogs({
                    type: 80,
                    limit: 1
                }).catch(() => {});
                log = logs.entries.first();
                if (!log) return;

                antiNukeData = await this.client.cache.get(guild?.id);
                if (!antiNukeData) {
                    antiNukeData = await this.client.database.antiNukeData.get(guild?.id);
                    await this.client.cache.set(guild?.id, antiNukeData);
                }
                if (!antiNukeData.enabled) return;

                user = log.executor;
                if (antiNukeData?.whitelistusers?.includes(user.id)) return;

                exeMember = await guild?.members.fetch(user.id);
                if (this.client.util.checkOwner(user.id) || user.id == this.client.user.id || user.id == guild?.ownerId || exeMember?.roles.highest.position > guild?.members.resolve(this.client.user).roles.highest.position) return;

                bot = guild?.members.cache.get(log.target.account.id);
                if (!bot) {
                    bot = await guild?.members.fetch(log.target.account.id);
                }
                bot.kick({ reason: "Anti Bot Add | Prismo Antinuke" });

                this.client.eventRestrict(antiNukeData.punishment, user.id, guild?.id, `Anti Bot Add | Prismo Antinuke`);

                logChannel = guild?.channels.cache.get(antiNukeData.logchannelid);
                if (!logChannel) return;

                embed = this.client.util.embed()
                    .setTitle(`Anti Bot Add`)
                    .setDescription(`**User:** ${user.username} (${user.id})\n**Action:** Kicked`)
                    .setColor(this.client.ErrorColor)
                    .setTimestamp();

                logChannel.send({ embeds: [embed] }).catch(() => {});
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }
};