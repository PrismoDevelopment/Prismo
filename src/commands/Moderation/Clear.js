const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "clear",
            aliases: ["purge"],
            description: "Clears number of messages in perticular channel",
            usage: ["clear (type) <amount>"],
            category: "Moderation",
            userPerms: ["ManageMessages"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "ManageMessages",
            ],
            cooldown: 5,
            image:"https://i.imgur.com/OkakjBY.png",
            options: [
                {
                    type: 3,
                    name: "type",
                    description: "Type Of Messages To Clear",
                    required: true,
                    choices: [
                        {
                            name: "All",
                            value: "all",
                        },
                        {
                            name: "Bots",
                            value: "bot",
                        },
                        {
                            name: "Users",
                            value: "user",
                        },
                        {
                            name: "Contains",
                            value: "contains",
                        },
                        {
                            name: "Emojis",
                            value: "emoji",
                        },
                    ],
                },
                {
                    type: 4,
                    name: "amount",
                    description: "Amount Of Messages To Clear",
                    required: true,
                },
                {
                    type: 3,
                    name: "contains",
                    description: "Text To Clear Messages With",
                    required: false,
                },
            ],
        });
    }
    async run({ message, args }) {
        const type = args[0].toLowerCase();
        const amount = parseInt(args[1]) || 100;
        if (!amount)
            return message?.reply({ content: "Please provide a valid amount." });
        if (amount > 100)
            return message?.reply({
                content: "You can only clear 100 messages at a time.",
            });
        if (amount < 1)
            return message?.reply({
                content: "You must clear at least 1 message?.",
            });
        if (type === "all" || type === "everything") {
            await message?.channel
                .bulkDelete(amount, true)
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Cleared ${amount} Messages.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message
                .reply({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (type === "bots" || type === "bot") {
            await message?.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const botMessages = messages.filter((m) => m.author.bot);
                    await message?.channel
                        .bulkDelete(botMessages, true)
                        .catch(() => { });
                })
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Cleared ${amount} Bot Messages.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message
                .reply({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (type === "user" || type === "users") {
            const user = await this.client.util.userQuery(args[0]);
            const member = await message?.guild.members.fetch(user);
            await message?.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const userMessages = messages.filter((m) => member.id);
                    await message?.channel
                        .bulkDelete(userMessages, true)
                        .catch(() => { });
                })
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Cleared ${amount} User Messages.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.channel
                .send({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (
            type === "contains" ||
            type === "contain" ||
            type === "includes" ||
            type === "include"
        ) {
            const contains = args[1];
            if (!contains)
                return message?.reply({
                    content: "Please provide a valid string to search for.",
                });
            await message?.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const containsMessages = messages.filter((m) =>
                        m.content.toLowerCase().includes(contains.toLowerCase())
                    );
                    await message?.channel
                        .bulkDelete(containsMessages, true)
                        .catch(() => { });
                })
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(
                    `Successfully Cleared ${amount} Messages Containing ${contains}.`
                )
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.channel
                .send({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (type === "emoji" || type === "emojis") {
            await message?.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const emojiMessages = messages.filter((m) =>
                        m.content.match(/<a?:\w{2,32}:\d{17,19}>/)
                    );
                    await message?.channel
                        .bulkDelete(emojiMessages, true)
                        .catch(() => { });
                })
                .catch(() => { })
                .then((m) => setTimeout(() => m.delete(), 10000));
            const embed = this.client.util
                .embed()
                .setDescription(
                    `Successfully Cleared ${amount} Messages Containing Emojis.`
                )
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.reply({ embeds: [embed] });
        }   else if (type === "link" || type === "links") {
            await message?.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const linkMessages = messages.filter((m) =>
                        m.content.match(
                            /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/
                        )
                    );
                    await message?.channel
                        .bulkDelete(linkMessages, true)
                        .catch(() => { });
                })
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(
                    `Successfully Cleared ${amount} Messages Containing Links.`
                )
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.reply({ embeds: [embed] });
        } else if (args[0].match(/<@!?(\d{17,19})>/)) {
            const user = await this.client.util.userQuery(args[0]);
            const member = await message?.guild.members.fetch(user);
            await message?.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const userMessages = messages.filter((m) => member.id.match(m.author.id));
                    await message?.channel
                        .bulkDelete(userMessages, true)
                        .catch(() => { });
                })
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Cleared ${amount} User Messages.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.channel
                .send({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
            } else if (args[0].match(/^\d+$/)) {
            const ammount = parseInt(args[0]) || 100;
            if (!ammount)
                return message?.reply({
                    content: "Please provide a valid amount.",
                });
            if (ammount > 100)
                return message?.reply({
                    content: "You can only clear 100 messages at a time.",
                });
            if (ammount < 1)
                return message?.reply({
                    content: "You must clear at least 1 message?.",
                });
            await message?.channel
                .bulkDelete(ammount, true)
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Cleared ${ammount} Messages.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return message?.channel
                .send({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
            }
    }

    async exec({ interaction }) {
        const type = interaction?.options.getString("type").toLowerCase();
        const amount = interaction?.options.getInteger("amount");
        if (!amount)
            return interaction?.reply({
                content: "Please provide a valid amount.",
                ephemeral: true,
            });
        if (amount > 100)
            return interaction?.reply({
                content: "You can only clear 100 messages at a time.",
                ephemeral: true,
            });
        if (amount < 1)
            return interaction?.reply({
                content: "You must clear at least 1 message?.",
                ephemeral: true,
            });
        if (type === "all" || type === "everything") {
            await interaction?.channel
                .bulkDelete(amount, true)
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Cleared ${amount} Messages.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction
                .reply({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (type === "bots" || type === "bot") {
            await interaction?.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const botMessages = messages.filter((m) => m.author.bot);
                    await interaction?.channel
                        .bulkDelete(botMessages, true)
                        .catch(() => { });
                })
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Cleared ${amount} Bot Messages.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction
                .reply({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (type === "user" || type === "users") {
            await interaction?.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const userMessages = messages.filter((m) => !m.author.bot);
                    await interaction?.channel
                        .bulkDelete(userMessages, true)
                        .catch(() => { });
                })
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Cleared ${amount} User Messages.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction
                .reply({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (
            type === "contains" ||
            type === "contain" ||
            type === "includes" ||
            type === "include"
        ) {
            const contains = interaction?.options.getString("contains");
            if (!contains)
                return interaction?.reply({
                    content: "Please provide a valid string to search for.",
                });
            await interaction?.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const containsMessages = messages.filter((m) =>
                        m.content.toLowerCase().includes(contains.toLowerCase())
                    );
                    await interaction?.channel
                        .bulkDelete(containsMessages, true)
                        .catch(() => { });
                })
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(
                    `Successfully Cleared ${amount} Messages Containing ${contains}.`
                )
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction
                .reply({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (type === "emoji" || type === "emojis") {
            await interaction?.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const emojiMessages = messages.filter((m) =>
                        m.content.match(/<a?:\w{2,32}:\d{17,19}>/)
                    );
                    await interaction?.channel
                        .bulkDelete(emojiMessages, true)
                        .catch(() => { });
                })
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(
                    `Successfully Cleared ${amount} Messages Containing Emojis.`
                )
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction?.reply({ embeds: [embed] });
        } else {
            if (!type)
                return interaction?.reply({
                    content: "Please provide a valid type.",
                    ephemeral: true,
                });
            if (amount > 100)
                return interaction?.reply({
                    content: "You can only clear 100 messages at a time.",
                    ephemeral: true,
                });
            if (amount < 1)
                return interaction?.reply({
                    content: "You must clear at least 1 message?.",
                    ephemeral: true,
                });
            await interaction?.channel
                .bulkDelete(amount, true)
                .catch(() => { });
            const embed = this.client.util
                .embed()
                .setDescription(`Successfully Cleared ${amount} Messages.`)
                .setColor(this.client.config.Client.PrimaryColor);
            return interaction?.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
