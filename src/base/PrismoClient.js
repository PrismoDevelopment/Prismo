const {
    Client,
    Collection,
    PermissionsBitField,
} = require("discord.js");
const eventHandler = require("./handler/eventHandler");
const commandHandler = require("./handler/commandHandler");
const database = require("./database");
const commandFunctions = require("./commandFunctions");
const util = require("./util");
const topgg = require("@top-gg/sdk");
const mongoose = require("mongoose");
const Cluster = require("discord-hybrid-sharding");
module.exports = class PrismoClient extends Client {
    constructor(options) {
        super(options);
        this.validate(require("../../config.js"));
        this.config = require("../../config.js");
        this.logger = require("./logger");
        this.Cluster = new Cluster.Client(this);
        this.util = new util(this);
        this.Snipe = new Collection();
        this.Location = process.cwd();
        this.commandHandler = new commandHandler(this).buildMessageCommands();
        this.events = new eventHandler(this).build();
        this.database = new database(this);
        this.topgg = new topgg.Api(this.config.Client.TopGG);
        this.commandFunctions = new commandFunctions(this);
        this.PrimaryColor = this.config.Client.PrimaryColor;
        this.SuccessColor = this.config.Client.SuccessColor;
        this.ErrorColor = this.config.Client.ErrorColor;
        this.Tick = this.config.Client.Emoji.Tick;
        this.Down = this.config.Client.Emoji.Down;
        this.Up = this.config.Client.Emoji.Up;
    }
    async login(token = this.token) {
        await this.connectMongo();
        await super.login(token);
        return this.constructor.name;
    }
    async connectMongo() {
        const connection = await mongoose.connect(this.config.Database.Uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.mongo = mongoose.connection;
        let state = connection.connections[0]._readyState;

        switch (state) {
            case 0:
                this.logger.log(
                    "Client Has Been Disconnected From Database",
                    "ready"
                );
                break;
            case 1:
                this.logger.log(
                    "Client Has Been Connected To Database",
                    "ready"
                );
                break;
            case 2:
                this.logger.log(
                    "Client Is Attempting A Connection To Database",
                    "ready"
                );
                break;
            case 3:
                this.logger.log(
                    "Client Has Been Disconnected From Database",
                    "ready"
                );
        }
    }
};
