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
        this.guildOnly = options.guildOnly || false;
        this.image = options.image || null;
    }
    get interactionData() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            defaultMemberPermissions: this.userPerms
        };
    }
    get Global() {
        return {
            name: this.name,
            description: this.description || "No description provided.",
            usage: this.usage ? this.usage : this.examples ? this.examples : "No usage provided.",
            category: this.category || "general",
            aliases: this.aliases || [],
            cooldown: this.cooldown || 0,
            userPerms: this.userPerms?.toArray() || [],
            botPerms: this.botPerms?.toArray() || [],
            vote: this.vote || false,
            premium: this.premium || false,
            image: this.image || null,
        }
    }
};
