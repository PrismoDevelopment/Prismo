const Command = require("../../abstract/command");
const {
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
} = require("discord.js");
module.exports = class Managepremium extends Command {
    constructor(...args) {
        super(...args, {
            name: "managepremium",
            aliases: ["mp"],
            description: "Manage premium",
            category: "Owners",
            cooldown: 0,
        });
    }
    async run({ message, args }) {
        const goahead =
            this.client.util.checkOwner(message?.author.id) ||
            (await this.client.util.checkXhotuOwner(message?.author.id));
        if (!goahead)
            return message?.channel.send(
                `You are not allowed to use this command!`
            );
        if (!args[0]) {
            return message?.reply(`Choose add,remove & list`);
        }
        if (args[0] == "add") {
            const user = await this.client.util.userQuery(args[1]);
            if (!user)
                return message?.reply({
                    content: "Please mention a user or provide a valid user ID",
                });
            const member = await this.client.users.fetch(user);
            if (!member) return message?.reply({ content: "Invalid User" });
            const data = await this.client.database.welcomeUserData.get(
                member.id
            );
            if (data.premium)
                return message?.reply({ content: "User already has premium" });
            let select = new StringSelectMenuBuilder()
                .setCustomId("premium")
                .setPlaceholder("Select Premium")
                .addOptions([
                    {
                        label: "1 Premium",
                        value: "1",
                        description: "1 Premium for 1 month",
                        emoji: "📅",
                    },
                    {
                        label: "2 Premium",
                        value: "2",
                        description: "2 Premium for 1 months",
                        emoji: "📅",
                    },
                    {
                        label: "3 Premium",
                        value: "3",
                        description: "3 Premium for 1 months",
                        emoji: "📅",
                    },
                    {
                        label: "4 Premium",
                        value: "4",
                        description: "4 Premium for 1 months",
                        emoji: "📅",
                    },
                    {
                        label: "5 Premium",
                        value: "5",
                        description: "5 Premium for 1 months",
                        emoji: "📅",
                    },
                    {
                        label: "6 Premium",
                        value: "6",
                        description: "6 Premium for 1 months",
                        emoji: "📅",
                    },
                    {
                        label: "7 Premium",
                        value: "7",
                        description: "7 Premium for 1 months",
                        emoji: "📅",
                    },
                    {
                        label: "8 Premium",
                        value: "8",
                        description: "8 Premium for 1 months",
                        emoji: "📅",
                    },
                    {
                        label: "9 Premium",
                        value: "9",
                        description: "9 Premium for 1 months",
                        emoji: "📅",
                    },
                    {
                        label: "10 Premium",
                        value: "10",
                        description: "10 Premium for 1 months",
                        emoji: "📅",
                    },
                    {
                        label: "11 Premium",
                        value: "11",
                        description: "11 Premium for 1 months",
                        emoji: "📅",
                    },
                    {
                        label: "12 Premium",
                        value: "12",
                        description: "12 Premium for 1 months",
                        emoji: "📅",
                    },
                ]);
            let row = new ActionRowBuilder().addComponents(select);
            const embed = new EmbedBuilder()
                .setTitle("Premium")
                .setDescription("Select Premium")
                .setColor(this.client.config.Client.PrimaryColor);
            message
                .reply({ embeds: [embed], components: [row] })
                .then(async (msg) => {
                    this.client.once(
                        "interactionCreate",
                        async (interaction) => {
                            if (interaction?.isSelectMenu()) {
                                if (interaction?.customId == "premium") {
                                    if (
                                        interaction?.user.id == message?.author.id
                                    ) {
                                        let value = interaction?.values[0];
                                        data.premium = true;
                                        data.premiumCount = value;
                                        await this.client.database.welcomeUserData.postAll(
                                            member.id,
                                            data
                                        );
                                        interaction?.deferUpdate();
                                        const embed = new EmbedBuilder()
                                            .setTitle("Premium")
                                            .setDescription(
                                                `Added ${value} Premium to ${member.username}`
                                            )
                                            .setColor(
                                                this.client.config.Client
                                                    .PrimaryColor
                                            );
                                        msg.edit({
                                            embeds: [embed],
                                            components: [],
                                        });
                                    }
                                }
                            }
                        }
                    );
                });
        } else if (args[0] == "remove") {
            const user = await this.client.util.userQuery(args[1]);
            if (!user)
                return message?.reply({
                    content: "Please mention a user or provide a valid user ID",
                });
            const member = await this.client.users.fetch(user);
            if (!member) return message?.reply({ content: "Invalid User" });
            const data = await this.client.database.welcomeUserData.get(
                member.id
            );
            if (!data.premium)
                return message?.reply({ content: "User does not have premium" });
            data.premium = false;
            data.premiumCount = 0;
            await this.client.database.welcomeUserData.postAll(member.id, data);
            message?.reply({ content: `Removed Premium from ${member.username}` });
        } else if (args[0] == "list") {
            const data = await this.client.database.welcomeUserData.getAll();
            let array = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].premium) {
                    const user = await this.client.users.fetch(data[i].id);
                    array.push(
                        `**${user.username}** - ${data[i].premiumCount} Premium`
                    );
                }
            }
            if (array.length == 0)
                return message?.reply({ content: "No Premium Users" });
            const embed = new EmbedBuilder()
                .setTitle("Premium Users")
                .setDescription(array.join("\n"))
                .setColor(this.client.config.Client.PrimaryColor);
            message?.reply({ embeds: [embed] });
        }
    }
};
