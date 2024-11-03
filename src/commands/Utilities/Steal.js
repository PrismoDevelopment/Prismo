const Command = require("../../abstract/command");
const axios = require('axios')

module.exports = class steal extends Command {
    constructor(...args) {
        super(...args, {
            name: "steal",
            aliases: ["stealemojis", "stealemoji"],
            description: "Steal emojis and adds to the server.",
            usage: ["steal <emojis>"],
            category: "Utilities",
            userPerms: ["ManageEmojisAndStickers"],
            botPerms: [
                "ManageEmojisAndStickers",
                "ViewChannel",
                "SendMessages",
            ],
            options: [
                {
                    name: "emojis",
                    description: "The emojis to steal",
                    type: 3,
                    required: true,
                },
            ],
            cooldown: 5,
            image: "https://imgur.com/pxJPG2t",
        });
    }
    async run({ message, args }) {
        if (message?.stickers?.size != 0) {
            let sticker = message?.stickers?.first();
            let nunu = await message.guild.stickers.create({
                name: sticker.name,
                description: sticker.description ? sticker.description : "No description",
                tags: sticker.tags,
                file: sticker.url,
            }).catch((err) => { return message?.reply({ content: `An error occured while adding the sticker!` }); });
            await message?.reply({
                content: `Sticker **${sticker.name}** has been added to the server!`, stickers: [nunu],
            });
            return;
        } else if (message?.reference){
            let refmsg = message?.reference?.messageId;
            if (refmsg) {
                let ref = await message?.channel.messages.fetch(refmsg);
                if (ref?.stickers?.size != 0) {
                    let sticker = ref?.stickers?.first();
                    let nunu = await message.guild.stickers.create({
                        name: sticker.name,
                        description: sticker.description ? sticker.description : "No description",
                        tags: sticker.tags,
                        file: sticker.url,
                    }).catch((err) => { return message?.reply({ content: `An error occured while adding the sticker!` }); });
                    await message?.reply({
                        content: `Sticker **${sticker.name}** has been added to the server!`,
                        stickers: [nunu],
                    });
                    return;
                }
            }
        } else {
            if (!args[0]) { return message?.reply({ content: "Please provide the emojis/sticker to steal!" }); }
            // check if the user has provided a valid emoji using regex
            const emojiargs = args.join("");
            let animemojis = emojiargs.match(/[a][:]([A-Za-z0-9_~])+[:]\d{15,}/g);
            let normemojis = emojiargs.match(/[^a][:]([A-Za-z0-9_~])+[:]\d{15,}/g);
            if(!animemojis && !normemojis) { return message?.reply({ content: "Please provide a valid emoji/sticker!" }); }
            try {
                const emojiargs = args.join("");
                let animemojis = emojiargs.match(/[a][:]([A-Za-z0-9_~])+[:]\d{15,}/g);
                let normemojis = emojiargs.match(/[^a][:]([A-Za-z0-9_~])+[:]\d{15,}/g);
                let desc = "Emoji(s) : ";
                if (animemojis && normemojis) {
                    if (animemojis.length + normemojis.length > 15) {
                        return message?.reply({
                            content: `You can only add 15 emojis at a time!`,
                        });
                    }
                }

                if (animemojis) {
                    if (animemojis.length > 15) {
                        return message?.reply({
                            content: `You can only add 15 emojis at a time!`,
                        });
                    }
                    for (let aemoji in animemojis) {
                        const list = animemojis[aemoji].split(":");
                        const Url = `https://cdn.discordapp.com/emojis/${list[2]}.gif`;
                        const buffer = await axios.get(Url, { responseType: 'arraybuffer' });
                        const size = Buffer.byteLength(buffer.data);
                        if (size > 256000) {
                            return message?.reply({
                                content: `The file size of one or more of the emojis is too large! Please make sure that the file size of each emoji is less than or equal to 256 KB.`,
                            });
                        }
                        await message?.guild.emojis
                            .create({ attachment: Url, name: list[1] })
                            .then(
                                (emoji) => (desc += `<a:${emoji.name}:${emoji.id}> `)
                            );
                    }
                }

                if (normemojis) {
                    if (normemojis.length > 15) {
                        return message?.reply({
                            content: `You can only add 15 emojis at a time!`,
                        });
                    }
                    for (let emojis in normemojis) {
                        const list = normemojis[emojis].split(":");
                        const Url = `https://cdn.discordapp.com/emojis/${list[2]}.png`;
                        const buffer = await axios.get(Url, { responseType: 'arraybuffer' });
                        const size = Buffer.byteLength(buffer.data);
                        if (size > 256000) {
                            return message?.reply({
                                content: `The file size of one or more of the emojis is too large! Please make sure that the file size of each emoji is less than or equal to 256 KB.`,
                            });
                        }
                        await message?.guild.emojis
                            .create({ attachment: Url, name: list[1] })
                            .then((emoji) => (desc += `<:${emoji.name}:${emoji.id}> `));
                    }
                }

                const embed = this.client.util
                    .embed()
                    .setTitle("Successfully added emojis to server.")
                    .setColor(this.client.PrimaryColor)
                    .setDescription(desc);

                message?.reply({ embeds: [embed] });
            } catch (err) {
                message?.reply({
                    content: `An error occurred while adding the emojis. It is possible that the server's emoji slots are full or there is an issue with the provided emoji URLs.`,
                });
            }
        }
    }


    async exec({ interaction, args }) {
        if (!args) return interaction?.reply({ content: `No emojis provided!` });
        const emojiargs = args.join("");
        let animemojis = emojiargs.match(/[a][:]([A-Za-z0-9_~])+[:]\d{15,}/g);
        let normemojis = emojiargs.match(/[^a][:]([A-Za-z0-9_~])+[:]\d{15,}/g);
        let desc = "Emoji(s) : ";
        if (animemojis && normemojis) {
            if (animemojis.length + normemojis.length > 15) {
                return interaction?.reply({
                    content: `You can only add 15 emojis at a time!`,
                });
            }
        }

        if (animemojis) {
            if (animemojis.length > 15) {
                return interaction?.reply({
                    content: `You can only add 15 emojis at a time!`,
                });
            }
            for (let aemoji in animemojis) {
                const list = animemojis[aemoji].split(":");
                const Url = `https://cdn.discordapp.com/emojis/${list[2]}.gif`;
                const buffer = await axios.get(Url, { responseType: 'arraybuffer' });
                const size = Buffer.byteLength(buffer.data);
                if (size > 256000) {
                    return interaction?.reply({
                        content: `The file size of one or more of the emojis is too large! Please make sure that the file size of each emoji is less than or equal to 256 KB.`,
                    });
                }
                await interaction?.guild.emojis
                    .create({ attachment: Url, name: list[1] })
                    .then(
                        (emoji) => (desc += `<a:${emoji.name}:${emoji.id}> `)
                    );
            }
        }

        if (normemojis) {
            if (normemojis.length > 15) {
                return interaction?.reply({
                    content: `You can only add 15 emojis at a time!`,
                });
            }
            for (let emojis in normemojis) {
                const list = normemojis[emojis].split(":");
                const Url = `https://cdn.discordapp.com/emojis/${list[2]}.png`;
                const buffer = await axios.get(Url, { responseType: 'arraybuffer' });
                const size = Buffer.byteLength(buffer.data);
                if (size > 256000) {
                    return interaction?.reply({
                        content: `The file size of one or more of the emojis is too large! Please make sure that the file size of each emoji is less than or equal to 256 KB.`,
                    });
                }
                await interaction?.guild.emojis
                    .create({ attachment: Url, name: list[1] })
                    .then((emoji) => (desc += `<:${emoji.name}:${emoji.id}> `));
            }
        }

        const embed = this.client.util
            .embed()
            .setTitle("Successfully added emojis to server.")
            .setColor(this.client.util.color(interaction))
            .setDescription(desc);
            
        interaction?.reply({ embeds: [embed] });
    }
}       