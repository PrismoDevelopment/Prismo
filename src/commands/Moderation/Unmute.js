const Command = require("../../abstract/command");

module.exports = class help extends Command {
    constructor(...args) {
        super(...args, {
            name: "unmute",
            aliases: ["removemute", "removetimeout", "untimeout"],
            description: "Unmutes A User",
            usage: ["Unmute <user>"],
            category: "Moderation",
            userPerms: ["ModerateMembers"],
            botPerms: [
                "EmbedLinks",
                "ViewChannel",
                "SendMessages",
                "ModerateMembers",
            ],
            cooldown: 3,
            image:"https://i.imgur.com/bNVC35D.png",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "User To Unmute",
                    required: true,
                },
            ],
        });
    }
    async run({ message, args }) {
        const user = await this.client.util.userQuery(args[0]);
        if (!user)
            return message?.reply({ content: "I would appreciate it if you provided a valid user!" });
        const member = await message?.guild.members.fetch(user);
        if (!member)
            return message?.reply({ content: "I would appreciate it if you provided a valid user!" });
        if (!member.communicationDisabledUntil)
            return message?.reply({ content: "This user is not muted." });
        await member
            .edit({ communicationDisabledUntil: null })
            .catch(() => { });
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully Unmuted ${member.user.username}.`)
            .setColor(this.client.config.Client.PrimaryColor);
        return message?.reply({ embeds: [embed] });
    }

    async exec({ interaction }) {
        let user = interaction?.options.getUser("user");
        if (!user)
            return interaction?.reply({
                content: "I would appreciate it if you provided a valid user!",
                ephemeral: true,
            });
        let member = interaction?.guild.members.cache.get(user.id);
        if (!member)
            return interaction?.reply({
                content: "I would appreciate it if you provided a valid user!",
                ephemeral: true,
            });
        if (!member.communicationDisabledUntil)
            return interaction?.reply({
                content: "This user is not muted.",
                ephemeral: true,
            });
        await member
            .edit({ communicationDisabledUntil: null })
            .catch(() => { });
        const embed = this.client.util
            .embed()
            .setDescription(`Successfully Unmuted ${member.user.username}.`)
            .setColor(this.client.config.Client.PrimaryColor);
        return interaction?.reply({ embeds: [embed] });
    }
};
