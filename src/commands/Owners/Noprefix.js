const Command = require("../../abstract/command");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} = require("discord.js");
module.exports = class Noprefix extends Command {
    constructor(...args) {
        super(...args, {
            name: "noprefix",
            aliases: ["nopre", "np"],
            description: "Set the prefix for the bot",
            category: "Owners",
            cooldown: 0,
        });
    }
    async run({ message, args }) {
        const goahead =
            this.client.util.checkOwner(message?.author.id) ||
            (await this.client.util.checkXhotuOwner(message?.author.id));
        if (!goahead)
            return message?.channel.send(
                `You are not allowed to use this command!`
            );
        const data = await this.client.database.noprefixUserData.get(
            this.client.user.id
        );
        if (!args[0]) {
            return message?.reply(`Choose add,remove & list`);
        }
        if (args[0] == "add") {
            const xd = args[1] ? await this.client.util.userQuery(args[1]) : null;
            if (!xd) return message?.channel.send("User not found.");
            const member = await this.client.users.fetch(xd);
            if (!member) return message?.reply(`Please mention a member`);
            if (data.userids.includes(member.id))
                return message?.reply(`Member already has no prefix`);
            data.userids.push(member.id);
            this.client.database.noprefixUserData.put(
                this.client.user.id,
                data
            );
            return message?.reply(`Added ${member.username} to the list`);
        }
        if (args[0] == "remove") {
            let member = args[1] ? await this.client.util.userQuery(args[1]) : null;
            if (!member) return message?.channel.send("User not found.");
            member =  await this.client.users.fetch(member);
            if (!member) return message?.reply(`Please mention a member`);
            if (!data.userids.includes(member.id))
                return message?.reply(`Member does not have no prefix`);
            data.userids = data.userids.filter((x) => x !== member.id);
            this.client.database.noprefixUserData.put(
                this.client.user.id,
                data
            );
            return message?.reply(`Removed ${member.username} from the list`);
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
            const queue = data.userids.map((x) => `<@${x}> - ${x}`);
            const embed = new EmbedBuilder()
                .setTitle(`No Prefix List`)
                .setDescription(queue.slice(0, 10).join("\n"))
                .setColor(`#2b2d31`)
                .setFooter({
                    text: `Page 1 of ${Math.ceil(data.userids.length / 10)}`,
                });
            const msg = await message?.reply({
                embeds: [embed],
                components: [row],
            });
            const filter = (interaction) =>
                interaction?.user.id === message?.author.id;
            const collector = msg.createMessageComponentCollector({
                filter,
                time: 60000,
            });
            let page = 1;
            collector.on("collect", async (interaction) => {
                if (interaction?.customId === firstId) {
                    page = 1;
                    embed.setDescription(queue.slice(0, 10).join("\n"));
                    embed.setFooter({
                        text: `Page 1 of ${Math.ceil(
                            data.userids.length / 10
                        )}`,
                    });
                    await interaction?.update({ embeds: [embed] });
                }
                if (interaction?.customId === backId) {
                    page--;
                    if (page < 1) page = 1;
                    embed.setDescription(
                        queue.slice((page - 1) * 10, page * 10).join("\n")
                    );
                    embed.setFooter({
                        text: `Page ${page} of ${Math.ceil(
                            data.userids.length / 10
                        )}`,
                    });
                    await interaction?.update({ embeds: [embed] });
                }
                if (interaction?.customId === nextId) {
                    page++;
                    if (page > Math.ceil(data.userids.length / 10))
                        page = Math.ceil(data.userids.length / 10);
                    embed.setDescription(
                        queue.slice((page - 1) * 10, page * 10).join("\n")
                    );
                    embed.setFooter({
                        text: `Page ${page} of ${Math.ceil(
                            data.userids.length / 10
                        )}`,
                    });
                    await interaction?.update({ embeds: [embed] });
                }
                if (interaction?.customId === lastId) {
                    page = Math.ceil(data.userids.length / 10);
                    embed.setDescription(
                        queue.slice((page - 1) * 10, page * 10).join("\n")
                    );
                    embed.setFooter({
                        text: `Page ${page} of ${Math.ceil(
                            data.userids.length / 10
                        )}`,
                    });
                    await interaction?.update({ embeds: [embed] });
                }
            });
        }
    }
};
