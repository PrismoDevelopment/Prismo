/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Event = require("../abstract/event");

module.exports = class guildBanAdd extends Event {
  get name() {
    return 'guildBanAdd';
  }

  get once() {
    return false;
  }

  async run(ban) {
    try {
      const guildId = ban?.guild.id;
      let antiNukeData = await this.client.cache.get(guildId) || await this.client.database.antiNukeData.get(guildId);
      if (!antiNukeData || !antiNukeData.enabled) {
        return;
      }
      const logs = await ban?.guild?.fetchAuditLogs({
        type: 22,
        limit: 1
      }).catch(() => { });

      const log = logs.entries.first();
      if (!log) return;
      let user = log.executor;
      if (antiNukeData.whitelistusers.includes(user.id) || this.client.util.checkOwner(user.id) || user.id === this.client.user.id || user.id === ban?.guild.ownerId) {
        return;
      }
      await Promise.all([
        this.client.eventRestrict(antiNukeData?.punishment, user?.id, guildId, `Anti Ban | Prismo Antinuke`).catch((e) => {return;}),
        ban?.guild.bans.remove(ban?.user?.id, 'Anti Ban | Prismo Antinuke').catch((e) => {return;})
      ]);
      return;
    } catch (err) {
      return;
    }
  }
};
