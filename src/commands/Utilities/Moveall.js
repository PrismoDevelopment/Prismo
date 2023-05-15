const Command = require("../../abstract/command");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");

module.exports = class Moveall extends Command {
    constructor(...args) {
        super(...args, {
            name: "moveall",
            aliases: ["vcmoveall", "moveallvc"],
            description: "Moves all members from one voice channel to another.",
            usage: ["<ma fromchannel tochannel>"],
            category: "Utilities",
            userPerms: ["MoveMembers"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "MoveMembers",
            ],
            cooldown: 5,
            options: [
                {
                    type: 1,
                    name: "moveall",
                    description:
                        "Moves all members from one voice channel to another.",
                    options: [
                        {
                            type: 7,
                            name: "fromchannel",
                            description: "Channel to move members from",
                            required: true,
                        },
                        {
                            type: 7,
                            name: "tochannel",
                            description: "Channel to move members to",
                            required: true,
                        },
                    ],
                },
            ],
        });
    }

    async run({ message, args }) {
        try {
            const voice = message.member.voice;
            if (!voice.channel)
                return this.client.util.errorEmbed(
                    message,
                    "Sorry But I Can't Find You In Any Voice Channel!"
                );
            if (voice) {
                await joinVoiceChannel({
                    channelId: voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });
                let msg = await message.reply({
                    content:
                        "Now Move Me To The Voice Channel, To Move Everyone To The New Voice Channel!",
                });
                await this.move(message, msg);
            }
        } catch {
            return;
        }
    }
    async move(message, msg) {
        try {
            this.client.once("voiceStateUpdate", async (oldState, newState) => {
                await newState.guild.members.fetch();
                if (newState.id != this.client.user.id) return;
                if (newState.channelId == null) return;
                const channel = message.guild.channels.cache.get(
                    newState.channelId
                );
                await message.guild.members.cache.forEach((member) => {
                    if (!member.voice) return;
                    if (oldState.channelId !== member.voice.channelId) return;
                    member.voice.setChannel(channel);
                });
                await msg.edit({
                    content: "Moved All Members To The New Voice Channel!",
                });
                await getVoiceConnection(message.guild.id).disconnect();
            });
        } catch {
            return;
        }
    }
};
