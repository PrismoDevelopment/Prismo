const Command = require("../../abstract/command");
const {
    ActionRowBuilder,
    ButtonBuilder,
} = require("discord.js");

module.exports = class Eval extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["ev", "prismo"],
            description: "Evaluate the bot",
            category: "Owners",
            ownerOnly: true,
            cooldown: 0,
        });
    }

    async run({ message, args }) {
        let toEval = args.join(" ");
        this.client.config.Client.Token = "Lund chusaga mera token le ke?";
        let result = new Promise((resolve, reject) => resolve(eval(toEval)));
        result
            .then(async (evaluated) => {
                if (typeof evaluated !== "string") {
                    evaluated = require("util").inspect(evaluated, {
                        depth: 0,
                    });
                }
                const row = new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setCustomId("eval_delete")
                        .setLabel("Delete")
                        .setStyle("Danger")
                );
                if (!toEval) {
                    const embed = this.client.util
                        .embed()
                        .setTitle("Eval")
                        .setColor(0xff0000)
                        .setDescription(`Error while evaluating: \`air\``)
                        .setTimestamp();
                    return message?.channel
                        .send({
                            embeds: [embed],
                            components: [row],
                        })
                        .catch((e) => {
                            return;
                        });
                } else {
                    if (toEval.toLowerCase() == "this.client.token") {
                        evaluated = `console.log("Lund chusaga mera token le ke?")`;
                    }
                    if (toEval.toLowerCase().includes([".token", ".config"])) {
                        evaluated = `console.log("Lund chusaga mera token le ke?")`;
                    }
                    let hrStart = process.hrtime();
                    let hrDiff;
                    hrDiff = process.hrtime(hrStart);
                    if (evaluated.length > 1024) {
                        let hehfilel = await this.client.util.largeMessage(
                            evaluated,
                            "js"
                        );
                        return message?.channel
                            .send({
                                content: null,
                                files: [hehfilel],
                                components: [row],
                            })
                            .catch((e) => {
                                return;
                            });
                    }
                    const embed = this.client.util
                        .embed()
                        .setColor(0xff0000)
                        .setDescription(
                            `**Executed in ${
                                hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""
                            }${hrDiff[1] / 1000000}ms.**`
                        )
                        .setTitle("Eval")
                        .addFields(
                            {
                                name: "Input",
                                value: toEval,
                            },
                            {
                                name: "Output",
                                value: `\`\`\`js\n${evaluated}\n\`\`\``,
                            }
                        )
                        .setTimestamp();
                    return message?.channel
                        .send({
                            embeds: [embed],
                            components: [row],
                        })
                        .catch((e) => {
                            return;
                        });
                }
            })
            .catch(async (e) => {
                const row = new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setCustomId("eval_delete")
                        .setLabel("Delete")
                        .setStyle("Danger")
                );
                return message?.channel
                    .send({
                        content: `Error while evaluating: \`${e.message}\``,
                        components: [row],
                    })
                    .catch((e) => {
                        return;
                    });
            });
    }
};
