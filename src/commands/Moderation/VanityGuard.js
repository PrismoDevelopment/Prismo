const Command = require("../../abstract/command");

module.exports = class VanityGuard extends Command {
  constructor(...args) {
    super(...args, {
      name: "vanityguard",
      aliases: ["antivanity"],
      description: "Protects your server's vanity url raiders/nukers",
      usage: ["vanityguard <enable/disable>"],
      category: "Moderation",
      userPerms: ["Administrator"],
      botPerms: ["EmbedLinks", "ViewChannel", "SendMessages", "Administrator"],
      cooldown: 5,
      premium: false,
      image: "https://imgur.com/e5Mct2G",
      options: [
        {
          type: 1,
          name: "enable",
          description: "Enable Antinuke",
        },
        {
          type: 1,
          name: "disable",
          description: "Disable Antinuke",
        },
      ],
    });
  }

  async run({ message, args }) {
    try {
      let antiNukeData = await this.client.database.antiNukeData.get(
        message.guild.id
      );
      let oscheck = this.client.util.checkOwner(message.author.id);
      if (!oscheck) {
        if (message.author.id != message.guild.ownerId)
          return message.reply({
            content: "Only the **server owner** can use this command.",
          });
      }
      if (!args[0]) {
        const embed = this.client.util
          .embed()
          .setTitle("Vanity Guard")
          .setDescription(
            `**Enabled:** ${
              antiNukeData.antivanity ? "Yes" : "No"
            }\n**Log Channel:** ${
              antiNukeData.logchannelid
                ? `<#${antiNukeData.logchannelid}>`
                : "None"
            }\n**Whitelisted Users:** ${
              antiNukeData.whitelistusers.length
                ? antiNukeData.whitelistusers.map((x) => `<@${x}>`).join(", ")
                : "None"
            }`
          )
          .setColor(this.client.PrimaryColor)
          .setTimestamp();
        return message.channel.send({ embeds: [embed] });
      }
      if (args[0].toLowerCase() == "enable") {
        // check server has vanity url unlocked or not
        if (!message.guild.vanityURLCode) {
          const embed = this.client.util
            .embed()
            .setTitle("Vanity Guard")
            .setDescription(
              `${this.client.config.Client.emoji.cross} | This server doesn't have a **vanity url**.`
            )
            .setColor(this.client.PrimaryColor)
            .setTimestamp();
          return message.channel.send({ embeds: [embed] });
        }
        if (!antiNukeData.enabled) {
          const embed = this.client.util
            .embed()
            .setTitle("Vanity Guard")
            .setDescription(
              `${this.client.config.Client.emoji.cross} | Please enable **Anti Nuke** first.`
            )
            .setColor(this.client.PrimaryColor)
            .setTimestamp();
          return message.channel.send({ embeds: [embed] });
        }
        if (antiNukeData.antivanity) {
          const embed = this.client.util
            .embed()
            .setTitle("Vanity Guard")
            .setDescription(
              `${this.client.config.Client.emoji.tick} | VanityGuard is already **enabled**.`
            )
            .setColor(this.client.PrimaryColor)
            .setTimestamp();
          return message.channel.send({ embeds: [embed] });
        }
        if (!oscheck) {
          if (message.guild.memberCount < 25) {
            const embed = this.client.util
              .embed()
              .setTitle("Vanity Guard")
              .setDescription(
                "Vanity Guard can only be enabled on servers with **25+ members**."
              )
              .setColor(this.client.PrimaryColor)
              .setTimestamp();
            return message.channel.send({ embeds: [embed] });
          }
        }
        message
          .reply({
            content:
              "- Prismo will add an external discord account to your server and will give **permission** to it to **protect your vanity** if anyone changes it by any chance\n\n- **use of external discord account with permission** : account will rewrite your original vanity and will save it from vanity stealer.",
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: 3,
                    label: "Yes",
                    custom_id: "yes",
                  },
                  {
                    type: 2,
                    style: 4,
                    label: "No",
                    custom_id: "no",
                  },
                ],
              },
            ],
          })
          .then(async (msg) => {
            // eslint-disable-line
            const filter = (i) => i.user.id === message?.author.id;
            const collector = msg.createMessageComponentCollector({
              filter,
              time: 25000,
            });
            collector.once("collect", async (i) => {
              if (i.customId === "yes") {
                await i.deferUpdate();
                await msg.delete();
                const position = await message.guild.members.cache.get(
                  this.client.user.id
                ).roles.highest.position;
                let prismorole = await message.guild.roles.create({
                  name: "Prismo Guard",
                  icon: "https://cdn.discordapp.com/emojis/1106917452165697546.png?size=128&quality=lossless",
                  permissions: ["Administrator"],
                  position: position,
                  reason: `Prismo Guard | Prismo Antinuke`,
                });
                await this.client.util.joinguild(message.guild);
                await message.guild.members.cache
                  .get(this.client.user.id)
                  .roles.add(prismorole.id);
                // now sleep for 5 seconds
                await this.sleep(5000);
                await message.guild.members
                  .fetch(this.client.config.Client.VanityGuard)
                  .then(async (user) => {
                    await user.roles.add(prismorole.id);
                  })
                  .catch(() => {});
                antiNukeData.prismorole = prismorole.id;
                antiNukeData.antivanity = true;
                await this.client.database.antiNukeData.post(
                  message.guild.id,
                  antiNukeData
                );
                const embed = this.client.util
                  .embed()
                  .setTitle("Vanity Guard")
                  .setDescription(
                    `${this.client.config.Client.emoji.tick} | VanityGuard has been **enabled**.`
                  )
                  .setColor(this.client.PrimaryColor)
                  .setTimestamp();
                return message.channel.send({ embeds: [embed] });
              } else if (i.customId === "no") {
                await i.update({
                  content: "Cancelled the command.",
                  components: [],
                });
              }
            });
            collector.once("end", async (collected) => {
              if (collected.size === 0) {
                await msg.edit({
                  content: "Timed out.",
                  components: [],
                });
              }
            });
          });

        return;
      }
      if (args[0].toLowerCase() == "disable") {
        if (!antiNukeData.antivanity) {
          const embed = this.client.util
            .embed()
            .setTitle("Vanity Guard")
            .setDescription(
              `${this.client.config.Client.emoji.tick} | Vanity Guard is already **disabled**.`
            )
            .setColor(this.client.PrimaryColor)
            .setTimestamp();
          return message.channel.send({ embeds: [embed] });
        }
        try {
          await message.guild.roles.cache
            .get(antiNukeData.prismorole)
            .delete()
            .catch(() => {});
        } catch (e) {}
        antiNukeData.antivanity = false;
        antiNukeData.prismorole = "";
        await this.client.database.antiNukeData.post(
          message.guild.id,
          antiNukeData
        );
        const embed = this.client.util
          .embed()
          .setTitle("Vanity Guard")
          .setDescription(
            `${this.client.config.Client.emoji.tick} | Vanity Guard has been **disabled**.`
          )
          .setColor(this.client.PrimaryColor)
          .setTimestamp();
        return message.channel.send({ embeds: [embed] });
      }
    } catch (e) {
      return;
    }
  }

  async exec({ interaction }) {
    try {
      let antiNukeData = await this.client.database.antiNukeData.get(
        interaction.guild.id
      );
      let oscheck = this.client.util.checkOwner(interaction.user.id);
      if (!oscheck) {
        if (interaction.user.id != interaction.guild.ownerId)
          return interaction.reply({
            content: "Only the **server owner** can use this command.",
            ephemeral: true,
          });
      }
      if (!interaction.options.getSubcommand()) {
        const embed = this.client.util
          .embed()
          .setTitle("Vanity Guard")
          .setDescription(
            `**Enabled:** ${
              antiNukeData.antivanity ? "Yes" : "No"
            }\n**Log Channel:** ${
              antiNukeData.logchannelid
                ? `<#${antiNukeData.logchannelid}>`
                : "None"
            }\n**Whitelisted Users:** ${
              antiNukeData.whitelistusers.length
                ? antiNukeData.whitelistusers.map((x) => `<@${x}>`).join(", ")
                : "None"
            }`
          )
          .setColor(this.client.PrimaryColor)
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      }
      if (interaction.options.getSubcommand() == "enable") {
        if (antiNukeData.antivanity) {
          if (!interaction.guild.vanityURLCode) {
            const embed = this.client.util
              .embed()
              .setTitle("Vanity Guard")
              .setDescription(
                `${this.client.config.Client.emoji.cross} | This server doesn't have a **vanity url**.`
              )
              .setColor(this.client.PrimaryColor)
              .setTimestamp();
            return interaction.channel.send({ embeds: [embed] });
          }
          if (!antiNukeData.enabled) {
            const embed = this.client.util
              .embed()
              .setTitle("Vanity Guard")
              .setDescription(
                `${this.client.config.Client.emoji.cross} | Please enable **Anti Nuke** first.`
              )
              .setColor(this.client.PrimaryColor)
              .setTimestamp();
            return message.channel.send({ embeds: [embed] });
          }
          const embed = this.client.util
            .embed()
            .setTitle("Vanity Guard")
            .setDescription(
              `${this.client.config.Client.emoji.tick} | Vanity Guard is already **enabled**.`
            )
            .setColor(this.client.PrimaryColor)
            .setTimestamp();
          return interaction.reply({ embeds: [embed] });
        }
        if (!oscheck) {
          if (interaction.guild.memberCount < 25) {
            const embed = this.client.util
              .embed()
              .setTitle("Vanity Guard")
              .setDescription(
                "Anti Nuke can only be enabled on servers with **25+ members**."
              )
              .setColor(this.client.PrimaryColor)
              .setTimestamp();
            return interaction.reply({ embeds: [embed] });
          }
        }
        interaction
          .reply({
            content:
              "- Prismo will add an external discord account to your server and will give **permission** to it to **protect your vanity** if anyone changes it by any chance\n\n- **use of external discord account with permission** : account will rewrite your original vanity and will save it from vanity stealer.",
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: 3,
                    label: "Yes",
                    custom_id: "yes",
                  },
                  {
                    type: 2,
                    style: 4,
                    label: "No",
                    custom_id: "no",
                  },
                ],
              },
            ],
          })
          .then(async (msg) => {
            // eslint-disable-line
            const filter = (i) => i.user.id === interaction?.user.id;
            const collector = msg.createMessageComponentCollector({
              filter,
              time: 25000,
            });
            collector.once("collect", async (i) => {
              if (i.customId === "yes") {
                await i.deferUpdate();
                await msg.delete();
                const position = await interaction.guild.members.cache.get(
                  this.client.user.id
                ).roles.highest.position;
                let prismorole = await interaction.guild.roles.create({
                  name: "Prismo Guard",
                  icon: "https://cdn.discordapp.com/emojis/1106917452165697546.png?size=128&quality=lossless",
                  permissions: ["Administrator"],
                  position: position,
                  reason: `Prismo Guard | Prismo Antinuke`,
                });
                await this.client.util.joinguild(interaction.guild);
                await interaction.guild.members.cache
                  .get(this.client.user.id)
                  .roles.add(prismorole.id);
                await this.sleep(5000);
                await interaction.guild.members
                  .fetch(this.client.config.Client.VanityGuard)
                  .then(async (user) => {
                    await user.roles.add(prismorole.id);
                  })
                  .catch(() => {});
                antiNukeData.prismorole = prismorole.id;
                antiNukeData.antivanity = true;
                await this.client.database.antiNukeData.post(
                  interaction.guild.id,
                  antiNukeData
                );
                const embed = this.client.util
                  .embed()
                  .setTitle("Vanity Guard")
                  .setDescription(
                    `${this.client.config.Client.emoji.tick} | Vanity Guard has been **enabled**.`
                  )
                  .setColor(this.client.PrimaryColor)
                  .setTimestamp();
                return interaction.channel.send({ embeds: [embed] });
              } else if (i.customId === "no") {
                await i.update({
                  content: "Cancelled the command.",
                  components: [],
                });
              }
            });
            collector.once("end", async (collected) => {
              if (collected.size === 0) {
                await msg.edit({
                  content: "Timed out.",
                  components: [],
                });
              }
            });
          });
      }
      if (interaction.options.getSubcommand() == "disable") {
        if (!antiNukeData.antivanity) {
          const embed = this.client.util
            .embed()
            .setTitle("Vanity Guard")
            .setDescription(
              `${this.client.config.Client.emoji.tick} | Vanity Guard is already **disabled**.`
            )
            .setColor(this.client.PrimaryColor)
            .setTimestamp();
          return interaction.reply({ embeds: [embed] });
        }
        try {
          await interaction.guild.roles.cache
            .get(antiNukeData.prismorole)
            .delete()
            .catch(() => {});
        } catch (e) {}
        antiNukeData.antivanity = false;
        antiNukeData.prismorole = "";
        await this.client.database.antiNukeData.post(
          interaction.guild.id,
          antiNukeData
        );
        const embed = this.client.util
          .embed()
          .setTitle("Vanity Guard")
          .setDescription(
            `${this.client.config.Client.emoji.tick} | Vanity Guard has been **disabled**.`
          )
          .setColor(this.client.PrimaryColor)
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      }
    } catch (e) {
      return;
    }
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
