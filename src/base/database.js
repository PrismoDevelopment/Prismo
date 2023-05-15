const guildData = require("./database/guildData");
const welcomeUserData = require("./database/welcomeUserData");
const noprefixUserData = require("./database/noprefixUserData");
const emojiData = require("./database/emojiData");
const stickynickData = require("./database/stickynickData");
const xhotuPermsData = require("./database/xhotuPermsData");
const guildVerificationData = require("./database/guildVerificationData");
module.exports = class database {
    /**
     *
     * @param {import('./PrismoClient')} client
     */
    constructor(client) {
        this.client = client;
        this.guildData = new guildData(this);
        this.welcomeUserData = new welcomeUserData(this);
        this.noprefixUserData = new noprefixUserData(this);
        this.emojiData = new emojiData(this);
        this.stickynickData = new stickynickData(this);
        this.xhotuPermsData = new xhotuPermsData(this);
        this.guildVerificationData = new guildVerificationData(this);
    }
};
