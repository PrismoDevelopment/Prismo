module.exports = class Presencefunction {
    /**
     *
     * @param {import('../PrismoClient')} client
     */
    constructor(client) {
        this.client = client;
    }
    async presence(message, args, slash = false) {
        if (slash) {
            args = [message.options.getSubcommand()]
        }
        let guildData = await this.client.database.guildData.get(message?.guild.id);
        if (!args[0]) return message.channel.send({ content: "Please provide a valid option to enable/disable presence roles." });
        if (args[0].toLowerCase() == "enable" || args[0].toLowerCase() == "on" || args[0].toLowerCase() == "true" || args[0].toLowerCase() == "set") {
            if (guildData.presenserole.enabled) return message.channel.send({ content: "Presence roles are already enabled." });
            await this.client.sleep(1000);
            let nunumsg;
            let gamelist = ["Visual Studio Code", "Spotify", "Netflix", "Twitch", "Minecraft", "Fortnite", "Roblox", "Valorant", "League of Legends", "Grand Theft Auto V"];
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
                    await collector15.stop()
                }
            })
            collector15.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    await nunumsg.edit(`${this.client.config.Client.emoji.cross} Command timed out!`)
                    await collector15.stop()
                    return
                }
            }
            )


        } else if (args[0] === 'disable' || args[0] === 'off' || args[0] === 'false' || args[0] === 'remove') {
            if (!guildData.presenserole.enabled) return message.channel.send({ content: "Presence roles are already disabled." });
            let msg = await message.channel.send({ content: "Disabling presence roles will delete all the roles created by the bot" })
            await msg.edit({ content: `${this.client.config.Client.emoji.loading} Please wait while we are deleting the roles!` })
            let guild = message?.guild
            let roles = []
            if (guildData.presenserole.gtav) roles.push(guildData.presenserole.gtav)
            if (guildData.presenserole.leagueoflegends) roles.push(guildData.presenserole.leagueoflegends)
            if (guildData.presenserole.roblox) roles.push(guildData.presenserole.roblox)
            if (guildData.presenserole.minecraft) roles.push(guildData.presenserole.minecraft)
            if (guildData.presenserole.fortnite) roles.push(guildData.presenserole.fortnite)
            if (guildData.presenserole.valorant) roles.push(guildData.presenserole.valorant)
            if (guildData.presenserole.spotify) roles.push(guildData.presenserole.spotify)
            if (guildData.presenserole.netflix) roles.push(guildData.presenserole.netflix)
            if (guildData.presenserole.twitch) roles.push(guildData.presenserole.twitch)
            if (guildData.presenserole.vscode) roles.push(guildData.presenserole.vscode)
            for (let i = 0; i < roles.length; i++) {
                await guild.roles.cache.get(roles[i])?.delete()
            }
            guildData.presenserole.enabled = false
            guildData.presenserole.gtav = null
            guildData.presenserole.leagueoflegends = null
            guildData.presenserole.roblox = null
            guildData.presenserole.minecraft = null
            guildData.presenserole.fortnite = null
            guildData.presenserole.valorant = null
            guildData.presenserole.spotify = null
            guildData.presenserole.netflix = null
            guildData.presenserole.twitch = null
            guildData.presenserole.vscode = null
            await this.client.database.guildData.presenserole(message?.guild.id, guildData.presenserole)
            await msg.edit({ content: `${this.client.config.Client.emoji.tick} Successfully disabled presence role!`, components: [] })
        } else if (args[0] === 'show' || args[0] === 'list') {
            if (!guildData.presenserole.enabled) return message.channel.send({ content: "Presence roles are disabled." });
            let embed = this.client.util.embed()
                .setTitle("Presence Roles")
                .setColor(this.client.config.Client.PrimaryColor)
            if (guildData.presenserole.gtav) embed.addFields({ name: "Grand Theft Auto V", value: `<@&${guildData.presenserole.gtav}>`, inline: true }) 
            if (guildData.presenserole.leagueoflegends) embed.addFields({ name: "League of Legends", value: `<@&${guildData.presenserole.leagueoflegends}>`, inline: true })
            if (guildData.presenserole.roblox) embed.addFields({ name: "Roblox", value: `<@&${guildData.presenserole.roblox}>`, inline: true })
            if (guildData.presenserole.minecraft) embed.addFields({ name: "Minecraft", value: `<@&${guildData.presenserole.minecraft}>`, inline: true })
            if (guildData.presenserole.fortnite) embed.addFields({ name: "Fortnite", value: `<@&${guildData.presenserole.fortnite}>`, inline: true })
            if (guildData.presenserole.valorant) embed.addFields({ name: "Valorant", value: `<@&${guildData.presenserole.valorant}>`, inline: true })
            if (guildData.presenserole.spotify) embed.addFields({ name: "Spotify", value: `<@&${guildData.presenserole.spotify}>`, inline: true })
            if (guildData.presenserole.netflix) embed.addFields({ name: "Netflix", value: `<@&${guildData.presenserole.netflix}>`, inline: true })
            if (guildData.presenserole.twitch) embed.addFields({ name: "Twitch", value: `<@&${guildData.presenserole.twitch}>`, inline: true })
            if (guildData.presenserole.vscode) embed.addFields({ name: "Visual Studio Code", value: `<@&${guildData.presenserole.vscode}>`, inline: true })
            message.channel.send({ embeds: [embed] })
        }
    }
};
