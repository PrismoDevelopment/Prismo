module.exports = class SetupFunction {
    /**
     *
     * @param {import('../PrismoClient')} client
     */
    constructor(client) {
        this.client = client;
    }
    async setup(message, slash = false) {
        console.log("Starting Setup");
        let hemuuser;
            if (slash) {
                hemuuser = await message.guild.members.fetch(message?.user.id)
                hemuuser = hemuuser.user
            } else {
                hemuuser = message?.author;
            }
            let msg = await message?.channel.send(`${this.client.config.Client.emoji.loading} **Starting Setup**`);
            let guildData = await this.client.database.guildData.get(message?.guild.id);
            let guildVerificationData = await this.client.database.guildVerificationData.get(message?.guild.id);
            await this.client.sleep(2000);
            let embed = this.client.util.embed()
                .setTitle(`Welcome to the Prismo setup wizard!`)
                .setThumbnail(hemuuser.displayAvatarURL())
                .setDescription(`${this.client.config.Client.emoji.info} This command will help you setup the bot for your server. You can always run this command again to change your settings.`)
                .setColor(this.client.config.Client.PrimaryColor)
                .setFooter({ text: `Prismo Setup`, iconURL:message.guild.iconURL() })
            await msg.edit({ content: ``, embeds: [embed] });
            await this.client.sleep(5000);
            embed.setDescription(`Server Prefix is currently set to \`${guildData.prefix}\` Would you like to change it?`)
            embed.setThumbnail(null)
            let compos = [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Yes",
                            style: 3,
                            custom_id: "yes"
                        },
                        {
                            type: 2,
                            label: "No",
                            style: 4,
                            custom_id: "no"
                        }
                    ]
                }
            ]
            await msg.edit({ content: ``, embeds: [embed], components: compos });
            let filter = (i) => {
                if (i.user.id === message?.member.id) return true;
                return false;
            }
            let collector = await msg.createMessageComponentCollector({ filter: filter, time: 60000 });
            let nunumsg;
            await new Promise((resolve) => {
                collector.on('collect', async (i) => {
                    if (i.customId === 'yes') {
                        await i.deferUpdate();
                        nunumsg = await message?.channel.send(`${this.client.config.Client.emoji.loading} **Please type the new prefix you would like to set.**`);
                        let filter2 = (m) => {
                            if (m.author.id === message?.member.id) return true;
                            return false;
                        }
                        let collector2 = message?.channel.createMessageCollector({ filter: filter2, time: 60000 });
                        collector2.on('collect', async (m) => {
                            if (m.content.length > 5) return nunumsg.edit(`${this.client.config.Client.emoji.cross} **Prefix can't be longer than 5 characters.**`);
                            if (m.content.length < 1) return nunumsg.edit(`${this.client.config.Client.emoji.cross} **Prefix can't be shorter than 1 character.**`);
                            guildData.prefix = m.content;
                            await this.client.database.guildData.putPrefix(message?.guild.id, guildData);
                            await nunumsg.edit(`${this.client.config.Client.emoji.tick} **Prefix has been set to \`${m.content}\`**`);
                            await m.delete();
                            await this.client.sleep(1000)
                            await collector2.stop();
                            await nunumsg.delete();
                            await collector.stop();
                            resolve();
                        });
                        collector2.on('end', async (collected, reason) => {
                            if (reason === 'time') {
                                await nunumsg.edit(`${this.client.config.Client.emoji.cross} **You took too long to respond.**`);
                                await collector2.stop();
                            }
                        });
                    } else if (i.customId === 'no') {
                        await i.deferUpdate();
                        await collector.stop()
                        resolve();
                    }
                });
            });
            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    await msg.edit(`${this.client.config.Client.emoji.cross} **You took too long to respond.**`);
                    await collector.stop();
                }
            });
            let automodon = false;
            let check = await message?.guild.autoModerationRules.fetch()
            if (!check.some(r => r.name.includes('Prismo'))) {
                embed.setDescription(`${this.client.config.Client.emoji.info} Auto Moderation is currently **Disabled**. Would you like to change it?`)
                compos = [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Enable",
                                style: 3,
                                custom_id: "enable"
                            },
                            {
                                type: 2,
                                label: "Skip",
                                style: 2,
                                custom_id: "skip"
                            }
                        ]
                    }
                ]
                await msg.edit({ content: ``, embeds: [embed], components: compos });
                let filter3 = (i) => {
                    if (i.user.id === message?.member.id) return true;
                    return false;
                }
                let collector3 = msg.createMessageComponentCollector({ filter: filter3, time: 60000 });
                await new Promise((resolve) => {
                    collector3.on('collect', async (i) => {
                        if (i.customId === 'enable') {
                            await i.deferUpdate();
                            nunumsg = await message?.channel.send(`${this.client.config.Client.emoji.loading} Creating Auto Moderation Rules...`);
                            if (check.size > 0) {
                                for (const rule of check) {
                                    await message?.guild.autoModerationRules.delete(rule[0]).catch(err => { })
                                }
                            }
                            let engwordlist = ["*https://*", "*https://*", "*discord.gg*", "*discord.com/invite*", "-NUS*", "anal", "anus", "anus*", "ANUS*", "arse", "asshat", "asshat*", "asshole", "asshole*", "b0", "b1tch", "b1tch*", "ballsac", "ballsac*", "ballsack", "ballsack*", "bct", "bct*", "bct.", "bcta", "bcta*", "bdsm", "bdsm*", "beastiality", "beastiality*", "beefcurtains", "beefcurtains*", "biatch", "biatch*", "bitch", "bitch*", "blowjob", "blowjob*", "Blowjob", "Blowjob*", "blowjobs", "blowjobs*", "bo0b", "bollock", "bollock*", "bollok", "bollok*", "boner", "boner*", "boob", "boobs", "booty", "booty*", "Boquete", "Boquete*", "BOQUETE*", "BOSSETA*", "Brasino", "buceta", "buceta*", "BUCETA*", "Bucetão", "Bucetão*", "bucetinha", "bucetinha*", "Bucetuda", "Bucetuda*", "Bucetudinha", "Bucetudinha*", "bucta", "bucta*", "Busseta", "Busseta*", "BUSSETA*", "Buttock", "Buttock*", "buttplug", "buttplug*", "buzeta", "buzeta*", "ceu pau", "chupo paus", "clitoris", "clitoris*", "cock", "comendo a tua", "comendo o teu", "comendo teu", "comendo tua", "comerei a sua", "comerei o seu", "comerei sua", "comi a sua", "comi o seu", "comi sua", "Culhao", "Culhao*", "cum", "cunt", "cunt*", "Curalho", "Curalho*", "Cuzinho", "Cuzinho*", "Cuzuda", "Cuzuda*", "CUZUDA*", "Cuzudo", "Cuzudo*", "CUZUDO*", "da o cu", "deepthroat", "deepthroat*", "dei o cu", "dick", "dick*", "dildo", "dildov", "ecchi", "ecchi*", "ejaculate", "erection", "erection*", "f0de", "f0de*", "feck", "feck*", "felching", "felching*", "fellate", "fellate*", "fellatio", "fellatio*", "fiIho da pta", "Fiquei ate ereto", "Fiquei até ereto", "fodar", "fodar*", "fode", "fode*", "FODE*", "foder", "foder*", "FODIDA*", "FORNICA*", "fuc", "fuck*", "fucks", "fucks*", "Fucky", "FUDE¦+O*", "FUDECAO*", "FUDENDO*", "FUDIDA*", "FUDIDO*", "g0z@ndo", "g0z@ndo*", "g0z@r", "g0z@r*", "g0zando", "g0zando*", "g0zar", "g0zar*", "gemida", "gemida*", "genitals", "genitals*", "gey", "gey*", "gosei", "gosei*", "goz@r", "goz@r*", "gozando", "gozando*", "gozar", "gozar*", "Gozei", "Gozei*", "horny", "horny*", "Kudasai", "Kudasai*", "kys", "kys*", "labia", "labia*", "M.A.M.A.D.A", "M.A.M.A.D.A*", "mama", "mamado", "mamado*", "mamo", "masterbating", "masterbating*", "masturbate", "masturbate*", "memama", "memama*", "meu penis", "meu pênis", "Nadega", "Nadega*", "nakedphotos", "nakedphotos*", "P-NIS*", "p0rn", "P0rn0", "P0rn0*", "paugrand", "paugrand*", "peituda", "peituda*", "pelad0", "pelad0*", "PELAD4", "PELAD4*", "pen15", "pen15*", "pen1s", "pen1s*", "penezis", "penezis*", "penis", "piroca", "piroca*", "Piroca", "Piroca*", "Piroco", "Piroco*", "Pirocudo", "piroquinha", "piroquinha*", "piss", "porn", "PornHub", "PornHub*", "porno", "pornô", "pornohug", "pornohug*", "pu55y", "pu55y*", "PUNHET+O*", "Punheta", "Punheta*", "PUNHETA*", "PUNHETAO*", "punheteiro", "punheteiro*", "pussy", "pussy*", "r@b@", "r@b@*", "r@ba", "r@ba*", "rab@", "rab@*", "raba", "raba*", "rape", "rimjob", "rimjob*", "rule34", "rule34*", "scat", "scat*", "scrotum", "scrotum*", "seqsu", "seqsu*", "Sequisu", "Sequisu*", "seu c", "seu cu", "seu pau", "seu penis", "seu pênis", "Sex0", "Sex0*", "sexslaves", "sexslaves*", "sh1t", "shemale", "shemale*", "smegma", "smegma*", "sperm", "spunk", "spunk*", "strap-on", "strap-on*", "strapon", "strapon*", "stripper", "stripper*", "Tesao*", "testicle", "testicle*", "testicules", "testicules*", "tetinha", "tetinha*", "Tezao", "Tezao*", "Tezuda", "Tezuda*", "Tezudo", "Tezudo*", "throat", "throat*", "tits", "tits*", "titt", "titty", "titty*", "toma no cu", "tosser", "tosser*", "trannie", "trannie*", "trannies", "trannies*", "tranny", "tranny*", "Transa", "Transa*", "tubgirl", "tubgirl*", "turd", "turd*", "twat", "twat*", "vadge", "vadge*", "vagane", "vagane*", "vagina", "vagina*", "vai se foder", "vai toma no c", "vai toma no cu", "vai tomar no", "você mama", "wank", "wank*", "wanker", "wanker*", "whore", "whore*", "x-rated", "x-rated*", "Xereca*", "XERERECA*", "XEXECA*", "Xota", "Xota*", "Xoxota*", "xVideos", "xVideos*", "xVidros", "xVidros*", "Yamete", "Yamete*", "you mama", "zoophile", "zoophile*"]
                            await message?.guild.autoModerationRules.create({
                                name: 'Prismo AutoMod Rule 1',
                                eventType: 1,
                                triggerType: 1,
                                triggerMetadata: {
                                    keywordFilter: engwordlist,
                                },
                                enabled: true,
                                reason: `auto-moderation enabled by ${hemuuser?.username}`,
                                actions: [
                                    {
                                        type: 1,
                                        duration: 0,
                                        reason: `${hemuuser?.username} was muted for using a bad word!`,
                                    }
                                ]
                            }).catch(err => { _ })
                            await message?.guild.autoModerationRules.create({
                                name: 'Prismo AutoMod Rule 2',
                                eventType: 1,
                                triggerType: 5,
                                triggerMetadata: {
                                    mentionTotalLimit: 5,
                                },
                                enabled: true,
                                reason: `auto-moderation enabled by ${hemuuser?.username}`,
                                actions: [
                                    {
                                        type: 1,
                                        duration: 0,
                                        reason: `${hemuuser?.username} was muted for mentioning too many people!`,
                                    }
                                ]
                            }).catch(err => { _ })
                            await message?.guild.autoModerationRules.create({
                                name: 'Prismo AutoMod Rule 3',
                                eventType: 1,
                                triggerType: 4,
                                triggerMetadata: {
                                    presets: [1, 2, 3]
                                },
                                enabled: true,
                                reason: `auto-moderation enabled by ${hemuuser?.username}`,
                                actions: [
                                    {
                                        type: 1,
                                        duration: 0,
                                        reason: `${hemuuser?.username} was muted for using a bad word!`,
                                    }
                                ]
                            }).catch(err => { _ })
                            await message?.guild.autoModerationRules.create({
                                name: 'Prismo AutoMod Rule 4',
                                eventType: 1,
                                triggerType: 3,
                                actions: [
                                    {
                                        type: 1,
                                        duration: 0,
                                        reason: `${hemuuser?.username} was muted for using a bad word!`,
                                    }
                                ],
                                enabled: true,
                                reason: `auto-moderation enabled by ${hemuuser?.username}`,
                            }).catch(err => { _ })
                            await nunumsg.edit(`${this.client.config.Client.emoji.tick} Auto-moderation has been enabled!`)
                            automodon = true
                            await collector3.stop()
                            await this.client.sleep(1000)
                            await nunumsg.delete()
                            resolve()
                        }
                        if (i.customId === 'skip') {
                            await i.deferUpdate()
                            await collector3.stop()
                            resolve()
                        }
                    })
                })
                collector3.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                        await collector3.stop()
                        await msg.delete()
                        return
                    }
                })
            } else {
                automodon = true
            }
            if (guildData.welcome.channel == null) {
                embed.setDescription(`${this.client.config.Client.emoji.info} Welcome Is Disabled!, Would You Like To Enable It?`)
                compos = [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Yes",
                                style: 3,
                                custom_id: "yes"
                            },
                            {
                                type: 2,
                                label: "No",
                                style: 4,
                                custom_id: "no"
                            }
                        ]
                    }
                ]
                await msg.edit({ embeds: [embed], components: compos })
                let filter4 = (i) => {
                    if (i.user.id === message?.member.id) return true;
                    return false;
                }
                const collector4 = msg.createMessageComponentCollector({ filter: filter4, time: 60000 });
                await new Promise((resolve) => {
                    collector4.on('collect', async (i) => {
                        if (i.customId === 'yes') {
                            await i.deferUpdate()
                            nunumsg = await message?.channel.send(`${this.client.config.Client.emoji.channel} Please mention the channel you want to set as the welcome channel!`)
                            let filter5 = (m) => {
                                if (m.author.id === message?.member.id) return true;
                                return false;
                            }
                            const collector5 = message?.channel.createMessageCollector({ filter: filter5, time: 60000 });
                            collector5.on('collect', async (m) => {
                                let channel = m.mentions.channels.first() || message?.guild.channels.cache.get(m.content);
                                if (!channel) {
                                    return message?.channel.send(
                                        `${this.client.config.Client.emoji.cross} Please mention a valid channel!`
                                    );
                                }
                                await m.delete();
                                guildData.welcome.channel = channel.id
                                const data = await this.client.database.welcomeUserData.get(
                                    message?.member.user.id
                                );
                                let max = data.message?.length;
                                let okie = data.message?.slice(0, max);
                                await nunumsg.edit({
                                    content:
                                        `Please Choose, Channel And Preset You Want To Set
Need more presets? Try \`/embed create\`!`,
                                    components: [
                                        this.client.util.row().setComponents(
                                            this.client.util
                                                .menu()
                                                .setCustomId("embedPreset")
                                                .setPlaceholder("Choose Preset")
                                                .addOptions([
                                                    ...okie.map((c) => ({
                                                        label: c.name,
                                                        value: c.id,
                                                    })),
                                                ])
                                        ),
                                        this.client.util
                                            .row()
                                            .setComponents(
                                                this.client.util
                                                    .button()
                                                    .setCustomId("save")
                                                    .setLabel("Save")
                                                    .setStyle(3),
                                                this.client.util
                                                    .button()
                                                    .setCustomId("cancel")
                                                    .setLabel("Cancel")
                                                    .setStyle(4)
                                            ),
                                    ],
                                });
                                const filter6 = (i) => {
                                    if (i.user.id === message?.member.id) return true;
                                    return false;
                                }
                                const collector6 = nunumsg.createMessageComponentCollector({ filter: filter6, time: 60000 });
                                let presetName = "";
                                let dataToSave = {
                                    channel: null,
                                    content: null,
                                    embeds: null,
                                };
                                dataToSave.channel = channel.id;
                                collector6.on('collect', async (i) => {
                                    i.deferUpdate();
                                    if (i.componentType == 3) {
                                        if (i.customId === "embedPreset") {
                                            const embedValue = data.message?.filter(
                                                (g) => g.id == i.values[0]
                                            )[0];
                                            presetName = embedValue.name;
                                            dataToSave.content = embedValue.content;
                                            dataToSave.embeds = embedValue.embeds;
                                        }
                                    }
                                    if (i.componentType == 2) {
                                        if (i.customId === "save") {
                                            if (!dataToSave.embeds)
                                                return i.reply({
                                                    content: "You Must Choose A Preset",
                                                    ephemeral: true,
                                                });
                                            await this.client.database.guildData.putWelcome(
                                                message?.guild.id,
                                                dataToSave
                                            );
                                            await nunumsg.edit({
                                                content: `Welcome Message Has Been Set Successfully!\n\n**Channel**: <#${dataToSave.channel}>\n**Preset**: ${presetName}`,
                                                components: [],
                                            });
                                            await collector6.stop();
                                            await collector5.stop();
                                            await collector4.stop();
                                            await nunumsg.delete();
                                            resolve();
                                        }
                                        if (i.customId === "cancel") {
                                            await nunumsg.delete().catch(() => { });
                                            await collector6.stop();
                                            await collector4.stop();
                                            await collector5.stop();
                                            resolve();
                                        }
                                    }
                                });
                                collector6.on('end', async (collected, reason) => {
                                    if (reason === 'time') {
                                        await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                                        await collector6.stop()
                                        await collector5.stop()
                                        await collector4.stop()
                                        await nunumsg.delete()
                                        return
                                    }
                                }
                                )
                            })
                            collector5.on('end', async (collected, reason) => {
                                if (reason === 'time') {
                                    await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                                    await collector5.stop()
                                    await msg.delete()
                                    return
                                }
                            }
                            )
                        }
                        if (i.customId === 'no') {
                            await i.deferUpdate()
                            await collector4.stop()
                            resolve()
                        }
                    })
                    collector4.on('end', async (collected, reason) => {
                        if (reason === 'time') {
                            await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                            await collector4.stop()
                            await msg.delete()
                            return
                        }
                    }
                    )
                })
                collector4.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                        await collector4.stop()
                        await msg.delete()
                        return
                    }
                }
                )
            }
            if (!guildData.greet.enabled) {
                embed.setDescription(`${this.client.config.Client.emoji.info} Auto delete greet message is disabled!, Would You Like To Enable It?`)
                compos = [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Yes",
                                style: 3,
                                custom_id: "yes"
                            },
                            {
                                type: 2,
                                label: "No",
                                style: 4,
                                custom_id: "no"
                            }
                        ]
                    }
                ]
                await msg.edit({ embeds: [embed], components: compos })
                let filter7 = (i) => {
                    if (i.user.id === message?.member.id) return true;
                    return false;
                }
                const collector7 = msg.createMessageComponentCollector({ filter: filter7, time: 60000 });
                await new Promise((resolve) => {
                    collector7.on('collect', async (i) => {
                        if (i.customId === 'yes') {
                            await i.deferUpdate()
                            nunumsg = await message?.channel.send(`${this.client.config.Client.emoji.channel} Please mention the channel you want to set as the welcome channel!`)
                            let filter8 = (m) => {
                                if (m.author.id === message?.member.id) return true;
                                return false;
                            }
                            const collector8 = message?.channel.createMessageCollector({ filter: filter8, time: 60000 });
                            collector8.on('collect', async (m) => {
                                let channel = m.mentions.channels.first() || message?.guild.channels.cache.get(m.content);
                                if (!channel) {
                                    return message?.channel.send(
                                        `${this.client.config.Client.emoji.cross} Please mention a valid channel!`
                                    );
                                }
                                await m.delete();
                                guildData.greet.enabled = true
                                guildData.greet.channel.push(channel.id)
                                await this.client.database.guildData.putGreet(message?.guild.id, guildData.greet)
                                await nunumsg.edit(`${this.client.config.Client.emoji.tick} Auto delete greet message has been enabled!`)
                                await collector8.stop()
                                await collector7.stop()
                                await this.client.sleep(1000)
                                nunumsg.delete().catch(() => { });
                                resolve()

                            })
                            collector8.on('end', async (collected, reason) => {
                                if (reason === 'time') {
                                    await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                                    await collector8.stop()
                                    await msg.delete()
                                    return
                                }
                            }
                            )
                        }
                        if (i.customId === 'no') {
                            await i.deferUpdate()
                            await collector7.stop()
                            resolve()
                        }
                    })
                })
            }
            if (!guildData.autorole.enabled) {
                embed.setDescription(`${this.client.config.Client.emoji.info} Auto role is disabled!, Would You Like To Enable It?`)
                compos = [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Yes",
                                style: 3,
                                custom_id: "yes"
                            },
                            {
                                type: 2,
                                label: "No",
                                style: 4,
                                custom_id: "no"
                            }
                        ]
                    }
                ]
                await msg.edit({ embeds: [embed], components: compos })
                let filter9 = (i) => {
                    if (i.user.id === message?.member.id) return true;
                    return false;
                }
                const collector9 = msg.createMessageComponentCollector({ filter: filter9, time: 60000 });
                await new Promise((resolve) => {
                    collector9.on('collect', async (i) => {
                        if (i.customId === 'yes') {
                            await i.deferUpdate()
                            nunumsg = await message?.channel.send(`${this.client.config.Client.emoji.add} Please mention the role you want to set as the auto role!`)
                            let filter10 = (m) => {
                                if (m.author.id === message?.member.id) return true;
                                return false;
                            }
                            const collector10 = message?.channel.createMessageCollector({ filter: filter10, time: 60000 });
                            collector10.on('collect', async (m) => {
                                let role = m.mentions.roles.first() || message?.guild.roles.cache.get(m.content);
                                if (!role) {
                                    return message?.channel.send(
                                        `${this.client.config.Client.emoji.cross} Please mention a valid role!`
                                    );
                                }
                                const perms = await this.client.util.rolePerms(role);
                                if (perms) {
                                    msg.delete()
                                    return message?.channel.send(
                                        `${this.client.config.Client.emoji.cross} You can't set a role with dangerous permissions as the auto role!`
                                    );
                                }
                                await m.delete();
                                guildData.autorole.enabled = true
                                guildData.autorole.humanRoles.push(role.id)
                                await this.client.database.guildData.putAutorole(message?.guild.id, guildData.autorole)
                                await nunumsg.edit(`${this.client.config.Client.emoji.tick} Auto role has been enabled!`)
                                await collector10.stop()
                                await collector9.stop()
                                await this.client.sleep(1000)
                                await nunumsg.delete().catch(() => { });
                                resolve()

                            })
                            collector10.on('end', async (collected, reason) => {
                                if (reason === 'time') {
                                    await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                                    await collector10.stop()
                                    await msg.delete()
                                    return
                                }
                            }
                            )
                        }
                        if (i.customId === 'no') {
                            await i.deferUpdate()
                            await collector9.stop()
                            resolve()
                        }
                    })
                })
            }
            if (!guildVerificationData.enabled) {
                embed.setDescription(`${this.client.config.Client.emoji.info} Verification is disabled!, Would You Like To Enable It?`)
                compos = [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Yes",
                                style: 3,
                                custom_id: "yes"
                            },
                            {
                                type: 2,
                                label: "No",
                                style: 4,
                                custom_id: "no"
                            }
                        ]
                    }
                ]
                await msg.edit({ embeds: [embed], components: compos })
                let filter11 = (i) => {
                    if (i.user.id === message?.member.id) return true;
                    return false;
                }
                const collector11 = msg.createMessageComponentCollector({ filter: filter11, time: 60000 });
                // for verification we have to collect 2 things first the channel and then the role so we will use a promise
                await new Promise((resolve) => {
                    collector11.on('collect', async (i) => {
                        if (i.customId === 'yes') {
                            await i.deferUpdate()
                            let isargtaken = false
                            nunumsg = await message?.channel.send(`${this.client.config.Client.emoji.channel} Please mention the channel you want to set as the verification channel!`)
                            let filter12 = (m) => {
                                if (m.author.id === message?.member.id) return true;
                                return false;
                            }
                            const collector12 = message?.channel.createMessageCollector({ filter: filter12, time: 60000 });
                            collector12.on('collect', async (m) => {
                                if(isargtaken) return
                                let channel = m.mentions.channels.first() || message?.guild.channels.cache.get(m.content);
                                if (!channel) {
                                    return message?.channel.send(
                                        `${this.client.config.Client.emoji.cross} Please mention a valid channel!`
                                    );
                                }
                                await m.delete();
                                isargtaken = true
                                nunumsg.edit(`${this.client.config.Client.emoji.add} Please mention the role you want to set as the verification role!`)
                                let filter13 = (m) => {
                                    if (m.author.id === message?.member.id) return true;
                                    return false;
                                }
                                const collector13 = message?.channel.createMessageCollector({ filter: filter13, time: 60000 });
                                collector13.on('collect', async (m) => {
                                    let role = m.mentions.roles.first() || message?.guild.roles.cache.get(m.content);
                                    if (!role) {
                                        return message?.channel.send(
                                            `${this.client.config.Client.emoji.cross} Please mention a valid role!`
                                        );
                                    }
                                    const perms = await this.client.util.rolePerms(role);
                                    if (perms) {
                                        msg.delete()
                                        return message?.channel.send(
                                            `${this.client.config.Client.emoji.cross} You can't set a role with dangerous permissions as the verification role!`
                                        );
                                    }
                                    await m.delete();
                                    guildVerificationData.enabled = true
                                    guildVerificationData.channel = channel.id
                                    guildVerificationData.role = role.id
                                    await this.client.database.guildVerificationData.post(message?.guild.id, guildVerificationData)
                                    await nunumsg.edit(`${this.client.config.Client.emoji.tick} Verification has been enabled!`)
                                    let veriembed = this.client.util.embed()
                                        .setDescription(`Welcome to ${message?.guild.name}! Please react to this message to verify yourself.`)
                                        .setColor(this.client.config.Client.PrimaryColor)
                                        .setFooter({ text: `© ${message?.guild.name} | Verification`, iconURL: message?.guild.iconURL() });
                                    await channel.send({
                                        embeds: [veriembed], components: [
                                            {
                                                type: 1,
                                                components: [
                                                    {
                                                        type: 2,
                                                        style: 3,
                                                        label: "Verify",
                                                        custom_id: "verify_server",
                                                        emoji: "1047852965760868423",
                                                    },
                                                ],
                                            },
                                        ]
                                    });
                                    collector13.stop()
                                    collector12.stop()
                                    collector11.stop()
                                    await this.client.sleep(1000)
                                    nunumsg.delete().catch(() => { });
                                    resolve()
                                })
                                collector13.on('end', async (collected, reason) => {
                                    if (reason === 'time') {
                                        await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                                        await collector13.stop()
                                        await msg.delete()
                                        return
                                    }
                                }
                                )
                            })
                            collector12.on('end', async (collected, reason) => {
                                if (reason === 'time') {
                                    await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                                    await collector12.stop()
                                    await msg.delete()
                                    return
                                }
                            }
                            )
                        }
                        if (i.customId === 'no') {
                            await i.deferUpdate()
                            await collector11.stop()
                            resolve()
                        }
                    })
                })

            }
            if (!guildData.presenserole.enabled) {
                embed.setDescription(`${this.client.config.Client.emoji.info} Presence Role is disabled!, Would You Like To Enable It?`)
                compos = [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Yes",
                                style: 3,
                                custom_id: "yes"
                            },
                            {
                                type: 2,
                                label: "No",
                                style: 4,
                                custom_id: "no"
                            }
                        ]
                    }
                ]
                await msg.edit({ embeds: [embed], components: compos })
                let filter14 = (i) => {
                    if (i.user.id === message?.member.id) return true;
                    return false;
                }
                const collector14 = msg.createMessageComponentCollector({ filter: filter14, time: 60000 });
                // for verification we have to collect 2 things first the channel and then the role so we will use a promise
                await new Promise((resolve) => {
                    collector14.on('collect', async (i) => {
                        if (i.customId === 'yes') {
                            let gamelist = ["Visual Studio Code", "Spotify", "Netflix", "Twitch", "Minecraft", "Fortnite", "Roblox", "Valorant", "League of Legends", "Grand Theft Auto V"];
                            await i.deferUpdate()
                            // now we have to create a select menu with all the games in it and then we will use the select menu to get the game
                            let selectmenu = {
                                type: 1,
                                components: [
                                    {
                                        type: 3,
                                        custom_id: "selectmenu",
                                        min_values: 1,
                                        max_values: gamelist.length,
                                        placeholder: "Select a game",
                                        options: gamelist.map((game) => ({
                                            label: game,
                                            value: game,
                                        })),
                                    },
                                ],
                            };
                            nunumsg = await message?.channel.send({ content: `${this.client.config.Client.emoji.add} Please select the game you want to set as the game for the presence role!`, components: [selectmenu] })
                            let filter15 = (i) => {
                                if (i.user.id === message?.member.id) return true;
                                return false;
                            }
                            const collector15 = nunumsg.createMessageComponentCollector({ filter: filter15, time: 60000 });
                            collector15.on('collect', async (i) => {
                                await i.deferUpdate()
                                if (i.customId === 'selectmenu') {
                                    await nunumsg.edit(`${this.client.config.Client.emoji.loading} Please wait while we are creating the roles!`)
                                    // now we have to create the roles of the selected value create a loop and push its name and id to an array
                                    let roles = []
                                    for (let j = 0; j < i.values.length; j++) {
                                        let role = await message?.guild.roles.create({
                                            name: i.values[j],
                                            hoist: true,
                                            reason: `Creating role for activity "${i.values[j]}"`
                                        });
                                        roles.push({ name: i.values[j], id: role.id });
                                    }
                                    // now push it to database according to the game from fetching the roles

                                    guildData.presenserole.enabled = true
                                    let guild = message?.guild
                                    guildData.presenserole.gtav = guild.roles.cache.find((r) => r.name === "Grand Theft Auto V") ? guild.roles.cache.find((r) => r.name === "Grand Theft Auto V").id : null
                                    guildData.presenserole.leagueoflegends = guild.roles.cache.find((r) => r.name === "League of Legends") ? guild.roles.cache.find((r) => r.name === "League of Legends").id : null
                                    guildData.presenserole.roblox = guild.roles.cache.find((r) => r.name === "Roblox") ? guild.roles.cache.find((r) => r.name === "Roblox").id : null
                                    guildData.presenserole.minecraft = guild.roles.cache.find((r) => r.name === "Minecraft") ? guild.roles.cache.find((r) => r.name === "Minecraft").id : null
                                    guildData.presenserole.fortnite = guild.roles.cache.find((r) => r.name === "Fortnite") ? guild.roles.cache.find((r) => r.name === "Fortnite").id : null
                                    guildData.presenserole.valorant = guild.roles.cache.find((r) => r.name === "Valorant") ? guild.roles.cache.find((r) => r.name === "Valorant").id : null
                                    guildData.presenserole.spotify = guild.roles.cache.find((r) => r.name === "Spotify") ? guild.roles.cache.find((r) => r.name === "Spotify").id : null
                                    guildData.presenserole.netflix = guild.roles.cache.find((r) => r.name === "Netflix") ? guild.roles.cache.find((r) => r.name === "Netflix").id : null
                                    guildData.presenserole.twitch = guild.roles.cache.find((r) => r.name === "Twitch") ? guild.roles.cache.find((r) => r.name === "Twitch").id : null
                                    guildData.presenserole.vscode = guild.roles.cache.find((r) => r.name === "Visual Studio Code") ? guild.roles.cache.find((r) => r.name === "Visual Studio Code").id : null
                                    await this.client.database.guildData.presenserole(message?.guild.id, guildData.presenserole)
                                    await nunumsg.edit({ content: `${this.client.config.Client.emoji.tick} Successfully enabled presence role!`, components: [] })
                                    await this.client.sleep(1000)
                                    await nunumsg.delete().catch(() => { })
                                    await collector15.stop()
                                    await collector14.stop()
                                    resolve()
                                }
                            })
                            collector15.on('end', async (collected, reason) => {
                                if (reason === 'time') {
                                    await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                                    await collector15.stop()
                                    await msg.delete()
                                    return
                                }
                            }
                            )
                        }
                        if (i.customId === 'no') {
                            await i.deferUpdate()
                            await collector14.stop()
                            resolve()
                        }
                    })
                })
            }
            let checkuser = await this.client.database.welcomeUserData.get(message?.member.id)
            if (checkuser.premium && checkuser.premiumCount > 0) {
                embed.setDescription(`${this.client.config.Client.emoji.info} You have premium! Would you like to activate the premium?`)
                let compos = [
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
                ];
                await msg.edit({ embeds: [embed], components: compos })
                let filter14 = (i) => {
                    if (i.user.id === message?.member.id) return true;
                    return false;
                }
                const collector14 = msg.createMessageComponentCollector({ filter: filter14, time: 60000 });
                await new Promise((resolve) => {
                    collector14.on('collect', async (i) => {
                        if (i.customId === 'yes') {
                            await i.deferUpdate()
                            let premiumExpires = new Date();
                            premiumExpires.setMonth(premiumExpires.getMonth() + 1);
                            guildData.premiumUntil = premiumExpires.getTime();
                            guildData.premium = true;
                            await this.client.database.guildData.set(message?.guild.id, guildData)
                            checkuser.premiumCount = checkuser.premiumCount - 1
                            if (checkuser.premiumCount === 0) checkuser.premium = false
                            await this.client.database.welcomeUserData.post(message?.member.id, checkuser)
                            await collector14.stop()
                            resolve()
                        }
                        if (i.customId === 'no') {
                            await i.deferUpdate()
                            await collector14.stop()
                            resolve()
                        }
                    }
                    )
                    collector14.on('end', async (collected, reason) => {
                        if (reason === 'time') {
                            await msg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                            await collector14.stop()
                            await msg.delete()
                            return
                        }
                    }
                    )
                })

            }
            let antiNukeData = await this.client.database.antiNukeData.get(message?.guild.id)
            if (!antiNukeData.enabled) {
                embed.setDescription(`${this.client.config.Client.emoji.info} Would you like to enable Antinuke?`)
                let compos = [
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
                ];
                await msg.edit({ embeds: [embed], components: compos })
                let filter15 = (i) => {
                    if (i.user.id === message?.member.id) return true;
                    return false;
                }
                const collector15 = msg.createMessageComponentCollector({ filter: filter15, time: 60000 });
                await new Promise((resolve) => {
                    collector15.on('collect', async (i) => {
                        if (i.customId === 'yes') {
                            await i.deferUpdate()
                            antiNukeData.enabled = true
                            let logChannel = await message.guild.channels.create({
                                name: "Prismo-logs",
                                type: 0,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        deny: ["ViewChannel"],
                                    },
                                    {
                                        id: this.client.user.id,
                                        allow: ["ViewChannel", "SendMessages", "ManageMessages"],
                                    },
                                ],
                            });
                            antiNukeData.logChannelid = logChannel.id
                            await this.client.database.antiNukeData.post(message?.guild.id, antiNukeData)
                            await collector15.stop()
                            resolve()
                        }
                        if (i.customId === 'no') {
                            await i.deferUpdate()
                            await collector15.stop()
                            resolve()
                        }
                    }
                    )
                    collector15.on('end', async (collected, reason) => {
                        if (reason === 'time') {
                            await msg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                            await collector15.stop()
                            await msg.delete()
                            return
                        }
                    }
                    )
                })
            }
            let enabledaraay = []
            if (automodon) enabledaraay.push("Automod")
            if (guildData.welcome.channel !== null) enabledaraay.push("Welcome")
            if (guildData.autorole.enabled) enabledaraay.push("Autorole")
            if (guildData.greet.enabled) enabledaraay.push("Greet")
            if (guildData.presenserole.enabled) enabledaraay.push("Presence Role")
            if( guildVerificationData.enabled) enabledaraay.push("Verification")
            if (guildData.premium) enabledaraay.push("Premium")
            if (antiNukeData.enabled) enabledaraay.push("Antinuke")
            if (enabledaraay.length === 0) enabledaraay.push("None")
            let disabledaraay = []
            if (!automodon) disabledaraay.push("Automod")
            if (guildData.welcome.channel === null) disabledaraay.push("Welcome")
            if (!guildData.autorole.enabled) disabledaraay.push("Autorole")
            if (!guildData.greet.enabled) disabledaraay.push("Greet")
            if (!guildData.presenserole.enabled) disabledaraay.push("Presence Role")
            if(!guildVerificationData.enabled) disabledaraay.push("Verification")
            if (!guildData.premium) disabledaraay.push("Premium")
            if (!antiNukeData.enabled) disabledaraay.push("Antinuke")
            if (disabledaraay.length === 0) disabledaraay.push("None")
            let successembed = this.client.util.embed()
                .setDescription(`${this.client.config.Client.emoji.Exclamation} Setup Wizard has been completed!\n\n${this.client.config.Client.emoji.add} Prefix: \`${guildData.prefix}\`\n${enabledaraay.map((x) => `${this.client.config.Client.emoji.tick} ${x}`).join("\n")}\n${disabledaraay.map((x) => `${this.client.config.Client.emoji.cross} ${x}`).join("\n")}`)
                .setColor(this.client.PrimaryColor)
                .setFooter({ text: `Setup Wizard | ${message?.guild.name}`, iconURL: this.client.user.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(message?.guild.iconURL({ dynamic: true }))
            await msg.edit({ embeds: [successembed], components: [] }).catch(() => { })
    }
};