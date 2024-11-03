const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "avatar",
            aliases: ["av"],
            description: "Shows the avatar of the mentioned user.",
            usage: ["avatar <user>"],
            category: "Utilities",
            userPerms: ["SendMessages"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image:"https://i.imgur.com/2y93K5z.png",
            guildOnly: true,
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The user to show the avatar of.",
                    required: false,
                },
            ],
        });
    }

    async run({ message, args }) {
        let user = args[0]
            ? await this.client.util.userQuery(args[0])
            : message?.author;
        if (!user)
            return this.client.util.errorDelete(
                message,
                "Invalid user provided."
            );
        let customavatar = false;
        const member = await this.client.users.fetch(user);
        let globaluser = null;
        try {
            globaluser = await this.client.users.fetch(user).then(c => c.avatarURL({
                dynamic: true,
                size: 2048,
            }));
        } catch (err) {
            globaluser = null;
        }
        if (globaluser === null) return message?.reply({ embeds: [this.client.util.errorDelete(message, "This user does not have an avatar.")] });
        let guilduser = null;
        try {
            guilduser = await message?.guild.members
                .fetch(user)
                .then((member) => member.avatarURL({ dynamic: true, size: 2048 }));
        } catch (e) {
            guilduser = null;
        }
        let embed = null;
        if (globaluser !== guilduser) customavatar = true;
        if (guilduser === null) customavatar = false;
        if (customavatar == false) {
            embed = this.client.util
                .embed()
                .setAuthor({ name: `${member.username}'s Avatar`, iconURL: member.avatarURL({ dynamic: true }) })
                .setImage(globaluser)
                .setColor(this.client.config.Client.PrimaryColor)
                .setFooter({ text: `Requested by ${message?.author.username}`, iconURL: message?.author.avatarURL({ dynamic: true }) })
            let newcomponent = [
                    {
                        type: 2,
                        style: 5,
                        label: "JPEG",
                        url: globaluser.replace("webp", "jpeg"),
                    },
                    {
                        type: 2,
                        style: 5,
                        label: "PNG",
                        url: globaluser.replace("webp", "png"),
                    },
                ];
                if (globaluser.includes("a_")) {
                    newcomponent.push({
                        type: 2,
                        style: 5,
                        label: "GIF",
                        url: globaluser.replace("webp", "gif"),
                    });
                    newcomponent[0].url = globaluser.replace("gif", "jpeg");
                    newcomponent[1].url = globaluser.replace("gif", "png");
                }
            return message?.channel.send({
                embeds: [embed],
                components: [
                    {
                        type: 1,
                        components: newcomponent,
                    },
                ],
            });
        }
        embed = this.client.util
            .embed()
            .setDescription(`which avatar would you like to see?`)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel
            .send({
                embeds: [embed],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 3,
                                label: "Global Avatar",
                                custom_id: "global",
                            },
                            {
                                type: 2,
                                style: 3,
                                label: "Server Avatar",
                                custom_id: "guild",
                                disabled: !customavatar,
                            },
                        ],
                    },
                ],
            })
            .then(async (msg) => {
                const filter = (i) => i.user.id === message?.author.id;
                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 60000,
                });
                collector.once("collect", async (i) => {
                    if (i.customId === "global") {
                        embed.setImage(globaluser);
                        embed.setAuthor({ name: `${member.username}'s Avatar`, iconURL: member.avatarURL({ dynamic: true }) });
                        embed.setDescription(null)
                        embed.setFooter({ text: `Requested by ${message?.author.username}`, iconURL: message?.author.avatarURL({ dynamic: true }) })
                        let compos = [
                            {
                                type: 2,
                                style: 5,
                                label: "JPEG",
                                url: globaluser.replace("webp", "jpeg"),
                            },
                            {
                                type: 2,
                                style: 5,
                                label: "PNG",
                                url: globaluser.replace("webp", "png"),
                            },
                        ];
                        if (globaluser.includes("a_")) {
                            compos.push({
                                type: 2,
                                style: 5,
                                label: "GIF",
                                url: globaluser.replace("webp", "gif"),
                            });
                            compos[0].url = globaluser.replace("gif", "jpeg");
                            compos[1].url = globaluser.replace("gif", "png");
                        }
                        await i.update({
                            embeds: [embed],
                            components: [
                                {
                                    type: 1,
                                    components: compos,
                                },
                            ],
                        });
                    }
                    if (i.customId === "guild") {
                        embed.setImage(guilduser);
                        embed.setAuthor({ name: `${member.username}'s Avatar`, iconURL: member.avatarURL({ dynamic: true }) });
                        embed.setDescription(null)
                        embed.setFooter({ text: `Requested by ${message?.author.username}`, iconURL: message?.author.avatarURL({ dynamic: true }) })
                        let compos = [
                            {
                                type: 2,
                                style: 5,
                                label: "JPEG",
                                url: guilduser.replace("webp", "jpeg"),
                            },
                            {
                                type: 2,
                                style: 5,
                                label: "PNG",
                                url: guilduser.replace("webp", "png"),
                            },
                        ];
                        if (guilduser.includes("a_")) {
                            compos.push({
                                type: 2,
                                style: 5,
                                label: "GIF",
                                url: guilduser.replace("webp", "gif"),
                            });
                            compos[0].url = guilduser.replace("gif", "jpeg");
                            compos[1].url = guilduser.replace("gif", "png");
                        }
                        await i.update({
                            embeds: [embed],
                            components: [
                                {
                                    type: 1,
                                    components: compos,
                                },
                            ],
                        });
                    }
                });
                collector.once("end", async (collected) => {
                    if (collected.size === 0) {
                        embed.setDescription(
                            `You didn't select an avatar in time!`
                        );
                        await i.update({
                            embeds: [embed],
                            components: [],
                        });
                    }
                });
            });
    }

    async exec({ interaction }) {
        let user = interaction?.options.get("user")
            ? interaction?.options.get("user").user
            : interaction?.user;
        let customavatar = false;
        const member = await this.client.users.fetch(user);
        let globaluser = null;
        try {
            globaluser = await this.client.users.fetch(user).then(c => c.avatarURL({
                dynamic: true,
                size: 2048,
            }));
        } catch (err) {
            globaluser = null;
        }
        if (globaluser === null) return interaction?.reply({ content: `This user doesn't have an avatar!`, ephemeral: true });
        let guilduser = null;
        try {
            guilduser = await interaction?.guild.members
                .fetch(user)
                .then((member) => member.avatarURL({ dynamic: true, size: 2048 }));
        } catch (e) {
            guilduser = null;
        }
        if (globaluser !== guilduser) customavatar = true;
        if (guilduser === null) customavatar = false;
        let embed = this.client.util
            .embed()
            .setDescription(`which avatar would you like to see?`)
            .setColor(this.client.config.Client.PrimaryColor)
            .setFooter({ text: `Requested by ${interaction?.user.username}`, iconURL: interaction?.user.displayAvatarURL({ dynamic: true }) })

        interaction?.reply({
            embeds: [embed],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 3,
                            label: "Global Avatar",
                            custom_id: "global",
                        },
                        {
                            type: 2,
                            style: 3,
                            label: "Guild Avatar",
                            custom_id: "guild",
                            disabled: !customavatar,
                        },
                    ],
                },
            ],
        });
        const filter = (i) => i.user.id === interaction?.user.id;
        const collector = interaction?.channel.createMessageComponentCollector({
            filter,
            time: 60000,
        });
        collector.once("collect", async (i) => {
            if (i.customId === "global") {
                embed.setImage(globaluser);
                embed.setAuthor({ name: `${member.username}'s Avatar`, iconURL: member.avatarURL({ dynamic: true }) });
                embed.setDescription(null)
                embed.setFooter({ text: `Requested by ${interaction?.user.username}`, iconURL: interaction?.user.displayAvatarURL({ dynamic: true }) })
                let compos = [
                    {
                        type: 2,
                        style: 5,
                        label: "JPEG",
                        url: globaluser.replace("webp", "jpeg"),
                    },
                    {
                        type: 2,
                        style: 5,
                        label: "PNG",
                        url: globaluser.replace("webp", "png"),
                    },
                ];
                if (globaluser.includes("a_")) {
                    compos.push({
                        type: 2,
                        style: 5,
                        label: "GIF",
                        url: globaluser.replace("webp", "gif"),
                    });
                    compos[0].url = globaluser.replace("gif", "jpeg");
                    compos[1].url = globaluser.replace("gif", "png");
                }
                await i.update({
                    embeds: [embed],
                    components: [
                        {
                            type: 1,
                            components: compos,
                        },
                    ],
                });
            }
            if (i.customId === "guild") {
                embed.setImage(guilduser);
                embed.setAuthor({ name: `${member.username}'s Avatar`, iconURL: member.avatarURL({ dynamic: true }) });
                embed.setDescription(null)
                embed.setFooter({ text: `Requested by ${interaction?.user.username}`, iconURL: interaction?.user.displayAvatarURL({ dynamic: true }) })
                let compos = [
                    {
                        type: 2,
                        style: 5,
                        label: "JPEG",
                        url: guilduser.replace("webp", "jpeg"),
                    },
                    {
                        type: 2,
                        style: 5,
                        label: "PNG",
                        url: guilduser.replace("webp", "png"),
                    },
                ];
                if (guilduser.includes("a_")) {
                    compos.push({
                        type: 2,
                        style: 5,
                        label: "GIF",
                        url: guilduser.replace("webp", "gif"),
                    });
                    compos[0].url = globaluser.replace("gif", "jpeg");
                    compos[1].url = globaluser.replace("gif", "png");
                }
                await i.update({
                    embeds: [embed],
                    components: [
                        {
                            type: 1,
                            components: compos,
                        },
                    ],
                });
            }
        });
        collector.once("end", async (collected) => {
            if (collected.size === 0) {
                embed.setDescription(`You didn't select an avatar in time!`);
                await i.update({
                    embeds: [embed],
                    components: [],
                });
            }
        });
    }
};
