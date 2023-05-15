const Event = require("../abstract/event");

module.exports = class guildMemberUpdate extends Event {
    get name() {
        return "guildMemberUpdate";
    }
    get once() {
        return false;
    }
    /**
     *
     * @param {import('discord.js').GuildMember} oldMember
     * @param {import('discord.js').GuildMember} newMember
     */
    async run(oldMember, newMember) {
        if (oldMember.nickname == newMember.nickname) return;
        const data = await this.client.database.stickynickData.get(
            newMember.id,
            newMember.guild.id
        );
        if (data) {
            const nick = data.nick;
            if (newMember.nickname != nick) {
                newMember.setNickname(nick);
            }
        }
    }
};
