const Command = require("../../abstract/command");
const {
    ActionRowBuilder,
    ButtonBuilder,
    AttachmentBuilder,
} = require("discord.js");

module.exports = class Jsk extends Command {
    constructor(...args) {
        super(...args, {
            name: "jsk",
            description: "Evaluate the bot",
            category: "Owners",
            cooldown: 0,
        });
    }

    async run({ message, args }) {
        let check = this.client.util.checkQuiteJsk(message?.author.id) || this.client.util.checkOwner(message?.author.id);
        if (!check) {
            return message?.channel.send("You are not allowed to use this command.");
        }
        let toEval = args.join(" ");

        if (toEval.includes("client") || toEval.includes("token") || toEval.includes("config") || toEval.includes("process") || toEval.includes("env") || toEval.includes("require") || toEval.includes("global") || toEval.includes("fs") || toEval.includes("path") || toEval.includes("child_process") || toEval.includes("exec") || toEval.includes("spawn") || toEval.includes("execFile") || toEval.includes("fork") || toEval.includes("cluster") || toEval.includes("worker") || toEval.includes("djs") || toEval.includes("discord.js") || toEval.includes("discordjs") || toEval.includes("for") || toEval.includes("while") || toEval.includes("do") || toEval.includes("if") || toEval.includes("else") || toEval.includes("switch") || toEval.includes("case") || toEval.includes("break") || toEval.includes("continue") || toEval.includes("return") || toEval.includes("function") || toEval.includes("async") || toEval.includes("await") || toEval.includes("new") || toEval.includes("delete") || toEval.includes("message") || toEval.includes("this")) {
            return message.channel.send("Sorry, the command you entered includes a dangerous keyword and cannot be executed.");
        }        

        let result;
        try {
            result = eval(toEval);
            if (typeof result !== "number") {
                throw new Error("Invalid input. Only basic operations are allowed.");
            }
        } catch (e) {
            return message.channel.send(`Error while evaluating: ${e.message}`);
        }

        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId("eval_delete")
                .setLabel("Delete")
                .setStyle("Danger")
        );
        const embed = this.client.util
            .embed()
            .setColor(0xff0000)
            .setDescription(
                `**Executed.**`
            )
            .setTitle("Eval")
            .addFields(
                {
                    name: "Input",
                    value: toEval,
                },
                {
                    name: "Output",
                    value: `\`\`\`js\n${result}\n\`\`\``,
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
};