const Command = require("../../abstract/command");
module.exports = class PreseneRoles extends Command {
    constructor(...args) {
        super(...args, {
            name: "presenceroles",
            aliases: ["activityrole", "presencesrole", "activityroles"],
            description: "Gives role on basis of your activities",
            usage: ["preseneroles <enable/disable>"],
            category: "Utilities",
            userPerms: ["ManageRoles"],
            botPerms: ["ManageRoles"],
            cooldown: 5,
            image: "https://imgur.com/cVGofmj",
            vote: false,
            options: [
                {
                    type: 1,
                    name: "enable",
                    description: "Enables presence roles.",
                },
                {
                    type: 1,
                    name: "show",
                    description: "Shows your presence roles.",
                },
                {
                    type: 1,
                    name: "disable",
                    description: "Disables presence roles.",
                },
            ],
        });
    }

    async run({ message, args }) {
        await this.client.commandFunctions.PresenceFunction.presence(message, args);
    }

    async exec({ interaction, args }) {
        await interaction.reply({ content: "starting...", ephemeral: true });
        await this.client.commandFunctions.PresenceFunction.presence(interaction, args, true);
    }
}
