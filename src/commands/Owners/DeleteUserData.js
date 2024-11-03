const Command = require("../../abstract/command");
module.exports = class deleteUserData extends Command {
    constructor(...args) {
        super(...args, {
            name: "deleteuserdata",
            aliases: ["dud"],
            description: "Delete a User Data",
            category: "Owners",
            ownerOnly: true,
            cooldown: 0,
        });
    }
    async run({ message, args }) {
        const user = await this.client.util.userQuery(args[0]);
        if (!user) return message?.reply(`Please provide a user id`);
        const member = await this.client.users.fetch(user);
        if (!member) return message?.reply(`Invalid User`);
        const data = await this.client.database.welcomeUserData.get(member.id);
        if (!data) return message?.reply(`User data not found`);
        await this.client.database.welcomeUserData.deleteUserData(member.id);
        return message?.reply(`User data deleted`);
    }
};

        