const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "prefix",
            aliases: ["prefix", "setprefix"],
            description: "Set the prefix for the bot",
            usage: ["prefix <prefix>"],
            category: "Utilities",
            examples: ["Prefix"],
            userPerms: ["SendMessages", "ManageGuild"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
            cooldown: 5,
            image:"https://i.imgur.com/akMyNgP.png",
            options: [
                {
                    type: 3,
                    name: "prefix",
                    description: "Prefix to set",
                    required: true,
                },
            ],
        });
    }
    async run({ message, args }) {
        const data = await this.client.database.guildData.get(message?.guild.id);
        if (!args[0]) {
            return message?.reply(`The current prefix is \`${data.prefix}\``);
        }
        if (args[0].length > 5) {
            return message?.reply("Prefix can only be 5 characters long");
        }
        let newPrefix = args[0];
        data.prefix = newPrefix;
        this.client.database.guildData.putPrefix(message?.guild.id, data);
        return message?.reply(`Prefix has been set to \`${data.prefix}\``);
    }

    async exec({ interaction }) {
        const data = await this.client.database.guildData.get(
            interaction?.guild.id
        );
        if (!interaction?.options.getString("prefix")) {
            return interaction?.reply(
                `The current prefix is \`${data.prefix}\``
            );
        }
        if (interaction?.options.getString("prefix").length > 5) {
            return interaction?.reply("Prefix can only be 5 characters long");
        }
        let newPrefix = interaction?.options.getString("prefix");
        data.prefix = newPrefix;
        this.client.database.guildData.putPrefix(interaction?.guild.id, data);
        return interaction?.reply(`Prefix has been set to \`${data.prefix}\``);
    }
};
