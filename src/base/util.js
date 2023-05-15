const {EmbedBuilder} = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js");

module.exports = class Util {
    /**
     *
     * @param {import('./PrismoClient')} client
     */
    embed() {
        return new EmbedBuilder()
    }
    constructor(client) {
        this.client = client;
    }
    parseEmoji(emoji) {
        if (!emoji) return null;
        if (emoji instanceof Array) return emoji.map((x) => Util.parseEmoji(x));
        if (emoji instanceof Object)
            return emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;
        if (typeof emoji === "string") {
            if (emoji.includes("%")) emoji = decodeURIComponent(emoji);
            if (emoji.includes(":")) {
                const parsedEmoji = Util.parseEmoji(emoji.split(":"));
                if (parsedEmoji instanceof Array)
                    return parsedEmoji.map((x) => Util.parseEmoji(x));
                return parsedEmoji;
            } else {
                const customEmoji = Util.parseEmoji(
                    emoji.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)
                );
                if (customEmoji) return customEmoji;
                return emoji;
            }
        }
        return null;
    }

    hextodecimal(hex) {
        if (hex.startsWith("#")) hex = hex.slice(1);
        if (hex.length === 3)
            hex = hex
                .split("")
                .map((hex) => hex + hex)
                .join("");
        if (hex.length !== 6) throw new TypeError("Invalid hex code.");
        const num = parseInt(hex, 16);
        return [num >> 16, (num >> 8) & 255, num & 255];
    }
    gettime() {
        try {
            let currentdate = new Date();
            let datetime =
                currentdate.getDate() +
                "/" +
                (currentdate.getMonth() + 1) +
                "/" +
                currentdate.getFullYear() +
                " @ " +
                currentdate.getHours() +
                ":" +
                currentdate.getMinutes() +
                ":" +
                currentdate.getSeconds() +
                " UTC";
            return datetime;
        } catch (e) {
            console.error(e);
        }
    }
    emojify(content) {
        {
            content = content.toLowerCase().split('');

            content = content.map(letter => {
                if (/[a-z]/g.test(letter)) return `:regional_indicator_${letter}:`;
                else if (this.chars[letter]) return this.chars[letter];
                else return letter;
            })

            return content.join('');
        }
    }
    chars = {
        '0': ':zero:', '1': ':one:', '2': ':two:', '3': ':three:', '4': ':four:', '5': ':five:', '6': ':six:', '7': ':seven:', '8': ':eight:',
        '9': ':nine:', '#': ':hash:', '*': ':asterisk:', '?': ':grey_question:', '!': ':grey_exclamation:', '+': ':heavy_plus_sign:', '-': ':heavy_minus_sign:',
        '×': ':heavy_multiplication_x:', '*': ':asterisk:', '$': ':heavy_dollar_sign:', '/': ':heavy_division_sign:', ' ': '   '
    }
    timestampconvert(timestamp) {
        timestamp = timestamp / 1000;
        return timestamp;
    }
    async requestget(url) {
        let options = {
            method: 'GET',
            headers: { Accept: '*/*' }
        };
        const response = await fetch(url, options);
        const json = await response.json();
        return json;
    }
    formatDate(date) {
        return new Intl.DateTimeFormat("en-US").format(date);
    }
    formatTime(date) {
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).format(date);
    }
    formatDateTime(date) {
        return `${this.formatDate(date)} ${this.formatTime(date)}`;
    }
    dateToTimestamp(date) {
        return new Date(date).getTime();
    }

    async replacerString(objectValue, message) {
        if (objectValue.author != null) {
            if (objectValue.author.name != null) {
                objectValue.author.name = objectValue.author.name.replace(
                    /\$user_mention/g,
                    `<@${message.member.id}>`
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$user_username/g,
                    message.member.user.username
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$user_tag/g,
                    message.member.user.tag
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$user_id/g,
                    message.member.user.id
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$user_createdtimestamp/g,
                    `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$guild_name/g,
                    message.guild.name
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$guild_id/g,
                    message.guild.id
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$guild_membercount/g,
                    message.guild.memberCount
                );
            }
            if (objectValue.author.icon_url != null) {
                objectValue.author.icon_url =
                    objectValue.author.icon_url.replace(
                        /\$user_iconurl/g,
                        message.member.user.displayAvatarURL({ dynamic: true })
                    );
                objectValue.author.icon_url =
                    objectValue.author.icon_url.replace(
                        /\$guild_iconurl/g,
                        message.guild.iconURL({ dynamic: true })
                    );
            }
        }
        if (objectValue.description != null) {
            objectValue.description = objectValue.description.replace(
                /\$user_mention/g,
                `<@${message.member.id}>`
            );
            objectValue.description = objectValue.description.replace(
                /\$user_username/g,
                message.member.user.username
            );
            objectValue.description = objectValue.description.replace(
                /\$user_tag/g,
                message.member.user.tag
            );
            objectValue.description = objectValue.description.replace(
                /\$user_id/g,
                message.member.user.id
            );
            objectValue.description = objectValue.description.replace(
                /\$user_createdtimestamp/g,
                `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
            );
            objectValue.description = objectValue.description.replace(
                /\$user_iconurl/g,
                message.member.user.displayAvatarURL({ dynamic: true })
            );
            objectValue.description = objectValue.description.replace(
                /\$guild_name/g,
                message.guild.name
            );
            objectValue.description = objectValue.description.replace(
                /\$guild_id/g,
                message.guild.id
            );
            objectValue.description = objectValue.description.replace(
                /\$guild_iconurl/g,
                message.guild.iconURL({ dynamic: true })
            );
            objectValue.description = objectValue.description.replace(
                /\$guild_membercount/g,
                message.guild.memberCount
            );
        }
        if (objectValue.footer != null) {
            if (objectValue.footer.text != null) {
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$user_mention/g,
                    `<@${message.member.id}>`
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$user_username/g,
                    message.member.user.username
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$user_tag/g,
                    message.member.user.tag
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$user_id/g,
                    message.member.user.id
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$user_createdtimestamp/g,
                    `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$guild_name/g,
                    message.guild.name
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$guild_id/g,
                    message.guild.id
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$guild_membercount/g,
                    message.guild.memberCount
                );
            }
            if (objectValue.footer.icon_url != null) {
                objectValue.footer.icon_url =
                    objectValue.footer.icon_url.replace(
                        /\$user_iconurl/g,
                        message.member.user.displayAvatarURL({ dynamic: true })
                    );
                objectValue.footer.icon_url =
                    objectValue.footer.icon_url.replace(
                        /\$guild_iconurl/g,
                        message.guild.iconURL({ dynamic: true })
                    );
            }
        }
        if (objectValue.title != null) {
            objectValue.title = objectValue.title.replace(
                /\$user_mention/g,
                `<@${message.member.id}>`
            );
            objectValue.title = objectValue.title.replace(
                /\$user_username/g,
                message.member.user.username
            );
            objectValue.title = objectValue.title.replace(
                /\$user_tag/g,
                message.member.user.tag
            );
            objectValue.title = objectValue.title.replace(
                /\$user_id/g,
                message.member.user.id
            );
            objectValue.title = objectValue.title.replace(
                /\$user_createdtimestamp/g,
                `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
            );
            objectValue.title = objectValue.title.replace(
                /\$guild_name/g,
                message.guild.name
            );
            objectValue.title = objectValue.title.replace(
                /\$guild_id/g,
                message.guild.id
            );
            objectValue.title = objectValue.title.replace(
                /\$guild_membercount/g,
                message.guild.memberCount
            );
        }
        if (objectValue.image != null && objectValue.image.url != null) {
            objectValue.image.url = objectValue.image.url.replace(
                /\$user_iconurl/g,
                message.member.user.displayAvatarURL({ dynamic: true })
            );
            objectValue.image.url = objectValue.image.url.replace(
                /\$guild_iconurl/g,
                message.guild.iconURL({ dynamic: true })
            );
        }
        if (
            objectValue.thumbnail != null &&
            objectValue.thumbnail.url != null
        ) {
            objectValue.thumbnail.url = objectValue.thumbnail.url.replace(
                /\$user_iconurl/g,
                message.member.user.displayAvatarURL({ dynamic: true })
            );
            objectValue.thumbnail.url = objectValue.thumbnail.url.replace(
                /\$guild_iconurl/g,
                message.guild.iconURL({ dynamic: true })
            );
        }
        return objectValue;
    }
    async replacerOriginal(objectValue, member) {
        if (objectValue.author != null) {
            if (objectValue.author.name != null) {
                objectValue.author.name = objectValue.author.name.replace(
                    /\$user_mention/g,
                    `<@${member.id}>`
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$user_username/g,
                    member.user.username
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$user_tag/g,
                    member.user.tag
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$user_id/g,
                    member.user.id
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$user_createdtimestamp/g,
                    member.user.createdTimestamp
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$guild_name/g,
                    member.guild.name
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$guild_id/g,
                    member.guild.id
                );
                objectValue.author.name = objectValue.author.name.replace(
                    /\$guild_membercount/g,
                    member.guild.memberCount
                );
            }
            if (objectValue.author.icon_url != null) {
                objectValue.author.icon_url =
                    objectValue.author.icon_url.replace(
                        /\$user_iconurl/g,
                        member.user.displayAvatarURL({ dynamic: true })
                    );
                objectValue.author.icon_url =
                    objectValue.author.icon_url.replace(
                        /\$guild_iconurl/g,
                        member.guild.iconURL({ dynamic: true })
                    );
            }
        }
        if (objectValue.description != null) {
            objectValue.description = objectValue.description.replace(
                /\$user_mention/g,
                `<@${member.id}>`
            );
            objectValue.description = objectValue.description.replace(
                /\$user_username/g,
                member.user.username
            );
            objectValue.description = objectValue.description.replace(
                /\$user_tag/g,
                member.user.tag
            );
            objectValue.description = objectValue.description.replace(
                /\$user_id/g,
                member.user.id
            );
            objectValue.description = objectValue.description.replace(
                /\$user_createdtimestamp/g,
                member.user.createdTimestamp
            );
            objectValue.description = objectValue.description.replace(
                /\$user_iconurl/g,
                member.user.displayAvatarURL({ dynamic: true })
            );
            objectValue.description = objectValue.description.replace(
                /\$guild_name/g,
                member.guild.name
            );
            objectValue.description = objectValue.description.replace(
                /\$guild_id/g,
                member.guild.id
            );
            objectValue.description = objectValue.description.replace(
                /\$guild_iconurl/g,
                member.guild.iconURL({ dynamic: true })
            );
            objectValue.description = objectValue.description.replace(
                /\$guild_membercount/g,
                member.guild.memberCount
            );
        }
        if (objectValue.footer != null) {
            if (objectValue.footer.text != null) {
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$user_mention/g,
                    `<@${member.id}>`
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$user_username/g,
                    member.user.username
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$user_tag/g,
                    member.user.tag
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$user_id/g,
                    member.user.id
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$user_createdtimestamp/g,
                    member.user.createdTimestamp
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$guild_name/g,
                    member.guild.name
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$guild_id/g,
                    member.guild.id
                );
                objectValue.footer.text = objectValue.footer.text.replace(
                    /\$guild_membercount/g,
                    member.guild.memberCount
                );
            }
            if (objectValue.footer.icon_url != null) {
                objectValue.footer.icon_url =
                    objectValue.footer.icon_url.replace(
                        /\$user_iconurl/g,
                        member.user.displayAvatarURL({ dynamic: true })
                    );
                objectValue.footer.icon_url =
                    objectValue.footer.icon_url.replace(
                        /\$guild_iconurl/g,
                        member.guild.iconURL({ dynamic: true })
                    );
            }
        }
        if (objectValue.title != null) {
            objectValue.title = objectValue.title.replace(
                /\$user_mention/g,
                `<@${member.id}>`
            );
            objectValue.title = objectValue.title.replace(
                /\$user_username/g,
                member.user.username
            );
            objectValue.title = objectValue.title.replace(
                /\$user_tag/g,
                member.user.tag
            );
            objectValue.title = objectValue.title.replace(
                /\$user_id/g,
                member.user.id
            );
            objectValue.title = objectValue.title.replace(
                /\$user_createdtimestamp/g,
                member.user.createdTimestamp
            );
            objectValue.title = objectValue.title.replace(
                /\$guild_name/g,
                member.guild.name
            );
            objectValue.title = objectValue.title.replace(
                /\$guild_id/g,
                member.guild.id
            );
            objectValue.title = objectValue.title.replace(
                /\$guild_membercount/g,
                member.guild.memberCount
            );
        }
        if (objectValue.image != null && objectValue.image.url != null) {
            objectValue.image.url = objectValue.image.url.replace(
                /\$user_iconurl/g,
                member.user.displayAvatarURL({ dynamic: true })
            );
            objectValue.image.url = objectValue.image.url.replace(
                /\$guild_iconurl/g,
                member.guild.iconURL({ dynamic: true })
            );
        }
        if (
            objectValue.thumbnail != null &&
            objectValue.thumbnail.url != null
        ) {
            objectValue.thumbnail.url = objectValue.thumbnail.url.replace(
                /\$user_iconurl/g,
                member.user.displayAvatarURL({ dynamic: true })
            );
            objectValue.thumbnail.url = objectValue.thumbnail.url.replace(
                /\$guild_iconurl/g,
                member.guild.iconURL({ dynamic: true })
            );
        }
        return objectValue;
    }
    async replace(string, message) {
        try {
            if (string == null) return string;
            string = string.replace(
                /\$user_mention/g,
                `<@${message.member.id}>`
            );
            string = string.replace(
                /\$user_username/g,
                message.member.user.username
            );
            string = string.replace(/\$user_tag/g, message.member.user.tag);
            string = string.replace(/\$user_id/g, message.member.user.id);
            string = string.replace(
                /\$user_createdtimestamp/g,
                `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
            );
            string = string.replace(
                /\$user_iconurl/g,
                message.member.user.displayAvatarURL({ dynamic: true })
            );
            string = string.replace(/\$guild_name/g, message.guild.name);
            string = string.replace(/\$guild_id/g, message.guild.id);
            string = string.replace(
                /\$guild_iconurl/g,
                message.guild.iconURL({ dynamic: true })
            );
            string = string.replace(
                /\$guild_membercount/g,
                message.guild.memberCount
            );
            return string;
        } catch (e) {
            return string;
        }
    }
    async replaceOriginal(string, member) {
        try {
            if (string == null) return string;
            string = string.replace(/\$user_mention/g, `<@${member.id}>`);
            string = string.replace(/\$user_username/g, member.user.username);
            string = string.replace(/\$user_tag/g, member.user.tag);
            string = string.replace(/\$user_id/g, member.user.id);
            string = string.replace(
                /\$user_createdtimestamp/g,
                member.user.createdTimestamp
            );
            string = string.replace(
                /\$user_iconurl/g,
                member.user.displayAvatarURL({ dynamic: true })
            );
            string = string.replace(/\$guild_name/g, member.guild.name);
            string = string.replace(/\$guild_id/g, member.guild.id);
            string = string.replace(
                /\$guild_iconurl/g,
                member.guild.iconURL({ dynamic: true })
            );
            string = string.replace(
                /\$guild_membercount/g,
                member.guild.memberCount
            );
            return string;
        } catch (e) {
            return string;
        }
    }
    async replaceNoIcon(string, message) {
        if (string == null) return string;
        string = string.replace(/\$user_mention/g, `<@${message.member.id}>`);
        string = string.replace(
            /\$user_username/g,
            message.member.user.username
        );
        string = string.replace(/\$user_tag/g, message.member.user.tag);
        string = string.replace(/\$user_id/g, message.member.user.id);
        string = string.replace(
            /\$user_createdtimestamp/g,
            `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
        );
        string = string.replace(/\$guild_name/g, message.guild.name);
        string = string.replace(/\$guild_id/g, message.guild.id);
        string = string.replace(
            /\$guild_membercount/g,
            message.guild.memberCount
        );
        return string;
    }
    async replaceIcon(string, message) {
        if (string == null) return string;
        string = string.replace(
            /\$user_iconurl/g,
            message.member.user.displayAvatarURL({ dynamic: true })
        );
        string = string.replace(
            /\$guild_iconurl/g,
            message.guild.iconURL({ dynamic: true })
        );
        return string;
    }
    checkOwner(target) {
        return this.client.config.Client.Owners.includes(target);
    }
    millisToDuration(ms) {
        try {
            const ok = prettyMilliseconds(ms, {
                colonNotation: true,
                secondsDecimalDigits: 0,
            });
            return ok;
        } catch (e) {
            return;
        }
    }
    formatPerms(perm) {
        return perm
            .toLowerCase()
            .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
            .replace(/_/g, " ")
            .replace(/Guild/g, "Server")
            .replace(/Use Vad/g, "Use Voice Acitvity")
            .replace(/Manageemojisandstickers/g, "Manage Emojis And Stickers")
            .replace(/Use Application Commands/g, "Use Slash Commands")
            .replace(/Use Public Threads/g, "Use Public Thread")
            .replace(/Use Private Threads/g, "Use Private Thread")
            .replace(/Use External Stickers/g, "Use External Sticker");
    }
    formatArray(array, type = "conjunction") {
        return new Intl.ListFormat("en-GB", {
            style: "short",
            type: type,
        }).format(array);
    }

    /*
    Embed Area.......
    */
    async errorDelete(message, description) {
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(description)
            .setTimestamp()
            .setColor(this.client.config.Client.ErrorColor);
        return await message.reply({ embeds: [embed] }).then((c) => {
            setTimeout(() => {
                c.delete();
            }, 5000);
        });
    }
    async getGlobalUser(id) {
        this.client.users
            .fetch(id)
            .then((user) => {
                return user;
            })
            .catch((e) => {
                return null;
            });
    }
    async getGuildUser(id, guild) {
        guild.members
            .fetch(id)
            .then((user) => {
                return user;
            })
            .catch((e) => {
                return null;
            });
    }
    async doDeletesend(message, description) {
        const embed = new EmbedBuilder()
            .setTitle("Success")
            .setDescription(description)
            .setTimestamp()
            .setColor(this.client.config.Client.PrimaryColor);
        return await message.reply({ embeds: [embed] }).then((c) => {
            setTimeout(() => {
                c.delete();
            }, 11000);
        });
    }
    async imagine(text) {
            return "https://cdn.discordapp.com/attachments/1055744259883532339/1107730915968430231/rickroll-roll.gif"
    }

    async errorButtonEmbed(message, description, perm) {
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(description)
            .setTimestamp()
            .setColor(this.client.config.Client.ErrorColor);
        return await message.reply({
            embeds: [embed],
            components: [
                this.row().setComponents(
                    this.button()
                        .setStyle(5)
                        .setLabel("Link")
                        .setURL(
                            `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=${perm}&scope=bot%20applications.commands`
                        )
                ),
            ],
        });
    }
};
