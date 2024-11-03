const Event = require("../abstract/event");
const { BaseInteraction, WebhookClient } = require('discord.js');
module.exports = class interactionCreate extends Event {
    get name() {
        return "interactionCreate";
    }
    get once() {
        return false;
    }
    /**
     * @param {BaseInteraction} interaction
     */
    async run(interaction) {
        try {
            if (!interaction?.guild || interaction?.channel.type == 1) return interaction?.reply({ content: "This command is not available in DMs!", ephemeral: true });
            if (!interaction?.guild.config) {
                interaction.guild.config =
                    await this.client.database.guildData.get(
                        interaction?.guild.id
                    );
            }
            interaction.guild.config = await this.client.database.guildData.get(
                interaction?.guild.id
            );
            if (interaction?.isButton() && interaction?.customId == "verify_server") {
                return this.client.emit('serverVerificationCreate', interaction);
            };
            if (interaction?.isButton() && interaction?.customId.startsWith("giveaway-")) {
                let id = interaction?.customId.split("-")[1];
                let giveaway = this.client.giveawayManager.giveaways.find((g) => g.messageId === id);
                if (!giveaway) return interaction?.reply({ content: `This giveaway is not found!`, ephemeral: true });
                if (giveaway.ended) return interaction?.reply({ content: `This giveaway is ended!`, ephemeral: true });
                if (giveaway.entered.includes(interaction?.user.id)) {
                    giveaway.entered = giveaway.entered.filter((u) => u !== interaction?.user.id);
                    this.client.giveawayManager.editData(giveaway);
                    const button = await this.client.giveawayManager.embedButton(giveaway);
                    interaction?.message?.edit({ components: [this.client.util.row().addComponents(button)] });
                    return interaction?.reply({ content: `You have left the giveaway successfully!`, ephemeral: true });
                }
                interaction?.reply({ content: `You have joined the giveaway successfully!`, ephemeral: true });
                giveaway.entered.push(interaction?.user.id);
                this.client.giveawayManager.editData(giveaway);
                const button = await this.client.giveawayManager.embedButton(giveaway);
                interaction?.message?.edit({ components: [this.client.util.row().addComponents(button)] });
            }
            if (interaction?.isModalSubmit() && interaction?.customId === 'modal_verification_sumbit') {
                return this.client.emit('serverVerificationSubmit', interaction);
            };
            if (interaction?.isButton() && interaction?.customId.startsWith("setup_")) {
                if(interaction?.user.id !== interaction?.guild?.ownerId) return interaction.reply({ content: `Only the server owner can use this button!`, ephemeral: true });
                await interaction?.reply({ content: `Setup has been started!`, ephemeral: true });
                this.client.commandFunctions.SetupFunction.setup(interaction, true);
            };
            if (
                interaction?.isButton() &&
                interaction?.customId == "eval_delete"
            ) {
                return interaction?.message?.delete().catch((e) => {
                    return;
                });
            };
            if (interaction?.type != 2) return;
            const command = this.client.commands.get(interaction?.commandName);
            if (!command) return;
            if (
                command.ownerOnly &&
                !this.client.util.checkOwner(interaction?.member.id)
            )
                return;
            if (!this.client.util.checkOwner(interaction?.member.id)) { //&& 
                (!interaction?.channel?.permissionsFor(interaction?.user).has([
                    "Administrator",
                    "ManageGuild",
                    "ManageRoles",
                    "ManageChannels",
                    "ManageMessages",
                    "ManageNicknames",
                    "ManageEmojisAndStickers",
                    "ManageWebhooks",
                    "ManageThreads",
                    "BanMembers",
                    "KickMembers",
                ]))
                {
                    if (
                        interaction?.guild.config.disabledCommands.includes(
                            command.name
                        )
                    ) {
                        return interaction?.reply({
                            content: `This command is disabled in this server!`,
                            ephemeral: true,
                        });
                    }
                    if (
                        interaction?.guild.config.disabledChannels.includes(
                            interaction?.channel.id
                        )
                    ) {
                        return interaction?.reply({
                            content: `This command is disabled in this channel!`,
                            ephemeral: true,
                        });
                    }
                }
                if (interaction?.guild.config.blacklisted) {
                    return interaction?.reply({
                        content: `This server is blacklisted from using this bot!`,
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        label: "Contact Support",
                                        style: 5,
                                        url: this.client.config.Url.SupportURL,
                                    },
                                ],
                            },
                        ],
                        ephemeral: true,
                    });
                }
                let userdata = await this.client.database.welcomeUserData.get(
                    interaction?.user.id
                );
                if (userdata.blacklist) {
                    return interaction?.reply({
                        content: `You are blacklisted from using this bot!`,
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        label: "Contact Support",
                                        style: 5,
                                        url: this.client.config.Url.SupportURL,
                                    },
                                ],
                            },
                        ],
                        ephemeral: true,
                    });
                }
                const userPermCheck = command.userPerms
                    ? this.client.userPerms.add(command.userPerms)
                    : this.client.userPerms;
                if (
                    userPermCheck &&
                    !this.client.util.checkOwner(interaction?.member.id)
                ) {
                    const missing = interaction?.channel
                        .permissionsFor(interaction?.member)
                        .missing(userPermCheck);
                    if (missing.length) {
                        return this.client.util.errorDelete(
                            interaction,
                            `You Are Missing The Following Permissions: ${this.client.util.formatArray(
                                missing.map(this.client.util.formatPerms)
                            )}`
                        );
                    }
                }
                if (
                    command.guildOwnerOnly &&
                    interaction?.guild.ownerId != interaction?.member.id
                ) {
                    return this.client.util.errorDelete(
                        interaction,
                        `This Command Can Only Be Run By The Server Owner!`
                    );
                }
                if (
                    command.upFromMe &&
                    interaction?.member.roles.highest.position <
                    interaction?.guild.members.resolve(this.client.user)
                        .roles.highest.position
                ) {
                    return this.client.util.errorDelete(
                        interaction,
                        `This Command Can Only Be Run By Someone Higher Than Me!`
                    );
                }
                const botPermCheck = command.botPerms
                    ? this.client.defaultPerms.add(command.botPerms)
                    : this.client.defaultPerms;
                if (botPermCheck) {
                    const missing = interaction?.channel
                        .permissionsFor(this.client.user)
                        .missing(botPermCheck);
                    if (missing.length) {
                        return this.client.util.errorButtonEmbed(
                            interaction,
                            `I Don't Have Enough Permission! Click The Button Below To Fix`,
                            botPermCheck.bitfield.toString()
                        );
                    }
                }
                if (
                    (!interaction?.guild.config.premium && command?.vote) ||
                    (!interaction?.guild.config.premium && command?.premium)
                ) {
                    let voted = await this.client.util.checkVote(
                        interaction?.member.id
                    );
                    if (!voted) {
                        let embed = this.client.util
                            .embed()
                            .setTitle(`Premium Command`)
                            .setDescription(
                                `You Need To Vote For Me To Use This Command!`
                            )
                            .setColor(this.client.config.Client.PrimaryColor);
                        return interaction?.channel.send({
                            embeds: [embed],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            style: 5,
                                            label: `Vote`,
                                            url: `https://top.gg/bot/${this.client.user.id}/vote`,
                                        },
                                    ],
                                },
                            ],
                        });
                    }
                }
            }
            let cmdr = command.exec({ interaction });
            // let webhook = new WebhookClient({
            //     url: this.client.config.Webhook.Url,
            // });
            // let embed = this.client.util
            //     .embed()
            //     .setTitle(`Command Executed`)
            //     .setDescription(`**Command:** ${command.name}\n**User:** ${interaction.user.tag} (${interaction.user.id})\n**Guild:** ${interaction.guild.name} (${interaction.guild.id})\n**Channel:** ${interaction.channel.name} (${interaction.channel.id})\n**Message:** \`\`\`${interaction.content}\`\`\``)
            //     .setColor(this.client.config.Client.PrimaryColor);
            // webhook.send({
            //     embeds: [embed],
            // });
        } catch (error) {
            return
        }
    }
};
