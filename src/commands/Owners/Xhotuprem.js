const Command = require("../../abstract/command");
const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
module.exports = class Xhotuprem extends Command {
    constructor(...args) {
        super(...args, {
            name: "xhotuprem",
            aliases: ["xp"],
            description: "Manage Xhotu Owners",
            category: "Owners",
            ownerOnly: true,
            cooldown: 0,
        });
    }
    async run({ message, args }) {
        if (!args[0]) {
            return message?.reply(`Choose add,remove & list`);
        }
        if (args[0] == "add") {
            const user = await this.client.util.userQuery(args[1]);
            if (!user)
                return message?.reply({
                    content: "Please mention a user or provide a valid user ID",
                });
            const member = await this.client.users.fetch(user);
            if (!member) return message?.reply({ content: "Invalid User" });
            const data = await this.client.database.xhotuPermsData.get(
                member.id
            );
            if (data.xhotu)
                return message?.reply({
                    content: "User already has Xhotu Owner",
                });
            data.xhotu = true;
            this.client.database.xhotuPermsData.post(member.id, data);
            return message?.reply({
                content: `Added ${member.username} to the Xhotulist`,
            });
        }
        if (args[0] == "remove") {
            const user = await this.client.util.userQuery(args[1]);
            if (!user)
                return message?.reply({
                    content: "Please mention a user or provide a valid user ID",
                });
            const member = await this.client.users.fetch(user);
            if (!member) return message?.reply({ content: "Invalid User" });
            const data = await this.client.database.xhotuPermsData.get(
                member.id
            );
            if (!data.xhotu)
                return message?.reply({
                    content: "User does not have Xhotu Owner",
                });
            data.xhotu = false;
            this.client.database.xhotuPermsData.post(member.id, data);
            return message?.reply({
                content: `Removed ${member.username} from the Xhotulist`,
            });
        }
        if (args[0] == "list") {
            const firstId = "first";
            const backId = "back";
            const nextId = "next";
            const lastId = "last";
            const first = new ButtonBuilder()
                .setCustomId(firstId)
                .setLabel("First")
                .setStyle(1);
            const back = new ButtonBuilder()
                .setCustomId(backId)
                .setLabel("Back")
                .setStyle(1);
            const next = new ButtonBuilder()
                .setCustomId(nextId)
                .setLabel("Next")
                .setStyle(1);
            const last = new ButtonBuilder()
                .setCustomId(lastId)
                .setLabel("Last")
                .setStyle(1);
            const row = new ActionRowBuilder().addComponents(
                first,
                back,
                next,
                last
            );
            const data = await this.client.database.xhotuPermsData.all();
            const xhotuOwners = data.filter((x) => x.xhotu == true);
            const xhotuOwnersList = xhotuOwners.map((x) => x.id);
            let xhotuOwnersListEmbed = this.client.util.embed()
                .setTitle(`Xhotu Owners List`)
                .setDescription(
                    xhotuOwnersList
                        .slice(0, 10)
                        .map((x) => `<@${x}> - ${x}`)
                        .join("\n")
                )
                .setFooter({ text: `Page 1 of ${Math.ceil(xhotuOwnersList.length / 10)}` });
            const xhotuOwnersListMessage = await message?.reply({
                embeds: [xhotuOwnersListEmbed],
                components: [row],
            });
            const filter = (i) =>
                i.user.id === message?.author.id &&
                [firstId, backId, nextId, lastId].includes(i.customId);
            const collector = xhotuOwnersListMessage?.createMessageComponentCollector(
                { filter, time: 60000 }
            );
            let currentPage = 1;
            collector?.on("collect", async (i) => {
                if (interaction?.customId === firstId) {
                    currentPage = 1;
                    xhotuOwnersListEmbed.setDescription(
                        xhotuOwnersList
                            .slice(0, 10)
                            .map((x) => `<@${x}> - ${x}`)
                            .join("\n")
                    );
                    xhotuOwnersListEmbed.setFooter({ text: `Page 1 of ${Math.ceil(xhotuOwnersList.length / 10)}` });
                    await i.update({ embeds: [xhotuOwnersListEmbed] });
                }
                if (interaction?.customId === backId) {
                    if (currentPage !== 1) {
                        currentPage--;
                        xhotuOwnersListEmbed.setDescription(
                            xhotuOwnersList
                                .slice(currentPage * 10 - 10, currentPage * 10)
                                .map((x) => `<@${x}> - ${x}`)
                                .join("\n")
                        );
                        xhotuOwnersListEmbed.setFooter({ text: `Page ${currentPage} of ${Math.ceil(xhotuOwnersList.length / 10)}` });
                        await i.update({ embeds: [xhotuOwnersListEmbed] });
                    }
                }
                if (interaction?.customId === nextId) {
                    if (currentPage < xhotuOwnersList.length / 10) {
                        currentPage++;
                        xhotuOwnersListEmbed.setDescription(
                            xhotuOwnersList
                                .slice(currentPage * 10 - 10, currentPage * 10)
                                .map((x) => `<@${x}> - ${x}`)
                                .join("\n")
                        );
                        xhotuOwnersListEmbed.setFooter({ text: `Page ${currentPage} of ${Math.ceil(xhotuOwnersList.length / 10)}` });
                        await i.update({ embeds: [xhotuOwnersListEmbed] });
                    }
                }
                if (interaction?.customId === lastId) {
                    currentPage = Math.ceil(xhotuOwnersList.length / 10);
                    xhotuOwnersListEmbed.setDescription(
                        xhotuOwnersList
                            .slice(
                                currentPage * 10 - 10,
                                currentPage * 10
                            )
                            .map((x) => `<@${x}> - ${x}`)
                            .join("\n")
                    );
                    xhotuOwnersListEmbed.setFooter({ text: `Page ${currentPage} of ${Math.ceil(xhotuOwnersList.length / 10)}` });
                    await i.update({ embeds: [xhotuOwnersListEmbed] });
                }
            });
        }
    }
};
