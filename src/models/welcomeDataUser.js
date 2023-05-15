const { Schema, model } = require("mongoose");

const welcomeDataUser = new Schema({
    id: { type: String, required: true },
    premium: { type: Boolean, default: false },
    premiumCount: { type: Number, default: 0 },
    message: {
        type: Array,
        default: [
            {
                id: "example1",
                name: "Preset 1",
                content: "Welcome $user_mention to $guild_name!",
                embeds: {
                    title: "$guild_name",
                    description:
                        "$user_mention Welcome to the guild! We hope you enjoy your stay!",
                    color: 0xff0000,
                    footer: {
                        icon_url: "$guild_iconurl",
                    },
                },
            },
            {
                id: "example2",
                name: "Preset 2",
                content: "Welcome $user_mention to $guild_name!",
                embeds: {
                    title: "♡・welcyy ゛﹒𓂃",
                    description:
                        "<a:dot:1047385974692392960>Check Out Rules\n<a:dot:1047385974692392960>Boost if you love the guild\n\n<a:ace_heart_4:1047386085879197738> Don't leave us",
                    color: 0x2f3136,
                    footer: {
                        icon_url: "$guild_iconurl",
                    },
                },
            },
            {
                id: "example3",
                name: "Preset 3",
                content: "Welcome $user_mention to $guild_name!",
                embeds: {
                    title: "Heyo $user_username!",
                    description:
                        "Welcome to $guild_name! We are a small community that is growing everyday! We hope you enjoy your stay!",
                    color: 0x00ff00,
                    footer: {
                        icon_url: "$guild_iconurl",
                    },
                },
            },
        ],
    },
});

module.exports = model("welcomeDataUser", welcomeDataUser);
