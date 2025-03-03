/*
 * Copyright (C) 2025 Vaxera
 * Licensed under the Prismo License v2.0
 * Unauthorized use, distribution, or modification is strictly prohibited.
 * Legal actions, including DMCA takedowns and financial penalties, may apply.
 */
const PrismoClient = require("../base/PrismoClient");
const request = new (require('rss-parser'))();
class Youtube_notification {
    /**
     * @param {PrismoClient} client;
     */
    constructor(client) {
        this.client = client;
    }

    async checkyt() {
        try {
            this.client.database.ytData.all().then(async (data) => {
            const filteredData = data.filter((d) => d.ytchannel !== null);
            for (const d of filteredData) {
                request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${d.ytchannel}`)
                .then(async (res) => {
                    if(!res?.items[0]?.id) return;
                    if(d?.postedvids?.includes(res?.items[0]?.id)) return;
                    const channel = await this.client.channels?.fetch(d.channel);
                    if(!channel) return;
                    let message = `Hey ${d.ping ? "@everyone" : "Members"}, **${res?.items[0]?.author}** just uploaded a new video! | **${res?.items[0]?.title}**\n${res?.items[0]?.link}`;
                    channel?.send({content: message, allowedMentions: {parse: ["everyone"]}}).catch((err) => {})
                    d?.postedvids?.push(res?.items[0]?.id);
                    await this.client.database.ytData.post(d.id, d);
                })
                .catch((err) => {
                    return;
                });
            }
        });
        } catch (error) {
            return;
        }
    }
}



module.exports = Youtube_notification;
