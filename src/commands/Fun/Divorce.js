const Command = require("../../abstract/command");

module.exports = class Divorce extends Command {
    constructor(...args) {
        super(...args, {
            name: "divorce",
            aliases: ["divorcie", "divorce"],
            description: "Divorces your current spouse.",
            category: "Fun",
            usage: ["divorce"],
            userPerms: ["ViewChannel", "SendMessages"],
            botPerms: ["ViewChannel", "SendMessages"],
            cooldown: 5,
        });
    }

    async run({ message }) {
        let data = await this.client.database.marryData.get(message?.author.id);
        if (!data) return message?.reply("You're not married.");
        if (!data.partner) return message?.reply("You're not married.");
        let partner = data.partner ? await this.client.users.fetch(data.partner) : null;
        if (!partner) return message?.reply("You're not married.");
        let partnerdata = await this.client.database.marryData.get(partner.id);
        data.partner = null;
        data.marriedAt = null;
        data.married = false;
        partnerdata.partner = null;
        partnerdata.marriedAt = null;
        partnerdata.married = false;
        let confirmation = await message?.reply({
            content: `Are you sure you want to divorce ${partner.username}?`,
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
        });
        let filter = (i) => i.user.id === message?.author.id;
        let collector = confirmation.createMessageComponentCollector({
            filter,
            time: 15000
        });
        collector.on("collect", async (i) => {
            if (i.customId === "yes") {
                i.message?.delete();
                let confmsg = await message?.channel.send({
                    content: `${message?.author} confirmed divorce with you. <@${partner.id}>, do you want to confirm?`,
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 3,
                                    label: "Yes",
                                    custom_id: "yes_2",
                                },
                                {
                                    type: 2,
                                    style: 4,
                                    label: "No",
                                    custom_id: "no_2",
                                },
                            ],
                        },
                    ],
                });
                let filter = (i) => i.user.id === partner.id;
                let collector2 = confmsg.createMessageComponentCollector({
                    filter,
                    time: 15000
                });
                collector2.on("collect", async (i) => {
                    if (i.customId === "yes_2") {
                        await this.client.database.marryData.post(message?.author.id, data);
                        await this.client.database.marryData.post(partner.id, partnerdata);
                        i.message?.delete();
                        message?.channel.send(`${message?.author} and <@${partner.id}> divorced.`);
                        return;
                    }
                    if (i.customId === "no_2") {
                        return i.update({ content: `You canceled the divorce with ${message?.author.username}.`, components: [] });
                    }
                });
                collector2.once("end", async (collected, reason) => {
                    if (reason === "time") {
                        return confirmation.edit({ content: "You didn't respond in time.", components: [] });
                    }
                });
            }
            if (i.customId === "no") {
                return i.update({ content: `You canceled the divorce with ${partner.username}.`, components: [] });
            }
        });
        collector.once("end", async (collected, reason) => {
            if (reason === "time") {
                return confirmation.edit({ content: "You didn't respond in time.", components: [] });
            }
        });
    }

    async exec({ interaction }) {
        let data = await this.client.database.marryData.get(interaction?.user.id);
        if (!data) return interaction?.reply("You're not married.");
        if (!data.partner) return interaction?.reply("You're not married.");
        let partner = data.partner ? await this.client.users.fetch(data.partner) : null;
        if (!partner) return interaction?.reply("You're not married.");
        let partnerdata = await this.client.database.marryData.get(partner.id);
        data.partner = null;
        data.marriedAt = null;
        data.married = false;
        partnerdata.partner = null;
        partnerdata.marriedAt = null;
        partnerdata.married = false;
        let confirmation = await interaction?.reply({
            content: `Are you sure you want to divorce ${partner.username}?`,
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
        });
        let filter = (i) => i.user.id === interaction?.user.id;
        let collector = confirmation.createMessageComponentCollector({
            filter,
            time: 15000
        });

        collector.once("collect", async (i) => {
            if (i.customId === "yes") {
                await this.client.database.marryData.post(interaction?.user.id, data);
                await this.client.database.marryData.post(partner.id, partnerdata);
                i.message?.delete();
                let confmsg = await interaction?.channel.send({
                    content: `${interaction?.user} confirmed divorce with you. <@${partner.id}>, do you want to confirm?`,
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 3,
                                    label: "Yes",
                                    custom_id: "yes_2",
                                },
                                {
                                    type: 2,
                                    style: 4,
                                    label: "No",
                                    custom_id: "no_2",
                                },
                            ],
                        },
                    ],
                });
                let filter = (i) => i.user.id === partner.id;
                let collector2 = confmsg.createMessageComponentCollector({
                    filter,
                    time: 15000
                });
                collector2.once("collect", async (i) => {
                    if (i.customId === "yes_2") {
                        await this.client.database.marryData.post(interaction?.user.id, data);
                        await this.client.database.marryData.post(partner.id, partnerdata);
                        i.message?.delete();
                        interaction?.channel.send(`${interaction?.user} and <@${partner.id}> divorced.`);
                        return;
                    }
                    if (i.customId === "no_2") {
                        return i.update({ content: `You canceled the divorce with ${interaction?.user.username}.`, components: [] });
                    }
                });
                collector2.once("end", async (collected, reason) => {
                    if (reason === "time") {
                        return confirmation.edit({ content: "You didn't respond in time.", components: [] });
                    }
                });
            }
            if (i.customId === "no") {
                return i.update({ content: `You canceled the divorce with ${partner.username}.`, components: [] });
            }
        });

        collector.once("end", async (collected, reason) => {
            if (reason === "time") {
                return confirmation.edit({ content: "You didn't respond in time.", components: [] });
            }
        });
    }
};
