const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "welcome",
            aliases: ["wel"],
            description: "Will Welcome the user to your server",
            usage: ["welcome <set|delete>"],
            category: "Welcome",
            userPerms: ["ManageGuild"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/BA5XIva.png",
            options: [
                {
                    type: 1,
                    name: "set",
                    description: "Set Welcome Message",
                    options: [
                        {
                            type: 7,
                            name: "channel",
                            description: "Channel to send welcome message",
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "delete",
                    description: "Delete Welcome Message",
                },
                {
                    type: 1,
                    name: "test",
                    description: "Test Welcome Message",
                },
            ],
        });
    }

    async run({ message, args }) {
        try {
            if (!args[0])
                return message?.reply({
                    embeds: [this.client.util.errorDelete(message, "Please Provide A Valid Option!\n\n**Options**:\n- `set`\n- `delete`\n- `test`")],
                    ephemeral: true,
                });
            if (args[0] === "set") {
                const channel =
                    message?.mentions.channels.first() ||
                    message?.guild.channels.cache.get(args[1]) ||
                    message?.guild.channels.cache.find(
                        (r) =>
                            r.name.toLowerCase() ==
                            args.slice(0).join(" ").toLowerCase()
                    )
                if (!channel)
                    return message?.reply({
                        embeds: [this.client.util.errorDelete(message, "Please Provide A Valid Channel!")],
                        ephemeral: true,
                    });
                const data = await this.client.database.welcomeUserData.get(
                    message?.member.user.id
                );
                let max = data.message?.length;
                let okie = data.message?.slice(0, max);
                const msg = await message?.reply({
                    content:
                        `Please Choose, Channel And Preset You Want To Set
Need more presets? Try \`/embed create\`!`,
                    components: [
                        this.client.util.row().setComponents(
                            this.client.util
                                .menu()
                                .setCustomId("embedPreset")
                                .setPlaceholder("Choose Preset To Set Welcome Message")
                                .addOptions([
                                    ...okie.map((c) => ({
                                        label: c.name,
                                        value: c.id,
                                    })),
                                ])
                        ),
                        this.client.util
                            .row()
                            .setComponents(
                                this.client.util
                                    .button()
                                    .setCustomId("save")
                                    .setLabel("Save")
                                    .setStyle(3),
                                this.client.util
                                    .button()
                                    .setCustomId("cancel")
                                    .setLabel("Cancel")
                                    .setStyle(4)
                            ),
                    ],
                });
                const filter = (i) => i.user.id === message?.member.user.id;
                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 60000,
                });
                let presetName = "";
                let dataToSave = {
                    channel: null,
                    content: null,
                    embeds: null,
                };
                dataToSave.channel = channel.id;
                collector.on("collect", async (i) => {
                    if (i.componentType == 3) {
                        if (i.customId === "embedPreset") {
                            const embedValue = data.message?.filter(
                                (g) => g.id == i.values[0]
                            )[0];
                            presetName = embedValue.name;
                            dataToSave.content = embedValue.content;
                            dataToSave.embeds = embedValue.embeds;
                            i.deferUpdate().catch(() => {});
                        }
                    }
                    if (i.componentType == 2) {
                        if (i.customId === "save") {
                            if (!dataToSave.embeds)
                                return i.reply({
                                    content: `${this.client.config.Client.emoji.cross} Please Choose A Preset!`,
                                    ephemeral: true,
                                });
                            await this.client.database.guildData.putWelcome(
                                message?.guild.id,
                                dataToSave
                            );
                            msg.edit({
                                content: `${this.client.config.Client.emoji.tick} Welcome Message Has Been Successfully Setupped!\n\n**Channel**: <#${dataToSave.channel}>\n**Preset**: ${presetName}`,
                                components: [],
                            });
                            collector.stop();
                        }
                        if (i.customId === "cancel") {
                            msg.delete().catch(() => {});
                            collector.stop();
                        }
                    }
                });
            }
            if (args[0] === "delete") {
                await this.client.database.guildData.putWelcome(
                    message?.guild.id,
                    {
                        channel: null,
                        content: null,
                        embeds: null,
                    }
                );
                message?.reply({
                    embeds: [this.client.util.doDeletesend(message, "Welcome Message Has Been Successfully Deleted!")],
                    ephemeral: true,
                });
            }
            if (args[0] === "test") {
                const data = await this.client.database.guildData.getWelcome(
                    message?.guild.id
                );
                if (!data.channel)
                    return message?.reply({
                        embeds: [this.client.util.errorDelete(message, "Welcome Message Hasn't Been Setupped Yet!")],
                        ephemeral: true,
                    });
                message?.reply({
                    embeds: [this.client.util.doDeletesend(message, "Welcome Message Has Been Sent!")],
                    ephemeral: true,
                });
                this.client.emit("guildMemberAdd", message?.member);
            }
        } catch (e) {
            return
        }
    }

    async exec({ interaction }) {
        try {
            if (interaction?.options.getSubcommand() === "set") {
                const channel =
                    interaction?.options.getChannel("channel") ||
                    interaction?.channel;
                const data = await this.client.database.welcomeUserData.get(
                    interaction?.user.id
                );
                let max = data.message?.length;
                let okie = data.message?.slice(0, max);
                const msg = await interaction?.reply({
                    content:
                        `Please Choose, Channel And Preset You Want To Set
Need more presets? Try \`/embed create\`!`,
                    fetchReply: true,
                    components: [
                        this.client.util.row().setComponents(
                            this.client.util
                                .menu()
                                .setCustomId("embedPreset")
                                .setPlaceholder("Choose Preset To Set Welcome Message")
                                .addOptions([
                                    ...okie.map((c) => ({
                                        label: c.name,
                                        value: c.id,
                                    })),
                                ])
                        ),
                        this.client.util
                            .row()
                            .setComponents(
                                this.client.util
                                    .button()
                                    .setCustomId("save")
                                    .setLabel("Save")
                                    .setStyle(3),
                                this.client.util
                                    .button()
                                    .setCustomId("cancel")
                                    .setLabel("Cancel")
                                    .setStyle(4)
                            ),
                    ],
                });
                const filter = (i) => i.user.id === interaction?.user.id;
                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 60000,
                });
                let presetName = "";
                let dataToSave = {
                    channel: null,
                    content: null,
                    embeds: null,
                };
                dataToSave.channel = channel.id;
                collector.on(
                    "collect",
                    async (i) => {
                        if (i.componentType == 3) {
                            if (i.customId === "embedPreset") {
                                const embedValue = data.message?.filter(
                                    (g) => g.id == i.values[0]
                                )[0];
                                presetName = embedValue.name;
                                dataToSave.content = embedValue.content;
                                dataToSave.embeds = embedValue.embeds;
                                i.deferUpdate().catch(() => {});
                            }
                        }
                        if (i.componentType == 2) {
                            if (i.customId === "save") {
                                if (!dataToSave.embeds)
                                    return i.reply({
                                        content: "You Must Choose A Preset",
                                        ephemeral: true,
                                    });
                                await this.client.database.guildData.putWelcome(
                                    interaction?.guild.id,
                                    dataToSave
                                );
                                msg.edit({
                                    content: `${this.client.config.Client.emoji.tick} Welcome Message Has Been Successfully Setupped!\n\n**Channel**: <#${dataToSave.channel}>\n**Preset**: ${presetName}`,
                                    components: [],
                                });
                                collector.stop();
                            }
                            if (i.customId === "cancel") {
                                msg.delete().catch(() => {});
                                collector.stop();
                            }
                        }
                    },
                    { time: 60000 }
                );
            }
            if (interaction?.options.getSubcommand() === "delete") {
                await this.client.database.guildData.putWelcome(
                    interaction?.guild.id,
                    {
                        channel: null,
                        content: null,
                        embeds: null,
                    }
                );
                interaction?.reply({
                    content: `${this.client.config.Client.emoji.tick} Welcome Message Has Been Successfully Deleted!`,
                    ephemeral: true,
                });
            }
            if (interaction?.options.getSubcommand() === "test") {
                const data = await this.client.database.guildData.getWelcome(
                    interaction?.guild.id
                );
                if (!data.channel)
                    return interaction?.reply({
                        content: `${this.client.config.Client.emoji.cross} Welcome Message Has Not Been Setupped Yet!`,
                        ephemeral: true,
                    });
                interaction?.reply({
                    content: `${this.client.config.Client.emoji.tick} Welcome Message Has Been Successfully Sent!`,
                    ephemeral: true,
                });
                this.client.emit("guildMemberAdd", interaction?.member);
            }
        } catch (e) {
            return  
        }
    }
};
