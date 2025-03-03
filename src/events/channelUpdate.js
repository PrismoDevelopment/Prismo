/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Event = require("../abstract/event");

module.exports = class channelUpdate extends Event {
    get name() {
        return 'channelUpdate';
    }

    get once() {
        return false;
    }

    async run(oldChannel, newChannel) {
        try {
            const guildId = newChannel?.guild.id;
            let antiNukeData = await this.client.cache.get(guildId) || await this.client.database.antiNukeData.get(guildId);
            if (!antiNukeData || !antiNukeData.enabled) {
              return;
            }
            if (!antiNukeData.enabled) return;
            const logs = await newChannel?.guild.fetchAuditLogs({
                limit: 1
            }).catch(() => { });
            const log = logs.entries.first();
            if (!log) return;
            let user = log.executor;
            if (antiNukeData?.whitelistusers?.includes(user.id)) return;
            if (newChannel?.id == log.target.id) {
                if (this.client.util.checkOwner(user.id)) return;
                if (user.id == this.client.user.id) return;
                if (user.id == newChannel?.guild.ownerId) return;
                await Promise.all([
                    this.client.eventRestrict(antiNukeData.punishment, user.id, newChannel?.guild.id, `Anti Channel Update | Prismo Anti Nuke`).catch(() => { }),
                    newChannel?.edit({
                        name: oldChannel.name,
                        type: oldChannel.type,
                        topic: oldChannel.topic,
                        nsfw: oldChannel.nsfw,
                        position: oldChannel.position,
                        rateLimitPerUser: oldChannel.rateLimitPerUser,
                        reason: `Anti Channel Update`
                    }).catch(() => { })
                ]);
                return;
            }
        } catch (err) {
            return;
        }
    }
};
