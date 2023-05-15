const embedFunction = require("./commands/embedFunction");
const welcomeFunction = require("./commands/welcomeFunction");
const roleFunction = require("./commands/roleFunction");
module.exports = class commandFunctions {
    /**
     *
     * @param {import('./PrismoClient')} client
     */
    constructor(client) {
        this.client = client;
        this.embedFunction = new embedFunction(client);
        this.welcomeFunction = new welcomeFunction(client);
        this.roleFunction = new roleFunction(client);
    }
};
