const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');

const data = new Schema({
    _id: { type: String, required: true },
    hoster: { type: String },
    messageId: { type: String },
    guildId: { type: String },
    channelId: { type: String },
    startsAt: { type: Number },
    endsAt: { type: Number },
    ended: { type: Boolean },
    winnerCount: { type: Number },
    prize: { type: String },
    winners: { type: [String], default: [] },
    entered: { type: [String], default: [] },
    reaction: { type: String, default: '1121823929204482148' },
    extraData: { type: mongoose.Mixed },
    messages: {
        embedColor: { type: Number },
        description: { type: String },
        title: { type: String },
        url: { type: String },
        image: { type: String },
    }
});

module.exports = model('GiveawayData', data);