/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Event = require("../abstract/event");

module.exports = class roleUpdate extends Event {
    get name() {
        return 'roleUpdate';
    }

    get once() {
        return false;
    }

    async run(oldRole, newRole) {
        try {
            let antiNukeData = await this.client.cache.get(newRole?.guild.id)
            if (!antiNukeData) {
                antiNukeData = await this.client.database.antiNukeData.get(newRole?.guild.id);
                await this.client.cache.set(newRole?.guild.id, antiNukeData);
            }
            if (!antiNukeData.enabled) return;
            const logs = await newRole?.guild.fetchAuditLogs({
                type: 31,
                limit: 1
            });

            const log = logs.entries.first();
            if (!log) return;
            let user = log.executor;
            if (antiNukeData?.whitelistusers?.includes(user.id)) return;
            if (this.client.util.checkOwner(user.id)) return;
            if (user.id == this.client.user.id) return;
            if (user.id == newRole?.guild.ownerId) return;
            await Promise.all([
                newRole?.edit({
                    name: oldRole.name,
                    color: oldRole.color,
                    hoist: oldRole.hoist,
                    mentionable: oldRole.mentionable,
                    permissions: oldRole.permissions,
                    position: oldRole.position,
                    reason : `Anti Role Update | Prismo Antinuke`
                }).catch(() => { }),
                this.client.eventRestrict(antiNukeData.punishment, user.id,  newRole?.guild.id, `Anti Role Update | Prismo Antinuke`)
            ]);
        } catch (e) {
            return;
        }
    }
};
