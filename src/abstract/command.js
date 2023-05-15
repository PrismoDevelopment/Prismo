const { Permissions, PermissionsBitField } = require("discord.js");

module.exports = class Command {
    /**
     *
     * @param {import('../base/PrismoClient')} client
     */
    constructor(client, name, options = {}) {
        this.client = client;
        this.name = options.name || name;
        this.aliases = options.aliases || [];
        this.description = options.description || "No description provided.";
        this.category = options.category || "general";
        this.usage = options.usage || [];
        this.examples = options.examples || [];
        this.userPerms = new PermissionsBitField(options.userPerms).freeze();
        this.botPerms = new PermissionsBitField(options.botPerms).freeze();
        this.speakPerms = options.speakPerms || [];
        this.cooldown = "cooldown" in options ? options.cooldown : 5 || 0;
        this.guildOnly = options.guildOnly || false;
        this.ownerOnly = options.ownerOnly || false;
        this.vote = options.vote || false;
        this.premium = options.premium || false;
        this.guildPremium = options.guildPremium || false;
        this.options = options.options || null;
    }
    get interactionData() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
        };
    }
};
