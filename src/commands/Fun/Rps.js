const Command = require("../../abstract/command");

module.exports = class Rps extends Command {
    constructor(...args) {
        super(...args, {
            name: "rps",
            aliases: ["rps", "rockpaperscissors"],
            description: "Play rock paper scissors with the bot.",
            category: "Fun",
            usage: ["rps"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/4wMfxV1.png",
        });
    }

    async run({ message }) {
        const choices = ["rock", "paper", "scissors"];
        const choice = choices[Math.floor(Math.random() * choices.length)];
        const embed = this.client.util.embed()
            .setTitle("Rock Paper Scissors")
            .setDescription(`You think you can beat me?
            
Choose one of the following: \`rock\`, \`paper\`, \`scissors\``)
            .setColor(this.client.config.Client.PrimaryColor);

        message?.channel.send({ embeds: [embed], components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 1,
                        label: "Rock",
                        custom_id: "rock",
                        emoji: {
                            id: "1047524220994863214",
                            name: "rps_rock"
                        }
                    },
                    {
                        type: 2,
                        style: 1,
                        label: "Paper",
                        custom_id: "paper",
                        emoji: {
                            id: "1047524227093377104",
                            name: "Paper"
                        }
                    },
                    {
                        type: 2,
                        style: 1,
                        label: "Scissors",
                        custom_id: "scissors",
                        emoji: {
                            id: "1047524299080212490",
                            name: "rps_scissor"
                        }
                    }
                ]
            }
        ]}).then(async msg => {
            const filter = (i) => i.user.id === message?.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

            collector.on("collect", async i => {
                if (i.customId === choice) {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I also chose ${choice}! It's a tie!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "rock" && choice === "paper") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose paper! I win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "rock" && choice === "scissors") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose scissors! You win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "paper" && choice === "rock") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose rock! You win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "paper" && choice === "scissors") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose scissors! I win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "scissors" && choice === "rock") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose rock! I win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "scissors" && choice === "paper") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose paper! You win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                }

                collector.stop();
            });

            collector.once("end", async collected => {
                if (collected.size === 0) {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`You didn't choose anything!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    msg.edit({ embeds: [embed] });
                }
            });
        });
    }

    async exec({ interaction }) {
        const choices = ["rock", "paper", "scissors"];
        const choice = choices[Math.floor(Math.random() * choices.length)];
        const embed = this.client.util.embed()
            .setTitle("Rock Paper Scissors")
            .setDescription(`You think you can beat me?
            
Choose one of the following: \`rock\`, \`paper\`, \`scissors\``)
            .setColor(this.client.config.Client.PrimaryColor);

        interaction?.reply({ embeds: [embed], components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 1,
                        label: "Rock",
                        custom_id: "rock",
                        emoji: {
                            id: "1047524220994863214",
                            name: "rps_rock"
                        }
                    },
                    {
                        type: 2,
                        style: 1,
                        label: "Paper",
                        custom_id: "paper",
                        emoji: {
                            id: "1047524227093377104",
                            name: "Paper"
                        }
                    },
                    {
                        type: 2,
                        style: 1,
                        label: "Scissors",
                        custom_id: "scissors",
                        emoji: {
                            id: "1047524299080212490",
                            name: "rps_scissor"
                        }
                    }
                ]
            }
        ]}).then(async msg => {
            const filter = (i) => i.user.id === interaction?.user.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

            collector.on("collect", async i => {
                if (i.customId === choice) {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I also chose ${choice}! It's a tie!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "rock" && choice === "paper") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose paper! I win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "rock" && choice === "scissors") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose scissors! You win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "paper" && choice === "rock") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose rock! You win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "paper" && choice === "scissors") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose scissors! I win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "scissors" && choice === "rock") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose rock! I win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                } else if (i.customId === "scissors" && choice === "paper") {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`I chose paper! You win!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    i.update({ embeds: [embed] });
                }

                collector.stop();
            });

            collector.once("end", async collected => {
                if (collected.size === 0) {
                    const embed = this.client.util.embed()
                        .setTitle("Rock Paper Scissors")
                        .setDescription(`You didn't choose anything!`)
                        .setColor(this.client.config.Client.PrimaryColor);
                    msg.edit({ embeds: [embed] });
                }
            });
        });
    }
};
