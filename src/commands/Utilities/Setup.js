const Command = require("../../abstract/command");

module.exports = class Setup extends Command {
    constructor(...args) {
        super(...args, {
            name: "setup",
            description: "Setup the bot",
            category: "Utilities",
            aliases: ["setup"],
            usage: "setup",
            cooldown: 5,
            image:"https://i.imgur.com/tRZAfq3.png",
            userPerms: ['ManageGuild'],
            botPerms: ['EmbedLinks', 'ViewChannel', 'SendMessages']
        });
    }

    async run({ message }) {
        let oscheck = this.client.util.checkOwner(message.author.id);
        if (!oscheck) {
            if (message.author.id != message.guild.ownerId) return message.reply({ content: "Only the server owner can use this command." });
        }
        await this.client.commandFunctions.SetupFunction.setup(message, false)
    }

    async exec({ interaction }) {
        let oscheck = this.client.util.checkOwner(interaction?.user.id);
        if (!oscheck) {
            if (interaction.user.id != interaction.guild.ownerId) return interaction.reply({ content: "Only the server owner can use this command.", ephemeral: true });
        }
        await interaction.reply({ content: 'Starting Setup...', ephemeral: true })
        await this.client.commandFunctions.SetupFunction.setup(interaction, true)
    }
}