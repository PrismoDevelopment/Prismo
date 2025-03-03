/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Event = require("../abstract/event");
const { Collection } = require("@discordjs/collection");
module.exports = class messageCreate extends Event {
  constructor(...args) {
    super(...args);
    this.ratelimits = new Collection();
  }
  get name() {
    return "messageCreate";
  }
  get once() {
    return false;
  }
  async run(message) {
    if (message?.author.bot || message?.channel.type == 1) return;
    let afkdata = await this.client.cache.get(message?.author.id);
    if (afkdata) {
      await this.client.database.afkData.deleteAfk(message?.author.id);
      let timestamp = afkdata.time;
      timestamp = Math.floor(timestamp / 1000);
      return message
        ?.reply(`Welcome back! You went afk <t:${timestamp}:R> with the reason - ${afkdata.reason}`)
        .then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 10000);
        })
        .catch((err) => {});
    }
    if (message?.author.bot || message?.channel.type == 1) return;
    let mentionmember = message.mentions.members.first();
    if (mentionmember && mentionmember.id != this.client.user.id) {
      let afk = await this.client.cache.get(mentionmember.id);
      if (afk) {
        let user = await message?.guild.members.fetch(afk.id);
        return message?.reply(`${user.user.username} is afk for reason - **${afk.reason}**`).catch((err) => {});
      }
    }
  }
};
