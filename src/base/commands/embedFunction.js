const { MessageEmbed, EmbedBuilder } = require("discord.js");
const imgSync = ["$guild_iconurl", "$user_iconurl"];
module.exports = class EmbedFunction {
    /**
     *
     * @param {import('../PrismoClient')} client
     */
    constructor(client) {
        this.client = client;
        this.msg = null;
    }
    async buildNormal(message, args, slash = false) {
        if (args === "create") {
            let check = await this.client.database.welcomeUserData.get(message?.member.user.id);
            if (check.message.length >= 10) {
                return message?.reply({
                    content: "You can only have 10 embeds!",
                    ephemeral: true,
                });
            }
            const data = {
                name: "",
                content: " ",
            };
            let embedData = {
                title: "title",
                description: "description",
                color: 3092790,
                image: { url: undefined },
                thumbnail: { url: undefined },
                author: { name: undefined, icon_url: undefined },
                footer: { text: undefined, icon_url: undefined },
            };

            const msg = await message?.reply({
                content: "What would you like to set the embed name? (Type `cancel` to cancel)",
                fetchReply: true,
            });

            const filter = (i) => {
                if (i?.member?.id === message?.member.id) return true;
                return false;
            }
            const collector = await message?.channel?.createMessageCollector({
                filter,
                max: 3,
                time: 30000,
            });

            collector.on("collect", async (m) => {
                if (m.content.toLowerCase() === "cancel") {
                    await message?.message?.delete();
                    await m?.delete();
                    return collector?.stop();
                }
                if (m.content.length > 20)
                    return m.reply({
                        content: "Embed name must be less than 20 characters!",
                        ephemeral: true,
                    });
                data.name = m.content;
                await m?.delete();
                await collector?.stop();
            });

            collector.on("end", async (collected, reason) => {
                if (reason === "time") {
                    await collector?.stop();
                    this.editReply(message, {
                        content: "You took too long to respond!",
                        ephemeral: true,
                    }, slash);
                }
                const embed = this.client.util.embed().setTitle("Title").setDescription("Description").setColor(0x000000);
                await this.sendNormal(msg, "Content", embed, slash);
                let filter = (i) => {
                    if (i.user.id === message?.member.id) return true;
                    return false;
                }
                const selected = await message?.channel?.createMessageComponentCollector({ filter, time: 20 * 60 * 1000 });
                selected.on("collect", async (i) => {
                    if (i.componentType == 2) {
                        if (i.customId == "body") {
                            await this.body(message, data, embedData, i, embed, slash);
                        }
                        if (i.customId === "images") {
                            await this.image(message, data, embedData, i, embed, slash);
                        }
                        if (i.customId == "misc") {
                            await this.misc(message, data, embedData, i, embed, slash);
                        }
                        if (i.customId == "cancel") {
                            selected.stop();
                            return this.msg?.edit
                                ({
                                    content: "Successfully Cancelled The Embed!",
                                    embeds: [],
                                    components: [],
                                });
                        }
                        if (i.customId == "save") {
                            selected.stop();
                            await this.msg.edit({
                                content: "Successfully Saved The Embed!",
                                embeds: [embed],
                                components: [],
                            });
                            try{
                                // console.log(`Exec: ${data.name} | ${data.content} | ${embedData}`);
                                return await this.client.database.welcomeUserData.post(message?.member.user.id, {
                                    name: data.name,
                                    content: data.content,
                                    embeds: embedData,
                                });
                            } catch (e) {
                                return message?.reply({
                                    content: "An error occurred while saving the embed!",
                                    ephemeral: true,
                                });
                            }
                            
                        }
                    }
                });
            });
        }
        if ((args == "show") || (args == "list")) {
            const data = await this.client.database.welcomeUserData.get(message?.member.user.id);
            if (!data.message.length) return await message?.reply({ content: "You Don't Have Any Presets Saved!" });
            let max = data.message?.length;
            let okie = data.message?.slice(0, max);
            let resultMessage = await message?.reply({
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
            const selected = await message?.client.util.awaitSelectionMenu(resultMessage, (message) => message?.member.id == message?.user.id);
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
            const embedValue = data.message?.filter((g) => g.id == selected.values[0])[0];
            // await resultMessage.reply({content:`h`})
            await this.editReply(resultMessage, {
                content: `Here Is The Embed Preview For ${"`" + embedValue.name + "`"} Preset ${this.client.config.Client.emoji.down}`,
                components: [],
            }, slash);
            embedValue.embeds.color = embedValue.embeds.color ? Number(embedValue.embeds.color) : 0;
            if (embedValue.content != " ") embedValue.content = await this.client.util.replace(embedValue.content, message);
            const dataEmbed = await this.client.util.replacerString(embedValue.embeds, message);
            await message?.channel.send({
                content: embedValue.content,
                embeds: [new EmbedBuilder(dataEmbed)],
            });
        }
        if (args === "delete") {
            const data = await this.client.database.welcomeUserData.get(message?.member.user.id);
            if (!data.message.length) return await message?.reply({ content: "You Don't Have Any Presets Saved!" });
            let max = data.message?.length;
            let okie = data.message?.slice(0, max);
            let resultMessage = await message?.reply({
                content: `Select An Preset To Delete`,
                components: [
                    this.client.util.row().setComponents(
                        this.client.util
                            .menu()
                            .setCustomId("delete")
                            .setPlaceholder("Select An Preset To Delete")
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
            const selected = await message?.client.util.awaitSelectionMenu(resultMessage, (message) => message?.member.id == message?.user.id);
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
            const embedValue = data.message?.filter((g) => g.id == selected.values[0])[0];
            message?.editReply({
                components: [
                    this.client.util.row().setComponents(
                        this.client.util
                            .menu()
                            .setCustomId("delete")
                            .setPlaceholder("Select An Preset To Delete")
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
                            this.client.util.button().setStyle(3).setLabel("Yes").setCustomId("yes"),
                            this.client.util.button().setStyle(4).setLabel("No").setCustomId("no")
                        ),
                ],
                fetchReply: true,
                ephemeral: true,
            });
            const selected2 = await this.client.util.awaitSelectionButton(okayMsg, (message) => message?.member.id == message?.user.id);
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
                await this.client.database.welcomeUserData.delete(message?.member.user.id, embedValue.id);
                await selected.editReply({
                    content: `Successfully Deleted The Preset **${embedValue.name}**`,
                    components: [],
                    ephemeral: true,
                });
                message?.deleteReply().catch((e) => {
                    return;
                });
            }
            if (selected2.customId == "no") {
                await selected.editReply({
                    content: `Successfully Cancelled The Delete Process`,
                    components: [],
                    ephemeral: true,
                });
                message?.deleteReply().catch((e) => {
                    return;
                });
            }
        }
        if (args === "edit") {
            let data = await this.client.database.welcomeUserData.get(message?.member.user.id);
            if (!data.message.length) return await message?.reply({ content: "You Don't Have Any Presets Saved!" });
            const dataToSave = {
                name: "",
                content: " ",
            };
            let embedData = {
                title: "title",
                description: "description",
                color: 3092790,
                image: { url: undefined },
                thumbnail: { url: undefined },
                author: { name: undefined, icon_url: undefined },
                footer: { text: undefined, icon_url: undefined },
            };

            const userData = await this.client.database.welcomeUserData.get(message?.member.user.id);
            const max = userData.message?.length;
            const options = userData.message?.slice(0, max).map((x, i) => ({ label: x.name, value: x.id }));

            const resultMessage = await message?.reply({
                content: "Select a preset to edit",
                components: [
                    this.client.util
                        .row()
                        .setComponents(this.client.util.menu().setCustomId("edit").setPlaceholder("Select a preset to edit").setOptions(options)),
                ],
                fetchReply: true,
            });

            const selected = await message?.client.util.awaitSelectionMenu(resultMessage, (message) => message?.member.id === message?.user.id);

            if (!selected) {
                return await message
                    .editReply({
                        content: "Oops! Time is up.",
                        components: [],
                    })
                    .catch(() => {
                        return;
                    });
            }

            await selected.deferUpdate().catch(() => {
                return;
            });

            const embedValue = userData.message?.find((g) => g.id === selected.values[0]);
            embedData = embedValue.embeds;
            dataToSave.name = embedValue.name;
            dataToSave.content = embedValue.content;

            embedValue.embeds.color = embedValue.embeds.color ? Number(embedValue.embeds.color) : 0;

            if (embedValue.content !== " ") {
                embedValue.content = await this.client.util.replace(embedValue.content, message);
            }

            const dataEmbed = await this.client.util.replacerString(embedValue.embeds, message);
            const embed = new EmbedBuilder(dataEmbed);
            await this.sendNormal(resultMessage, dataEmbed?.content, embed, slash);

            const filter = (i) => i.user.id === message?.member.id;
            const collector = await message?.channel.createMessageComponentCollector({ filter });

            collector.on("collect", async (interaction) => {
                if (interaction.componentType === 2) {
                    if (interaction.customId === "body") {
                        await this.body(message, dataToSave, embedData, interaction, embed, slash);
                    }
                    if (interaction.customId === "images") {
                        await this.image(message, dataToSave, embedData, interaction, embed, slash);
                    }
                    if (interaction.customId === "misc") {
                        await this.misc(message, dataToSave, embedData, interaction, embed, slash);
                    }
                    if (interaction.customId == "cancel") {
                        collector.stop();
                        return this.msg?.edit({
                            content: "Successfully Cancelled The Embed!",
                            embeds: [],
                            components: [],
                        });
                    }
                    if (interaction.customId == "save") {
                        this.msg?.edit({
                            content: "Successfully Saved The Embed!",
                            embeds: [embed],
                            components: [],
                        });
                        collector.stop();
                        return await this.client.database.welcomeUserData.put(message?.member.user.id, embedValue.id, {
                            name: dataToSave.name,
                            content: dataToSave.content,
                            embeds: embedData,
                        });
                    }
                }
            });
        }
    }

    async sendNormal(message, content, embed, slash = false) {
        await message?.delete().catch((e) => { return; });
        this.msg = await message.channel.send({
            content: content || " ",
            embeds: [embed],
            components: [
                this.client.util
                    .row()
                    .setComponents(
                        this.client.util.button().setCustomId("body").setEmoji("1010055851328946227").setLabel("Body").setStyle(1),
                        this.client.util.button().setCustomId("images").setEmoji("1010056682526736445").setLabel("Images").setStyle(1),
                        this.client.util.button().setCustomId("misc").setEmoji("1001043777596694558").setLabel("Misc").setStyle(1)
                    ),
                this.client.util
                    .row()
                    .setComponents(
                        this.client.util.button().setCustomId("save").setEmoji("1001064958450208788").setLabel("Save").setStyle(3),
                        this.client.util.button().setCustomId("cancel").setEmoji("1001064990079471679").setLabel("Cancel").setStyle(4)
                    ),
            ],
        });
    }

    async body(message, data, embedData, i, embed, slash = false) {
        const rows = [
            this.client.util.row().addComponents(
                this.client.util
                    .textInput()
                    .setCustomId("content")
                    .setLabel("Content")
                    .setStyle(2)
                    .setMaxLength(2048)
                    .setRequired(false)
                    .setValue(data.content || "")
            ),
            this.client.util.row().addComponents(
                this.client.util
                    .textInput()
                    .setCustomId("title")
                    .setLabel("Title")
                    .setStyle(1)
                    .setMaxLength(248)
                    .setRequired(false)
                    .setValue(embedData.title || "")
            ),
            this.client.util.row().addComponents(
                this.client.util
                    .textInput()
                    .setCustomId("color")
                    .setLabel("Color")
                    .setStyle(1)
                    .setRequired(false)
                    .setPlaceholder("#000000")
                    .setValue(embedData.color ? `#${embedData.color.toString(16)}` : "")
            ),
            this.client.util.row().addComponents(
                this.client.util
                    .textInput()
                    .setCustomId("description")
                    .setLabel("Description")
                    .setStyle(2)
                    .setMaxLength(2048)
                    .setRequired(false)
                    .setValue(embedData.description || "")
            ),
        ];
        const modal = this.client.util.model().setCustomId(`modal-${i.id}`).addComponents(rows).setTitle("Body");
        const modalSubmitInteraction = await this.client.util.addModel(i, modal);
        const contentData =
            modalSubmitInteraction.fields.getTextInputValue("content") == ""
                ? null
                : modalSubmitInteraction.fields.getTextInputValue("content");
        const dataContent = await this.client.util.replace(contentData, message);
        const titleData =
            modalSubmitInteraction.fields.getTextInputValue("title") == ""
                ? null
                : modalSubmitInteraction.fields.getTextInputValue("title");
        const dataTitle = await this.client.util.replace(titleData, message);
        let color = modalSubmitInteraction.fields.getTextInputValue("color");
        if (!color || color === "0") {
            color = "000000";
        } else if (color.includes("#")) {
            color = color.replace("#", "");
        }
        color = color.padStart(6, "0");
        const colorData = `#${color}`;
        const dataColor = await this.client.util.replace(colorData, message);
        const descriptionData =
            modalSubmitInteraction.fields.getTextInputValue("description") == ""
                ? null
                : modalSubmitInteraction.fields.getTextInputValue("description");
        const dataDescription = await this.client.util.replace(descriptionData, message);
        embed.setTitle(dataTitle);
        embed.setColor(dataColor);
        embed.setDescription(dataDescription);
        data.content = contentData;
        embedData.title = titleData;
        embedData.color = parseInt(dataColor.replace("#", ""), 16);
        embedData.description = descriptionData;
        this.msg?.edit({
            content: dataContent,
            embeds: [embed],
        });
        modalSubmitInteraction.deferUpdate().catch((e) => {
            return;
        });
        return embedData, embed;
    }
    async image(message, data, embedData, i, embed, slash = false) {
        const rows = [
            this.client.util.row().setComponents(
                this.client.util
                    .textInput()
                    .setCustomId("thumbnail")
                    .setLabel("Thumbnail")
                    .setStyle(1)
                    .setRequired(false)
                    .setPlaceholder("Top Right Of The Embed!")
                    .setValue(embedData.thumbnail ? (!embedData.thumbnail.url ? "" : embedData.thumbnail.url) : "")
            ),
            this.client.util.row().setComponents(
                this.client.util
                    .textInput()
                    .setCustomId("image")
                    .setLabel("Image")
                    .setStyle(1)
                    .setRequired(false)
                    .setPlaceholder("Bottom Of The Embed!")
                    .setValue(embedData.image ? (!embedData.image.url ? "" : embedData.image.url) : "")
            ),
        ];
        if (!embedData.thumbnail) {
            embedData.thumbnail = {};
        }
        if (!embedData.image) {
            embedData.image = {};
        }

        const modal = this.client.util.model().setCustomId(`modal-${i.id}`).addComponents(rows).setTitle("Images");
        const modalSubmitInteraction = await this.client.util.addModel(i, modal);

        const thumbnailData =
            modalSubmitInteraction.fields.getTextInputValue("thumbnail") === ""
                ? null
                : modalSubmitInteraction.fields.getTextInputValue("thumbnail");
        const dataThumbnail = await this.client.util.replaceIcon(thumbnailData, message);

        const imageData =
            modalSubmitInteraction.fields.getTextInputValue("image") === "" ? null : modalSubmitInteraction.fields.getTextInputValue("image");
        const dataImage = await this.client.util.replaceIcon(imageData, message);

        embed.setThumbnail(dataThumbnail);
        embed.setImage(dataImage);
        embedData.thumbnail.url = thumbnailData;
        embedData.image.url = imageData;

        await this.msg?.edit({
            embeds: [embed],
        });

        modalSubmitInteraction.deferUpdate().catch(() => { });
        return embedData, embed;
    }
    async misc(message, data, embedData, i, embed, slash = false) {
        const rows = [
            this.client.util.row().setComponents(
                this.client.util
                    .textInput()
                    .setCustomId("author")
                    .setLabel("Author")
                    .setStyle(1)
                    .setRequired(false)
                    .setPlaceholder("Author Name")
                    .setValue(embedData.author ? (!embedData.author.name ? "" : embedData.author.name) : "")
            ),
            this.client.util.row().setComponents(
                this.client.util
                    .textInput()
                    .setCustomId("authorIcon")
                    .setLabel("Author Icon")
                    .setStyle(1)
                    .setRequired(false)
                    .setPlaceholder("Author Icon")
                    .setValue(embedData.author ? (!embedData.author.icon_url ? "" : embedData.author.icon_url) : "")
            ),
            this.client.util.row().setComponents(
                this.client.util
                    .textInput()
                    .setCustomId("footer")
                    .setLabel("Footer Text")
                    .setStyle(1)
                    .setRequired(false)
                    .setPlaceholder("Footer Text")
                    .setValue(embedData.footer ? (!embedData.footer.text ? "" : embedData.footer.text) : "")
            ),
            this.client.util.row().setComponents(
                this.client.util
                    .textInput()
                    .setCustomId("footerIcon")
                    .setLabel("Footer Icon")
                    .setStyle(1)
                    .setRequired(false)
                    .setPlaceholder("Footer Icon")
                    .setValue(embedData.footer ? (!embedData.footer.icon_url ? "" : embedData.footer.icon_url) : "")
            ),
        ];
        if (!embedData.author) {
            embedData.author = {};
        }
        if (!embedData.footer) {
            embedData.footer = {};
        }
        const modal = this.client.util.model().setCustomId(`modal-${i.id}`).addComponents(rows).setTitle("Misc");
        const modalSubmitInteraction = await this.client.util.addModel(i, modal);

        const authorData =
            modalSubmitInteraction.fields.getTextInputValue("author") === "" ? null : modalSubmitInteraction.fields.getTextInputValue("author");
        const dataAuthor = await this.client.util.replace(authorData, message);

        const authorIconData =
            modalSubmitInteraction.fields.getTextInputValue("authorIcon") === ""
                ? null
                : modalSubmitInteraction.fields.getTextInputValue("authorIcon");
        const dataAuthorIcon = await this.client.util.replaceIcon(authorIconData, message);

        const footerData =
            modalSubmitInteraction.fields.getTextInputValue("footer") === "" ? null : modalSubmitInteraction.fields.getTextInputValue("footer");
        const dataFooter = await this.client.util.replace(footerData, message);

        const footerIconData =
            modalSubmitInteraction.fields.getTextInputValue("footerIcon") === ""
                ? null
                : modalSubmitInteraction.fields.getTextInputValue("footerIcon");
        const dataFooterIcon = await this.client.util.replaceIcon(footerIconData, message);

        embed.setAuthor({ name: dataAuthor, iconURL: dataAuthorIcon });
        embed.setFooter({ text: dataFooter, iconURL: dataFooterIcon });
        embedData.author.name = authorData;
        embedData.author.icon_url = authorIconData;
        embedData.footer.text = footerData;
        embedData.footer.icon_url = footerIconData;

        await this.msg.edit({
            embeds: [embed],
        });

        modalSubmitInteraction.deferUpdate().catch(() => { });
        return embedData, embed;
    }
    async editReply(message, data, slash = false) {
        if (slash) {
            await message?.edit(data);
        } else {
            await message?.edit(data);
        }
    }
}