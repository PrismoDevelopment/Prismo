const Cluster = require("discord-hybrid-sharding");
const { Client, Shards } = require("./config");
const Logger = require("./src/base/logger");

const manager = new Cluster.Manager(`${__dirname}/src/base/main.js`, {
    totalShards: Shards.totalShards, // or 'auto'
    totalClusters: Shards.totalClusters,
    shardsPerClusters: Shards.shardsPerCluster,
    mode: "process",
    token: Client.Token,
});

manager.on("clusterCreate", (cluster) => {
    Logger.log(`Launched Cluster ${cluster.id}`, "shard");
    cluster.on("ready", () =>
        Logger.log(`Cluster ${cluster.id} Is Up And Running`, "shard")
    );
});
manager.spawn({ timeout: -1, delay: 1000 * 20 });
