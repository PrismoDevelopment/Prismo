const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "variables",
            aliases: ["welcomevariables", "variables"],
            description: "To get information about all variables.",
            usage: ["variable"],
            category: "Utilities",
            examples: ["variables"],
            userPerms: ["SendMessages"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image: "https://imgur.com/TUbZ3Tk",
        });
    }

    async run({ message }) {
        const embed = this.client.util
            .embed()
            .setTitle("Variables")
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(
                `Variables are used to make your welcome messages more dynamic. You can use these variables in your welcome message to make it more dynamic. For example, if you want to mention the user who joined the server, you can use \`$user_mention\` in your welcome message?. This will mention the user who joined the server. You can use these variables in your welcome message, goodbye message, and autorole message?.`
            )
            .addFields({
                name: "Variables",
                value: `\`$user_mention\` - Mentions the user.
\`$user_tag\` - The user's tag.
\`$user_username\` - The user's name.
\`$user_id\` - The user's id.
\`$user_iconurl\` - The user's avatar.
\`$user_createdtimestamp\` - The user's account creation date.
\`$guild_name\` - The server's name.
\`$guild_id\` - The server's id.
\`$guild_iconurl\` - The server's icon.
\`$guild_membercount\` - The server's member count.`,
            });

        message?.reply({ embeds: [embed] });
    }

    async exec({ interaction }) {
        const embed = this.client.util
            .embed()
            .setTitle("Variables")
            .setColor(this.client.config.Client.PrimaryColor)
            .setDescription(
                `Variables are used to make your welcome messages more dynamic. You can use these variables in your welcome message to make it more dynamic. For example, if you want to mention the user who joined the server, you can use \`$user_mention\` in your welcome message?. This will mention the user who joined the server. You can use these variables in your welcome message, goodbye message, and autorole message?.`
            )
            .addFields({
                name: "Variables",
                value: `\`$user_mention\` - Mentions the user.
\`$user_tag\` - The user's tag.
\`$user_username\` - The user's name.
\`$user_id\` - The user's id.
\`$user_iconurl\` - The user's avatar.
\`$user_createdtimestamp\` - The user's account creation date.
\`$guild_name\` - The server's name.
\`$guild_id\` - The server's id.
\`$guild_iconurl\` - The server's icon.
\`$guild_membercount\` - The server's member count.`,
            });

        interaction?.reply({ embeds: [embed] });
    }
};
