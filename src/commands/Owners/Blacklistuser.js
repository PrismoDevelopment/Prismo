const Command = require("../../abstract/command");
module.exports = class Blacklistuser extends Command {
    constructor(...args) {
        super(...args, {
            name: "blacklistuser",
            description: "Blacklist a User",
            category: "Owners",
            ownerOnly: true,
            cooldown: 0,
        });
    }
    async run({ message, args }) {
        if(!args[0]) return message?.reply(`Choose add or remove`)
        const user = await this.client.util.userQuery(args[1]);
        if(!user) return message?.reply(`User not found`)
        let userdata = await this.client.database.welcomeUserData.get(user);
        if(args[0] == "add") {
            if(userdata.blacklist) return message?.reply(`User already blacklisted`)
            message?.reply({content: `Are you sure you want to blacklist this user?`, components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 3,
                            label: "Yes",
                            custom_id: "yes"
                        },
                        {
                            type: 2,
                            style: 4,
                            label: "No",
                            custom_id: "no"
                        }
                    ]
                }
            ]}).then(async msg => {
                const filter = i => i.user.id === message?.author.id;
                const collector = message?.channel.createMessageComponentCollector({filter, time: 15000});
                collector.once("collect", async i => {
                    if(i.customId == "yes") {
                        userdata.blacklist = true;
                        await this.client.database.welcomeUserData.postAll(user, userdata);
                        i.update({content: `User blacklisted`})
                    } else {
                        i.update({content: `Cancelled`})
                    }
                })
            })
        }
        if(args[0] == "remove") {
            if(!userdata.blacklist) return message?.reply(`User not blacklisted`)
            message?.reply({content: `Are you sure you want to unblacklist this user?`, components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 3,
                            label: "Yes",
                            custom_id: "yes"
                        },
                        {
                            type: 2,
                            style: 4,
                            label: "No",
                            custom_id: "no"
                        }
                    ]
                }
            ]}).then(async msg => {
                const filter = i => i.user.id === message?.author.id;
                const collector = message?.channel.createMessageComponentCollector({filter, time: 15000});
                collector.once("collect", async i => {
                    if(i.customId == "yes") {
                        userdata.blacklist = false;
                        await this.client.database.welcomeUserData.postAll(user, userdata);
                        i.update({content: `User unblacklisted`})
                    } else {
                        i.update({content: `Cancelled`})
                    }
                })
            })
        }
    }
};

