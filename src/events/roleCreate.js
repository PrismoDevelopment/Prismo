const Event = require("../abstract/event");

module.exports = class roleCreate extends Event {
    get name() {
        return 'roleCreate';
    }

    get once() {
        return false;
    }

    async run(role) {
        try {
            let antiNukeData = await this.client.cache.get(role?.guild.id)
            if (!antiNukeData) {
                antiNukeData = await this.client.database.antiNukeData.get(role?.guild.id);
                await this.client.cache.set(role?.guild.id, antiNukeData);
            }
            if (!antiNukeData.enabled) return;
            const logs = await role?.guild.fetchAuditLogs({
                type: 30,
                limit: 1
            }).catch(() => { });

            const log = logs.entries.first();
            if (!log) return;
            let user = log.executor;
            if (antiNukeData?.whitelistusers?.includes(user.id)) return;
            if (this.client.util.checkOwner(user.id)) return;
            if (user.id == this.client.user.id) return;
            if (user.id == role?.guild.ownerId) return;
            if (role?.id != log.target.id) return;
            await Promise.all([
            role?.delete().catch(() => { }),
            this.client.eventRestrict(antiNukeData.punishment, user.id, role?.guild.id, `Anti Role Create | Prismo Antinuke`).catch(() => { })
            ]);
            return;
        } catch (err) {
            return;
        }
    }
};
