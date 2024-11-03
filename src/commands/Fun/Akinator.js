const Command = require("../../abstract/command");
const akinator = require("discord.js-akinator");

module.exports = class Akinator extends Command {
    constructor(...args) {
        super(...args, {
            name: "akinator",
            aliases: ["akinator"],
            description: "I will guess the character you are thinking of.",
            category: "Fun",
            usage: ["akinator"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages", "EmbedLinks"],
            cooldown: 5,
            options: [
                {
                    type: 1,
                    name: "type",
                    description: "What I need to guess.",
                    options: [
                        {
                            type: 3,
                            name: "option",
                            description: "What I need to guess.",
                            choices: [
                                {
                                    name: "character",
                                    value: "character"
                                },
                                {
                                    name: "animal",
                                    value: "animal"
                                },
                                {
                                    name: "object",
                                    value: "object"
                                }
                            ],
                            required: true
                        }
                    ],
                }
            ],
        });
    }

    async run({ message }) {
        const language = "en"; //The language of the game. Defaults to "en".
        let gameType;
        const useButtons = true; //Whether to use Discord's buttons instead of message input for answering questions. Defaults to "true".
        const embedColor = this.client.PrimaryColor; //The color of the embeds. Defaults to "#2b2d31".
        const msg = await message?.reply({
            content: "Please select an option what I need to guess.", components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Character",
                            style: 2,
                            custom_id: "character",
                        },
                        {
                            type: 2,
                            label: "Animal",
                            style: 2,
                            custom_id: "animal",
                        },
                        {
                            type: 2,
                            label: "Object",
                            style: 2,
                            custom_id: "object",
                        }
                    ]
                }
            ]
        });
        const filter = (interaction) => interaction.user.id === message?.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
        collector.on("collect", async (interaction) => {
            if (interaction.customId === "character") {
                gameType = "character";
                await interaction.update({ content: "Alright, now think of a character and I will try to guess it.", components: [] });
                collector.stop();
            } else if (interaction.customId === "animal") {
                gameType = "animal";
                await interaction.update({ content: "Alright, now think of an animal and I will try to guess it.", components: [] });
                collector.stop();
            } else if (interaction.customId === "object") {
                gameType = "object";
                await interaction.update({ content: "Alright, now think of an object and I will try to guess it.", components: [] });
                collector.stop();
            }
        });
        collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                return message?.reply("You didn't select an option in time.");
            }
            akinator(message, {
                language,
                gameType,
                useButtons,
                embedColor,
            })
        });
    }

    async exec({ interaction }) {
        const language = "en"; //The language of the game. Defaults to "en".
        let gameType;
        const useButtons = true; //Whether to use Discord's buttons instead of message input for answering questions. Defaults to "true".
        const embedColor = this.client.PrimaryColor; //The color of the embeds. Defaults to "#2b2d31".
        if (interaction.options.get("type").value === "character") {
            gameType = "character";
            await interaction.reply({ content: "Alright, now think of a character and I will try to guess it.", ephemeral: true });
        } else if (interaction.options.get("type").value === "animal") {
            gameType = "animal";
            await interaction.reply({ content: "Alright, now think of an animal and I will try to guess it.", ephemeral: true });
        } else if (interaction.options.get("type").value === "object") {
            gameType = "object";
            await interaction.reply({ content: "Alright, now think of an object and I will try to guess it.", ephemeral: true });
        }
        akinator(interaction, {
            language,
            gameType,
            useButtons,
            embedColor,
        })
    }
};