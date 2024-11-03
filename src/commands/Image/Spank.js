const Command = require("../../abstract/command");
const DIG = require("discord-image-generation");
const { AttachmentBuilder, Message } = require("discord.js");

module.exports = class Spank extends Command {
  constructor(...args) {
    super(...args, {
      name: "spank",
      aliases: ["spank"],
      description: "spank a user",
      usage: ["spank <user>"],
      image: "https://imgur.com/1LLzN3C",
      category: "Image",
      userPerms: ["SendMessages"],
      botPerms: ["SendMessages", "ReadMessageHistory", "AttachFiles"],
      options: [
        {
          name: "user",
          description: "The user to spank",
          type: 6,
          required: false,
        },
      ],
    });
  }

  async run({ message, args }) {
    const user = args[0] ? await this.client.util.userQuery(args[0]) : message?.author;
    const member = await this.client.users.fetch(user);
    let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
    let pngavatar = avatar.replace("webp", "png");
    let useravatar = message?.author.displayAvatarURL({ size: 512, dynamic: false });
    let pnguseravatar = useravatar.replace("webp", "png");
    const img = await new DIG.Spank().getImage(pnguseravatar, pngavatar);
    const attach = new AttachmentBuilder(img, { name: "spank.png" });
    let embed = this.client.util.embed().setColor(this.client.config.Client.PrimaryColor).setDescription(`Spank ${member.username}`).setImage("attachment://spank.png");
    let xddata = message?.channel.send({ embeds: [embed], files: [attach] });
  }

  async exec({ interaction }) {
    const user = interaction?.options.getUser("user") || interaction?.user;
    const member = await this.client.users.fetch(user);
    let avatar = member.displayAvatarURL({ size: 512, dynamic: false });
    let pngavatar = avatar.replace("webp", "png");
    let useravatar = interaction?.user.displayAvatarURL({ size: 512, dynamic: false });
    let pnguseravatar = useravatar.replace("webp", "png");
    const img = await new DIG.Spank().getImage(pnguseravatar, pngavatar);
    const attach = new AttachmentBuilder(img, { name: "spank.png" });
    let embed = this.client.util.embed().setColor(this.client.config.Client.PrimaryColor).setDescription(`Spank ${member.username}`).setImage("attachment://spank.png");
    await interaction?.deferReply();
    await interaction?.editReply({ embeds: [embed], files: [attach] });
  }
};
