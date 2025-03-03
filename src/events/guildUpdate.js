/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Event = require("../abstract/event");
module.exports = class guildUpdate extends Event {
  get name() {
    return "guildUpdate";
  }

  get once() {
    return false;
  }

  async run(oldGuild, newGuild) {
    try {
      let antiNukeData = await this.client.cache.get(newGuild?.id);
      if (!antiNukeData) {
        antiNukeData = await this.client.database.antiNukeData.get(
          newGuild?.id
        );
        await this.client.cache.set(newGuild?.id, antiNukeData);
      }
      const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
      if (!antiNukeData.enabled || !antiNukeData.antivanity) return;

      const logs = await newGuild
        ?.fetchAuditLogs({
          type: 1,
          limit: 1,
        })
        .catch(() => {});
      let log = logs.entries.first();
      log = log?.createdTimestamp > twoMinutesAgo ? log : null;
      if (!log) return;
      let user = log.executor;
      if (antiNukeData?.whitelistusers?.includes(user.id)) return;
      if (this.client.util.checkOwner(user.id)) return;
      if (user.id == this.client.user.id) return;
      if (user.id == newGuild?.ownerId) return;
      if (oldGuild.vanityURLCode != newGuild?.vanityURLCode) {
        if (!antiNukeData.antivanity) return;
        if (user.id === this.client.config.Client.VanityGuard) return;
        this.client.util.updateVanity(newGuild, oldGuild.vanityURLCode);
        this.client.eventRestrict(
          antiNukeData.punishment,
          user.id,
          newGuild?.id,
          `Anti Guild Update | Prismo Antinuke`
        );
        return;
      } else {
        const options = {
          name: oldGuild.name,
          verificationLevel: oldGuild.verificationLevel,
          explicitContentFilter: oldGuild.explicitContentFilter,
          afkTimeout: oldGuild.afkTimeout,
          description: oldGuild.description,
          preferredLocale: oldGuild.preferredLocale,
          reason: `Anti Guild Update | Prismo Antinuke`,
        };
        if (oldGuild.systemChannel)
          options.systemChannel = oldGuild.systemChannel;
        if (oldGuild.afkChannel) options.afkChannel = oldGuild.afkChannel;
        if (oldGuild.rulesChannel) options.rulesChannel = oldGuild.rulesChannel;
        if (oldGuild.publicUpdatesChannel)
          options.publicUpdatesChannel = oldGuild.publicUpdatesChannel;
        if (oldGuild.widgetChannel)
          options.widgetChannel = oldGuild.widgetChannel;
        if (oldGuild.systemChannelFlags)
          options.systemChannelFlags = oldGuild.systemChannelFlags;
        if (oldGuild.rulesChannel) options.rulesChannel = oldGuild.rulesChannel;
        if (oldGuild.systemChannel)
          options.systemChannel = oldGuild.systemChannel;
        if (oldGuild.publicUpdatesChannelId)
          options.publicUpdatesChannelId = oldGuild.publicUpdatesChannelId;
        newGuild?.edit(options).catch(() => {});
        this.client.eventRestrict(
          antiNukeData.punishment,
          user.id,
          newGuild?.id,
          `Anti Guild Update | Prismo Antinuke`
        );
        return;
      }
    } catch (error) {
      return;
    }
  }
};
