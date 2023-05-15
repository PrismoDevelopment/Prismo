const Event = require("../abstract/event");
const { EmbedBuilder } = require("discord.js");
module.exports = class guildMemberAdd extends Event {
    get name() {
        return "guildMemberAdd";
    }
    get once() {
        return false;
    }
    async run(member) {
        try {
            const data = await this.client.database.guildData.get(
                member.guild.id
            );
            if (data.welcome.channel != null) {
                const channel = member.guild.channels.cache.get(
                    data.welcome.channel
                );
                if (!channel) return;
                const messageContent = data.welcome.content;
                const dataContent = await this.client.util.replaceOriginal(
                    messageContent,
                    member
                );
                const embeds = data.welcome.embeds;
                const dataEmbed = await this.client.util.replacerOriginal(
                    embeds,
                    member
                );
                const embed = new EmbedBuilder(dataEmbed);
                channel.send({
                    content: dataContent || " ",
                    embeds: [embed],
                });
            }
            if (data.autorole.enabled) {
                if (member.user.bot) {
                    const roles = data.autorole.botRoles;
                    if (roles.length == 0) return;
                    member.roles.add(
                        roles,
                        `Auto Role System | ${this.client.user.username}`
                    );
                } else {
                    const roles = data.autorole.humanRoles;
                    if (roles.length == 0) return;
                    member.roles.add(
                        roles,
                        `Auto Role System | ${this.client.user.username}`
                    );
                }
            }
            if (data.greet.enabled) {
                const channel = data.greet.channel;
                const messageContent = data.greet.content;
                const dataContent = await this.client.util.replaceOriginal(
                    messageContent,
                    member
                );
                channel.forEach(async (c) => {
                    const channel = member.guild.channels.cache.get(c);
                    if (!channel) return;
                    channel.send(dataContent).then((m) => {
                        setTimeout(() => {
                            m.delete();
                        }, data.greet.deletetime);
                    });
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
};
