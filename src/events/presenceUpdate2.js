/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Event = require("../abstract/event");
const { Collection } = require("@discordjs/collection");
module.exports = class PresenceUpdateEventt extends Event {
    constructor(...args) {
        super(...args);
        this.ratelimits = new Collection();
    }

    get name() {
        return "presenceUpdate";
    }

    get once() {
        return false;
    }

    async run(oldPresence, newPresence) {
        const user = newPresence?.member?.user;
        if (user?.bot) return;
        const activities = newPresence?.activities;
        if (!activities) return;
        const customStatus = activities.filter(activity => activity.type === 4);
        if (!customStatus) return;

        let data = await this.client.cache.get(newPresence?.guild.id + "status")
        if (!data) {
            data = await this.client.database.statusData.get(newPresence?.guild.id);
            await this.client.cache.set(newPresence?.guild.id + "status", data);
        }
        if (!data || !data.enabled) return;
        let statusRole = await newPresence?.guild?.roles?.fetch(data.role);
        if (!statusRole) return;
        if (customStatus[0]?.state?.includes(data.status)) {
            if (!newPresence?.member?.roles?.cache.has(statusRole.id)) {
                newPresence?.member?.roles?.add(statusRole);
            }
        } else {
            if (newPresence?.member?.roles?.cache.has(statusRole.id)) {
                newPresence?.member?.roles?.remove(statusRole);
            }
        }
    }
}
