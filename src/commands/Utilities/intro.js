const Command = require("../../abstract/command");
/**Please create the image / update it in here */
module.exports = class introduction extends Command {
    constructor(...args) {
        super(...args, {
            name: "introduction",
            description: "Get to know about the bot.",
            category: "Utilities",
            aliases: ["intro"],
            usage: "introduction",
            cooldown: 5,
            image: "https://imgur.com/34I3wSk",
            userPerms: ['SendMessages', 'ViewChannel'],
            botPerms: ['EmbedLinks', 'ViewChannel', 'SendMessages'],
            vote: false,
        });
    }

    async run({ message, args }) {
        await message?.channel.send({ content: `Hey bud! I'm Prismo, a bot, here to make your discord experience even better. Need help with commands? Type \`.help\` to see what I can do. `});
    }

    async exec({ interaction }) {
        await interaction.reply({ content: `Hey bud! I'm Prismo, a bot, here to make your discord experience even better. Need help with commands? Type \`.help\` to see what I can do. `});
    }
}