const Command = require("../../abstract/command");
/**Please create the image / update it in here */
module.exports = class support extends Command {
    constructor(...args) {
        super(...args, {
            name: "support",
            description: "Get support for the bot.",
            category: "Utilities",
            aliases: ["support"],
            usage: "support",
            cooldown: 5,
            image: "https://imgur.com/34I3wSk",
            userPerms: ['SendMessages', 'ViewChannel'],
            botPerms: ['EmbedLinks', 'ViewChannel', 'SendMessages'],
            vote: false,
        });
    }

    async run({ message, args }) {
        await message?.channel.send({ content: `Thanks for choosing Prismo! If you have any questions or need help, we're here for you.\n${this.client.config.Url.SupportURL}`});
    }

    async exec({ interaction }) {
        await interaction.reply({ content: `Thanks for choosing Prismo! If you have any questions or need help, we're here for you.\n${this.client.config.Url.SupportURL}`});
    }
}