const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "nuke",
            aliases: ["clone", "clonechannel", "nukechannel"],
            description: "Nuke A Channel",
            usage: ["nuke"],
            category: "Moderation",
            userPerms: ["ManageChannels"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "ManageChannels",
            ],
            cooldown: 5,
            image: "https://imgur.com/M2qjy9x",
            options: [
                {
                    type: 7,
                    name: "channel",
                    description: "Channel To Nuke",
                    required: false,
                },
            ],
        });
    }

    async run({ message, args }) {
        try {
            let serverowner = message.guild.ownerId;
            if(message.author.id !== serverowner) {
            if (
                message?.member.roles.highest.position <
                message?.guild.members.cache.get(this.client.user.id).roles
                    .highest.position
            )
                return message?.reply({
                    content: "You need to have a higher role than me.",
                    ephemeral: true,
                });
            }
            let channel =
                message?.mentions.channels.first() ||
                message?.guild.channels.cache.get(args[0]) ||
                message?.guild.channels.cache.find(
                    (r) =>
                        r.name.toLowerCase() ==
                        args.slice(0).join(" ").toLowerCase()
                ) ||
                message?.channel;
            if (!channel)
                return message?.reply({
                    content: "I would appreciate it if you provided a valid channel.",
                    ephemeral: true,
                });

            const position = channel.rawPosition;
            message
                .reply({
                    content: "Are you sure you want to clone this channel?",
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 3,
                                    label: "Yes",
                                    custom_id: "yes",
                                },
                                {
                                    type: 2,
                                    style: 4,
                                    label: "No",
                                    custom_id: "no",
                                },
                            ],
                        },
                    ],
                })
                .then(async (msg) => {
                    // eslint-disable-line
                    const filter = (i) => i.user.id === message?.author.id;
                    const collector = msg.createMessageComponentCollector({
                        filter,
                        time: 25000,
                    });
                    collector.once("collect", async (i) => {
                        if (i.customId === "yes") {
                            await channel.clone({ position });
                            await channel.delete();
                            await i.update({
                                content: "Successfully cloned the channel.",
                                components: [],
                            });
                        } else if (i.customId === "no") {
                            await i.update({
                                content: "Cancelled the command.",
                                components: [],
                            });
                        }
                    });
                    collector.once("end", async (collected) => {
                        if (collected.size === 0) {
                            await msg.edit({
                                content: "Timed out.",
                                components: [],
                            });
                        }
                    });
                });
        } catch (e) {
            return
        }
    }

    async exec({ interaction }) {
        try {
            let serverowner = interaction.guild.ownerId;
            if(interaction.user.id !== serverowner) {
            if (
                interaction?.member.roles.highest.position <
                interaction?.guild.members.cache.get(this.client.user.id).roles
                    .highest.position
            )
                return interaction?.reply({
                    content: "You do not have permission to use this command.",
                    ephemeral: true,
                });
            }
            const channel =
                interaction?.options.getChannel("channel") ||
                interaction?.channel;
            if (!channel)
                return interaction?.reply({
                    content: "I would appreciate it if you provided a valid channel.",
                    ephemeral: true,
                });
            const position = channel.rawPosition;
            interaction
                .reply({
                    content: "Are you sure you want to clone this channel?",
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 3,
                                    label: "Yes",
                                    custom_id: "yes",
                                },
                                {
                                    type: 2,
                                    style: 4,
                                    label: "No",
                                    custom_id: "no",
                                },
                            ],
                        },
                    ],
                })
                .then(async (msg) => {
                    // eslint-disable-line
                    const filter = (i) => i.user.id === interaction?.user.id;
                    const collector = msg.createMessageComponentCollector({
                        filter,
                        time: 25000,
                    });
                    collector.once("collect", async (i) => {
                        if (i.customId === "yes") {
                            await channel.clone({ position });
                            await channel.delete();
                            await i.update({
                                content: "Successfully cloned the channel.",
                                components: [],
                            });
                        } else if (i.customId === "no") {
                            await i.update({
                                content: "Cancelled the command.",
                                components: [],
                            });
                        }
                    });
                    collector.once("end", async (collected) => {
                        if (collected.size === 0) {
                            await msg.edit({
                                content: "Timed out.",
                                components: [],
                            });
                        }
                    });
                });
        } catch (e) {
            return
        }
    }
};
