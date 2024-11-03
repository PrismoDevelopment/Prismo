const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "embed",
            aliases: ["em", "preset"],
            description: "Create Embed can be used for announcment and welcome",
            usage: ["embed (Creates/Delete/Edit/Show embeds.)"],
            category: "Utilities",
            userPerms: [
                "SendMessages",
                "EmbedLinks",
                "ReadMessageHistory",
                "ManageMessages",
            ],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://i.imgur.com/YRh8F15.png",
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
                args[0],
                false
            );
        } catch (e) {
            message?.reply({
                content: e.message,
            });
        }
    }
    async exec({ interaction }) {
        try {
            this.client.commandFunctions.embedFunction.buildNormal(
                interaction,
                interaction?.options.getSubcommand(),
                true
            );
        } catch (e) {
            interaction?.reply({
                content: e.message,
                ephemeral: true,
            });
        }
    }
};
