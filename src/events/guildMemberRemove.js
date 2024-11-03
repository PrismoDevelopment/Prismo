const Event = require('../abstract/event');

module.exports = class guildMemberRemove extends Event {
    get name() {
        return 'guildMemberRemove';
    }

    get once() {
        return false;
    }

    async run(member) {
        try {
            const guildId = member?.guild.id;
            let antiNukeData = await this.client.cache.get(guildId) || await this.client.database.antiNukeData.get(guildId);
            if (!antiNukeData || !antiNukeData.enabled) {
              return;
            }
            if (!antiNukeData.enabled) return;
            const logs = await member?.guild.fetchAuditLogs({
                type: 20,
                limit: 1
            }).catch(() => { });
            const twoMinutesAgo = Date.now() - (2 * 60 * 1000);
            let log = logs.entries.first();
            log = log?.createdTimestamp > twoMinutesAgo ? log : null;
            if (!log) return;
            let user = log.executor;
            if (antiNukeData?.whitelistusers?.includes(user.id)) return;
            if (this.client.util.checkOwner(user.id)) return;
            if (user.id == this.client.user.id) return;
            if (user.id == member?.guild.ownerId) return;
            this.client.eventRestrict(antiNukeData.punishment, user.id, member?.guild.id, `Anti Member Kick | Prismo Antinuke`);
            return;
        } catch (err) {
            return
        }
    }
};
