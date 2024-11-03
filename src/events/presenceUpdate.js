const Event = require("../abstract/event");
const { Collection } = require("@discordjs/collection");
module.exports = class PresenceUpdateEvent extends Event {
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
        let data = await this.client.cache.get(newPresence?.guild.id + "1")
        if (!data) {
            data = await this.client.database.guildData.get(newPresence?.guild.id);
            await this.client.cache.set(newPresence?.guild.id + "1", data);
        }
        if (data.presenserole.enabled) {

            const presenceRoleMapping = {
                "Grand Theft Auto V": data.presenserole.gtav,
                "Minecraft": data.presenserole.minecraft,
                "Fortnite": data.presenserole.fortnite,
                "Roblox": data.presenserole.roblox,
                "VALORANT": data.presenserole.valorant,
                "League of Legends": data.presenserole.leagueoflegends,
                "Spotify": data.presenserole.spotify,
                "Netflix": data.presenserole.netflix,
                "Twitch": data.presenserole.twitch,
                "Visual Studio Code": data.presenserole.vscode,
                "Code": data.presenserole.vscode
            };

            const rolesToAdd = [];
            const rolesToRemove = [];
            const processedActivities = [];

            for (const activity of activities) {
                if (processedActivities.includes(activity.name)) {
                    continue;
                }
                const roleID = presenceRoleMapping[activity.name];
                if (roleID) {
                    const role = newPresence?.guild?.roles?.cache.get(roleID);
                    if (role) {
                        rolesToAdd.push(role);
                    } else if (roleID === null || roleID === undefined) {
                        delete presenceRoleMapping[activity.name];
                    }
                }
                processedActivities?.push(activity.name);
            }

            const member = newPresence?.member;
            const existingRoles = member?.roles?.cache;
            if (!existingRoles) return;
            if (!member) return;

            for (const [_, role] of existingRoles) {
                if (Object.values(presenceRoleMapping).includes(role.id)) {
                    rolesToRemove?.push(role);
                }
            }

            if (rolesToAdd.length === 0 && rolesToRemove.length === 0) return;
            if (rolesToAdd.includes(rolesToRemove[0])) return;
            if (rolesToRemove.length != 0) {
                await member?.roles?.remove(rolesToRemove).catch(() => { });
            }
            if (rolesToAdd.length != 0) {
                await member?.roles?.add(rolesToAdd).catch(() => { });
            }
        }
    }
};