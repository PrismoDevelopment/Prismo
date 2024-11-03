const NodeCache = require("node-cache");

module.exports = class CacheManager {
    /**
     *
     * @param {import('./PrismoClient')} client
     */
    constructor(client) {
        this.client = client;
        this.cache = new NodeCache();
    }

    async get(key) {
        try {
            const data = this.cache.get(key);
            if (data === undefined) {
                return null;
            }
            return data;
        } catch (error) {
            // Handle the error
            console.error("Error in get request:", error);
            return null; // Or handle in a way appropriate for your use case
        }
    }

    async set(key, value) {
        try {
            this.cache.set(key, value);
            return { status: true };
        } catch (error) {
            // Handle the error
            console.error("Error in set request:", error);
            return { status: false, error: error.message };
        }
    }

    async setbulk(bulkdata) {
        try {
            for (const key in bulkdata) {
                if (bulkdata.hasOwnProperty(key)) {
                    this.cache.set(key, bulkdata[key]);
                }
            }
            return { status: true };
        } catch (error) {
            // Handle the error
            console.error("Error in setbulk request:", error);
            return { status: false, error: error.message };
        }
    }

    async flush() {
        try {
            this.cache.flushAll();
            return { status: true };
        } catch (error) {
            // Handle the error
            console.error("Error in flush request:", error);
            return { status: false, error: error.message };
        }
    }

    async delete(key) {
        try {
            const success = this.cache.del(key);
            return { status: success };
        } catch (error) {
            // Handle the error
            console.error("Error in delete request:", error);
            return { status: false, error: error.message };
        }
    }
}
