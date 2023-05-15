const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "embed",
            aliases: ["em", "preset"],
            description: "Creates/Delete/Edit/Show embeds.",
            usage: ["embed"],
            category: "Utilities",
            userPerms: [
                "SendMessages",
                "EmbedLinks",
                "ReadMessageHistory",
                "ManageMessages",
            ],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            options: [
                {
                    type: 1,
                    name: "create",
                    description: "Create An Embed Preset!",
                },
                {
                    type: 1,
                    name: "delete",
                    description: "Delete An Preset From List!",
                },
                {
                    type: 1,
                    name: "show",
                    description: "Shows The Embed Layout",
                },
                {
                    type: 1,
                    name: "edit",
                    description: "Edit The Embed Layout",
                },
            ],
        });
    }

    async run({ message, args }) {
        try {
            this.client.commandFunctions.embedFunction.buildNormal(
                message,
                args
            );
        } catch (e) {
            message.reply({
                content: e.message,
                ephemeral: true,
            });
        }
    }
    async exec({ interaction }) {
        try {
            this.client.commandFunctions.embedFunction.buildNormal(
                interaction,
                interaction.options.getSubcommand(),
                true
            );
        } catch (e) {
            interaction.reply({
                content: e.message,
                ephemeral: true,
            });
        }
    }
};
