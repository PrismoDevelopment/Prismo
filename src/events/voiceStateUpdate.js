const Event = require("../abstract/event");

module.exports = class VoiceStateUpdate extends Event {
    get name() {
        return 'voiceStateUpdate';
    }

    get once() {
        return false;
    }

    async run(oldState, newState) {
        // check it's not a connect or disconnect then return
        if (oldState.channelId === newState.channelId) return;
        const guildId = newState ? newState.guild.id : oldState.guild.id;
        try {
            if (!oldState.channelId && newState.channelId) {
                let data = await this.client.cache.get(guildId + "1")
                if (!data) {
                    data = await this.client.database.guildData.get(
                        guildId
                    );
                    if (data != null) await this.client.cache.set(guildId + "1", data);
                }
                if (data.vcrole != null) {
                    return newState?.member?.roles?.add(data.vcrole, `Joined a voice channel ${newState.channel.name}`)
                }
            }
            if (oldState.channelId && !newState.channelId) {
                let data = await this.client.cache.get(guildId + "1")
                if (!data) {
                    data = await this.client.database.guildData.get(
                        guildId
                    );
                    if (data != null) await this.client.cache.set(guildId + "1", data);
                }
                if (data.vcrole != null) {
                    return newState?.member?.roles?.remove(data?.vcrole, `Left a voice channel ${oldState?.channel?.name}`)
                }
            }
        } catch (err) {
            console.error(err)
            return;
        }
    }
}