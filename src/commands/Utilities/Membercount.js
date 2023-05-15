const Command = require("../../abstract/command");

module.exports = class Membercount extends Command {
    constructor(...args) {
        super(...args, {
            name: "membercount",
            aliases: ["mc"],
            description: "Shows the membercount of the server.",
            usage: ["mc"],
            category: "Utilities",
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["EmbedLinks", "ViewChannel", "SendMessages"],
        });
    }

    async run({ message }) {
        try {
            const guild = message.guild;
            const memberCount = guild.memberCount;
            const embed = this.client.util
                .embed()
                .setTitle("Membercount")
                .setColor(this.client.config.Client.PrimaryColor)
                .setDescription(`**${memberCount}** members`);
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
        }
    }

    async exec({ interaction }) {
        try {
            const guild = interaction.guild;
            const memberCount = guild.memberCount;
            const embed = this.client.util
                .embed()
                .setTitle("Membercount")
                .setColor(this.client.config.Client.PrimaryColor)
                .setDescription(`**${memberCount}** members`);
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
        }
    }
};
