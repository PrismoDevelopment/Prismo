const { readdirSync } = require("fs");
const Command = require("../../abstract/command.js");
const { Collection } = require("discord.js");

module.exports = class CommandHandler {
    /**
     *
     * @param {import('../PrismoClient')} client
     */
    constructor(client) {
        this.client = client;
        this.cmdBuilt = false;
        this.slashBuilt = false;
        this.size = 0;
    }
    async buildMessageCommands() {
        let index = 0;
        this.client.commands = new Collection();
        this.client.aliases = new Collection();
        if (this.cmdBuilt) return;

        readdirSync("./src/commands/").forEach((dir) => {
            const commands = readdirSync(`./src/commands/${dir}/`).filter(
                (file) => file.endsWith(".js")
            );
            for (let file of commands) {
                let path = `../../commands/${dir}/${file}`;
                delete require.cache[path];
                const File = require(path);
                if (!this.isClass(File))
                    throw new TypeError(
                        `Command ${file} doesn't export a class.`
                    );
                const command = new File(
                    this.client,
                    file.toLowerCase().split(".js")[0]
                );
                if (!(command instanceof Command))
                    throw new TypeError(
                        `Command ${file} dosen't belong in Commands.`
                    );
                command.fileName = file.split(".js")[0];
                this.client.commands.set(command.name, command);
                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        this.client.aliases.set(alias, command.name);
                    }
                }
                index++;
            }
        });
        this.size = index;
        this.cmdBuilt = true;
        return this;
    }

    isClass(input) {
        return (
            typeof input === "function" &&
            typeof input.prototype === "object" &&
            input.toString().substring(0, 5) === "class"
        );
    }
};
