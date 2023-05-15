const EventEmitter = require("events");

module.exports = class Event extends EventEmitter {
    /**
     *
     * @param {import('../base/PrismoClient')} client
     */
    constructor(client) {
        super();
        this.client = client;
        if (this.constructor === Event)
            throw new TypeError(
                'Abstract class "MainEvent" cannot be instantiated directly.'
            );
        if (this.name === undefined)
            throw new TypeError(
                'Classes extending MainEvent must have a getter "name"'
            );
        if (this.once === undefined)
            throw new TypeError(
                'Classes extending MainEvent must have a getter "once"'
            );
        if (this.run === undefined)
            throw new TypeError(
                'Classes extending MainEvent must implement an async function "run"'
            );
        if (this.run.constructor.name !== "AsyncFunction")
            throw new TypeError(
                'Classes extending MainEvent must implement "run" as async function'
            );
        this.on("error", (error) => console.log(error));
    }

    exec(...args) {
        this.run(...args).catch((error) => this.emit("error", error));
    }
};
