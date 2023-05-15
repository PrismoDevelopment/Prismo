const chalk = require("chalk");
const moment = require("moment");

module.exports = class Logger {
    static log(content, type = "log") {
        const timestamp = `[${moment()
            .utcOffset("+05:30")
            .format("DD.MM.yyyy / hh:mm A")}]:`;
        switch (type) {
            case "log": {
                return console.log(
                    `${timestamp} ${chalk.bgBlue(
                        type.toUpperCase()
                    )} ${content} `
                );
            }
            case "warn": {
                return console.log(
                    `${timestamp} ${chalk.black.bgYellow(
                        type.toUpperCase()
                    )} ${content} `
                );
            }
            case "error": {
                return console.log(
                    `${timestamp} ${chalk.bgRed(
                        type.toUpperCase()
                    )} ${content} `
                );
            }
            case "debug": {
                return console.log(
                    `${timestamp} ${chalk.green(
                        type.toUpperCase()
                    )} ${content} `
                );
            }
            case "cmd": {
                return console.log(
                    `${timestamp} ${chalk.black.bgWhite(
                        type.toUpperCase()
                    )} ${content}`
                );
            }
            case "ready": {
                return console.log(
                    `${timestamp} ${chalk.black.bgGreen(
                        type.toUpperCase()
                    )} ${content}`
                );
            }
            case "lavalink": {
                return console.log(
                    `${timestamp} ${chalk.black.bgGreen(
                        type.toUpperCase()
                    )} ${content}`
                );
            }
            case "lavalinkError": {
                return console.log(
                    `${timestamp} ${chalk.black.bgRed(
                        type.toUpperCase()
                    )} ${content}`
                );
            }
            case "shard": {
                return console.log(
                    `${timestamp} ${chalk.black.bgGreen(
                        type.toUpperCase()
                    )} ${content}`
                );
            }
        }
    }
    static error(content) {
        return this.log(content, "error");
    }
    static warn(content) {
        return this.log(content, "warn");
    }
    static debug(content) {
        return this.log(content, "debug");
    }
    static cmd(content) {
        return this.log(content, "cmd");
    }
};
