const Command = require("../../abstract/command");
module.exports = class Reload extends Command {
    constructor(...args) {
        super(...args, {
            name: "reload",
            aliases: ["rl"],
            description: "Reload a command",
            category: "Owners",
            ownerOnly: true,
            cooldown: 0,
        });
    }
    async run({ message, args }) {
        try {
            this.client.Cluster.broadcastEval((c) => c.reloadAllCommand());
            message?.channel.send(`All Commands Are Reloaded`).catch((e) => {
                return;
            });
        } catch (error) {
            message?.channel.send({ content: `${error}` }).catch((e) => {
                return;
            });
        }
    }
};
