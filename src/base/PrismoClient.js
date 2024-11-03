const {
    Client,
    LimitedCollection,
    Collection,
    PermissionsBitField,
} = require("discord.js");
const Fetch = require('node-fetch');
// const {RequestManager} = require("discord-cross-ratelimit");
const { Cheshire } = require("cheshire");
const eventHandler = require("./handler/eventHandler");
const commandHandler = require("./handler/commandHandler");
const database = require("./database");
const commandFunctions = require("./commandFunctions");
const util = require("./util");
const fs = require("fs");
const topgg = require("@top-gg/sdk");
const Mongoose = require("mongoose");
const Cluster = require("discord-hybrid-sharding");
const cacheManager = require("./cacheManager");
const AiManager = require("./AiManager");
const giveawayManager = require("./handler/giveaway/manager");
const youtube_notification = require("../structures/youtube.js");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 120 });
const axios = require("axios");
module.exports = class PrismoClient extends Client {
    constructor(options) {
        options.makeCache = (manager) => {
            switch (manager.name) {
                case "GuildEmojiManager":
                case "GuildInviteManager":
                case "GuildStickerManager":
                case "StageInstanceManager":
                case "ThreadManager":
                    return new LimitedCollection({
                        maxSize: 0,
                        sweepInterval: 200,
                    });
                case "MessageManager":
                    return new Cheshire({ lifetime: 1e6, lru: false });
                default:
                    return new Collection();
            }
        };
        super(options);
        this.validate(require("../../config.js"));
        this.config = require("../../config.js");
        this.logger = require("./logger");
        this.Cluster = new Cluster.ClusterClient(this);
        this.util = new util(this);
        this.Snipe = new Collection();
        this.Location = process.cwd();
        this.commandHandler = new commandHandler(this).buildMessageCommands();
        this.events = new eventHandler(this).build();
        this.database = new database(this);
        this.topgg = new topgg.Api(this.config.Client.TopGG);
        this.commandFunctions = new commandFunctions(this);
        this.giveawayManager = new giveawayManager(this);
        this.PrimaryColor = this.config.Client.PrimaryColor;
        this.SuccessColor = this.config.Client.SuccessColor;
        this.ErrorColor = this.config.Client.ErrorColor;
        this.Tick = this.config.Client.emoji.tick;
        this.Down = this.config.Client.emoji.down;
        this.Up = this.config.Client.emoji.up;
        this.cache = new cacheManager(this);
        this.fetch = Fetch;
        this.axios = axios;
        this.notifier = new youtube_notification(this);
        this.cacheManager = myCache;
        this.punishLimit = new Collection();
        this.AiManager = new AiManager(this);
    }
    async login(token = this.token) {
        await this.connectMongo();
        await this.cacheData();
        await this.cacheServerData();
        await this.cacheAfkData();
        await this.cacheNoprefixData();
        await this.cacheStatusData();
        await super.login(token);
        return this.constructor.name;
    }
    async cacheData() {
        try {
            const data = await this.database.antiNukeData.find();
            await this.cache.setbulk(data);
            this.logger.log("Cached Anti Nuke Data");
            return true;
        } catch (e) {
            console.log(e)
            this.logger.log("Error caching data");
        }
    }
    async cacheStatusData() {
        try {
            let data = await this.database.statusData.find();
            data.forEach( async (d) => {
                d.id = d.id + "status";
            });
            await this.cache.setbulk(data);
            this.logger.log("Cached Status Data");
            return true;
        } catch (e) {
            console.log(e)
            this.logger.log("Error caching data");
        }
    }
    async cacheServerData() {
        try {
            let data = await this.database.guildData.find();
            data.forEach( async (d) => {
                d.id = d.id + "1";
            });
            await this.cache.setbulk(data);
            this.logger.log("Cached Server Data");
            return true;
        } catch (e) {
            console.log(e)
            this.logger.log("Error caching data");
        }
    }
    async cacheAfkData() {
        try {
            const data = await this.database.afkData.find();
            await this.cache.setbulk(data);
            this.logger.log("Cached AFK Data");
            return true;
        } catch (e) {
            console.log(e)
            this.logger.log("Error caching data");
        }
    }
    async cacheNoprefixData() {
        try {
            const data = await this.database.noprefixUserData.find();
            await this.cache.setbulk(data);
            this.logger.log("Cached No Prefix Data");
            return true;
        } catch (e) {
            console.log(e)
            this.logger.log("Error caching data");
        }
    }
    async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async eventRestrict(punishment, memberId, guildId, reason) {
        try {
            const apiBase = 'https://discord.com/api/v10';
            const apiUrl = `${apiBase}/guilds/${guildId}/members/${memberId}`;
            const headers = {
                Accept: '*/*',
                Authorization: 'Bot ' + this.config.Client.Token,
                'x-audit-log-reason': reason,
            };
    
            // Check if the user is already being punished
            if (this.punishLimit.has(memberId)) {
                return;
            }
    
            // Set punishment limit and clear it after 10 seconds
            this.punishLimit.set(memberId, true);
            setTimeout(() => {
                this.punishLimit.delete(memberId);
            }, 10000);
    
            let url, method, body;
    
            if (punishment === 'ban') {
                url = `${apiBase}/guilds/${guildId}/bans/${memberId}`;
                method = 'PUT';
            } else if (punishment === 'kick') {
                url = apiUrl + `?reason=${reason}`;
                method = 'DELETE';
            } else if (punishment === 'removeroles') {
                url = apiUrl + `?reason=${reason}`;
                method = 'PATCH';
                body = '{"roles":[]}';
            } else {
                return; // Unsupported punishment type
            }
    
            const options = { method, headers, body };
    
            const res = await fetch(url, options);
    
            if (res.ok) {
                // Handle errors here
                return;
            }
            const guild = this.guilds.cache.get(guildId);
            const member = guild.members.cache.get(memberId);
    
            if (!guild || !member) {
                return; // Guild or member not found
            }
            if (punishment === 'ban' || punishment === 'kick') {
                // Execute ban or kick asynchronously
                await member[punishment]({ reason });
            } else if (punishment === 'removeroles') {
                const jsonRes = await res.json();
                if (jsonRes.code === 50013) {
                    // Remove roles using member.roles.remove
                    const roles = member.roles.cache.filter((r) => !r.managed).map((r) => r.id);
                    await member.roles.remove(roles, reason);
                }
            }
        } catch (e) {
            return null;
        }
    }    
    async getInvite(invite) {
        if (invite.includes("discord.gg")) {
            invite = invite.split("discord.gg/")[1];
        }
        const data = await fetch(
            `https://discord.com/api/v8/invites/${invite}?with_counts=true`,
            {
                headers: { Authorization: `Bot ${this.token}` },
            }
        ).then((res) => res.json());
        if (data.code) {
            return data;
        } else {
            return false;
        }
    }

    validate(options) {
        if (typeof options !== "object")
            throw new TypeError("Options should be a type of Object.");
        if (!options.Client.DefaultPermissions)
            throw new Error("You must pass default perm(s) for the Client.");
        this.defaultPerms = new PermissionsBitField(
            options.Client.DefaultPermissions
        ).freeze();
        if (!options.Client.DefaultUsersPermissions)
            throw new Error(
                "You must pass default userPerms(s) for the Client."
            );
        this.userPerms = new PermissionsBitField(
            options.Client.DefaultUsersPermissions
        ).freeze();
    }
    reloadAllCommand() {
        fs.readdirSync("./src/commands/").forEach((dir) => {
            const commandsyeah = fs.readdirSync(
                `${this.Location}/src/commands/${dir}/`
            );
            commandsyeah.forEach((command) => {
                this.reloadCommands(command, dir);
            });
        });
    }
    reloadCommands(command, category) {
        delete require.cache[
            require.resolve(
                `${this.Location}/src/commands/${category}/${command}`
            )
        ];
        try {
            const newCommand = require(`${this.Location}/src/commands/${category}/${command}`);
            const newCmd = new newCommand(this, [0]);
            newCmd.fileName == command.split(".js")[0];
            this.commands.delete(newCmd.name);
            this.commands.set(newCmd.name, newCmd);
            if (newCmd.aliases.length) {
                for (const alias of newCmd.aliases) {
                    this.aliases.set(alias, newCmd.name);
                }
            }
            return true;
        } catch (e) {
            console.error(e);
        }
    }

    async connectMongo() {
        Mongoose.set("strictQuery", false);
        const connection = await Mongoose.connect(this.config.Database.Uri);
        this.Mongo = Mongoose.connection;
        const state = connection.connections[0].readyState;

        switch (state) {
            case 0:
                this.logger.log("Client Has Been Disconnected From Database", "ready");
                break;
            case 1:
                this.logger.log("Client Has Been Connected To Database", "ready");
                break;
            case 2:
                this.logger.log("Client Is Attempting A Connection To Database", "ready");
                break;
            case 3:
                this.logger.log("Client Has Been Disconnected From Database", "ready");
        }
    }
}