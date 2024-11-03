const Command = require("../../abstract/command"); // (Please provide this file)
const DIG = require("discord-image-generation");
const { AttachmentBuilder, Message } = require("discord.js");

module.exports = class Beautiful extends Command {
  constructor(...args) {
    super(...args, {
      name: "beautiful",
      description: "Generates a 'beautiful' image of a user", // More concise
      usage: ["beautiful [user]"], // Optional argument indicated with []
      category: "Image", // Change to a more fitting category
      userPerms: ["SendMessages"],
      botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"], // Assuming these are the minimum needed
      options: [
        {
          name: "user",
          description: "The user to make beautiful",
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

    const imageBuffer = await new DIG.Beautiful().getImage(avatarURL);
    const attachment = new AttachmentBuilder(imageBuffer, { name: "beautiful.png" });

    const embed = this.client.util.embed().setColor(this.client.config.Client.PrimaryColor).setDescription(`Beautiful ${member?.username}`).setImage("attachment://beautiful.png");
    try {
      if (interactionOrMessage instanceof Message) {
        await interactionOrMessage.channel.send({ embeds: [embed], files: [attachment] });
      } else {
        await interactionOrMessage.deferReply(); // Only defer if an interaction
        await interactionOrMessage.editReply({ embeds: [embed], files: [attachment] });
      }
    } catch (error) {
      console.error("Error sending beautiful image:", error);
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
