const Command = require("../../abstract/command");
const { VoiceRecorder } = require('@kirdock/discordjs-voice-recorder');
const { joinVoiceChannel, VoiceConnectionStatus } = require("@discordjs/voice");
const { AttachmentBuilder } = require("discord.js");
module.exports = class Record extends Command {
  constructor(...args) {
    super(...args, {
      name: "record",
      description: "will Record your voice while you are in voice chat",
      category: "Utilities",
      aliases: ["rec"],
      usage: `record [time]`,
      userPerms: ["ViewChannel", "SendMessages"],
      botPerms: ["ViewChannel", "SendMessages"],
      cooldown: 10,
      image: "https://imgur.com/fKYqHRy",
      options: [
        {
          type: 4,
          name: "time",
          description: "Time To Record",
          required: false,
        },
      ],
    });
  }
  async run({ message, args }) {
    try {
      if (message?.guild.members.cache.get(this.client.user.id).voice.channel) return message?.channel.send("I'm already in a voice channel!");
      const voiceChannel = message?.member.voice.channel;
      if (!voiceChannel) return message?.channel.send("You must be in a voice channel to use this command!");

      let mins;
      let timeArg = args[0] || "2";
      if (timeArg.includes("s")) {
        timeArg = timeArg.replace("s", "");
        timeArg = parseInt(timeArg) / 60;
      } else if (timeArg.includes("m")) {
        timeArg = timeArg.replace("m", "");
      }
      mins = timeArg;
      if (isNaN(mins)) return message?.channel.send("Please enter a valid number!");
      if (mins > 10) return message?.channel.send("You can only record up to 10 minutes!");

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message?.guild.id,
        adapterCreator: message?.guild.voiceAdapterCreator,
      });

      const recorder = new VoiceRecorder();
      recorder.startRecording(connection);
      this.client.cacheManager.set(message?.guild.id + "recorder", Date.now());
      let stopcomponent = [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 4,
              label: "Stop",
              custom_id: "stop"
            }
          ]
        }
      ]
      let nuinuimsg = await message?.channel.send({ content: `**Recording Started**`, components: stopcomponent });
      const filter2 = (i) => i.customId === "stop" && i.member.voice.channel.id === message?.guild.members.cache.get(this.client.user.id).voice.channel.id;
      const collector2 = nuinuimsg.createMessageComponentCollector({
        filter2,
        time: mins * 60000,
      });
      let timeoutID = setTimeout(async () => {
        let buff = await recorder.getRecordedVoiceAsBuffer(message?.guild.id, "single", mins);
        let attachment = new AttachmentBuilder(buff, { name: "voice-message.mp3" });
        message?.channel.send({ content: "Recording ended!", files: [attachment] });
        recorder.stopRecording(connection);
        connection.destroy();
        this.client.cacheManager.del(message?.guild.id + "recorder");
        connection.off(VoiceConnectionStatus.Disconnected, disconnectedListener);
        return;
      }, mins * 60000);

      const disconnectedListener = async () => {
        clearTimeout(timeoutID);
        let time = this.client.cacheManager.get(message?.guild.id + "recorder");
        time = Date.now() - time;
        time = time / 60000;
        let buff = await recorder.getRecordedVoiceAsBuffer(message?.guild.id, "single", time);
        let attachment = new AttachmentBuilder(buff, { name: "voice-message.mp3" });
        await message?.channel.send({ content: "Recording ended!", files: [attachment] });
        recorder.stopRecording(connection);
        this.client.cacheManager.del(message?.guild.id + "recorder");
        collector2.stop();
        await nuinuimsg.delete().catch(() => { });
        connection.off(VoiceConnectionStatus.Disconnected, disconnectedListener);
        return;
      };

      connection.on(VoiceConnectionStatus.Disconnected, disconnectedListener);
      collector2.on("collect", async (i) => {
        if (i.customId === "stop") {
          if (!i?.member?.voice?.channel) return i.reply({ content: "You must be in a voice channel to use this button!", ephemeral: true });
          if (i?.member?.voice?.channel?.id !== message?.guild?.members?.cache.get(this.client.user.id).voice.channel.id) return i.reply({ content: "You must be in the same voice channel as me to use this button!", ephemeral: true });
          await i.deferUpdate();
          clearTimeout(timeoutID);
          let time = this.client.cacheManager.get(message?.guild.id + "recorder");
          time = Date.now() - time;
          time = time / 60000;
          let buff = await recorder.getRecordedVoiceAsBuffer(message?.guild.id, "single", time);
          let attachment = new AttachmentBuilder(buff, { name: "voice-message.mp3" });
          await message?.channel.send({ content: "Recording ended!", files: [attachment] });
          recorder.stopRecording(connection);
          connection.destroy();
          this.client.cacheManager.del(message?.guild.id + "recorder");
          await nuinuimsg.delete().catch(() => { });
          connection.off(VoiceConnectionStatus.Disconnected, disconnectedListener);
          return;
        }
      });
      collector2.on("end", async (collected, reason) => {
        if (reason === "time") {
          nuinuimsg.delete().catch(() => { });
        }
      });

    } catch (e) {
      return;
    }
  }




  async exec({ interaction }) {
    try {
      if (interaction?.guild.members.cache.get(this.client.user.id).voice.channel) return interaction?.reply("I'm already in a voice channel!");
      const voiceChannel = interaction?.member.voice.channel;
      if (!voiceChannel) return interaction?.reply("You must be in a voice channel to use this command!");

      let mins;
      let timeArg = interaction?.options.get("time")?.value || "2";
      if (timeArg.includes("s")) {
        timeArg = timeArg.replace("s", "");
        timeArg = parseInt(timeArg) / 60;
      } else if (timeArg.includes("m")) {
        timeArg = timeArg.replace("m", "");
      }
      mins = timeArg;
      if (isNaN(mins)) return interaction?.reply("Please enter a valid number!");
      if (mins > 10) return interaction?.reply("You can only record up to 10 minutes!");
      await interaction?.deferReply();
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction?.guild.id,
        adapterCreator: interaction?.guild.voiceAdapterCreator,
      });

      const recorder = new VoiceRecorder();
      recorder.startRecording(connection);
      this.client.cacheManager.set(interaction?.guild.id + "recorder", Date.now());
      let stopcomponent = [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 4,
              label: "Stop",
              custom_id: "stop"
            }
          ]
        }
      ]
      let nuinuimsg = await interaction?.editReply({ content: `**Recording Started**`, components: stopcomponent });
      const filter2 = (i) => i.customId === "stop" && i.member.voice.channel.id === interaction?.guild.members.cache.get(this.client.user.id).voice.channel.id;
      const collector2 = nuinuimsg.createMessageComponentCollector({
        filter2,
        time: mins * 60000,
      });
      let timeoutID = setTimeout(async () => {
        let buff = await recorder.getRecordedVoiceAsBuffer(interaction?.guild.id, "single", mins);
        let attachment = new AttachmentBuilder(buff, { name: "voice-message.mp3" });
        interaction?.editReply({ content: "Recording ended!", files: [attachment] });
        recorder.stopRecording(connection);
        connection.destroy();
        this.client.cacheManager.del(interaction?.guild.id + "recorder");
        connection.off(VoiceConnectionStatus.Disconnected, disconnectedListener);
        return;
      }, mins * 60000);

      const disconnectedListener = async () => {
        clearTimeout(timeoutID);
        let time = this.client.cacheManager.get(interaction?.guild.id + "recorder");
        time = Date.now() - time;
        time = time / 60000;
        let buff = await recorder.getRecordedVoiceAsBuffer(interaction?.guild.id, "single", time);
        let attachment = new AttachmentBuilder(buff, { name: "voice-message.mp3" });
        await interaction?.editReply({ content: "Recording ended!", files: [attachment] });
        recorder.stopRecording(connection);
        collector2.stop();
        await nuinuimsg.delete().catch(() => { });
        this.client.cacheManager.del(interaction?.guild.id + "recorder");
        connection.off(VoiceConnectionStatus.Disconnected, disconnectedListener);
        return;
      };

      // Add the disconnected listener for the voice connection
      connection.on(VoiceConnectionStatus.Disconnected, disconnectedListener);
      collector2.on("collect", async (i) => {
        if (i.customId === "stop") {

          if (!i?.member?.voice?.channel) return i.reply({ content: "You must be in a voice channel to use this button!", ephemeral: true });
          if (i.member.voice.channel.id !== interaction?.guild.members.cache.get(this.client.user.id).voice.channel.id) return i.reply({ content: "You must be in the same voice channel as the bot to use this button!", ephemeral: true });
          await i.deferUpdate();
          clearTimeout(timeoutID);
          let time = this.client.cacheManager.get(interaction?.guild.id + "recorder");
          time = Date.now() - time;
          time = time / 60000;
          let buff = await recorder.getRecordedVoiceAsBuffer(interaction?.guild.id, "single", time);
          let attachment = new AttachmentBuilder(buff, { name: "voice-message.mp3" });
          await interaction?.channel.send({ content: "Recording ended!", files: [attachment] });
          recorder.stopRecording(connection);
          connection.destroy();
          this.client.cacheManager.del(interaction?.guild.id + "recorder");
          await nuinuimsg.delete().catch(() => { });
          connection.off(VoiceConnectionStatus.Disconnected, disconnectedListener);
          return;
        }
      });
      collector2.on("end", async (collected, reason) => {
        if (reason === "time") {
          nuinuimsg.delete().catch(() => { });
        }
      });
    } catch (e) {
      return;
    }
  }
}