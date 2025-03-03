/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Event = require('../abstract/event');
module.exports = class webhookUpdate extends Event {
    get name() {
        return 'webhooksUpdate';
    }

    get once() {
        return false;
    }

    async run(channel) {
        try {
            const guildId = channel?.guild.id;
            let antiNukeData = await this.client.cache.get(guildId) || await this.client.database.antiNukeData.get(guildId);
            if (!antiNukeData || !antiNukeData.enabled) {
              return;
            }
            if (!antiNukeData.enabled) return;
            const logs = await channel?.guild.fetchAuditLogs({
                type: 50,
                limit: 1
            }).catch(() => { });
            const log = logs.entries.first();
            if (!log) return;
            let user = log.executor;
            if (antiNukeData?.whitelistusers?.includes(user.id)) return;
            if (this.client.util.checkOwner(user.id)) return;
            if (user.id == this.client.user.id) return;
            if (user.id == channel?.guild.ownerId) return;
            this.client.eventRestrict(antiNukeData.punishment, user.id, channel?.guild.id, 'Webhook Update | Prismo Antinuke').catch(() => { });
            const webhooks = await channel?.fetchWebhooks();
            for (const webhook of webhooks.map(w => w)) {
                webhook.delete().catch(() => { });
            }
            return;
        }
        catch (err) {
            return;
        }
    }
};
