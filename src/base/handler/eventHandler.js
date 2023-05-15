const { readdirSync } = require("fs");

module.exports = class EventHandler {
    constructor(client) {
        this.client = client;
        this.built = false;
        this.size = 0;
    }

    build() {
        if (this.built) return this;
        const events = readdirSync("./src/events");
        let index = 0;
        for (let event of events) {
            event = new (require(`../../events/${event}`))(this.client);
            const exec = event.exec.bind(event);
            event.once
                ? this.client.once(event.name, event.exec.bind(event))
                : this.client.on(event.name, exec);
            index++;
        }
        this.size = index;
        this.built = true;
        return this;
    }
};
