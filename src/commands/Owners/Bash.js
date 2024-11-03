const Command = require("../../abstract/command");
const { exec } = require("child_process");

module.exports = class Bash extends Command {
    constructor(...args) {
        super(...args, {
            name: "bash",
            aliases: ["$", "bash"],
            description: "Evaluate the bot",
            category: "Owners",
            ownerOnly: true,
            cooldown: 0,
        });
    }

    async run({ message, args }) {
        let value = args.join(" ");
        if (!value) return message.channel?.send('No arguments passed!').catch(e => {
            return;
        });
        if (value.toLowerCase().includes('ping')) {
            value = `${value} -c 5`;
        }
        if (value.toLowerCase().includes('rm -rf')) return message.channel?.send('Not Allowed!').catch(e => {
            return;
        });
        if (value.toLowerCase().includes('nano') || value.toLowerCase().includes('vim') || value.toLowerCase().includes('vi')) return message.channel?.send('Nope!').catch(e => {
            return;
        });
        if (value.toLowerCase().includes('top')) {
            value = 'top -b -n 1';
        }
        if (value.toLowerCase().includes('pm2 logs')) {
            value = 'pm2 logs --lines 10';
        }
        let m = await message.channel?.send(`>_ ${args.join(' ')}`).catch(e => {
            return;
        });
        exec(value, { timeout: 10000, maxBuffer: 1024 * 1024 }, async (err, stdout, stderr) => {
            if (err) {
                let embed = this.client.util.embed()
                    .setTitle('Error')
                    .setDescription(`\`\`\`js\n${err}\n\`\`\``)
                    .setColor(this.client.config.Client.PrimaryColor)
                    .setTimestamp()
                    .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
                return m.edit({ content: null, embeds: [embed] }).catch(e => {
                    return;
                }
                );
            }
            if (stdout.length > 2048) {
                let nunnu = this.client.util.largeMessage(stdout, 'txt');
                m.edit({ content: null, files: [nunnu] }).catch(e => {
                    return;
                }
                );
                return;
            }
            let newoutput = [];
            for (const output of stdout.split('\n')) {
                newoutput.push(output);
                let embed = this.client.util.embed()
                    .setTitle('Output')
                    .setDescription(`\`\`\`js\n${newoutput.join('\n')}\n\`\`\``)
                    .setColor(this.client.config.Client.PrimaryColor)
                    .setTimestamp()
                    .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
                await m.edit({ content: null, embeds: [embed] }).catch(e => {
                    return;
                });
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        });
    }
}