const Command = require("../../abstract/command");
module.exports = class Blacklist extends Command {
    constructor(...args) {
        super(...args, {
            name: "oblacklist",
            description: "Blacklist a Server",
            category: "Owners",
            ownerOnly: true,
            cooldown: 0,
        });
    }
    async run({ message, args }) {
        if (!args[0]) {
            return message?.reply(`Choose add or remove`);
        }
        const guild = args[1] || message?.guild.id;
        if (args[0] == "add") {
            const data = await this.client.database.guildData.get(guild);
            if (data.blacklisted)
                return message?.reply({ content: "Server already blacklisted" });
            message
                .reply({
                    content: "Are you sure you want to blacklist this server?",
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 3,
                                    label: "Yes",
                                    custom_id: "yes",
                                },
                                {
                                    type: 2,
                                    style: 4,
                                    label: "No",
                                    custom_id: "no",
                                },
                            ],
                        },
                    ],
                })
                .then(async (msg) => {
                    const filter = (i) => i.user.id === message?.author.id;
                    const collector =
                        message?.channel.createMessageComponentCollector({
                            filter,
                            time: 15000,
                        });
                    collector.once("collect", async (i) => {
                        if (i.customId == "yes") {
                            data.blacklisted = true;
                            await this.client.database.guildData.set(
                                message?.guild.id,
                                data
                            );
                            i.update({
                                content: `Server blacklisted ${await (
                                    await this.client.guilds.fetch(guild)
                                ).name}`,
                                components: [],
                            });
                        } else {
                            i.update({ content: "Cancelled", components: [] });
                        }
                    });
                });
        }
        if (args[0] == "remove") {
            const data = await this.client.database.guildData.get(guild);
            if (!data.blacklisted)
                return message?.reply({ content: "Server not blacklisted" });
            message
                .reply({
                    content:
                        "Are you sure you want to unblacklist this server?",
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 3,
                                    label: "Yes",
                                    custom_id: "yes",
                                },
                                {
                                    type: 2,
                                    style: 4,
                                    label: "No",
                                    custom_id: "no",
                                },
                            ],
                        },
                    ],
                })
                .then(async (msg) => {
                    const filter = (i) => i.user.id === message?.author.id;
                    const collector =
                        message?.channel.createMessageComponentCollector({
                            filter,
                            time: 15000,
                        });
                    collector.once("collect", async (i) => {
                        if (i.customId == "yes") {
                            data.blacklisted = false;
                            await this.client.database.guildData.set(
                                message?.guild.id,
                                data
                            );
                            i.update({
                                content: `Server unblacklisted ${await (
                                    await this.client.guilds.fetch(guild)
                                ).name}`,
                                components: [],
                            });
                        } else {
                            i.update({ content: "Cancelled", components: [] });
                        }
                    });
                });
        }
        if (args[0] !== "add" && args[0] !== "remove") {
            return message?.reply(`Choose add or remove`);
        }
    }
};
