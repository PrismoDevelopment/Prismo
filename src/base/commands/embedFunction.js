const { EmbedBuilder } = require("discord.js");
const imgSync = ["$user_iconurl", "$guild_iconurl"];

module.exports = class EmbedFunction {
    /**
     *
     * @param {import('../PrismoClient')} client
     */
    constructor(client) {
        this.client = client;
    }
    async buildNormal(message, args, slash = false) {
        try {
            if (slash == false) {
                if (!args[0])
                    return message.reply({
                        content:
                            "You Must Choose: `create`, `delete`, `edit`, `list`, `show`",
                        ephemeral: true,
                    });
                if (args[0].toLowerCase() === "create") {
                    let data = {
                        name: "",
                        content: " ",
                    };
                    let embedData = {};
                    embedData.title = "title";
                    embedData.description = "description";
                    embedData.color = 3092790;
                    embedData.image = {};
                    embedData.image.url = undefined;
                    embedData.thumbnail = {};
                    embedData.thumbnail.url = undefined;
                    embedData.author = {};
                    embedData.author.name = undefined;
                    embedData.author.icon_url = undefined;
                    embedData.footer = {};
                    embedData.footer.text = undefined;
                    embedData.footer.icon_url = undefined;
                    const msg = await message.reply({
                        content:
                            "What Whould You Like To Set The Embed Name? (Type `cancel` To Cancel)",
                    });
                    const filter = (m) =>
                        m.author.id == message.author.id && !m.author.bot;
                    const collector =
                        await message.channel.createMessageCollector({
                            filter,
                            max: 3,
                            time: 30000,
                        });
                    collector.on("collect", async (m) => {
                        if (m.content.toLowerCase() === "cancel") {
                            msg.delete();
                            m.delete();
                            return collector.stop();
                        }
                        if (m.content.length > 20)
                            return m.reply({
                                content:
                                    "Embed Name Must Be Less Than 20 Characters!",
                                ephemeral: true,
                            });
                        data.name = m.content;
                        m.delete();
                        msg.delete();
                        collector.stop();
                    });
                    collector.once("end", async (collected, reason) => {
                        if (reason == "time") {
                            message.reply({
                                content: "You Took Too Long To Respond!",
                                ephemeral: true,
                            });
                        }
                        const embed = this.client.util
                            .embed()
                            .setTitle("Title")
                            .setDescription("Description")
                            .setColor(0x000000);
                        const realMsg = await message.reply({
                            content: "Content!",
                            embeds: [embed],
                            components: [
                                this.client.util.row().setComponents(
                                    this.client.util
                                        .menu()
                                        .setPlaceholder(
                                            "Start Editing The Embed!"
                                        )
                                        .setCustomId("embed")
                                        .setOptions([
                                            {
                                                label: "Content",
                                                value: "content",
                                                description:
                                                    "Edit The Content Of The Message",
                                            },
                                            {
                                                label: "Title",
                                                value: "title",
                                                description:
                                                    "Set The Title Of The Embed",
                                            },
                                            {
                                                label: "Description",
                                                value: "description",
                                                description:
                                                    "Set The Description Of The Embed",
                                            },
                                            {
                                                label: "Color",
                                                value: "color",
                                                description:
                                                    "Set The Color Of The Embed",
                                            },
                                            {
                                                label: "Thumbnail",
                                                value: "thumbnail",
                                                description:
                                                    "Edit The Thumbnail",
                                            },
                                            {
                                                label: "Image",
                                                value: "image",
                                                description: "Edit The Image",
                                            },
                                            {
                                                label: "Author",
                                                value: "author",
                                                description: "Edit The Author",
                                            },
                                            {
                                                label: "Author Icon",
                                                value: "authoricon",
                                                description:
                                                    "Edit The Author Icon",
                                            },
                                            {
                                                label: "Footer",
                                                value: "footer",
                                                description: "Edit The Footer",
                                            },
                                            {
                                                label: "Footer Icon",
                                                value: "footericon",
                                                description:
                                                    "Edit The Footer Icon",
                                            },
                                        ])
                                ),
                                this.client.util
                                    .row()
                                    .setComponents(
                                        this.client.util
                                            .button()
                                            .setCustomId("save")
                                            .setLabel("Save")
                                            .setEmoji("1001064958450208788")
                                            .setStyle(3),
                                        this.client.util
                                            .button()
                                            .setCustomId("cancel")
                                            .setLabel("Cancel")
                                            .setEmoji("1001064990079471679")
                                            .setStyle(4)
                                    ),
                            ],
                        });
                        const filter = (i) => {
                            i.deferUpdate();
                            return message.member.id == i.user.id;
                        };
                        const selected =
                            await realMsg.createMessageComponentCollector({
                                filter,
                            });
                        if (!selected) {
                            realMsg.message.edit({
                                content: "You Took Too Long To Respond!",
                                embeds: [],
                                components: [],
                            });
                        }
                        selected.on("collect", async (i) => {
                            if (i.componentType == 3) {
                                if (i.values[0] == "content") {
                                    const resultMsg = await realMsg.reply({
                                        content:
                                            "Okay, Now Select An Action To Be Called?",
                                        components: [
                                            this.client.util
                                                .row()
                                                .setComponents(
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "content_edit"
                                                        )
                                                        .setEmoji(
                                                            "1009794861274238976"
                                                        )
                                                        .setLabel("Edit")
                                                        .setStyle(3),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "content_cancel"
                                                        )
                                                        .setEmoji(
                                                            "1009794928953540608"
                                                        )
                                                        .setLabel("Cancel")
                                                        .setStyle(2),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "content_delete"
                                                        )
                                                        .setEmoji(
                                                            "1001046298734121001"
                                                        )
                                                        .setLabel("Delete")
                                                        .setStyle(4)
                                                ),
                                        ],
                                    });
                                    const selectedButton =
                                        await resultMsg.awaitMessageComponent({
                                            filter,
                                            time: 600 * 1000,
                                            componentType: 2,
                                        });
                                    if (!selectedButton) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "content_edit"
                                    ) {
                                        const titleMsg =
                                            await message.channel.send({
                                                content:
                                                    "What Would You Like To Set The Content Message To?",
                                            });
                                        const filterText = (m) => {
                                            return (
                                                message.member.id == m.author.id
                                            );
                                        };
                                        const collector =
                                            await message.channel.createMessageCollector(
                                                {
                                                    filter: filterText,
                                                    max: 3,
                                                    time: 30000,
                                                }
                                            );
                                        collector.on("collect", async (m) => {
                                            if (
                                                m.content.toLowerCase() ===
                                                "cancel"
                                            ) {
                                                titleMsg.delete();
                                                m.delete();
                                                return collector.stop();
                                            }
                                            if (m.content.length > 2048)
                                                return m.reply({
                                                    content:
                                                        "Title Must Be Less Than 2048 Characters!",
                                                    ephemeral: true,
                                                });
                                            data.content = m.content;
                                            m.delete();
                                            titleMsg.delete();
                                            collector.stop();
                                        });
                                        collector.once(
                                            "end",
                                            async (collected, reason) => {
                                                if (reason == "time") {
                                                    titleMsg.delete();
                                                }
                                                const dataOkay =
                                                    await this.client.util.replace(
                                                        data.content,
                                                        message
                                                    );
                                                resultMsg.delete();
                                                realMsg.edit({
                                                    content: dataOkay,
                                                    embeds: [embed],
                                                });
                                            }
                                        );
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "content_cancel"
                                    ) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "content_delete"
                                    ) {
                                        resultMsg.delete();
                                        data.content = " ";
                                        realMsg.edit({
                                            content: " ",
                                            embeds: [embed],
                                        });
                                    }
                                }
                                if (i.values[0] == "title") {
                                    const resultMsg = await realMsg.reply({
                                        content:
                                            "Okay, Now Select An Action To Be Called?",
                                        components: [
                                            this.client.util
                                                .row()
                                                .setComponents(
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "title_edit"
                                                        )
                                                        .setEmoji(
                                                            "1009794861274238976"
                                                        )
                                                        .setLabel("Edit")
                                                        .setStyle(3),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "title_cancel"
                                                        )
                                                        .setEmoji(
                                                            "1009794928953540608"
                                                        )
                                                        .setLabel("Cancel")
                                                        .setStyle(2),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "title_delete"
                                                        )
                                                        .setEmoji(
                                                            "1001046298734121001"
                                                        )
                                                        .setLabel("Delete")
                                                        .setStyle(4)
                                                ),
                                        ],
                                    });
                                    const selectedButton =
                                        await resultMsg.awaitMessageComponent({
                                            filter,
                                            time: 600 * 1000,
                                            componentType: 2,
                                        });
                                    if (!selectedButton) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId == "title_edit"
                                    ) {
                                        let title = " ";
                                        const titleMsg =
                                            await message.channel.send({
                                                content:
                                                    "What Would You Like To Set The Title To?",
                                            });
                                        const filterText = (m) => {
                                            return (
                                                message.member.id == m.author.id
                                            );
                                        };
                                        const collector =
                                            await message.channel.createMessageCollector(
                                                {
                                                    filter: filterText,
                                                    max: 3,
                                                }
                                            );
                                        collector.on("collect", async (m) => {
                                            if (
                                                m.content.toLowerCase() ===
                                                "cancel"
                                            ) {
                                                titleMsg.delete();
                                                m.delete();
                                                return collector.stop();
                                            }
                                            if (m.content.length > 256)
                                                return m.reply({
                                                    content:
                                                        "Title Must Be Less Than 256 Characters!",
                                                    ephemeral: true,
                                                });
                                            title = m.content;
                                            m.delete();
                                            titleMsg.delete();
                                            collector.stop();
                                        });
                                        collector.once(
                                            "end",
                                            async (collected, reason) => {
                                                if (reason == "time") {
                                                    titleMsg.delete();
                                                }
                                                const dataOkay =
                                                    await this.client.util.replaceNoIcon(
                                                        title,
                                                        message
                                                    );
                                                resultMsg.delete();
                                                embedData.title = title;
                                                embed.setTitle(dataOkay);
                                                realMsg.edit({
                                                    embeds: [embed],
                                                });
                                            }
                                        );
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "title_cancel"
                                    ) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "title_delete"
                                    ) {
                                        resultMsg.delete();
                                        embedData.title = " ";
                                        embed.setTitle(" ");
                                        realMsg.edit({
                                            content: " ",
                                            embeds: [embed],
                                        });
                                    }
                                }
                                if (i.values[0] == "description") {
                                    const resultMsg = await realMsg.reply({
                                        content:
                                            "Okay, Now Select An Action To Be Called?",
                                        components: [
                                            this.client.util
                                                .row()
                                                .setComponents(
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "description_edit"
                                                        )
                                                        .setEmoji(
                                                            "1009794861274238976"
                                                        )
                                                        .setLabel("Edit")
                                                        .setStyle(3),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "description_cancel"
                                                        )
                                                        .setEmoji(
                                                            "1009794928953540608"
                                                        )
                                                        .setLabel("Cancel")
                                                        .setStyle(2),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "description_delete"
                                                        )
                                                        .setEmoji(
                                                            "1001046298734121001"
                                                        )
                                                        .setLabel("Delete")
                                                        .setStyle(4)
                                                ),
                                        ],
                                    });
                                    const selectedButton =
                                        await resultMsg.awaitMessageComponent({
                                            filter,
                                            time: 600 * 1000,
                                            componentType: 2,
                                        });
                                    if (!selectedButton) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "description_edit"
                                    ) {
                                        let description = " ";
                                        const titleMsg =
                                            await message.channel.send({
                                                content:
                                                    "What Would You Like To Set The Description To?",
                                            });
                                        const filterText = (m) => {
                                            return (
                                                message.member.id == m.author.id
                                            );
                                        };
                                        const collector =
                                            await message.channel.createMessageCollector(
                                                {
                                                    filter: filterText,
                                                    max: 3,
                                                }
                                            );
                                        collector.on("collect", async (m) => {
                                            if (
                                                m.content.toLowerCase() ===
                                                "cancel"
                                            ) {
                                                titleMsg.delete();
                                                m.delete();
                                                return collector.stop();
                                            }
                                            if (m.content.length > 2040)
                                                return m.reply({
                                                    content:
                                                        "Description Must Be Less Than 2040 Characters!",
                                                    ephemeral: true,
                                                });
                                            description = m.content;
                                            m.delete();
                                            titleMsg.delete();
                                            collector.stop();
                                        });
                                        collector.once(
                                            "end",
                                            async (collected, reason) => {
                                                if (reason == "time") {
                                                    titleMsg.delete();
                                                }
                                                const dataOkay =
                                                    await this.client.util.replace(
                                                        description,
                                                        message
                                                    );
                                                resultMsg.delete();
                                                embedData.description =
                                                    description;
                                                embed.setDescription(dataOkay);
                                                realMsg.edit({
                                                    embeds: [embed],
                                                });
                                            }
                                        );
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "description_cancel"
                                    ) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "description_delete"
                                    ) {
                                        resultMsg.delete();
                                        embedData.description = " ";
                                        embed.setDescription(" ");
                                        realMsg.edit({
                                            content: " ",
                                            embeds: [embed],
                                        });
                                    }
                                }
                                if (i.values[0] == "color") {
                                    const resultMsg = await realMsg.reply({
                                        content:
                                            "Okay, Now Select An Action To Be Called?",
                                        components: [
                                            this.client.util
                                                .row()
                                                .setComponents(
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "color_edit"
                                                        )
                                                        .setEmoji(
                                                            "1009794861274238976"
                                                        )
                                                        .setLabel("Edit")
                                                        .setStyle(3),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "color_cancel"
                                                        )
                                                        .setEmoji(
                                                            "1009794928953540608"
                                                        )
                                                        .setLabel("Cancel")
                                                        .setStyle(2),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "color_delete"
                                                        )
                                                        .setEmoji(
                                                            "1001046298734121001"
                                                        )
                                                        .setLabel("Delete")
                                                        .setStyle(4)
                                                ),
                                        ],
                                    });
                                    const selectedButton =
                                        await resultMsg.awaitMessageComponent({
                                            filter,
                                            time: 600 * 1000,
                                            componentType: 2,
                                        });
                                    if (!selectedButton) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId == "color_edit"
                                    ) {
                                        let description = " ";
                                        const titleMsg =
                                            await message.channel.send({
                                                content:
                                                    "What Would You Like To Set The Color Hex To?",
                                            });
                                        const filterText = (m) => {
                                            return (
                                                message.member.id == m.author.id
                                            );
                                        };
                                        const collector =
                                            await message.channel.createMessageCollector(
                                                {
                                                    filter: filterText,
                                                    max: 3,
                                                }
                                            );
                                        collector.on("collect", async (m) => {
                                            if (
                                                m.content.toLowerCase() ===
                                                "cancel"
                                            ) {
                                                titleMsg.delete();
                                                m.delete();
                                                return collector.stop();
                                            }
                                            if (!m.content.startsWith("#"))
                                                m.content = "#" + m.content;
                                            description = m.content;
                                            m.delete();
                                            titleMsg.delete();
                                            collector.stop();
                                        });
                                        collector.once(
                                            "end",
                                            async (collected, reason) => {
                                                if (reason == "time") {
                                                    titleMsg.delete();
                                                }
                                                resultMsg.delete();
                                                if (description == " ") return;
                                                if (description.length > 7)
                                                    return message.reply({
                                                        content:
                                                            "Color Hex Must Be Less Than 7 Characters!",
                                                        ephemeral: true,
                                                    });
                                                const colornumber = parseInt(
                                                    description.replace(
                                                        "#",
                                                        ""
                                                    ),
                                                    16
                                                );
                                                embedData.color = colornumber;
                                                embed.setColor(description);
                                                realMsg.edit({
                                                    embeds: [embed],
                                                });
                                            }
                                        );
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "color_cancel"
                                    ) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "color_delete"
                                    ) {
                                        resultMsg.delete();
                                        embedData.color = 0x000000;
                                        embed.setColor(0x000000);
                                        realMsg.edit({
                                            content: " ",
                                            embeds: [embed],
                                        });
                                    }
                                }
                                if (i.values[0] == "image") {
                                    const resultMsg = await realMsg.reply({
                                        content:
                                            "Okay, Now Select An Action To Be Called?",
                                        components: [
                                            this.client.util
                                                .row()
                                                .setComponents(
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "image_edit"
                                                        )
                                                        .setEmoji(
                                                            "1009794861274238976"
                                                        )
                                                        .setLabel("Edit")
                                                        .setStyle(3),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "image_cancel"
                                                        )
                                                        .setEmoji(
                                                            "1009794928953540608"
                                                        )
                                                        .setLabel("Cancel")
                                                        .setStyle(2),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "image_delete"
                                                        )
                                                        .setEmoji(
                                                            "1001046298734121001"
                                                        )
                                                        .setLabel("Delete")
                                                        .setStyle(4)
                                                ),
                                        ],
                                    });
                                    const selectedButton =
                                        await resultMsg.awaitMessageComponent({
                                            filter,
                                            time: 600 * 1000,
                                            componentType: 2,
                                        });
                                    if (!selectedButton) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId == "image_edit"
                                    ) {
                                        let description = " ";
                                        const titleMsg =
                                            await message.channel.send({
                                                content:
                                                    "What Would You Like To Set The Image URL To?",
                                            });
                                        const filterText = (m) => {
                                            return (
                                                message.member.id == m.author.id
                                            );
                                        };
                                        const collector =
                                            await message.channel.createMessageCollector(
                                                {
                                                    filter: filterText,
                                                    max: 3,
                                                }
                                            );
                                        collector.on("collect", async (m) => {
                                            if (
                                                m.content.toLowerCase() ===
                                                "cancel"
                                            ) {
                                                titleMsg.delete();
                                                m.delete();
                                                return collector.stop();
                                            }
                                            if (!imgSync.includes(m.content)) {
                                                if (
                                                    !m.content.startsWith(
                                                        "https://"
                                                    ) ||
                                                    !m.content.startsWith(
                                                        "http://"
                                                    )
                                                )
                                                    return m.reply({
                                                        content:
                                                            "Must Be A Variable Or Link!",
                                                        ephemeral: true,
                                                    });
                                            }
                                            description = m.content;
                                            m.delete();
                                            titleMsg.delete();
                                            collector.stop();
                                        });
                                        collector.once(
                                            "end",
                                            async (collected, reason) => {
                                                if (reason == "time") {
                                                    titleMsg.delete();
                                                }
                                                resultMsg.delete();
                                                embedData.image.url =
                                                    description;
                                                description =
                                                    description.replace(
                                                        /\$user_iconurl/g,
                                                        message.member.user.displayAvatarURL(
                                                            { dynamic: true }
                                                        )
                                                    );
                                                description =
                                                    description.replace(
                                                        /\$guild_iconurl/g,
                                                        message.guild.iconURL({
                                                            dynamic: true,
                                                        })
                                                    );
                                                embed.setImage(description);
                                                realMsg.edit({
                                                    embeds: [embed],
                                                });
                                            }
                                        );
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "image_cancel"
                                    ) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "image_delete"
                                    ) {
                                        resultMsg.delete();
                                        embedData.image.url = null;
                                        embed.setImage(null);
                                        realMsg.edit({
                                            content: " ",
                                            embeds: [embed],
                                        });
                                    }
                                }
                                if (i.values[0] == "thumbnail") {
                                    const resultMsg = await realMsg.reply({
                                        content:
                                            "Okay, Now Select An Action To Be Called?",
                                        components: [
                                            this.client.util
                                                .row()
                                                .setComponents(
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "thumbnail_edit"
                                                        )
                                                        .setEmoji(
                                                            "1009794861274238976"
                                                        )
                                                        .setLabel("Edit")
                                                        .setStyle(3),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "thumbnail_cancel"
                                                        )
                                                        .setEmoji(
                                                            "1009794928953540608"
                                                        )
                                                        .setLabel("Cancel")
                                                        .setStyle(2),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "thumbnail_delete"
                                                        )
                                                        .setEmoji(
                                                            "1001046298734121001"
                                                        )
                                                        .setLabel("Delete")
                                                        .setStyle(4)
                                                ),
                                        ],
                                    });
                                    const selectedButton =
                                        await resultMsg.awaitMessageComponent({
                                            filter,
                                            time: 600 * 1000,
                                            componentType: 2,
                                        });
                                    if (!selectedButton) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "thumbnail_edit"
                                    ) {
                                        let description = " ";
                                        const titleMsg =
                                            await message.channel.send({
                                                content:
                                                    "What Would You Like To Set The Thumbnail URL To?",
                                            });
                                        const filterText = (m) => {
                                            return (
                                                message.member.id == m.author.id
                                            );
                                        };
                                        const collector =
                                            await message.channel.createMessageCollector(
                                                {
                                                    filter: filterText,
                                                    max: 3,
                                                }
                                            );
                                        collector.on("collect", async (m) => {
                                            if (
                                                m.content.toLowerCase() ===
                                                "cancel"
                                            ) {
                                                titleMsg.delete();
                                                m.delete();
                                                return collector.stop();
                                            }
                                            if (!imgSync.includes(m.content)) {
                                                if (
                                                    !m.content.startsWith(
                                                        "https://"
                                                    ) ||
                                                    !m.content.startsWith(
                                                        "http://"
                                                    )
                                                )
                                                    return m.reply({
                                                        content:
                                                            "Must Be A Variable Or Link!",
                                                        ephemeral: true,
                                                    });
                                            }
                                            description = m.content;
                                            m.delete();
                                            titleMsg.delete();
                                            collector.stop();
                                        });
                                        collector.once(
                                            "end",
                                            async (collected, reason) => {
                                                if (reason == "time") {
                                                    titleMsg.delete();
                                                }
                                                resultMsg.delete();
                                                embedData.thumbnail.url =
                                                    description;
                                                description =
                                                    description.replace(
                                                        /\$user_iconurl/g,
                                                        message.member.user.displayAvatarURL(
                                                            { dynamic: true }
                                                        )
                                                    );
                                                description =
                                                    description.replace(
                                                        /\$guild_iconurl/g,
                                                        message.guild.iconURL({
                                                            dynamic: true,
                                                        })
                                                    );
                                                embed.setThumbnail(description);
                                                realMsg.edit({
                                                    embeds: [embed],
                                                });
                                            }
                                        );
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "thumbnail_cancel"
                                    ) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "thumbnail_delete"
                                    ) {
                                        resultMsg.delete();
                                        embedData.thumbnail.url = null;
                                        embed.setThumbnail(null);
                                        realMsg.edit({
                                            content: " ",
                                            embeds: [embed],
                                        });
                                    }
                                }
                                if (i.values[0] == "author") {
                                    const resultMsg = await realMsg.reply({
                                        content:
                                            "Okay, Now Select An Action To Be Called?",
                                        components: [
                                            this.client.util
                                                .row()
                                                .setComponents(
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "author_edit"
                                                        )
                                                        .setEmoji(
                                                            "1009794861274238976"
                                                        )
                                                        .setLabel("Edit")
                                                        .setStyle(3),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "author_cancel"
                                                        )
                                                        .setEmoji(
                                                            "1009794928953540608"
                                                        )
                                                        .setLabel("Cancel")
                                                        .setStyle(2),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "author_delete"
                                                        )
                                                        .setEmoji(
                                                            "1001046298734121001"
                                                        )
                                                        .setLabel("Delete")
                                                        .setStyle(4)
                                                ),
                                        ],
                                    });
                                    const selectedButton =
                                        await resultMsg.awaitMessageComponent({
                                            filter,
                                            time: 600 * 1000,
                                            componentType: 2,
                                        });
                                    if (!selectedButton) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId == "author_edit"
                                    ) {
                                        let description = " ";
                                        const titleMsg =
                                            await message.channel.send({
                                                content:
                                                    "What Would You Like To Set The Author Text To?",
                                            });
                                        const filterText = (m) => {
                                            return (
                                                message.member.id == m.author.id
                                            );
                                        };
                                        const collector =
                                            await message.channel.createMessageCollector(
                                                {
                                                    filter: filterText,
                                                    max: 3,
                                                }
                                            );
                                        collector.on("collect", async (m) => {
                                            if (
                                                m.content.toLowerCase() ===
                                                "cancel"
                                            ) {
                                                titleMsg.delete();
                                                m.delete();
                                                return collector.stop();
                                            }
                                            description = m.content;
                                            m.delete();
                                            titleMsg.delete();
                                            collector.stop();
                                        });
                                        collector.once(
                                            "end",
                                            async (collected, reason) => {
                                                if (reason == "time") {
                                                    titleMsg.delete();
                                                }
                                                embedData.author.name =
                                                    description;
                                                const dataOkay =
                                                    await this.client.util.replaceNoIcon(
                                                        description,
                                                        message
                                                    );
                                                resultMsg.delete();
                                                embed.setAuthor({
                                                    name: dataOkay,
                                                    iconURL: realMsg.embeds[0]
                                                        .author
                                                        ? realMsg.embeds[0]
                                                              .author.icon_url
                                                        : null,
                                                });
                                                realMsg.edit({
                                                    embeds: [embed],
                                                });
                                            }
                                        );
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "author_cancel"
                                    ) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "author_delete"
                                    ) {
                                        resultMsg.delete();
                                        embedData.author.name = null;
                                        embed.setAuthor({
                                            name: null,
                                            iconURL: realMsg.embeds[0].author
                                                ? realMsg.embeds[0].author
                                                      ?.icon_url
                                                : null,
                                        });
                                        realMsg.edit({
                                            content: " ",
                                            embeds: [embed],
                                        });
                                    }
                                }
                                if (i.values[0] == "authoricon") {
                                    const resultMsg = await realMsg.reply({
                                        content:
                                            "Okay, Now Select An Action To Be Called?",
                                        components: [
                                            this.client.util
                                                .row()
                                                .setComponents(
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "authoricon_edit"
                                                        )
                                                        .setEmoji(
                                                            "1009794861274238976"
                                                        )
                                                        .setLabel("Edit")
                                                        .setStyle(3),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "authoricon_cancel"
                                                        )
                                                        .setEmoji(
                                                            "1009794928953540608"
                                                        )
                                                        .setLabel("Cancel")
                                                        .setStyle(2),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "authoricon_delete"
                                                        )
                                                        .setEmoji(
                                                            "1001046298734121001"
                                                        )
                                                        .setLabel("Delete")
                                                        .setStyle(4)
                                                ),
                                        ],
                                    });
                                    const selectedButton =
                                        await resultMsg.awaitMessageComponent({
                                            filter,
                                            time: 600 * 1000,
                                            componentType: 2,
                                        });
                                    if (!selectedButton) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "authoricon_edit"
                                    ) {
                                        let description = " ";
                                        const titleMsg =
                                            await message.channel.send({
                                                content:
                                                    "What Would You Like To Set The Author Icon To?",
                                            });
                                        const filterText = (m) => {
                                            return (
                                                message.member.id == m.author.id
                                            );
                                        };
                                        const collector =
                                            await message.channel.createMessageCollector(
                                                {
                                                    filter: filterText,
                                                    max: 3,
                                                }
                                            );
                                        collector.on("collect", async (m) => {
                                            if (
                                                m.content.toLowerCase() ===
                                                "cancel"
                                            ) {
                                                titleMsg.delete();
                                                m.delete();
                                                return collector.stop();
                                            }
                                            if (!imgSync.includes(m.content)) {
                                                if (
                                                    !m.content.startsWith(
                                                        "https://"
                                                    ) ||
                                                    !m.content.startsWith(
                                                        "http://"
                                                    )
                                                )
                                                    return m.reply({
                                                        content:
                                                            "Must Be A Variable Or Link!",
                                                        ephemeral: true,
                                                    });
                                            }
                                            description = m.content;
                                            m.delete();
                                            titleMsg.delete();
                                            collector.stop();
                                        });
                                        collector.once(
                                            "end",
                                            async (collected, reason) => {
                                                if (reason == "time") {
                                                    titleMsg.delete();
                                                }
                                                resultMsg.delete();
                                                embedData.author.icon_url =
                                                    description;
                                                description =
                                                    description.replace(
                                                        /\$user_iconurl/g,
                                                        message.member.user.displayAvatarURL(
                                                            { dynamic: true }
                                                        )
                                                    );
                                                description =
                                                    description.replace(
                                                        /\$guild_iconurl/g,
                                                        message.guild.iconURL({
                                                            dynamic: true,
                                                        })
                                                    );
                                                embed.setAuthor({
                                                    name: realMsg.embeds[0]
                                                        .author
                                                        ? realMsg.embeds[0]
                                                              .author?.name
                                                        : null,
                                                    iconURL: description,
                                                });
                                                realMsg.edit({
                                                    embeds: [embed],
                                                });
                                            }
                                        );
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "authoricon_cancel"
                                    ) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "authoricon_delete"
                                    ) {
                                        resultMsg.delete();
                                        embedData.author.icon_url = null;
                                        embed.setAuthor({
                                            name: realMsg.embeds[0].author
                                                ? realMsg.embeds[0].author?.name
                                                : null,
                                            iconURL: null,
                                        });
                                        realMsg.edit({
                                            content: " ",
                                            embeds: [embed],
                                        });
                                    }
                                }
                                if (i.values[0] == "footer") {
                                    const resultMsg = await realMsg.reply({
                                        content:
                                            "Okay, Now Select An Action To Be Called?",
                                        components: [
                                            this.client.util
                                                .row()
                                                .setComponents(
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "footer_edit"
                                                        )
                                                        .setEmoji(
                                                            "1009794861274238976"
                                                        )
                                                        .setLabel("Edit")
                                                        .setStyle(3),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "footer_cancel"
                                                        )
                                                        .setEmoji(
                                                            "1009794928953540608"
                                                        )
                                                        .setLabel("Cancel")
                                                        .setStyle(2),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "footer_delete"
                                                        )
                                                        .setEmoji(
                                                            "1001046298734121001"
                                                        )
                                                        .setLabel("Delete")
                                                        .setStyle(4)
                                                ),
                                        ],
                                    });
                                    const selectedButton =
                                        await resultMsg.awaitMessageComponent({
                                            filter,
                                            time: 600 * 1000,
                                            componentType: 2,
                                        });
                                    if (!selectedButton) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId == "footer_edit"
                                    ) {
                                        let description = " ";
                                        const titleMsg =
                                            await message.channel.send({
                                                content:
                                                    "What Would You Like To Set The Footer Text To?",
                                            });
                                        const filterText = (m) => {
                                            return (
                                                message.member.id == m.author.id
                                            );
                                        };
                                        const collector =
                                            await message.channel.createMessageCollector(
                                                {
                                                    filter: filterText,
                                                    max: 3,
                                                }
                                            );
                                        collector.on("collect", async (m) => {
                                            if (
                                                m.content.toLowerCase() ===
                                                "cancel"
                                            ) {
                                                titleMsg.delete();
                                                m.delete();
                                                return collector.stop();
                                            }
                                            description = m.content;
                                            m.delete();
                                            titleMsg.delete();
                                            collector.stop();
                                        });
                                        collector.once(
                                            "end",
                                            async (collected, reason) => {
                                                if (reason == "time") {
                                                    titleMsg.delete();
                                                }
                                                embedData.footer.text =
                                                    description;
                                                const dataOkay =
                                                    await this.client.util.replaceNoIcon(
                                                        description,
                                                        message
                                                    );
                                                resultMsg.delete();
                                                embed.setFooter({
                                                    text: dataOkay,
                                                    iconURL: realMsg.embeds[0]
                                                        .footer
                                                        ? realMsg.embeds[0]
                                                              .footer?.icon_url
                                                        : null,
                                                });
                                                realMsg.edit({
                                                    embeds: [embed],
                                                });
                                            }
                                        );
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "footer_cancel"
                                    ) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "footer_delete"
                                    ) {
                                        resultMsg.delete();
                                        embedData.footer.text = null;
                                        embed.setFooter({
                                            text: null,
                                            iconURL: realMsg.embeds[0].footer
                                                ? realMsg.embeds[0].footer
                                                      ?.icon_url
                                                : null,
                                        });
                                        realMsg.edit({
                                            content: " ",
                                            embeds: [embed],
                                        });
                                    }
                                }
                                if (i.values[0] == "footericon") {
                                    const resultMsg = await realMsg.reply({
                                        content:
                                            "Okay, Now Select An Action To Be Called?",
                                        components: [
                                            this.client.util
                                                .row()
                                                .setComponents(
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "footericon_edit"
                                                        )
                                                        .setEmoji(
                                                            "1009794861274238976"
                                                        )
                                                        .setLabel("Edit")
                                                        .setStyle(3),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "footericon_cancel"
                                                        )
                                                        .setEmoji(
                                                            "1009794928953540608"
                                                        )
                                                        .setLabel("Cancel")
                                                        .setStyle(2),
                                                    this.client.util
                                                        .button()
                                                        .setCustomId(
                                                            "footericon_delete"
                                                        )
                                                        .setEmoji(
                                                            "1001046298734121001"
                                                        )
                                                        .setLabel("Delete")
                                                        .setStyle(4)
                                                ),
                                        ],
                                    });
                                    const selectedButton =
                                        await resultMsg.awaitMessageComponent({
                                            filter,
                                            time: 600 * 1000,
                                            componentType: 2,
                                        });
                                    if (!selectedButton) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "footericon_edit"
                                    ) {
                                        let description = " ";
                                        const titleMsg =
                                            await message.channel.send({
                                                content:
                                                    "What Would You Like To Set The Footer Icon To?",
                                            });
                                        const filterText = (m) => {
                                            return (
                                                message.member.id == m.author.id
                                            );
                                        };
                                        const collector =
                                            await message.channel.createMessageCollector(
                                                {
                                                    filter: filterText,
                                                    max: 3,
                                                }
                                            );
                                        collector.on("collect", async (m) => {
                                            if (
                                                m.content.toLowerCase() ===
                                                "cancel"
                                            ) {
                                                titleMsg.delete();
                                                m.delete();
                                                return collector.stop();
                                            }
                                            if (!imgSync.includes(m.content)) {
                                                if (
                                                    !m.content.startsWith(
                                                        "https://"
                                                    ) ||
                                                    !m.content.startsWith(
                                                        "http://"
                                                    )
                                                )
                                                    return m.reply({
                                                        content:
                                                            "Must Be A Variable Or Link!",
                                                        ephemeral: true,
                                                    });
                                            }
                                            description = m.content;
                                            m.delete();
                                            titleMsg.delete();
                                            collector.stop();
                                        });
                                        collector.once(
                                            "end",
                                            async (collected, reason) => {
                                                if (reason == "time") {
                                                    titleMsg.delete();
                                                }
                                                resultMsg.delete();
                                                embedData.footer.icon_url =
                                                    description;
                                                description =
                                                    description.replace(
                                                        /\$user_iconurl/g,
                                                        message.member.user.displayAvatarURL(
                                                            { dynamic: true }
                                                        )
                                                    );
                                                description =
                                                    description.replace(
                                                        /\$guild_iconurl/g,
                                                        message.guild.iconURL({
                                                            dynamic: true,
                                                        })
                                                    );
                                                embed.setFooter({
                                                    text: realMsg.embeds[0]
                                                        .footer
                                                        ? realMsg.embeds[0]
                                                              .footer?.text
                                                        : null,
                                                    iconURL: description,
                                                });
                                                realMsg.edit({
                                                    embeds: [embed],
                                                });
                                            }
                                        );
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "footericon_cancel"
                                    ) {
                                        resultMsg.delete();
                                    }
                                    if (
                                        selectedButton.customId ==
                                        "footericon_delete"
                                    ) {
                                        resultMsg.delete();
                                        embedData.footer.icon_url = null;
                                        embed.setFooter({
                                            text: realMsg.embeds[0].footer
                                                ? realMsg.embeds[0].footer?.text
                                                : null,
                                            iconURL: null,
                                        });
                                        realMsg.edit({
                                            content: " ",
                                            embeds: [embed],
                                        });
                                    }
                                }
                            }
                            if (i.componentType == 2) {
                                if (i.customId == "cancel") {
                                    selected.stop();
                                    realMsg.delete();
                                }
                                if (i.customId == "save") {
                                    selected.stop();
                                    realMsg.edit({
                                        content:
                                            "Successfully Saved The Embed!",
                                        embeds: [embed],
                                        components: [],
                                    });
                                    await this.client.database.welcomeUserData.post(
                                        message.member.user.id,
                                        {
                                            name: data.name,
                                            content: data.content,
                                            embeds: embedData,
                                        }
                                    );
                                }
                            }
                        });
                    });
                }
                if (args[0].toLowerCase() === "show") {
                    const data = await this.client.database.welcomeUserData.get(
                        message.member.user.id
                    );
                    let max = data.message.length;
                    let okie = data.message.slice(0, max);
                    let resultMessage = await message.reply({
                        content: `Select An Preset To Show`,
                        components: [
                            this.client.util.row().setComponents(
                                this.client.util
                                    .menu()
                                    .setCustomId("show")
                                    .setPlaceholder("Select An Preset To Show")
                                    .setOptions([
                                        ...okie.map((x, i) => ({
                                            label: x.name,
                                            value: x.id,
                                        })),
                                    ])
                            ),
                        ],
                        fetchReply: true,
                    });
                    const selected =
                        await message.client.util.awaitSelectionMenu(
                            resultMessage,
                            (message) => message.member.id == message.user.id
                        );
                    if (!selected) {
                        return await resultMessage
                            .edit({
                                content: "Oops! Looks Like Time Is Up",
                                components: [],
                            })
                            .catch((e) => {
                                return;
                            });
                    }
                    await selected?.deferUpdate().catch((e) => {
                        return;
                    });
                    const embedValue = data.message?.filter(
                        (g) => g.id == selected.values[0]
                    )[0];
                    selected.message.delete().catch((e) => {
                        return;
                    });
                    await message.reply({
                        content: `Here Is The Embed Preview For ${
                            "`" + embedValue.name + "`"
                        } Preset ${this.client.config.Client.Emoji.Down}`,
                    });
                    embedValue.embeds.color = embedValue.embeds.color
                        ? Number(embedValue.embeds.color)
                        : 0;
                    if (embedValue.content != " ")
                        embedValue.content = await this.client.util.replace(
                            embedValue.content,
                            message
                        );
                    const dataEmbed = await this.client.util.replacerString(
                        embedValue.embeds,
                        message
                    );
                    await message.channel.send({
                        content: embedValue.content,
                        embeds: [new EmbedBuilder(dataEmbed)],
                    });
                }
                if (args[0].toLowerCase() === "delete") {
                    const data = await this.client.database.welcomeUserData.get(
                        message.member.user.id
                    );
                    let max = data.message.length;
                    let okie = data.message.slice(0, max);
                    let resultMessage = await message.reply({
                        content: `Select An Preset To Delete`,
                        components: [
                            this.client.util.row().setComponents(
                                this.client.util
                                    .menu()
                                    .setCustomId("delete")
                                    .setPlaceholder(
                                        "Select An Preset To Delete"
                                    )
                                    .setOptions([
                                        ...okie.map((x, i) => ({
                                            label: x.name,
                                            value: x.id,
                                        })),
                                    ])
                            ),
                        ],
                        fetchReply: true,
                    });
                    const selected =
                        await message.client.util.awaitSelectionMenu(
                            resultMessage,
                            (message) => message.member.id == message.user.id
                        );
                    if (!selected) {
                        return await resultMessage
                            .edit({
                                content: "Oops! Looks Like Time Is Up",
                                components: [],
                            })
                            .catch((e) => {
                                return;
                            });
                    }
                    const embedValue = data.message?.filter(
                        (g) => g.id == selected.values[0]
                    )[0];
                    selected.message.delete().catch((e) => {
                        return;
                    });
                    const okayMsg = await selected.reply({
                        content: `Are You Sure Want To Delete The Preset **${embedValue.name}**?`,
                        components: [
                            this.client.util
                                .row()
                                .setComponents(
                                    this.client.util
                                        .button()
                                        .setStyle(3)
                                        .setLabel("Yes")
                                        .setCustomId("yes"),
                                    this.client.util
                                        .button()
                                        .setStyle(4)
                                        .setLabel("No")
                                        .setCustomId("no")
                                ),
                        ],
                        fetchReply: true,
                        ephemeral: true,
                    });
                    const selected2 =
                        await this.client.util.awaitSelectionButton(
                            okayMsg,
                            (message) => message.member.id == message.user.id
                        );
                    if (!selected2) {
                        return await selected
                            .editReply({
                                content: "Oops! Looks Like Time Is Up",
                                components: [],
                            })
                            .catch((e) => {
                                return;
                            });
                    }
                    if (selected2.customId == "yes") {
                        await this.client.database.welcomeUserData.delete(
                            message.member.user.id,
                            embedValue.id
                        );
                        await selected.editReply({
                            content: `Successfully Deleted The Preset **${embedValue.name}**`,
                            components: [],
                            ephemeral: true,
                        });
                        message.delete().catch((e) => {
                            return;
                        });
                    }
                    if (selected2.customId == "no") {
                        await selected.editReply({
                            content: `Successfully Cancelled The Delete Process`,
                            components: [],
                            ephemeral: true,
                        });
                        message.delete().catch((e) => {
                            return;
                        });
                    }
                }
                if (args[0].toLowerCase() === "edit") {
                    let dataToSave = {
                        name: "",
                        content: " ",
                    };
                    let embedData = {};
                    embedData.title = "title";
                    embedData.description = "description";
                    embedData.color = 3092790;
                    embedData.image = {};
                    embedData.image.url = undefined;
                    embedData.thumbnail = {};
                    embedData.thumbnail.url = undefined;
                    embedData.author = {};
                    embedData.author.name = undefined;
                    embedData.author.icon_url = undefined;
                    embedData.footer = {};
                    embedData.footer.text = undefined;
                    embedData.footer.icon_url = undefined;
                    const data = await this.client.database.welcomeUserData.get(
                        message.member.user.id
                    );
                    let max = data.message.length;
                    let okie = data.message.slice(0, max);
                    let resultMessage = await message.reply({
                        content: `Select An Preset To Edit`,
                        components: [
                            this.client.util.row().setComponents(
                                this.client.util
                                    .menu()
                                    .setCustomId("edit")
                                    .setPlaceholder("Select An Preset To Edit")
                                    .setOptions([
                                        ...okie.map((x, i) => ({
                                            label: x.name,
                                            value: x.id,
                                        })),
                                    ])
                            ),
                        ],
                        fetchReply: true,
                    });
                    const selected =
                        await message.client.util.awaitSelectionMenu(
                            resultMessage,
                            (message) => message.member.id == message.user.id
                        );
                    if (!selected) {
                        return await resultMessage
                            .edit({
                                content: "Oops! Looks Like Time Is Up",
                                components: [],
                            })
                            .catch((e) => {
                                return;
                            });
                    }
                    selected.deferUpdate().catch((e) => {
                        return;
                    });
                    selected.message.delete().catch((e) => {
                        return;
                    });
                    const embedValue = data.message?.filter(
                        (g) => g.id == selected.values[0]
                    )[0];
                    embedValue.embeds.color = embedValue.embeds.color
                        ? Number(embedValue.embeds.color)
                        : 0;
                    if (embedValue.content != " ")
                        embedValue.content = await this.client.util.replace(
                            embedValue.content,
                            message
                        );
                    const dataEmbed = await this.client.util.replacerString(
                        embedValue.embeds,
                        message
                    );
                    const embed = new EmbedBuilder(dataEmbed);
                    const realMsg = await message.reply({
                        content: embedValue.content,
                        embeds: [embed],
                        components: [
                            this.client.util.row().setComponents(
                                this.client.util
                                    .menu()
                                    .setPlaceholder("Start Editing The Embed!")
                                    .setCustomId("embed")
                                    .setOptions([
                                        {
                                            label: "Content",
                                            value: "content",
                                            description:
                                                "Edit The Content Of The Message",
                                        },
                                        {
                                            label: "Title",
                                            value: "title",
                                            description:
                                                "Set The Title Of The Embed",
                                        },
                                        {
                                            label: "Description",
                                            value: "description",
                                            description:
                                                "Set The Description Of The Embed",
                                        },
                                        {
                                            label: "Color",
                                            value: "color",
                                            description:
                                                "Set The Color Of The Embed",
                                        },
                                        {
                                            label: "Thumbnail",
                                            value: "thumbnail",
                                            description: "Edit The Thumbnail",
                                        },
                                        {
                                            label: "Image",
                                            value: "image",
                                            description: "Edit The Image",
                                        },
                                        {
                                            label: "Author",
                                            value: "author",
                                            description: "Edit The Author",
                                        },
                                        {
                                            label: "Author Icon",
                                            value: "authoricon",
                                            description: "Edit The Author Icon",
                                        },
                                        {
                                            label: "Footer",
                                            value: "footer",
                                            description: "Edit The Footer",
                                        },
                                        {
                                            label: "Footer Icon",
                                            value: "footericon",
                                            description: "Edit The Footer Icon",
                                        },
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
                    dataToSave.name = embedValue.name;
                    const filter = (i) => {
                        i.deferUpdate();
                        return message.member.id == i.user.id;
                    };
                    const selectedMenu =
                        await realMsg.createMessageComponentCollector({
                            filter,
                        });
                    if (!selectedMenu) {
                        realMsg.message.edit({
                            content: "You Took Too Long To Respond!",
                            embeds: [],
                            components: [],
                        });
                    }
                    selectedMenu.on("collect", async (i) => {
                        if (i.componentType == 3) {
                            if (i.values[0] == "content") {
                                const resultMsg = await realMsg.reply({
                                    content:
                                        "Okay, Now Select An Action To Be Called?",
                                    components: [
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId("content_edit")
                                                    .setEmoji(
                                                        "1009794861274238976"
                                                    )
                                                    .setLabel("Edit")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "content_cancel"
                                                    )
                                                    .setEmoji(
                                                        "1009794928953540608"
                                                    )
                                                    .setLabel("Cancel")
                                                    .setStyle(2),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "content_delete"
                                                    )
                                                    .setEmoji(
                                                        "1001046298734121001"
                                                    )
                                                    .setLabel("Delete")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const selectedButton =
                                    await resultMsg.awaitMessageComponent({
                                        filter,
                                        time: 600 * 1000,
                                        componentType: 2,
                                    });
                                if (!selectedButton) {
                                    resultMsg.delete();
                                }
                                if (selectedButton.customId == "content_edit") {
                                    const titleMsg = await message.channel.send(
                                        {
                                            content:
                                                "What Would You Like To Set The Content Message To?",
                                        }
                                    );
                                    const filterText = (m) => {
                                        return message.member.id == m.author.id;
                                    };
                                    const collector =
                                        await message.channel.createMessageCollector(
                                            {
                                                filter: filterText,
                                                max: 3,
                                            }
                                        );
                                    collector.on("collect", async (m) => {
                                        if (
                                            m.content.toLowerCase() === "cancel"
                                        ) {
                                            titleMsg.delete();
                                            m.delete();
                                            return collector.stop();
                                        }
                                        if (m.content.length > 2048)
                                            return m.reply({
                                                content:
                                                    "Title Must Be Less Than 2048 Characters!",
                                                ephemeral: true,
                                            });
                                        dataToSave.content = m.content;
                                        m.delete();
                                        titleMsg.delete();
                                        collector.stop();
                                    });
                                    collector.once(
                                        "end",
                                        async (collected, reason) => {
                                            if (reason == "time") {
                                                titleMsg.delete();
                                            }
                                            const dataOkay =
                                                await this.client.util.replace(
                                                    dataToSave.content,
                                                    message
                                                );
                                            resultMsg.delete();
                                            realMsg.edit({
                                                content: dataOkay,
                                                embeds: [embed],
                                            });
                                        }
                                    );
                                }
                                if (
                                    selectedButton.customId == "content_cancel"
                                ) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId == "content_delete"
                                ) {
                                    resultMsg.delete();
                                    data.content = " ";
                                    realMsg.edit({
                                        content: " ",
                                        embeds: [embed],
                                    });
                                }
                            }
                            if (i.values[0] == "title") {
                                const resultMsg = await realMsg.reply({
                                    content:
                                        "Okay, Now Select An Action To Be Called?",
                                    components: [
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId("title_edit")
                                                    .setEmoji(
                                                        "1009794861274238976"
                                                    )
                                                    .setLabel("Edit")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId("title_cancel")
                                                    .setEmoji(
                                                        "1009794928953540608"
                                                    )
                                                    .setLabel("Cancel")
                                                    .setStyle(2),
                                                this.client.util
                                                    .button()
                                                    .setCustomId("title_delete")
                                                    .setEmoji(
                                                        "1001046298734121001"
                                                    )
                                                    .setLabel("Delete")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const selectedButton =
                                    await resultMsg.awaitMessageComponent({
                                        filter,
                                        time: 600 * 1000,
                                        componentType: 2,
                                    });
                                if (!selectedButton) {
                                    resultMsg.delete();
                                }
                                if (selectedButton.customId == "title_edit") {
                                    let title = " ";
                                    const titleMsg = await message.channel.send(
                                        {
                                            content:
                                                "What Would You Like To Set The Title To?",
                                        }
                                    );
                                    const filterText = (m) => {
                                        return message.member.id == m.author.id;
                                    };
                                    const collector =
                                        await message.channel.createMessageCollector(
                                            {
                                                filter: filterText,
                                                max: 3,
                                            }
                                        );
                                    collector.on("collect", async (m) => {
                                        if (
                                            m.content.toLowerCase() === "cancel"
                                        ) {
                                            titleMsg.delete();
                                            m.delete();
                                            return collector.stop();
                                        }
                                        if (m.content.length > 256)
                                            return m.reply({
                                                content:
                                                    "Title Must Be Less Than 256 Characters!",
                                                ephemeral: true,
                                            });
                                        title = m.content;
                                        m.delete();
                                        titleMsg.delete();
                                        collector.stop();
                                    });
                                    collector.once(
                                        "end",
                                        async (collected, reason) => {
                                            if (reason == "time") {
                                                titleMsg.delete();
                                            }
                                            const dataOkay =
                                                await this.client.util.replaceNoIcon(
                                                    title,
                                                    message
                                                );
                                            resultMsg.delete();
                                            embedData.title = title;
                                            embed.setTitle(dataOkay);
                                            realMsg.edit({
                                                embeds: [embed],
                                            });
                                        }
                                    );
                                }
                                if (selectedButton.customId == "title_cancel") {
                                    resultMsg.delete();
                                }
                                if (selectedButton.customId == "title_delete") {
                                    resultMsg.delete();
                                    embedData.title = " ";
                                    embed.setTitle(" ");
                                    realMsg.edit({
                                        content: " ",
                                        embeds: [embed],
                                    });
                                }
                            }
                            if (i.values[0] == "description") {
                                const resultMsg = await realMsg.reply({
                                    content:
                                        "Okay, Now Select An Action To Be Called?",
                                    components: [
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "description_edit"
                                                    )
                                                    .setEmoji(
                                                        "1009794861274238976"
                                                    )
                                                    .setLabel("Edit")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "description_cancel"
                                                    )
                                                    .setEmoji(
                                                        "1009794928953540608"
                                                    )
                                                    .setLabel("Cancel")
                                                    .setStyle(2),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "description_delete"
                                                    )
                                                    .setEmoji(
                                                        "1001046298734121001"
                                                    )
                                                    .setLabel("Delete")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const selectedButton =
                                    await resultMsg.awaitMessageComponent({
                                        filter,
                                        time: 600 * 1000,
                                        componentType: 2,
                                    });
                                if (!selectedButton) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId ==
                                    "description_edit"
                                ) {
                                    let description = " ";
                                    const titleMsg = await message.channel.send(
                                        {
                                            content:
                                                "What Would You Like To Set The Description To?",
                                        }
                                    );
                                    const filterText = (m) => {
                                        return message.member.id == m.author.id;
                                    };
                                    const collector =
                                        await message.channel.createMessageCollector(
                                            {
                                                filter: filterText,
                                                max: 3,
                                            }
                                        );
                                    collector.on("collect", async (m) => {
                                        if (
                                            m.content.toLowerCase() === "cancel"
                                        ) {
                                            titleMsg.delete();
                                            m.delete();
                                            return collector.stop();
                                        }
                                        if (m.content.length > 2040)
                                            return m.reply({
                                                content:
                                                    "Description Must Be Less Than 2040 Characters!",
                                                ephemeral: true,
                                            });
                                        description = m.content;
                                        m.delete();
                                        titleMsg.delete();
                                        collector.stop();
                                    });
                                    collector.once(
                                        "end",
                                        async (collected, reason) => {
                                            if (reason == "time") {
                                                titleMsg.delete();
                                            }
                                            const dataOkay =
                                                await this.client.util.replace(
                                                    description,
                                                    message
                                                );
                                            resultMsg.delete();
                                            embedData.description = description;
                                            embed.setDescription(dataOkay);
                                            realMsg.edit({
                                                embeds: [embed],
                                            });
                                        }
                                    );
                                }
                                if (
                                    selectedButton.customId ==
                                    "description_cancel"
                                ) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId ==
                                    "description_delete"
                                ) {
                                    resultMsg.delete();
                                    embedData.description = " ";
                                    embed.setDescription(" ");
                                    realMsg.edit({
                                        content: " ",
                                        embeds: [embed],
                                    });
                                }
                            }
                            if (i.values[0] == "color") {
                                const resultMsg = await realMsg.reply({
                                    content:
                                        "Okay, Now Select An Action To Be Called?",
                                    components: [
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId("color_edit")
                                                    .setEmoji(
                                                        "1009794861274238976"
                                                    )
                                                    .setLabel("Edit")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId("color_cancel")
                                                    .setEmoji(
                                                        "1009794928953540608"
                                                    )
                                                    .setLabel("Cancel")
                                                    .setStyle(2),
                                                this.client.util
                                                    .button()
                                                    .setCustomId("color_delete")
                                                    .setEmoji(
                                                        "1001046298734121001"
                                                    )
                                                    .setLabel("Delete")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const selectedButton =
                                    await resultMsg.awaitMessageComponent({
                                        filter,
                                        time: 600 * 1000,
                                        componentType: 2,
                                    });
                                if (!selectedButton) {
                                    resultMsg.delete();
                                }
                                if (selectedButton.customId == "color_edit") {
                                    let description = " ";
                                    const titleMsg = await message.channel.send(
                                        {
                                            content:
                                                "What Would You Like To Set The Color Hex To?",
                                        }
                                    );
                                    const filterText = (m) => {
                                        return message.member.id == m.author.id;
                                    };
                                    const collector =
                                        await message.channel.createMessageCollector(
                                            {
                                                filter: filterText,
                                                max: 3,
                                            }
                                        );
                                    collector.on("collect", async (m) => {
                                        if (
                                            m.content.toLowerCase() === "cancel"
                                        ) {
                                            titleMsg.delete();
                                            m.delete();
                                            return collector.stop();
                                        }
                                        if (!m.content.startsWith("#"))
                                            m.content = "#" + m.content;
                                        description = m.content;
                                        m.delete();
                                        titleMsg.delete();
                                        collector.stop();
                                    });
                                    collector.once(
                                        "end",
                                        async (collected, reason) => {
                                            if (reason == "time") {
                                                titleMsg.delete();
                                            }
                                            resultMsg.delete();
                                            if (description == " ") return;
                                            if (description.length > 7)
                                                return message.reply({
                                                    content:
                                                        "Color Hex Must Be Less Than 7 Characters!",
                                                    ephemeral: true,
                                                });
                                            const colornumber = parseInt(
                                                description.replace("#", ""),
                                                16
                                            );
                                            embedData.color = colornumber;
                                            embed.setColor(description);
                                            realMsg.edit({
                                                embeds: [embed],
                                            });
                                        }
                                    );
                                }
                                if (selectedButton.customId == "color_cancel") {
                                    resultMsg.delete();
                                }
                                if (selectedButton.customId == "color_delete") {
                                    resultMsg.delete();
                                    embedData.color = 0x000000;
                                    embed.setColor(0x000000);
                                    realMsg.edit({
                                        content: " ",
                                        embeds: [embed],
                                    });
                                }
                            }
                            if (i.values[0] == "image") {
                                const resultMsg = await realMsg.reply({
                                    content:
                                        "Okay, Now Select An Action To Be Called?",
                                    components: [
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId("image_edit")
                                                    .setEmoji(
                                                        "1009794861274238976"
                                                    )
                                                    .setLabel("Edit")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId("image_cancel")
                                                    .setEmoji(
                                                        "1009794928953540608"
                                                    )
                                                    .setLabel("Cancel")
                                                    .setStyle(2),
                                                this.client.util
                                                    .button()
                                                    .setCustomId("image_delete")
                                                    .setEmoji(
                                                        "1001046298734121001"
                                                    )
                                                    .setLabel("Delete")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const selectedButton =
                                    await resultMsg.awaitMessageComponent({
                                        filter,
                                        time: 600 * 1000,
                                        componentType: 2,
                                    });
                                if (!selectedButton) {
                                    resultMsg.delete();
                                }
                                if (selectedButton.customId == "image_edit") {
                                    let description = " ";
                                    const titleMsg = await message.channel.send(
                                        {
                                            content:
                                                "What Would You Like To Set The Image URL To?",
                                        }
                                    );
                                    const filterText = (m) => {
                                        return message.member.id == m.author.id;
                                    };
                                    const collector =
                                        await message.channel.createMessageCollector(
                                            {
                                                filter: filterText,
                                                max: 3,
                                            }
                                        );
                                    collector.on("collect", async (m) => {
                                        if (
                                            m.content.toLowerCase() === "cancel"
                                        ) {
                                            titleMsg.delete();
                                            m.delete();
                                            return collector.stop();
                                        }
                                        if (!imgSync.includes(m.content)) {
                                            if (
                                                !m.content.startsWith(
                                                    "https://"
                                                ) ||
                                                !m.content.startsWith("http://")
                                            )
                                                return m.reply({
                                                    content:
                                                        "Must Be A Variable Or Link!",
                                                    ephemeral: true,
                                                });
                                        }
                                        description = m.content;
                                        m.delete();
                                        titleMsg.delete();
                                        collector.stop();
                                    });
                                    collector.once(
                                        "end",
                                        async (collected, reason) => {
                                            if (reason == "time") {
                                                titleMsg.delete();
                                            }
                                            resultMsg.delete();
                                            embedData.image.url = description;
                                            description = description.replace(
                                                /\$user_iconurl/g,
                                                message.member.user.displayAvatarURL(
                                                    { dynamic: true }
                                                )
                                            );
                                            description = description.replace(
                                                /\$guild_iconurl/g,
                                                message.guild.iconURL({
                                                    dynamic: true,
                                                })
                                            );
                                            embed.setImage(description);
                                            realMsg.edit({
                                                embeds: [embed],
                                            });
                                        }
                                    );
                                }
                                if (selectedButton.customId == "image_cancel") {
                                    resultMsg.delete();
                                }
                                if (selectedButton.customId == "image_delete") {
                                    resultMsg.delete();
                                    embedData.image.url = null;
                                    embed.setImage(null);
                                    realMsg.edit({
                                        content: " ",
                                        embeds: [embed],
                                    });
                                }
                            }
                            if (i.values[0] == "thumbnail") {
                                const resultMsg = await realMsg.reply({
                                    content:
                                        "Okay, Now Select An Action To Be Called?",
                                    components: [
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "thumbnail_edit"
                                                    )
                                                    .setEmoji(
                                                        "1009794861274238976"
                                                    )
                                                    .setLabel("Edit")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "thumbnail_cancel"
                                                    )
                                                    .setEmoji(
                                                        "1009794928953540608"
                                                    )
                                                    .setLabel("Cancel")
                                                    .setStyle(2),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "thumbnail_delete"
                                                    )
                                                    .setEmoji(
                                                        "1001046298734121001"
                                                    )
                                                    .setLabel("Delete")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const selectedButton =
                                    await resultMsg.awaitMessageComponent({
                                        filter,
                                        time: 600 * 1000,
                                        componentType: 2,
                                    });
                                if (!selectedButton) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId == "thumbnail_edit"
                                ) {
                                    let description = " ";
                                    const titleMsg = await message.channel.send(
                                        {
                                            content:
                                                "What Would You Like To Set The Thumbnail URL To?",
                                        }
                                    );
                                    const filterText = (m) => {
                                        return message.member.id == m.author.id;
                                    };
                                    const collector =
                                        await message.channel.createMessageCollector(
                                            {
                                                filter: filterText,
                                                max: 3,
                                            }
                                        );
                                    collector.on("collect", async (m) => {
                                        if (
                                            m.content.toLowerCase() === "cancel"
                                        ) {
                                            titleMsg.delete();
                                            m.delete();
                                            return collector.stop();
                                        }
                                        if (!imgSync.includes(m.content)) {
                                            if (
                                                !m.content.startsWith(
                                                    "https://"
                                                ) ||
                                                !m.content.startsWith("http://")
                                            )
                                                return m.reply({
                                                    content:
                                                        "Must Be A Variable Or Link!",
                                                    ephemeral: true,
                                                });
                                        }
                                        description = m.content;
                                        m.delete();
                                        titleMsg.delete();
                                        collector.stop();
                                    });
                                    collector.once(
                                        "end",
                                        async (collected, reason) => {
                                            if (reason == "time") {
                                                titleMsg.delete();
                                            }
                                            resultMsg.delete();
                                            embedData.thumbnail.url =
                                                description;
                                            description = description.replace(
                                                /\$user_iconurl/g,
                                                message.member.user.displayAvatarURL(
                                                    { dynamic: true }
                                                )
                                            );
                                            description = description.replace(
                                                /\$guild_iconurl/g,
                                                message.guild.iconURL({
                                                    dynamic: true,
                                                })
                                            );
                                            embed.setThumbnail(description);
                                            realMsg.edit({
                                                embeds: [embed],
                                            });
                                        }
                                    );
                                }
                                if (
                                    selectedButton.customId ==
                                    "thumbnail_cancel"
                                ) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId ==
                                    "thumbnail_delete"
                                ) {
                                    resultMsg.delete();
                                    embedData.thumbnail.url = null;
                                    embed.setThumbnail(null);
                                    realMsg.edit({
                                        content: " ",
                                        embeds: [embed],
                                    });
                                }
                            }
                            if (i.values[0] == "author") {
                                const resultMsg = await realMsg.reply({
                                    content:
                                        "Okay, Now Select An Action To Be Called?",
                                    components: [
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId("author_edit")
                                                    .setEmoji(
                                                        "1009794861274238976"
                                                    )
                                                    .setLabel("Edit")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "author_cancel"
                                                    )
                                                    .setEmoji(
                                                        "1009794928953540608"
                                                    )
                                                    .setLabel("Cancel")
                                                    .setStyle(2),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "author_delete"
                                                    )
                                                    .setEmoji(
                                                        "1001046298734121001"
                                                    )
                                                    .setLabel("Delete")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const selectedButton =
                                    await resultMsg.awaitMessageComponent({
                                        filter,
                                        time: 600 * 1000,
                                        componentType: 2,
                                    });
                                if (!selectedButton) {
                                    resultMsg.delete();
                                }
                                if (selectedButton.customId == "author_edit") {
                                    let description = " ";
                                    const titleMsg = await message.channel.send(
                                        {
                                            content:
                                                "What Would You Like To Set The Author Text To?",
                                        }
                                    );
                                    const filterText = (m) => {
                                        return message.member.id == m.author.id;
                                    };
                                    const collector =
                                        await message.channel.createMessageCollector(
                                            {
                                                filter: filterText,
                                                max: 3,
                                            }
                                        );
                                    collector.on("collect", async (m) => {
                                        if (
                                            m.content.toLowerCase() === "cancel"
                                        ) {
                                            titleMsg.delete();
                                            m.delete();
                                            return collector.stop();
                                        }
                                        description = m.content;
                                        m.delete();
                                        titleMsg.delete();
                                        collector.stop();
                                    });
                                    collector.once(
                                        "end",
                                        async (collected, reason) => {
                                            if (reason == "time") {
                                                titleMsg.delete();
                                            }
                                            embedData.author.name = description;
                                            const dataOkay =
                                                await this.client.util.replaceNoIcon(
                                                    description,
                                                    message
                                                );
                                            resultMsg.delete();
                                            embed.setAuthor({
                                                name: dataOkay,
                                                iconURL: realMsg.embeds[0]
                                                    .author
                                                    ? realMsg.embeds[0].author
                                                          .icon_url
                                                    : null,
                                            });
                                            realMsg.edit({
                                                embeds: [embed],
                                            });
                                        }
                                    );
                                }
                                if (
                                    selectedButton.customId == "author_cancel"
                                ) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId == "author_delete"
                                ) {
                                    resultMsg.delete();
                                    embedData.author.name = null;
                                    embed.setAuthor({
                                        name: null,
                                        iconURL: realMsg.embeds[0].author
                                            ? realMsg.embeds[0].author?.icon_url
                                            : null,
                                    });
                                    realMsg.edit({
                                        content: " ",
                                        embeds: [embed],
                                    });
                                }
                            }
                            if (i.values[0] == "authoricon") {
                                const resultMsg = await realMsg.reply({
                                    content:
                                        "Okay, Now Select An Action To Be Called?",
                                    components: [
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "authoricon_edit"
                                                    )
                                                    .setEmoji(
                                                        "1009794861274238976"
                                                    )
                                                    .setLabel("Edit")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "authoricon_cancel"
                                                    )
                                                    .setEmoji(
                                                        "1009794928953540608"
                                                    )
                                                    .setLabel("Cancel")
                                                    .setStyle(2),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "authoricon_delete"
                                                    )
                                                    .setEmoji(
                                                        "1001046298734121001"
                                                    )
                                                    .setLabel("Delete")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const selectedButton =
                                    await resultMsg.awaitMessageComponent({
                                        filter,
                                        time: 600 * 1000,
                                        componentType: 2,
                                    });
                                if (!selectedButton) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId == "authoricon_edit"
                                ) {
                                    let description = " ";
                                    const titleMsg = await message.channel.send(
                                        {
                                            content:
                                                "What Would You Like To Set The Author Icon To?",
                                        }
                                    );
                                    const filterText = (m) => {
                                        return message.member.id == m.author.id;
                                    };
                                    const collector =
                                        await message.channel.createMessageCollector(
                                            {
                                                filter: filterText,
                                                max: 3,
                                            }
                                        );
                                    collector.on("collect", async (m) => {
                                        if (
                                            m.content.toLowerCase() === "cancel"
                                        ) {
                                            titleMsg.delete();
                                            m.delete();
                                            return collector.stop();
                                        }
                                        if (!imgSync.includes(m.content)) {
                                            if (
                                                !m.content.startsWith(
                                                    "https://"
                                                ) ||
                                                !m.content.startsWith("http://")
                                            )
                                                return m.reply({
                                                    content:
                                                        "Must Be A Variable Or Link!",
                                                    ephemeral: true,
                                                });
                                        }
                                        description = m.content;
                                        m.delete();
                                        titleMsg.delete();
                                        collector.stop();
                                    });
                                    collector.once(
                                        "end",
                                        async (collected, reason) => {
                                            if (reason == "time") {
                                                titleMsg.delete();
                                            }
                                            resultMsg.delete();
                                            embedData.author.icon_url =
                                                description;
                                            description = description.replace(
                                                /\$user_iconurl/g,
                                                message.member.user.displayAvatarURL(
                                                    { dynamic: true }
                                                )
                                            );
                                            description = description.replace(
                                                /\$guild_iconurl/g,
                                                message.guild.iconURL({
                                                    dynamic: true,
                                                })
                                            );
                                            embed.setAuthor({
                                                name: realMsg.embeds[0].author
                                                    ? realMsg.embeds[0].author
                                                          ?.name
                                                    : null,
                                                iconURL: description,
                                            });
                                            realMsg.edit({
                                                embeds: [embed],
                                            });
                                        }
                                    );
                                }
                                if (
                                    selectedButton.customId ==
                                    "authoricon_cancel"
                                ) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId ==
                                    "authoricon_delete"
                                ) {
                                    resultMsg.delete();
                                    embedData.author.icon_url = null;
                                    embed.setAuthor({
                                        name: realMsg.embeds[0].author
                                            ? realMsg.embeds[0].author?.name
                                            : null,
                                        iconURL: null,
                                    });
                                    realMsg.edit({
                                        content: " ",
                                        embeds: [embed],
                                    });
                                }
                            }
                            if (i.values[0] == "footer") {
                                const resultMsg = await realMsg.reply({
                                    content:
                                        "Okay, Now Select An Action To Be Called?",
                                    components: [
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId("footer_edit")
                                                    .setEmoji(
                                                        "1009794861274238976"
                                                    )
                                                    .setLabel("Edit")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "footer_cancel"
                                                    )
                                                    .setEmoji(
                                                        "1009794928953540608"
                                                    )
                                                    .setLabel("Cancel")
                                                    .setStyle(2),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "footer_delete"
                                                    )
                                                    .setEmoji(
                                                        "1001046298734121001"
                                                    )
                                                    .setLabel("Delete")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const selectedButton =
                                    await resultMsg.awaitMessageComponent({
                                        filter,
                                        time: 600 * 1000,
                                        componentType: 2,
                                    });
                                if (!selectedButton) {
                                    resultMsg.delete();
                                }
                                if (selectedButton.customId == "footer_edit") {
                                    let description = " ";
                                    const titleMsg = await message.channel.send(
                                        {
                                            content:
                                                "What Would You Like To Set The Footer Text To?",
                                        }
                                    );
                                    const filterText = (m) => {
                                        return message.member.id == m.author.id;
                                    };
                                    const collector =
                                        await message.channel.createMessageCollector(
                                            {
                                                filter: filterText,
                                                max: 3,
                                            }
                                        );
                                    collector.on("collect", async (m) => {
                                        if (
                                            m.content.toLowerCase() === "cancel"
                                        ) {
                                            titleMsg.delete();
                                            m.delete();
                                            return collector.stop();
                                        }
                                        description = m.content;
                                        m.delete();
                                        titleMsg.delete();
                                        collector.stop();
                                    });
                                    collector.once(
                                        "end",
                                        async (collected, reason) => {
                                            if (reason == "time") {
                                                titleMsg.delete();
                                            }
                                            embedData.footer.text = description;
                                            const dataOkay =
                                                await this.client.util.replaceNoIcon(
                                                    description,
                                                    message
                                                );
                                            resultMsg.delete();
                                            embed.setFooter({
                                                text: dataOkay,
                                                iconURL: realMsg.embeds[0]
                                                    .footer
                                                    ? realMsg.embeds[0].footer
                                                          ?.icon_url
                                                    : null,
                                            });
                                            realMsg.edit({
                                                embeds: [embed],
                                            });
                                        }
                                    );
                                }
                                if (
                                    selectedButton.customId == "footer_cancel"
                                ) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId == "footer_delete"
                                ) {
                                    resultMsg.delete();
                                    embedData.footer.text = null;
                                    embed.setFooter({
                                        text: null,
                                        iconURL: realMsg.embeds[0].footer
                                            ? realMsg.embeds[0].footer?.icon_url
                                            : null,
                                    });
                                    realMsg.edit({
                                        content: " ",
                                        embeds: [embed],
                                    });
                                }
                            }
                            if (i.values[0] == "footericon") {
                                const resultMsg = await realMsg.reply({
                                    content:
                                        "Okay, Now Select An Action To Be Called?",
                                    components: [
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "footericon_edit"
                                                    )
                                                    .setEmoji(
                                                        "1009794861274238976"
                                                    )
                                                    .setLabel("Edit")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "footericon_cancel"
                                                    )
                                                    .setEmoji(
                                                        "1009794928953540608"
                                                    )
                                                    .setLabel("Cancel")
                                                    .setStyle(2),
                                                this.client.util
                                                    .button()
                                                    .setCustomId(
                                                        "footericon_delete"
                                                    )
                                                    .setEmoji(
                                                        "1001046298734121001"
                                                    )
                                                    .setLabel("Delete")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const selectedButton =
                                    await resultMsg.awaitMessageComponent({
                                        filter,
                                        time: 600 * 1000,
                                        componentType: 2,
                                    });
                                if (!selectedButton) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId == "footericon_edit"
                                ) {
                                    let description = " ";
                                    const titleMsg = await message.channel.send(
                                        {
                                            content:
                                                "What Would You Like To Set The Footer Icon To?",
                                        }
                                    );
                                    const filterText = (m) => {
                                        return message.member.id == m.author.id;
                                    };
                                    const collector =
                                        await message.channel.createMessageCollector(
                                            {
                                                filter: filterText,
                                                max: 3,
                                            }
                                        );
                                    collector.on("collect", async (m) => {
                                        if (
                                            m.content.toLowerCase() === "cancel"
                                        ) {
                                            titleMsg.delete();
                                            m.delete();
                                            return collector.stop();
                                        }
                                        if (!imgSync.includes(m.content)) {
                                            if (
                                                !m.content.startsWith(
                                                    "https://"
                                                ) ||
                                                !m.content.startsWith("http://")
                                            )
                                                return m.reply({
                                                    content:
                                                        "Must Be A Variable Or Link!",
                                                    ephemeral: true,
                                                });
                                        }
                                        description = m.content;
                                        m.delete();
                                        titleMsg.delete();
                                        collector.stop();
                                    });
                                    collector.once(
                                        "end",
                                        async (collected, reason) => {
                                            if (reason == "time") {
                                                titleMsg.delete();
                                            }
                                            resultMsg.delete();
                                            embedData.footer.icon_url =
                                                description;
                                            description = description.replace(
                                                /\$user_iconurl/g,
                                                message.member.user.displayAvatarURL(
                                                    { dynamic: true }
                                                )
                                            );
                                            description = description.replace(
                                                /\$guild_iconurl/g,
                                                message.guild.iconURL({
                                                    dynamic: true,
                                                })
                                            );
                                            embed.setFooter({
                                                text: realMsg.embeds[0].footer
                                                    ? realMsg.embeds[0].footer
                                                          ?.text
                                                    : null,
                                                iconURL: description,
                                            });
                                            realMsg.edit({
                                                embeds: [embed],
                                            });
                                        }
                                    );
                                }
                                if (
                                    selectedButton.customId ==
                                    "footericon_cancel"
                                ) {
                                    resultMsg.delete();
                                }
                                if (
                                    selectedButton.customId ==
                                    "footericon_delete"
                                ) {
                                    resultMsg.delete();
                                    embedData.footer.icon_url = null;
                                    embed.setFooter({
                                        text: realMsg.embeds[0].footer
                                            ? realMsg.embeds[0].footer?.text
                                            : null,
                                        iconURL: null,
                                    });
                                    realMsg.edit({
                                        content: " ",
                                        embeds: [embed],
                                    });
                                }
                            }
                        }
                        if (i.componentType == 2) {
                            if (i.customId == "cancel") {
                                selectedMenu.stop();
                                realMsg.delete();
                            }
                            if (i.customId == "save") {
                                selectedMenu.stop();
                                realMsg.edit({
                                    content: `Successfully Saved The Embed!`,
                                    embeds: [embed],
                                    components: [],
                                });
                                await this.client.database.welcomeUserData.put(
                                    message.member.user.id,
                                    embedValue.id,
                                    {
                                        name: dataToSave.name,
                                        content: dataToSave.content,
                                        embeds: embedData,
                                    }
                                );
                            }
                        }
                    });
                }
            } else if (slash == true) {
                if (args == "create") {
                    let data = {
                        name: "",
                        content: " ",
                    };
                    let embedData = {};
                    embedData.title = "title";
                    embedData.description = "description";
                    embedData.color = 3092790;
                    embedData.image = {};
                    embedData.image.url = undefined;
                    embedData.thumbnail = {};
                    embedData.thumbnail.url = undefined;
                    embedData.author = {};
                    embedData.author.name = undefined;
                    embedData.author.icon_url = undefined;
                    embedData.footer = {};
                    embedData.footer.text = undefined;
                    embedData.footer.icon_url = undefined;
                    const msg = await message.reply({
                        content:
                            "What Whould You Like To Set The Embed Name? (Type `cancel` To Cancel)",
                        fetchReply: true,
                    });
                    const filter = (m) => m.author.id == message.member.id;
                    const collector =
                        await message.channel.createMessageCollector({
                            filter,
                            max: 3,
                            time: 30000,
                        });
                    collector.on("collect", async (m) => {
                        if (m.content.toLowerCase() === "cancel") {
                            message.message.delete();
                            m.delete();
                            return collector.stop();
                        }
                        if (m.content.length > 20)
                            return m.reply({
                                content:
                                    "Embed Name Must Be Less Than 20 Characters!",
                                ephemeral: true,
                            });
                        data.name = m.content;
                        m.delete();
                        collector.stop();
                    });
                    collector.once("end", async (collected, reason) => {
                        if (reason == "time") {
                            message.reply({
                                content: "You Took Too Long To Respond!",
                                ephemeral: true,
                            });
                        }
                        const embed = this.client.util
                            .embed()
                            .setTitle("Title")
                            .setDescription("Description")
                            .setColor(0x000000);
                        await message.editReply({
                            content: "Content",
                            embeds: [embed],
                            components: [
                                this.client.util
                                    .row()
                                    .setComponents(
                                        this.client.util
                                            .button()
                                            .setCustomId("body")
                                            .setEmoji("1010055851328946227")
                                            .setLabel("Body")
                                            .setStyle(1),
                                        this.client.util
                                            .button()
                                            .setCustomId("images")
                                            .setEmoji("1010056682526736445")
                                            .setLabel("Images")
                                            .setStyle(1),
                                        this.client.util
                                            .button()
                                            .setCustomId("misc")
                                            .setEmoji("1001043777596694558")
                                            .setLabel("Misc")
                                            .setStyle(1)
                                    ),
                                this.client.util
                                    .row()
                                    .setComponents(
                                        this.client.util
                                            .button()
                                            .setCustomId("save")
                                            .setEmoji("1001064958450208788")
                                            .setLabel("Save")
                                            .setStyle(3),
                                        this.client.util
                                            .button()
                                            .setCustomId("cancel")
                                            .setEmoji("1001064990079471679")
                                            .setLabel("Cancel")
                                            .setStyle(4)
                                    ),
                            ],
                        });
                        const filter = (i) => i.user.id == message.member.id;
                        const selected =
                            await message.channel.createMessageComponentCollector(
                                {
                                    filter,
                                }
                            );
                        selected.on("collect", async (i) => {
                            if (i.componentType == 2) {
                                if (i.customId == "body") {
                                    const rows = [
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("content")
                                                .setLabel("Content")
                                                .setStyle(2)
                                                .setMaxLength(2048)
                                                .setRequired(false)
                                                .setValue(data.content || "")
                                        ),
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("title")
                                                .setLabel("Title")
                                                .setStyle(1)
                                                .setMaxLength(248)
                                                .setRequired(false)
                                                .setValue(embedData.title || "")
                                        ),
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("color")
                                                .setLabel("Color")
                                                .setStyle(1)
                                                .setRequired(false)
                                                .setValue(
                                                    embed.data.color.toString() ||
                                                        ""
                                                )
                                                .setMaxLength(7)
                                        ),
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("description")
                                                .setLabel("Description")
                                                .setStyle(2)
                                                .setMaxLength(2048)
                                                .setRequired(false)
                                                .setValue(
                                                    embedData.description || ""
                                                )
                                        ),
                                    ];
                                    const modal = this.client.util
                                        .model()
                                        .setCustomId(`modal-${i.id}`)
                                        .addComponents(rows)
                                        .setTitle("Body");
                                    const modalSubmitInteraction =
                                        await this.client.util.addModel(
                                            i,
                                            modal
                                        );
                                    const contentData =
                                        modalSubmitInteraction.fields.getTextInputValue(
                                            "content"
                                        ) == ""
                                            ? " "
                                            : modalSubmitInteraction.fields.getTextInputValue(
                                                  "content"
                                              );
                                    const dataContent =
                                        await this.client.util.replace(
                                            contentData,
                                            message
                                        );
                                    const titleData =
                                        modalSubmitInteraction.fields.getTextInputValue(
                                            "title"
                                        ) == ""
                                            ? null
                                            : modalSubmitInteraction.fields.getTextInputValue(
                                                  "title"
                                              );
                                    const dataTitle =
                                        await this.client.util.replace(
                                            titleData,
                                            message
                                        );
                                    const colorData =
                                        modalSubmitInteraction.fields.getTextInputValue(
                                            "color"
                                        ) == ""
                                            ? 0
                                            : modalSubmitInteraction.fields.getTextInputValue(
                                                  "color"
                                              );
                                    const dataColor =
                                        await this.client.util.replace(
                                            colorData,
                                            message
                                        );
                                    const descriptionData =
                                        modalSubmitInteraction.fields.getTextInputValue(
                                            "description"
                                        ) == ""
                                            ? null
                                            : modalSubmitInteraction.fields.getTextInputValue(
                                                  "description"
                                              );
                                    const dataDescription =
                                        await this.client.util.replace(
                                            descriptionData,
                                            message
                                        );
                                    embed.setDescription(dataDescription);
                                    embed.setTitle(dataTitle);
                                    embed.setColor(dataColor);
                                    data.content = contentData || " ";
                                    embedData.description = descriptionData;
                                    embedData.title = titleData;
                                    const colornumber = parseInt(
                                        dataColor.replace("#", ""),
                                        16
                                    );
                                    embedData.color = colornumber;
                                    message.editReply({
                                        content: dataContent || " ",
                                        embeds: [embed],
                                    });
                                    modalSubmitInteraction
                                        .deferUpdate()
                                        .catch((e) => {
                                            return;
                                        });
                                }
                                if (i.customId == "images") {
                                    const rows = [
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("thumbnail")
                                                .setLabel("Thumbnail")
                                                .setStyle(1)
                                                .setRequired(false)
                                                .setPlaceholder(
                                                    "Top Right Of The Embed!"
                                                )
                                                .setValue(
                                                    embedData.thumbnail
                                                        ? !embedData.thumbnail
                                                              ?.url
                                                            ? ""
                                                            : embedData
                                                                  .thumbnail.url
                                                        : ""
                                                )
                                        ),
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("image")
                                                .setLabel("Image")
                                                .setStyle(1)
                                                .setRequired(false)
                                                .setPlaceholder(
                                                    "Bottom Of The Embed!"
                                                )
                                                .setValue(
                                                    embedData.image
                                                        ? !embedData.image.url
                                                            ? ""
                                                            : embedData.image
                                                                  .url
                                                        : ""
                                                )
                                        ),
                                    ];
                                    const modal = this.client.util
                                        .model()
                                        .setCustomId(`modal-${i.id}`)
                                        .addComponents(rows)
                                        .setTitle("Images");
                                    const modalSubmitInteraction =
                                        await this.client.util.addModel(
                                            i,
                                            modal
                                        );
                                    const thumbnailData =
                                        modalSubmitInteraction.fields.getTextInputValue(
                                            "thumbnail"
                                        ) == ""
                                            ? null
                                            : modalSubmitInteraction.fields.getTextInputValue(
                                                  "thumbnail"
                                              );
                                    const dataThumbnail =
                                        await this.client.util.replaceIcon(
                                            thumbnailData,
                                            message
                                        );
                                    const imageData =
                                        modalSubmitInteraction.fields.getTextInputValue(
                                            "image"
                                        ) == ""
                                            ? null
                                            : modalSubmitInteraction.fields.getTextInputValue(
                                                  "image"
                                              );
                                    const dataImage =
                                        await this.client.util.replaceIcon(
                                            imageData,
                                            message
                                        );
                                    embed.setThumbnail(dataThumbnail);
                                    embed.setImage(dataImage);
                                    embedData.thumbnail.url = thumbnailData;
                                    embedData.image.url = imageData;
                                    message.editReply({
                                        embeds: [embed],
                                    });
                                    modalSubmitInteraction
                                        .deferUpdate()
                                        .catch((e) => {
                                            return;
                                        });
                                }
                                if (i.customId == "misc") {
                                    const rows = [
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("author")
                                                .setLabel("Author")
                                                .setStyle(1)
                                                .setRequired(false)
                                                .setPlaceholder("Author Name")
                                                .setValue(
                                                    embedData.author
                                                        ? !embedData.author.name
                                                            ? ""
                                                            : embedData.author
                                                                  .name
                                                        : ""
                                                )
                                        ),
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("authorIcon")
                                                .setLabel("Author Icon")
                                                .setStyle(1)
                                                .setRequired(false)
                                                .setPlaceholder("Author Icon")
                                                .setValue(
                                                    embedData.author
                                                        ? !embedData.author
                                                              .icon_url
                                                            ? ""
                                                            : embedData.author
                                                                  .icon_url
                                                        : ""
                                                )
                                        ),
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("footer")
                                                .setLabel("Footer Text")
                                                .setStyle(1)
                                                .setRequired(false)
                                                .setPlaceholder("Footer Text")
                                                .setValue(
                                                    embedData.footer
                                                        ? !embedData.footer.text
                                                            ? ""
                                                            : embedData.footer
                                                                  .text
                                                        : ""
                                                )
                                        ),
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("footerIcon")
                                                .setLabel("Footer Icon")
                                                .setStyle(1)
                                                .setRequired(false)
                                                .setPlaceholder("Footer Icon")
                                                .setValue(
                                                    embedData.footer
                                                        ? !embedData.footer
                                                              .icon_url
                                                            ? ""
                                                            : embedData.footer
                                                                  .icon_url
                                                        : ""
                                                )
                                        ),
                                    ];
                                    const modal = this.client.util
                                        .model()
                                        .setCustomId(`modal-${i.id}`)
                                        .addComponents(rows)
                                        .setTitle("Misc");
                                    const modalSubmitInteraction =
                                        await this.client.util.addModel(
                                            i,
                                            modal
                                        );
                                    const authorData =
                                        modalSubmitInteraction.fields.getTextInputValue(
                                            "author"
                                        ) == ""
                                            ? null
                                            : modalSubmitInteraction.fields.getTextInputValue(
                                                  "author"
                                              );
                                    const dataAuthor =
                                        await this.client.util.replace(
                                            authorData,
                                            message
                                        );
                                    const authorIconData =
                                        modalSubmitInteraction.fields.getTextInputValue(
                                            "authorIcon"
                                        ) == ""
                                            ? null
                                            : modalSubmitInteraction.fields.getTextInputValue(
                                                  "authorIcon"
                                              );
                                    const dataAuthorIcon =
                                        await this.client.util.replaceIcon(
                                            authorIconData,
                                            message
                                        );
                                    const footerData =
                                        modalSubmitInteraction.fields.getTextInputValue(
                                            "footer"
                                        ) == ""
                                            ? null
                                            : modalSubmitInteraction.fields.getTextInputValue(
                                                  "footer"
                                              );
                                    const dataFooter =
                                        await this.client.util.replace(
                                            footerData,
                                            message
                                        );
                                    const footerIconData =
                                        modalSubmitInteraction.fields.getTextInputValue(
                                            "footerIcon"
                                        ) == ""
                                            ? null
                                            : modalSubmitInteraction.fields.getTextInputValue(
                                                  "footerIcon"
                                              );
                                    const dataFooterIcon =
                                        await this.client.util.replaceIcon(
                                            footerIconData,
                                            message
                                        );
                                    embed.setAuthor({
                                        name: dataAuthor,
                                        iconURL: dataAuthorIcon,
                                    });
                                    embed.setFooter({
                                        text: dataFooter,
                                        iconURL: dataFooterIcon,
                                    });
                                    embedData.author.name = authorData;
                                    embedData.author.icon_url = authorIconData;
                                    embedData.footer.text = footerData;
                                    embedData.footer.icon_url = footerIconData;
                                    message.editReply({
                                        embeds: [embed],
                                    });
                                    modalSubmitInteraction
                                        .deferUpdate()
                                        .catch((e) => {
                                            return;
                                        });
                                }
                                if (i.customId == "cancel") {
                                    selected.stop();
                                    message.deleteReply();
                                }
                                if (i.customId == "save") {
                                    selected.stop();
                                    message.editReply({
                                        content:
                                            "Successfully Saved The Embed!",
                                        embeds: [embed],
                                        components: [],
                                    });
                                    await this.client.database.welcomeUserData.post(
                                        message.member.user.id,
                                        {
                                            name: data.name,
                                            content: data.content,
                                            embeds: embedData,
                                        }
                                    );
                                }
                            }
                        });
                    });
                }
                if (args == "show") {
                    const data = await this.client.database.welcomeUserData.get(
                        message.member.user.id
                    );
                    let max = data.message.length;
                    let okie = data.message.slice(0, max);
                    let resultMessage = await message.reply({
                        content: `Select An Preset To Show`,
                        components: [
                            this.client.util.row().setComponents(
                                this.client.util
                                    .menu()
                                    .setCustomId("show")
                                    .setPlaceholder("Select An Preset To Show")
                                    .setOptions([
                                        ...okie.map((x, i) => ({
                                            label: x.name,
                                            value: x.id,
                                        })),
                                    ])
                            ),
                        ],
                        fetchReply: true,
                    });
                    const selected =
                        await message.client.util.awaitSelectionMenu(
                            resultMessage,
                            (message) => message.member.id == message.user.id
                        );
                    if (!selected) {
                        return await message
                            .editReply({
                                content: "Oops! Looks Like Time Is Up",
                                components: [],
                            })
                            .catch((e) => {
                                return;
                            });
                    }
                    await selected?.deferUpdate().catch((e) => {
                        return;
                    });
                    const embedValue = data.message?.filter(
                        (g) => g.id == selected.values[0]
                    )[0];
                    await message.editReply({
                        content: `Here Is The Embed Preview For ${
                            "`" + embedValue.name + "`"
                        } Preset ${this.client.config.Client.Emoji.Down}`,
                        components: [],
                    });
                    embedValue.embeds.color = embedValue.embeds.color
                        ? Number(embedValue.embeds.color)
                        : 0;
                    if (embedValue.content != " ")
                        embedValue.content = await this.client.util.replace(
                            embedValue.content,
                            message
                        );
                    const dataEmbed = await this.client.util.replacerString(
                        embedValue.embeds,
                        message
                    );
                    await message.channel.send({
                        content: embedValue.content,
                        embeds: [new EmbedBuilder(dataEmbed)],
                    });
                }
                if (args === "delete") {
                    const data = await this.client.database.welcomeUserData.get(
                        message.member.user.id
                    );
                    let max = data.message.length;
                    let okie = data.message.slice(0, max);
                    let resultMessage = await message.reply({
                        content: `Select An Preset To Delete`,
                        components: [
                            this.client.util.row().setComponents(
                                this.client.util
                                    .menu()
                                    .setCustomId("delete")
                                    .setPlaceholder(
                                        "Select An Preset To Delete"
                                    )
                                    .setOptions([
                                        ...okie.map((x, i) => ({
                                            label: x.name,
                                            value: x.id,
                                        })),
                                    ])
                            ),
                        ],
                        fetchReply: true,
                    });
                    const selected =
                        await message.client.util.awaitSelectionMenu(
                            resultMessage,
                            (message) => message.member.id == message.user.id
                        );
                    if (!selected) {
                        return await message
                            .editReply({
                                content: "Oops! Looks Like Time Is Up",
                                components: [],
                            })
                            .catch((e) => {
                                return;
                            });
                    }
                    const embedValue = data.message?.filter(
                        (g) => g.id == selected.values[0]
                    )[0];
                    message.editReply({
                        components: [
                            this.client.util.row().setComponents(
                                this.client.util
                                    .menu()
                                    .setCustomId("delete")
                                    .setPlaceholder(
                                        "Select An Preset To Delete"
                                    )
                                    .setOptions([
                                        ...okie.map((x, i) => ({
                                            label: x.name,
                                            value: x.id,
                                        })),
                                    ])
                                    .setDisabled(true)
                            ),
                        ],
                    });
                    const okayMsg = await selected.reply({
                        content: `Are You Sure Want To Delete The Preset **${embedValue.name}**?`,
                        components: [
                            this.client.util
                                .row()
                                .setComponents(
                                    this.client.util
                                        .button()
                                        .setStyle(3)
                                        .setLabel("Yes")
                                        .setCustomId("yes"),
                                    this.client.util
                                        .button()
                                        .setStyle(4)
                                        .setLabel("No")
                                        .setCustomId("no")
                                ),
                        ],
                        fetchReply: true,
                        ephemeral: true,
                    });
                    const selected2 =
                        await this.client.util.awaitSelectionButton(
                            okayMsg,
                            (message) => message.member.id == message.user.id
                        );
                    if (!selected2) {
                        return await selected
                            .editReply({
                                content: "Oops! Looks Like Time Is Up",
                                components: [],
                            })
                            .catch((e) => {
                                return;
                            });
                    }
                    if (selected2.customId == "yes") {
                        await this.client.database.welcomeUserData.delete(
                            message.member.user.id,
                            embedValue.id
                        );
                        await selected.editReply({
                            content: `Successfully Deleted The Preset **${embedValue.name}**`,
                            components: [],
                            ephemeral: true,
                        });
                        message.deleteReply().catch((e) => {
                            return;
                        });
                    }
                    if (selected2.customId == "no") {
                        await selected.editReply({
                            content: `Successfully Cancelled The Delete Process`,
                            components: [],
                            ephemeral: true,
                        });
                        message.deleteReply().catch((e) => {
                            return;
                        });
                    }
                }
                if (args == "edit") {
                    let dataToSave = {
                        name: "",
                        content: " ",
                    };
                    let embedData = {};
                    embedData.title = "title";
                    embedData.description = "description";
                    embedData.color = 3092790;
                    embedData.image = {};
                    embedData.image.url = undefined;
                    embedData.thumbnail = {};
                    embedData.thumbnail.url = undefined;
                    embedData.author = {};
                    embedData.author.name = undefined;
                    embedData.author.icon_url = undefined;
                    embedData.footer = {};
                    embedData.footer.text = undefined;
                    embedData.footer.icon_url = undefined;
                    const data = await this.client.database.welcomeUserData.get(
                        message.member.user.id
                    );
                    let max = data.message.length;
                    let okie = data.message.slice(0, max);
                    let resultMessage = await message.reply({
                        content: `Select An Preset To Edit`,
                        components: [
                            this.client.util.row().setComponents(
                                this.client.util
                                    .menu()
                                    .setCustomId("edit")
                                    .setPlaceholder("Select An Preset To Edit")
                                    .setOptions([
                                        ...okie.map((x, i) => ({
                                            label: x.name,
                                            value: x.id,
                                        })),
                                    ])
                            ),
                        ],
                        fetchReply: true,
                    });
                    const selected =
                        await message.client.util.awaitSelectionMenu(
                            resultMessage,
                            (message) => message.member.id == message.user.id
                        );
                    if (!selected) {
                        return await message
                            .editReply({
                                content: "Oops! Looks Like Time Is Up",
                                components: [],
                            })
                            .catch((e) => {
                                return;
                            });
                    }
                    selected.deferUpdate().catch((e) => {
                        return;
                    });
                    const embedValue = data.message?.filter(
                        (g) => g.id == selected.values[0]
                    )[0];
                    embedData = embedValue.embeds;
                    dataToSave.name = embedValue.name;
                    dataToSave.content = embedValue.content;
                    embedValue.embeds.color = embedValue.embeds.color
                        ? Number(embedValue.embeds.color)
                        : 0;
                    if (embedValue.content != " ")
                        embedValue.content = await this.client.util.replace(
                            embedValue.content,
                            message
                        );
                    const dataEmbed = await this.client.util.replacerString(
                        embedValue.embeds,
                        message
                    );
                    const embed = new EmbedBuilder(dataEmbed);
                    const editedMessage = await message.editReply({
                        content: embedValue.content || " ",
                        embeds: [embed],
                        components: [
                            this.client.util
                                .row()
                                .setComponents(
                                    this.client.util
                                        .button()
                                        .setCustomId("body")
                                        .setEmoji("1010055851328946227")
                                        .setLabel("Body")
                                        .setStyle(1),
                                    this.client.util
                                        .button()
                                        .setCustomId("images")
                                        .setEmoji("1010056682526736445")
                                        .setLabel("Images")
                                        .setStyle(1),
                                    this.client.util
                                        .button()
                                        .setCustomId("misc")
                                        .setEmoji("1001043777596694558")
                                        .setLabel("Misc")
                                        .setStyle(1)
                                ),
                            this.client.util
                                .row()
                                .setComponents(
                                    this.client.util
                                        .button()
                                        .setCustomId("save")
                                        .setEmoji("1001064958450208788")
                                        .setLabel("Save")
                                        .setStyle(3),
                                    this.client.util
                                        .button()
                                        .setCustomId("cancel")
                                        .setEmoji("1001064990079471679")
                                        .setLabel("Cancel")
                                        .setStyle(4)
                                ),
                        ],
                    });
                    const filter = (i) => i.user.id == message.member.id;
                    const selected2 =
                        await message.channel.createMessageComponentCollector({
                            filter,
                        });
                    selected2.on("collect", async (i) => {
                        if (i.componentType == 2) {
                            if (i.customId == "body") {
                                const rows = [
                                    this.client.util.row().setComponents(
                                        this.client.util
                                            .textInput()
                                            .setCustomId("content")
                                            .setLabel("Content")
                                            .setStyle(2)
                                            .setMaxLength(2048)
                                            .setRequired(false)
                                            .setValue(dataToSave.content || "")
                                    ),
                                    this.client.util.row().setComponents(
                                        this.client.util
                                            .textInput()
                                            .setCustomId("title")
                                            .setLabel("Title")
                                            .setStyle(1)
                                            .setMaxLength(248)
                                            .setRequired(false)
                                            .setValue(embedData.title || "")
                                    ),
                                    this.client.util
                                        .row()
                                        .setComponents(
                                            this.client.util
                                                .textInput()
                                                .setCustomId("color")
                                                .setLabel("Color")
                                                .setStyle(1)
                                                .setRequired(false)
                                        ),
                                    this.client.util.row().setComponents(
                                        this.client.util
                                            .textInput()
                                            .setCustomId("description")
                                            .setLabel("Description")
                                            .setStyle(2)
                                            .setMaxLength(2048)
                                            .setRequired(false)
                                            .setValue(
                                                embedData.description || ""
                                            )
                                    ),
                                ];
                                const modal = this.client.util
                                    .model()
                                    .setCustomId(`modal-${i.id}`)
                                    .addComponents(rows)
                                    .setTitle("Body");
                                const modalSubmitInteraction =
                                    await this.client.util.addModel(i, modal);
                                const contentData =
                                    modalSubmitInteraction.fields.getTextInputValue(
                                        "content"
                                    ) == ""
                                        ? " "
                                        : modalSubmitInteraction.fields.getTextInputValue(
                                              "content"
                                          );
                                const dataContent =
                                    await this.client.util.replace(
                                        contentData,
                                        message
                                    );
                                const titleData =
                                    modalSubmitInteraction.fields.getTextInputValue(
                                        "title"
                                    ) == ""
                                        ? null
                                        : modalSubmitInteraction.fields.getTextInputValue(
                                              "title"
                                          );
                                const dataTitle =
                                    await this.client.util.replace(
                                        titleData,
                                        message
                                    );
                                const colorData =
                                    modalSubmitInteraction.fields.getTextInputValue(
                                        "color"
                                    ) == ""
                                        ? 0
                                        : modalSubmitInteraction.fields.getTextInputValue(
                                              "color"
                                          );
                                const dataColor =
                                    await this.client.util.replace(
                                        colorData,
                                        message
                                    );
                                const descriptionData =
                                    modalSubmitInteraction.fields.getTextInputValue(
                                        "description"
                                    ) == ""
                                        ? null
                                        : modalSubmitInteraction.fields.getTextInputValue(
                                              "description"
                                          );
                                const dataDescription =
                                    await this.client.util.replace(
                                        descriptionData,
                                        message
                                    );
                                embed.setDescription(dataDescription);
                                embed.setTitle(dataTitle);
                                embed.setColor(dataColor);
                                dataToSave.content = contentData || " ";
                                embedData.description = descriptionData;
                                embedData.title = titleData;
                                const colornumber = parseInt(
                                    dataColor.replace("#", ""),
                                    16
                                );
                                embedData.color = colornumber;
                                message.editReply({
                                    content: dataContent || " ",
                                    embeds: [embed],
                                });
                                modalSubmitInteraction
                                    .deferUpdate()
                                    .catch((e) => {
                                        return;
                                    });
                            }
                            if (i.customId == "images") {
                                const rows = [
                                    this.client.util.row().setComponents(
                                        this.client.util
                                            .textInput()
                                            .setCustomId("thumbnail")
                                            .setLabel("Thumbnail")
                                            .setStyle(1)
                                            .setRequired(false)
                                            .setPlaceholder(
                                                "Top Right Of The Embed!"
                                            )
                                            .setValue(
                                                embedData.thumbnail
                                                    ? !embedData.thumbnail?.url
                                                        ? ""
                                                        : embedData.thumbnail
                                                              .url
                                                    : ""
                                            )
                                    ),
                                    this.client.util.row().setComponents(
                                        this.client.util
                                            .textInput()
                                            .setCustomId("image")
                                            .setLabel("Image")
                                            .setStyle(1)
                                            .setRequired(false)
                                            .setPlaceholder(
                                                "Bottom Of The Embed!"
                                            )
                                            .setValue(
                                                embedData.image
                                                    ? !embedData.image.url
                                                        ? ""
                                                        : embedData.image.url
                                                    : ""
                                            )
                                    ),
                                ];
                                const modal = this.client.util
                                    .model()
                                    .setCustomId(`modal-${i.id}`)
                                    .addComponents(rows)
                                    .setTitle("Images");
                                const modalSubmitInteraction =
                                    await this.client.util.addModel(i, modal);
                                const thumbnailData =
                                    modalSubmitInteraction.fields.getTextInputValue(
                                        "thumbnail"
                                    ) == ""
                                        ? null
                                        : modalSubmitInteraction.fields.getTextInputValue(
                                              "thumbnail"
                                          );
                                const dataThumbnail =
                                    await this.client.util.replaceIcon(
                                        thumbnailData,
                                        message
                                    );
                                const imageData =
                                    modalSubmitInteraction.fields.getTextInputValue(
                                        "image"
                                    ) == ""
                                        ? null
                                        : modalSubmitInteraction.fields.getTextInputValue(
                                              "image"
                                          );
                                const dataImage =
                                    await this.client.util.replaceIcon(
                                        imageData,
                                        message
                                    );
                                embed.setThumbnail(dataThumbnail);
                                embed.setImage(dataImage);
                                embedData.thumbnail.url = thumbnailData;
                                embedData.image.url = imageData;
                                message.editReply({
                                    embeds: [embed],
                                });
                                modalSubmitInteraction
                                    .deferUpdate()
                                    .catch((e) => {
                                        return;
                                    });
                            }
                            if (i.customId == "misc") {
                                const rows = [
                                    this.client.util.row().setComponents(
                                        this.client.util
                                            .textInput()
                                            .setCustomId("author")
                                            .setLabel("Author")
                                            .setStyle(1)
                                            .setRequired(false)
                                            .setPlaceholder("Author Name")
                                            .setValue(
                                                embedData.author
                                                    ? !embedData.author.name
                                                        ? ""
                                                        : embedData.author.name
                                                    : ""
                                            )
                                    ),
                                    this.client.util.row().setComponents(
                                        this.client.util
                                            .textInput()
                                            .setCustomId("authorIcon")
                                            .setLabel("Author Icon")
                                            .setStyle(1)
                                            .setRequired(false)
                                            .setPlaceholder("Author Icon")
                                            .setValue(
                                                embedData.author
                                                    ? !embedData.author.icon_url
                                                        ? ""
                                                        : embedData.author
                                                              .icon_url
                                                    : ""
                                            )
                                    ),
                                    this.client.util.row().setComponents(
                                        this.client.util
                                            .textInput()
                                            .setCustomId("footer")
                                            .setLabel("Footer Text")
                                            .setStyle(1)
                                            .setRequired(false)
                                            .setPlaceholder("Footer Text")
                                            .setValue(
                                                embedData.footer
                                                    ? !embedData.footer.text
                                                        ? ""
                                                        : embedData.footer.text
                                                    : ""
                                            )
                                    ),
                                    this.client.util.row().setComponents(
                                        this.client.util
                                            .textInput()
                                            .setCustomId("footerIcon")
                                            .setLabel("Footer Icon")
                                            .setStyle(1)
                                            .setRequired(false)
                                            .setPlaceholder("Footer Icon")
                                            .setValue(
                                                embedData.footer
                                                    ? !embedData.footer.icon_url
                                                        ? ""
                                                        : embedData.footer
                                                              .icon_url
                                                    : ""
                                            )
                                    ),
                                ];
                                const modal = this.client.util
                                    .model()
                                    .setCustomId(`modal-${i.id}`)
                                    .addComponents(rows)
                                    .setTitle("Misc");
                                const modalSubmitInteraction =
                                    await this.client.util.addModel(i, modal);
                                const authorData =
                                    modalSubmitInteraction.fields.getTextInputValue(
                                        "author"
                                    ) == ""
                                        ? null
                                        : modalSubmitInteraction.fields.getTextInputValue(
                                              "author"
                                          );
                                const dataAuthor =
                                    await this.client.util.replace(
                                        authorData,
                                        message
                                    );
                                const authorIconData =
                                    modalSubmitInteraction.fields.getTextInputValue(
                                        "authorIcon"
                                    ) == ""
                                        ? null
                                        : modalSubmitInteraction.fields.getTextInputValue(
                                              "authorIcon"
                                          );
                                const dataAuthorIcon =
                                    await this.client.util.replaceIcon(
                                        authorIconData,
                                        message
                                    );
                                const footerData =
                                    modalSubmitInteraction.fields.getTextInputValue(
                                        "footer"
                                    ) == ""
                                        ? null
                                        : modalSubmitInteraction.fields.getTextInputValue(
                                              "footer"
                                          );
                                const dataFooter =
                                    await this.client.util.replace(
                                        footerData,
                                        message
                                    );
                                const footerIconData =
                                    modalSubmitInteraction.fields.getTextInputValue(
                                        "footerIcon"
                                    ) == ""
                                        ? null
                                        : modalSubmitInteraction.fields.getTextInputValue(
                                              "footerIcon"
                                          );
                                const dataFooterIcon =
                                    await this.client.util.replaceIcon(
                                        footerIconData,
                                        message
                                    );
                                embed.setAuthor({
                                    name: dataAuthor,
                                    iconURL: dataAuthorIcon,
                                });
                                embed.setFooter({
                                    text: dataFooter,
                                    iconURL: dataFooterIcon,
                                });
                                embedData.author.name = authorData;
                                embedData.author.icon_url = authorIconData;
                                embedData.footer.text = footerData;
                                embedData.footer.icon_url = footerIconData;
                                message.editReply({
                                    embeds: [embed],
                                });
                                modalSubmitInteraction
                                    .deferUpdate()
                                    .catch((e) => {
                                        return;
                                    });
                            }
                            if (i.customId == "cancel") {
                                selected2.stop();
                                message.deleteReply();
                            }
                            if (i.customId == "save") {
                                selected2.stop();
                                message.editReply({
                                    content: "Successfully Saved The Embed!",
                                    embeds: [embed],
                                    components: [],
                                });
                                await this.client.database.welcomeUserData.put(
                                    message.member.user.id,
                                    embedValue.id,
                                    {
                                        name: dataToSave.name,
                                        content: dataToSave.content,
                                        embeds: embedData,
                                    }
                                );
                            }
                        }
                    });
                }
            }
        } catch (e) {
            console.error(e);
            message.reply({
                content: `An Error Occured: ${e.message}`,
                ephemeral: true,
            });
        }
    }
};
