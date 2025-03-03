/*
 * Copyright (C) 2024 Vaxera
 * Licensed under the Prismo License v1.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const Cluster = require("discord-hybrid-sharding");
const { Client, Shards } = require("./config");
const Logger = require("./src/base/logger");
const express = require('express')
const cors = require('cors')
const app = express()
const manager = new Cluster.ClusterManager(`${__dirname}/src/base/main.js`, {
    totalShards: Shards.totalShards,
    totalClusters: Shards.totalClusters,
    shardsPerClusters: Shards.shardsPerCluster,
    respawn: true,
    mode: "process",
    token: Client.Token,
});
manager.on("clusterCreate", (cluster) => {
    Logger.log(`Launched Cluster ${cluster.id}`, "shard");
    cluster.on("ready", () =>
        Logger.log(`Cluster ${cluster.id} Is Up And Running`, "shard")
    );
});
manager.spawn({ timeout: -1 });
app.use(cors({
    origin: '*'
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/stats', async (req, res) => {
    try {
        const promises = [
            manager.fetchClientValues('guilds.cache.size'),
            manager.fetchClientValues('users.cache.size'),
            manager.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)),
        ];
        Promise.all(promises).then(async results => {
            const totalUsers = results[2].reduce((prev, memberCount) => prev + memberCount, 0);
            const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
            res.json({
                users: totalUsers,
                guilds: totalGuilds,
            })
        })
    } catch (e) {
        res.status(200).json({
            users: 0,
            guilds: 0,
        })
    }
})
app.get('/commands', async (req, res) => {
    try {
        let data = []
        const commands = await manager.broadcastEval(c => c.commands.map(cmd => cmd.Global))
        const filter = commands.filter(x => x !== null && x !== undefined)[0];
        const filter2 = filter.filter(x => x.category !== "Owners");
        res.json(filter2)
    } catch (e) {
        console.log(e)
        res.status(200).json([])
    }
})
app.listen(3001, () => {
    Logger.log(`Server is running on port 3001`, "shard");
});
