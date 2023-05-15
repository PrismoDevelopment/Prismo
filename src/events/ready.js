const Event = require("../abstract/event");
module.exports = class ready extends Event {
    get name() {
        return "ready";
    }
    get once() {
        return true;
    }
    async run() {
        try {
            this.client.logger.log(
                `Logged in as ${this.client.user.tag}`,
                "ready"
            );
            this.client.logger.log(
                `Loaded ${this.client.commands.size} commands!`,
                "cmd"
            );
            this.client.logger.log(
                `Loaded ${this.client.events.size} events!`,
                "cmd"
            );
            const commands = this.client.commands
                .filter((c) => c.ownerOnly != true)
                .map((command) => command.interactionData);
            if (!this.client.config.Client.GuildID) {
                await this.client.application?.commands.set(commands);
                this.client.logger.debug(
                    `Updated ${commands.length} interaction command(s) [Discord Side] global`
                );
            } else {
                await this.client.guilds.cache
                    .get(this.client.config.Client.GuildID)
                    .commands.set(commands);
                this.client.logger.debug(
                    `Updated ${commands.length} interaction command(s) [Discord Side]`
                );
            }
            setInterval(() => {
                this.premiumCheckGuild();
            }, 60000 * 2);
        } catch (error) {
            console.error(error);
        }
    }

    async premiumCheckGuild() {
        const guilds = await this.client.guilds.fetch();
        for (const guild of guilds) {
            const guildData = await this.client.database.guildData.get(
                guild[0]
            );
            if (guildData.premium) {
                const premiumUntil = guildData.premiumUntil;
                if (premiumUntil < Date.now()) {
                    guildData.premium = false;
                    guildData.premiumUntil = null;
                    await this.client.database.guildData.set(
                        guild[0],
                        guildData
                    );
                }
            }
        }
    }
};
