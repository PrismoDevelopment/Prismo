const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "stickynick",
            aliases: ["snick", "stickynickname", "snickname"],
            description: "Sticks a permenant nickname to an user.",
            usage: ["<snick @user nickname>"],
            category: "Utilities",
            userPerms: ["ManageNicknames"],
            botPerms: [
                "ManageEmojisAndStickers",
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
            ],
            cooldown: 5,
            image: "https://imgur.com/CSk5Sn9",
            options: [
                {
                    type: 1,
                    name: "set",
                    description: "Sets a stickynick",
                    options: [
                        {
                            type: 6,
                            name: "user",
                            description: "User to Set Nickname",
                            required: true,
                        },
                        {
                            type: 3,
                            name: "nick",
                            description: "Nickname to set",
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: "remove",
                    description: "Remove a stickynick",
                    options: [
                        {
                            type: 6,
                            name: "user",
                            description: "User to remove stickynick",
                            required: true,
                        },
                    ],
                },
            ],
        });
    }

    async run({ message, args }) {
        try {
            if (!args[0])
                return message?.reply({
                    content: "You Must Choose: `set`, `remove`",
                    ephemeral: true,
                });
            if (args[0].toLowerCase() == "set" || args[0].toLowerCase() == "add") {
                args.shift();
                if (!args[1])
                    return message?.reply({ content: "Please provide a user." });
                const user =
                    message?.mentions.members.first() ||
                    message?.guild.members.cache.find(
                        (m) => m.user.username === args[1]
                    ) ||
                    message?.guild.members.cache.get(args[1]);
                if (!user)
                    return message?.reply({
                        content:
                            "Please mention a user or provide a valid user ID",
                    });
                const member = message?.guild.members.cache.get(user.id);
                if (!member)
                    return message?.reply({
                        content: "That user isn't in this guild!",
                    });
                if (
                    member.roles.highest.position >
                    message?.member.roles.highest.position
                )
                    return message?.reply({
                        content:
                            "You can't do that with a user with higher roles than you!",
                    });
                args.shift();
                if (args.length == 0)
                    return message?.reply({
                        content: "Please provide Nickname to set.",
                    });

                let nickName = args.join(" ");
                if (nickName.length > 32)
                    return message?.reply({
                        content: "Nickname cannot be more than 32 characters.",
                    });

                const data = await this.client.database.stickynickData.get(
                    user.id,
                    message?.guild.id
                );

                if (data)
                    message?.reply({
                        content:
                            "Sticky Nick already exists for this user in this guild. Remove it first!",
                    });
                if (!data)
                    await this.client.database.stickynickData.set(
                        user.id,
                        message?.guild.id,
                        nickName
                    );

                member.setNickname(nickName);

                let embed = this.client.util
                    .embed()
                    .setTitle("StickyNickname Added!")
                    .setColor("Aqua")
                    .setDescription(
                        `\`\`\`User: ${user.user.username}\nNickname : ${nickName}\`\`\``
                    );

                return message?.reply({ embeds: [embed] });
            }
            if (args[0].toLowerCase() == "remove") {
                const user =
                    message?.mentions.members.first() ||
                    message?.guild.members.cache.find(
                        (m) => m.user.username === args[1]
                    ) ||
                    message?.guild.members.cache.get(args[1]);
                if (!user)
                    return message?.reply({
                        content:
                            "Please mention a user or provide a valid user ID",
                    });
                const member = await message?.guild.members.fetch(user);
                if (!member)
                    return message?.reply({
                        content: "That user isn't in this guild!",
                    });

                const data = await this.client.database.stickynickData.remove(
                    member.id,
                    message?.guild.id
                );

                let embed = this.client.util
                    .embed()
                    .setTitle("StickyNickname Removed!")
                    .setColor("Red")
                    .setDescription(`\`\`\`User: ${user.user.username}\`\`\``);

                if (data) message?.reply({ embeds: [embed] });
                if (!data)
                    message?.reply({
                        content:
                            "Sticky Nick doesn't exist for this user in this guild.",
                    });
                if (data) member.setNickname(null);
                return;
            }
            if (!["reset", "set"].includes(args[0].toLowerCase()))
                return message?.reply({
                    content: "You Must Choose: `set`, `remove`",
                });
        } catch (e) {
            message?.reply({
                content: `An error occured: ${e.message}`,
                ephemeral: true,
            });
        }
    }
    async exec({ interaction }) {
        const args = interaction?.options.getSubcommand();
        if (args == "set") {
            const user = interaction?.options.getUser("user");
            const nick = interaction?.options.getString("nick");

            const data = await this.client.database.stickynickData.get(
                user.id,
                interaction?.guild.id
            );

            if (data)
                interaction?.reply({
                    content:
                        "Sticky Nick already exists for this user in this guild. Remove it first!",
                });
            if (!data)
                await this.client.database.stickynickData.set(
                    user.id,
                    interaction?.guild.id,
                    nick
                );

            await interaction?.guild.members.cache
                .get(user.id)
                .setNickname(nick);
            let embed = this.client.util
                .embed()
                .setTitle("StickyNickname Added!")
                .setColor("Aqua")
                .setDescription(
                    `\`\`\`User: ${user.username}\nNickname : ${nick}\`\`\``
                );

            await interaction?.reply({ embeds: [embed] });
        }
        if (args == "remove") {
            const user = interaction?.options.getUser("user");
            const data = await this.client.database.stickynickData.remove(
                user.id,
                interaction?.guild.id
            );

            let embed = this.client.util
                .embed()
                .setTitle("StickyNickname Removed!")
                .setColor("Red")
                .setDescription(`\`\`\`User: ${user.username}\`\`\``);

            if (data) interaction?.reply({ embeds: [embed] });
            if (!data)
                interaction?.reply({
                    content: "No stickynick found for this user!",
                });
        }
    }
};
