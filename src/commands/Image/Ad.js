const Command = require("../../abstract/command");
const DIG = require("discord-image-generation");
const { AttachmentBuilder, Message } = require("discord.js");

module.exports = class Ad extends Command {
    constructor(...args) {
        super(...args, {
            name: "ad",
            aliases: ["Ads", "Advertisement", "Advertise"],
            description: "Advertise a user",
            usage: ["Advertise <user>"],
            image:"https://imgur.com/V6ccssO",
            category: "Image",
            userPerms: ["SendMessages"],
            botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
            options: [
                {
                    name: "user",
                    description: "The user to Advertise",
                    type: 6,
                    required: false,
                },
            ],
        });
    }

    async execute(interactionOrMessage, args = null) {
        // Function to handle both messages and interactions
        const user = interactionOrMessage instanceof Message ? (args[0] ? await this.client.util.userQuery(args[0]) : interactionOrMessage?.author) : interactionOrMessage.options.getUser("user") || interactionOrMessage.user;
        const member = interactionOrMessage instanceof Message ? await this.client.users.fetch(user) : null; // Fetch user if it's a message
        const avatarURL = member?.displayAvatarURL({ size: 512, extension: "png" }); // Get PNG directly
    
        const imageBuffer = await new DIG.Ad().getImage(avatarURL);
        const attachment = new AttachmentBuilder(imageBuffer, { name: "Ad.png" });
    
        const embed = this.client.util.embed().setColor(this.client.config.Client.PrimaryColor).setDescription(`Ad ${member?.username}`).setImage("attachment://Ad.png");
        try {
          if (interactionOrMessage instanceof Message) {
            await interactionOrMessage.channel.send({ embeds: [embed], files: [attachment] });
          } else {
            await interactionOrMessage.deferReply(); // Only defer if an interaction
            await interactionOrMessage.editReply({ embeds: [embed], files: [attachment] });
          }
        } catch (error) {
          console.error("Error sending Ad image:", error);
          // Add error handling based on your project setup
        }
      }
    
      async run({ message, args }) {
        // Assuming 'run' is required by the abstract Command
        await this.execute(message, args);
      }
    
      async exec({ interaction }) {
        // Assuming 'exec' is required by the abstract Command
        await this.execute(interaction);
      }
    };