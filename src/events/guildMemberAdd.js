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
            if (member?.user.bot) {
                const guildId = member?.guild.id;
                let antiNukeData = await this.client.cache.get(guildId) || await this.client.database.antiNukeData.get(guildId);
                if (!antiNukeData || !antiNukeData.enabled) {
                  return;
                }
                if (!antiNukeData.enabled) return;
                const logs = await member?.guild
                    ?.fetchAuditLogs({
                        type: 28,
                        limit: 1,
                    })
                    .catch(() => {});
                const log = logs?.entries?.first();
                if (!log) return;
                let user = log.executor;
                if (antiNukeData?.whitelistusers?.includes(user.id)) return;
                let exeMember;
                try {
                    exeMember = member?.guild.members.cache.get(user.id);
                } catch (err) {
                    exeMember = await member?.guild.members.fetch(user.id);
                }
                if (this.client.util.checkOwner(user.id)) return;
                if (user.id == this.client.user.id) return;
                if (user.id == member?.guild.ownerId) return;
                if (member?.id != log.target.id) return;
                member?.kick("Anti Bot Add | Prismo Antinuke").catch(() => {});
                if (exeMember?.roles.highest.position > member?.guild.members.resolve(this.client.user).roles.highest.position) {
                    return;
                }
                this.client.eventRestrict(antiNukeData.punishment, user.id, member?.guild.id, `Anti Bot Add | Prismo Antinuke`);
                let logChannel = member?.guild.channels.cache.get(antiNukeData.logchannelid);
                if (!logChannel) return;
                const embed = this.client.util
                    .embed()
                    .setTitle(`Anti Bot Add`)
                    .setDescription(`**User:** ${user.username} (${user.id})\n**Member:** ${member?.user.username} (${member?.id})\n**Action:** Kicked`)
                    .setColor(this.client.ErrorColor)
                    .setTimestamp();
                logChannel?.send({ embeds: [embed] }).catch(() => {});
                return;
            }
            const data = await this.client.database.guildData.get(member?.guild.id);
            if (data.welcome.channel != null) {
                const channel = member?.guild?.channels?.cache.get(data.welcome.channel);
                if (!channel) return;
                const messageContent = data.welcome.content;
                let dataContent = await this.client.util.replaceOriginal(messageContent, member);
                const embeds = data.welcome.embeds;
                const dataEmbed = await this.client.util.replacerOriginal(embeds, member);
                let embed = new EmbedBuilder(dataEmbed);
                if (this.client.config.Client.Owners.includes(member?.id)) {
                    embed = new EmbedBuilder()
                        .setTitle(`♡・welcyy ゛﹒𓂃  Sir`)
                        .setDescription(
                            `<a:dot:1047385974692392960>Check Out Rules\n<a:dot:1047385974692392960>Boost if you love the Server\n\n<a:ace_heart_4:1047386085879197738> Don't leave us`
                        )
                        .setColor("#2b2d31")
                        .setThumbnail(member?.user.displayAvatarURL());
                    dataContent = `<@${member?.id}> , Welcome owner!`;
                }
                channel
                    ?.send({
                        content: dataContent || " ",
                        embeds: [embed],
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
            if (data.autorole.enabled) {
                if (member?.user.bot) {
                    const roles = data.autorole.botRoles;
                    if (roles.length == 0) return;
                    member?.roles.add(roles, `Auto Role System | ${this.client.user.username}`);
                } else {
                    const roles = data.autorole.humanRoles;
                    if (roles.length == 0) return;
                    member?.roles.add(roles, `Auto Role System | ${this.client.user.username}`);
                }
            }
            if (data.greet.enabled) {
                const channel = data.greet.channel;
                const messageContent = data.greet.content;
                const dataContent = await this.client.util.replaceOriginal(messageContent, member);
                channel.forEach(async (c) => {
                    const channel = member?.guild.channels.cache.get(c);
                    if (!channel) return;
                    channel
                        ?.send(dataContent)
                        .then((m) => {
                            setTimeout(() => {
                                m.delete();
                            }, data.greet.deletetime);
                        })
                        .catch((e) => {
                            return;
                        });
                });
            }
        } catch (error) {
            return;
        }
    }
};
