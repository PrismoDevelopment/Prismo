const path = require("path");
const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  TextInputBuilder,
  ModalBuilder,
  AttachmentBuilder,
  Guild,
  PermissionsBitField,
} = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const fetch = require("node-fetch");
const { fs } = require("fs");
const { https } = require("https");
const Canvas = require("canvas");
module.exports = class Util {
  /**
   *
   * @param {import('./PrismoClient')} client
   */
  constructor(client) {
    this.client = client;
  }

  embed() {
    return new EmbedBuilder();
  }
  row() {
    return new ActionRowBuilder();
  }
  menu() {
    return new StringSelectMenuBuilder();
  }
  button() {
    return new ButtonBuilder();
  }
  textInput() {
    return new TextInputBuilder();
  }
  model() {
    return new ModalBuilder();
  }
  parseEmoji(emoji) {
    if (!emoji) return null;
    if (emoji instanceof Array) return emoji.map((x) => Util.parseEmoji(x));
    if (emoji instanceof Object)
      return emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;
    if (typeof emoji === "string") {
      if (emoji.includes("%")) emoji = decodeURIComponent(emoji);
      if (emoji.includes(":")) {
        const parsedEmoji = Util.parseEmoji(emoji.split(":"));
        if (parsedEmoji instanceof Array)
          return parsedEmoji.map((x) => Util.parseEmoji(x));
        return parsedEmoji;
      } else {
        const customEmoji = Util.parseEmoji(
          emoji.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)
        );
        if (customEmoji) return customEmoji;
        return emoji;
      }
    }
    return null;
  }
  hextodecimal(hex) {
    if (hex.startsWith("#")) hex = hex.slice(1);
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((hex) => hex + hex)
        .join("");
    if (hex.length !== 6) throw new TypeError("Invalid hex code.");
    const num = parseInt(hex, 16);
    return [num >> 16, (num >> 8) & 255, num & 255];
  }
  gettime() {
    try {
      let currentdate = new Date();
      let datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds() +
        " UTC";
      return datetime;
    } catch (e) {
      console.error(e);
    }
  }
  emojify(content) {
    {
      content = content.toLowerCase().split("");

      content = content.map((letter) => {
        if (/[a-z]/g.test(letter)) return `:regional_indicator_${letter}:`;
        else if (this.chars[letter]) return this.chars[letter];
        else return letter;
      });

      return content.join("");
    }
  }
  chars = {
    0: ":zero:",
    1: ":one:",
    2: ":two:",
    3: ":three:",
    4: ":four:",
    5: ":five:",
    6: ":six:",
    7: ":seven:",
    8: ":eight:",
    9: ":nine:",
    "#": ":hash:",
    "*": ":asterisk:",
    "?": ":grey_question:",
    "!": ":grey_exclamation:",
    "+": ":heavy_plus_sign:",
    "-": ":heavy_minus_sign:",
    "×": ":heavy_multiplication_x:",
    "*": ":asterisk:",
    $: ":heavy_dollar_sign:",
    "/": ":heavy_division_sign:",
    " ": "   ",
  };

  color(message) {
    const rang =
      message.guild.members.cache.get(this.client.user.id).displayHexColor ===
      "#000000"
        ? this.client.config.Client.PrimaryColor
        : message.guild.members.cache.get(this.client.user.id).displayHexColor;
    return rang;
  }
  largeMessage(message, output = "txt") {
    const attachmened = new AttachmentBuilder(Buffer.from(message), {
      name: `prismo.${output}`,
    });
    return attachmened;
  }
  async getgif(query) {
    const response = await fetch(
      `https://api.tenor.com/v1/search?q=${query}&key=${this.client.config.Client.TenorAPI}&limit=1`
    );
    const json = await response.json();
    return json.results[0].media[0].gif.url;
  }
  async fetchaudit(guild, type) {
    let headers = {
      Authorization: `Bot ${this.client.config.Client.Token}`,
    };
    let newdataa = await fetch(
      `https://discord.com/api/v8/guilds/${guild.id}/audit-logs?limit=1?action_type=${type}`,
      {
        method: "GET",
        headers: headers,
      }
    ).then((res) => res.json());
    let data = newdataa.audit_log_entries;
    return data;
  }

  async getAccessToken() {
    // Function 1: Get Code from Discord authorization URL
    const getCode = async () => {
      const url =
        "https://discord.com/api/oauth2/authorize?client_id={this.client.config.Client.botId}&redirect_uri=https%3A%2F%2Fdiscord.gg%2F5GWnQGbgZH&response_type=code&scope=identify%20guilds.join";

      const options = {
        method: "POST",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          Authorization: this.client.config.Client.VanityGuardToken,
          "Content-Type": "application/json",
        },
        body: '{"authorize":"true"}',
      };

      const response = await fetch(url, options);
      const json = await response.json();
      let code = json.location.split("code=")[1];
      return code
    };

    // Function 2: Get Access Token using the obtained code
    const getAccessTokenWithCode = async (code) => {
      const encodedParams = new URLSearchParams();

      encodedParams.set("client_id", this.client.config.Client.botId);
      encodedParams.set("client_secret", this.client.config.Client.botSecret);
      encodedParams.set("grant_type", "authorization_code");
      encodedParams.set("code", code);
      encodedParams.set("redirect_uri", "https://discord.gg/5GWnQGbgZH");

      const url = "https://discordapp.com/api/oauth2/token";

      const options = {
        method: "POST",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodedParams,
      };

      const response = await fetch(url, options);
      const json = await response.json();
      return json.access_token;
    };

    // Combine both functions
    try {
      const code = await getCode();
      const accessToken = await getAccessTokenWithCode(code);
      return accessToken;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async joinguild(guild) {
    try {
      const fetch = require("node-fetch");
      const accessToken = await this.getAccessToken();
      let url = `https://discord.com/api/v9/guilds/${guild.id}/members/${this.client.config.Client.VanityGuard}`;
      let body = '{"access_token":"accesstoken"}';
      body = body.replace("accesstoken", accessToken);
      let options = {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          Authorization: "Bot " + this.client.token,
          "Content-Type": "application/json",
        },
        body: body,
      };

      fetch(url, options)
        .then((res) => res.json())
        .then((json) => console.log(json))
        .catch((err) => console.error("error:" + err));
    } catch (e) {
      console.log(e);
      return;
    }
  }
  async updateVanity(guild, code) {
    try {
      const fetch = require("node-fetch");
      let url = `https://discord.com/api/v9/guilds/${guild.id}/vanity-url`;
      let body = '{"code":"prismo"}';
      body = body.replace("prismo", code);
      let options = {
        method: "PATCH",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          Authorization: this.client.config.Client.VanityGuardToken,
          "Content-Type": "application/json",
        },
        body: body,
      };

      fetch(url, options)
        .then((res) => res.json())
        .then((json) => console.log(json))
        .catch((err) => console.error("error:" + err));
    } catch (e) {
      return;
    }
  }
  async awaitSelectionMenu(message, filter) {
    try {
      const selected = await message.awaitMessageComponent({
        filter,
        time: 15000,
        componentType: 3,
      });
      return selected;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * @returns {Promise<Guild | null>}
   */
  async getbadges() {
    this.client.badgesInfo = {
      badgeServer: null,
      badgeRoles: {
        ownerRole: null,
        communityManagerRole: null,
        developerRole: null,
        adminRole: null,
        managerRole: null,
        moderatorRole: null,
        staffRole: null,
        supporterRole: null,
        bugHuntersRole: null,
        specialOnesRole: null,
      },
    };
    this.client.badgesInfo.badgeServer = await this.client.guilds.fetch(
      this.client.config.Client.serverId
    );
    if (!this.client.badgesInfo.badgeServer) return null;
    if (!this.client.badgesInfo.badgeRoles.ownerRole) {
      this.client.badgesInfo.badgeRoles.ownerRole =
        this.client.badgesInfo.badgeServer.roles.cache.get(
          this.client.config.Client.roleIds.ownerRoleId
        );
    }
    if (!this.client.badgesInfo.badgeRoles.developerRole) {
      this.client.badgesInfo.badgeRoles.developerRole =
        this.client.badgesInfo.badgeServer.roles.cache.get(
          this.client.config.Client.roleIds.developerRoleId
        );
    }
    if (!this.client.badgesInfo.badgeRoles.adminRole) {
      this.client.badgesInfo.badgeRoles.adminRole =
        this.client.badgesInfo.badgeServer.roles.cache.get(
          this.client.config.Client.roleIds.adminRoleId
        );
    }
    if (!this.client.badgesInfo.badgeRoles.managerRole) {
      this.client.badgesInfo.badgeRoles.managerRole =
        this.client.badgesInfo.badgeServer.roles.cache.get(
          this.client.config.Client.roleIds.managerRoleId
        );
    }
    if (!this.client.badgesInfo.badgeRoles.moderatorRole) {
      this.client.badgesInfo.badgeRoles.moderatorRole =
        this.client.badgesInfo.badgeServer.roles.cache.get(
          this.client.config.Client.roleIds.moderatorRoleId
        );
    }
    if (!this.client.badgesInfo.badgeRoles.staffRole) {
      this.client.badgesInfo.badgeRoles.staffRole =
        this.client.badgesInfo.badgeServer.roles.cache.get(
          this.client.config.Client.roleIds.staffRoleId
        );
    }
    if (!this.client.badgesInfo.badgeRoles.supporterRole) {
      this.client.badgesInfo.badgeRoles.supporterRole =
        this.client.badgesInfo.badgeServer.roles.cache.get(
          this.client.config.Client.roleIds.supporterRoleId
        );
    }
    if (!this.client.badgesInfo.badgeRoles.bugHuntersRole) {
      this.client.badgesInfo.badgeRoles.bugHuntersRole =
        this.client.badgesInfo.badgeServer.roles.cache.get(
          this.client.config.Client.roleIds.bughunterRoleId
        );
    }
    if (!this.client.badgesInfo.badgeRoles.specialOnesRole) {
      this.client.badgesInfo.badgeRoles.specialOnesRole =
        this.client.badgesInfo.badgeServer.roles.cache.get(
          this.client.config.Client.roleIds.specialonesRoleId
        );
    }
    if (!this.client.badgesInfo.badgeRoles.communityManagerRole) {
      this.client.badgesInfo.badgeRoles.communityManagerRole =
        this.client.badgesInfo.badgeServer.roles.cache.get(
          this.client.config.Client.roleIds.communityManagerRoleId
        );
    }
    return this.client.badgesInfo;
  }

  async awaitSelectionButton(message, filter) {
    try {
      const selected = await message.awaitMessageComponent({
        filter,
        time: 15000,
        componentType: 2,
      });
      return selected;
    } catch (e) {
      return null;
    }
  }
  timestampconvert(timestamp) {
    timestamp = timestamp / 1000;
    return timestamp;
  }
  async getBanner(id) {
    const response = await fetch(`https://discord.com/api/v8/users/${id}`, {
      headers: {
        Authorization: `Bot ${this.client.config.Client.Token}`,
      },
    });
    const json = await response.json();
    let banner = json.banner;
    if (!banner) return null;
    return banner;
  }
  async requestget(url) {
    let options = {
      method: "GET",
      headers: { Accept: "*/*" },
    };
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  }
  async fetchDetails(url, type = "GET", body = {}) {
    let options = {
      method: type,
      headers: { Accept: "*/*" },
    };
    if (type == "POST") {
      options.body = JSON.stringify(body);
      options.headers["Content-Type"] = "application/json";
    }
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  }
  timestampToDays(timestamp) {
    return Math.floor(timestamp / 86400000);
  }
  formatDate(date) {
    return new Intl.DateTimeFormat("en-US").format(date);
  }
  formatTime(date) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  }
  formatDateTime(date) {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }
  dateToTimestamp(date) {
    return new Date(date).getTime();
  }

  async replacerString(objectValue, message) {
    if (objectValue.author != null) {
      if (objectValue.author.name != null) {
        objectValue.author.name = objectValue.author.name.replace(
          /\$user_mention/g,
          `<@${message.member.id}>`
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$user_username/g,
          message.member.user.username
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$user_tag/g,
          message.member.user.username
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$user_id/g,
          message.member.user.id
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$user_createdtimestamp/g,
          `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$guild_name/g,
          message.guild.name
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$guild_id/g,
          message.guild.id
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$guild_membercount/g,
          message.guild.memberCount
        );
      }
      if (objectValue.author.icon_url != null) {
        objectValue.author.icon_url = objectValue.author.icon_url.replace(
          /\$user_iconurl/g,
          message.member.user.displayAvatarURL({ dynamic: true })
        );
        objectValue.author.icon_url = objectValue.author.icon_url.replace(
          /\$guild_iconurl/g,
          message.guild.iconURL({ dynamic: true }) || ""
        );
      }
    }
    if (objectValue.description != null) {
      objectValue.description = objectValue.description.replace(
        /\$user_mention/g,
        `<@${message.member.id}>`
      );
      objectValue.description = objectValue.description.replace(
        /\$user_username/g,
        message.member.user.username
      );
      objectValue.description = objectValue.description.replace(
        /\$user_tag/g,
        message.member.user.username
      );
      objectValue.description = objectValue.description.replace(
        /\$user_id/g,
        message.member.user.id
      );
      objectValue.description = objectValue.description.replace(
        /\$user_createdtimestamp/g,
        `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
      );
      objectValue.description = objectValue.description.replace(
        /\$user_iconurl/g,
        message.member.user.displayAvatarURL({ dynamic: true })
      );
      objectValue.description = objectValue.description.replace(
        /\$guild_name/g,
        message.guild.name
      );
      objectValue.description = objectValue.description.replace(
        /\$guild_id/g,
        message.guild.id
      );
      objectValue.description = objectValue.description.replace(
        /\$guild_iconurl/g,
        message.guild.iconURL({ dynamic: true }) || ""
      );
      objectValue.description = objectValue.description.replace(
        /\$guild_membercount/g,
        message.guild.memberCount
      );
    }
    if (objectValue.footer != null) {
      if (objectValue.footer.text != null) {
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$user_mention/g,
          `<@${message.member.id}>`
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$user_username/g,
          message.member.user.username
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$user_tag/g,
          message.member.user.username
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$user_id/g,
          message.member.user.id
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$user_createdtimestamp/g,
          `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$guild_name/g,
          message.guild.name
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$guild_id/g,
          message.guild.id
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$guild_membercount/g,
          message.guild.memberCount
        );
      }
      if (objectValue.footer.icon_url != null) {
        objectValue.footer.icon_url = objectValue.footer.icon_url.replace(
          /\$user_iconurl/g,
          message.member.user.displayAvatarURL({ dynamic: true })
        );
        objectValue.footer.icon_url = objectValue.footer.icon_url.replace(
          /\$guild_iconurl/g,
          // if guild has no icon then it will return null
          message.guild.iconURL({ dynamic: true }) || "" || ""
        );
      }
    }
    if (objectValue.title != null) {
      objectValue.title = objectValue.title.replace(
        /\$user_mention/g,
        `<@${message.member.id}>`
      );
      objectValue.title = objectValue.title.replace(
        /\$user_username/g,
        message.member.user.username
      );
      objectValue.title = objectValue.title.replace(
        /\$user_tag/g,
        message.member.user.username
      );
      objectValue.title = objectValue.title.replace(
        /\$user_id/g,
        message.member.user.id
      );
      objectValue.title = objectValue.title.replace(
        /\$user_createdtimestamp/g,
        `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
      );
      objectValue.title = objectValue.title.replace(
        /\$guild_name/g,
        message.guild.name
      );
      objectValue.title = objectValue.title.replace(
        /\$guild_id/g,
        message.guild.id
      );
      objectValue.title = objectValue.title.replace(
        /\$guild_membercount/g,
        message.guild.memberCount
      );
    }
    if (objectValue.image != null && objectValue.image.url != null) {
      objectValue.image.url = objectValue.image.url.replace(
        /\$user_iconurl/g,
        message.member.user.displayAvatarURL({ dynamic: true })
      );
      objectValue.image.url = objectValue.image.url.replace(
        /\$guild_iconurl/g,
        message.guild.iconURL({ dynamic: true }) || ""
      );
    }
    if (objectValue.thumbnail != null && objectValue.thumbnail.url != null) {
      objectValue.thumbnail.url = objectValue.thumbnail.url.replace(
        /\$user_iconurl/g,
        message.member.user.displayAvatarURL({ dynamic: true })
      );
      objectValue.thumbnail.url = objectValue.thumbnail.url.replace(
        /\$guild_iconurl/g,
        message.guild.iconURL({ dynamic: true }) || ""
      );
    }
    return objectValue;
  }
  async replacerOriginal(objectValue, member) {
    if (objectValue.author != null) {
      if (objectValue.author.name != null) {
        objectValue.author.name = objectValue.author.name.replace(
          /\$user_mention/g,
          `<@${member.id}>`
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$user_username/g,
          member.user.username
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$user_tag/g,
          member.user.username
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$user_id/g,
          member.user.id
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$user_createdtimestamp/g,
          member.user.createdTimestamp
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$guild_name/g,
          member.guild.name
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$guild_id/g,
          member.guild.id
        );
        objectValue.author.name = objectValue.author.name.replace(
          /\$guild_membercount/g,
          member.guild.memberCount
        );
      }
      if (objectValue.author.icon_url != null) {
        objectValue.author.icon_url = objectValue.author.icon_url.replace(
          /\$user_iconurl/g,
          member.user.displayAvatarURL({ dynamic: true })
        );
        objectValue.author.icon_url = objectValue.author.icon_url.replace(
          /\$guild_iconurl/g,
          member.guild.iconURL({ dynamic: true })
        );
      }
    }
    if (objectValue.description != null) {
      objectValue.description = objectValue.description.replace(
        /\$user_mention/g,
        `<@${member.id}>`
      );
      objectValue.description = objectValue.description.replace(
        /\$user_username/g,
        member.user.username
      );
      objectValue.description = objectValue.description.replace(
        /\$user_tag/g,
        member.user.username
      );
      objectValue.description = objectValue.description.replace(
        /\$user_id/g,
        member.user.id
      );
      objectValue.description = objectValue.description.replace(
        /\$user_createdtimestamp/g,
        member.user.createdTimestamp
      );
      objectValue.description = objectValue.description.replace(
        /\$user_iconurl/g,
        member.user.displayAvatarURL({ dynamic: true })
      );
      objectValue.description = objectValue.description.replace(
        /\$guild_name/g,
        member.guild.name
      );
      objectValue.description = objectValue.description.replace(
        /\$guild_id/g,
        member.guild.id
      );
      objectValue.description = objectValue.description.replace(
        /\$guild_iconurl/g,
        member.guild.iconURL({ dynamic: true })
      );
      objectValue.description = objectValue.description.replace(
        /\$guild_membercount/g,
        member.guild.memberCount
      );
    }
    if (objectValue.footer != null) {
      if (objectValue.footer.text != null) {
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$user_mention/g,
          `<@${member.id}>`
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$user_username/g,
          member.user.username
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$user_tag/g,
          member.user.username
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$user_id/g,
          member.user.id
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$user_createdtimestamp/g,
          member.user.createdTimestamp
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$guild_name/g,
          member.guild.name
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$guild_id/g,
          member.guild.id
        );
        objectValue.footer.text = objectValue.footer.text.replace(
          /\$guild_membercount/g,
          member.guild.memberCount
        );
      }
      if (objectValue.footer.icon_url != null) {
        objectValue.footer.icon_url = objectValue.footer.icon_url.replace(
          /\$user_iconurl/g,
          member.user.displayAvatarURL({ dynamic: true })
        );
        objectValue.footer.icon_url = objectValue.footer.icon_url.replace(
          /\$guild_iconurl/g,
          member.guild.iconURL({ dynamic: true }) || ""
        );
      }
    }
    if (objectValue.title != null) {
      objectValue.title = objectValue.title.replace(
        /\$user_mention/g,
        `<@${member.id}>`
      );
      objectValue.title = objectValue.title.replace(
        /\$user_username/g,
        member.user.username
      );
      objectValue.title = objectValue.title.replace(
        /\$user_tag/g,
        member.user.username
      );
      objectValue.title = objectValue.title.replace(
        /\$user_id/g,
        member.user.id
      );
      objectValue.title = objectValue.title.replace(
        /\$user_createdtimestamp/g,
        member.user.createdTimestamp
      );
      objectValue.title = objectValue.title.replace(
        /\$guild_name/g,
        member.guild.name
      );
      objectValue.title = objectValue.title.replace(
        /\$guild_id/g,
        member.guild.id
      );
      objectValue.title = objectValue.title.replace(
        /\$guild_membercount/g,
        member.guild.memberCount
      );
    }
    if (objectValue.image != null && objectValue.image.url != null) {
      objectValue.image.url = objectValue.image.url.replace(
        /\$user_iconurl/g,
        member.user.displayAvatarURL({ dynamic: true })
      );
      objectValue.image.url = objectValue.image.url.replace(
        /\$guild_iconurl/g,
        member.guild.iconURL({ dynamic: true })
      );
    }
    if (objectValue.thumbnail != null && objectValue.thumbnail.url != null) {
      objectValue.thumbnail.url = objectValue.thumbnail.url.replace(
        /\$user_iconurl/g,
        member.user.displayAvatarURL({ dynamic: true })
      );
      objectValue.thumbnail.url = objectValue.thumbnail.url.replace(
        /\$guild_iconurl/g,
        member.guild.iconURL({ dynamic: true })
      );
    }
    return objectValue;
  }
  async replace(string, message) {
    try {
      if (string == null) return string;
      string = await string.replace(
        /\$user_mention/g,
        `<@${message.member.id}>`
      );
      string = await string.replace(
        /\$user_username/g,
        message.member.user.username
      );
      string = await string.replace(
        /\$user_tag/g,
        message.member.user.username
      );
      string = await string.replace(/\$user_id/g, message.member.user.id);
      string = await string.replace(
        /\$user_createdtimestamp/g,
        `<t:${~~(message.member.user.createdTimestamp / 1000)}:R>`
      );
      string = await string.replace(
        /\$user_iconurl/g,
        message.member.user.displayAvatarURL({ dynamic: true })
      );
      string = await string.replace(/\$guild_name/g, message.guild.name);
      string = await string.replace(/\$guild_id/g, message.guild.id);
      string = await string.replace(
        /\$guild_iconurl/g,
        message.guild.iconURL({ dynamic: true }) || ""
      );
      string = await string.replace(
        /\$guild_membercount/g,
        message.guild.memberCount
      );
      return string;
    } catch (e) {
      return string;
    }
  }
  async replaceOriginal(string, member) {
    try {
      if (string == null) return string;
      string = await string.replace(/\$user_mention/g, `<@${member.id}>`);
      string = await string.replace(/\$user_username/g, member.user.username);
      string = await string.replace(/\$user_tag/g, member.user.username);
      string = await string.replace(/\$user_id/g, member.user.id);
      string = await string.replace(
        /\$user_createdtimestamp/g,
        `<t:${~~(member.user.createdTimestamp / 1000)}:R>`
      );
      string = await string.replace(
        /\$user_iconurl/g,
        member.user.displayAvatarURL({ dynamic: true })
      );
      string = await string.replace(/\$guild_name/g, member.guild.name);
      string = await string.replace(/\$guild_id/g, member.guild.id);
      string = await string.replace(
        /\$guild_iconurl/g,
        member.guild.iconURL({ dynamic: true })
      );
      string = await string.replace(
        /\$guild_membercount/g,
        member.guild.memberCount
      );
      return string;
    } catch (e) {
      console.error(e);
    }
  }
  async replaceIcon(inputString, message) {
    if (!inputString) return inputString;
    try {
      const userIconURL =
        message.member.user.displayAvatarURL({ dynamic: true }) ||
        "https://discord.com/assets/1f0bfc0865d324c2587920a7d80c609b.png";
      const guildIconURL =
        message.guild.iconURL({ dynamic: true }) ||
        "https://discord.com/assets/1f0bfc0865d324c2587920a7d80c609b.png";

      inputString = inputString.replace(/\$user_iconurl/g, userIconURL);
      inputString = inputString.replace(/\$guild_iconurl/g, guildIconURL);
      return inputString;
    } catch (error) {
      console.error("Error in replaceIcon function:", error);
      return inputString;
    }
  }
  async addModel(sourceInteraction, modal, timeout = 600000) {
    await sourceInteraction.showModal(modal);
    return await sourceInteraction.awaitModalSubmit({
      time: timeout,
      filter: (filterInteraction) =>
        filterInteraction.customId === `modal-${sourceInteraction.id}`,
    });
  }
  checkOwner(target) {
    return this.client.config.Client.Owners.includes(target);
  }
  checkQuiteJsk(target) {
    return this.client.config.Client.QuiteJsk.includes(target);
  }
  async getBuffer(target) {
    const buffer = await fetch(target).then((res) => res.buffer());
    return buffer;
  }
  splitText(text) {
    const chunkSize = 4000;
    const textLength = text.length;
    const chunks = [];

    for (let i = 0; i < textLength; i += chunkSize) {
      const chunk = text.substr(i, chunkSize);
      chunks.push(chunk);
    }

    return chunks;
  }
  async checkXhotuOwner(target) {
    const owner = await this.client.database.xhotuPermsData.get(target);
    if (!owner.xhotu) return false;
    return true;
  }
  async checkVote(target) {
    let voted = await this.client.topgg.hasVoted(target);
    return voted;
  }
  millisToDuration(ms) {
    try {
      const ok = prettyMilliseconds(ms, {
        colonNotation: true,
        secondsDecimalDigits: 0,
      });
      return ok;
    } catch (e) {
      return;
    }
  }
  formatPerms(perm) {
    return perm
      .toLowerCase()
      .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
      .replace(/_/g, " ")
      .replace(/Guild/g, "Server")
      .replace(/Use Vad/g, "Use Voice Acitvity")
      .replace(/Manageemojisandstickers/g, "Manage Emojis And Stickers")
      .replace(/Use Application Commands/g, "Use Slash Commands")
      .replace(/Use Public Threads/g, "Use Public Thread")
      .replace(/Use Private Threads/g, "Use Private Thread")
      .replace(/Use External Stickers/g, "Use External Sticker");
  }
  formatArray(array, type = "conjunction") {
    return new Intl.ListFormat("en-GB", {
      style: "short",
      type: type,
    }).format(array);
  }

  /*
    Embed Area.......
    */
  async errorDelete(message, description) {
    const embed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(this.client.config.Client.emoji.cross + " " + description)
      .setColor(this.client.config.Client.ErrorColor);
    return await message.reply({ embeds: [embed] }).then((c) => {
      setTimeout(() => {
        c.delete();
      }, 60000);
    });
  }
  async getGlobalUser(id) {
    this.client.users
      .fetch(id)
      .then((user) => {
        return user;
      })
      .catch((e) => {
        return null;
      });
  }
  async getGuildUser(id, guild) {
    guild.members
      .fetch(id)
      .then((user) => {
        return user;
      })
      .catch((e) => {
        return null;
      });
  }
  async doDeletesend(message, description) {
    const embed = new EmbedBuilder()
      .setTitle("Success")
      .setDescription(this.client.config.Client.emoji.tick + " " + description)
      .setColor(this.client.config.Client.SuccessColor);
    return await message.reply({ embeds: [embed] }).then((c) => {
      setTimeout(() => {
        c.delete();
      }, 100000);
    });
  }

  async errorButtonEmbed(message, description, perm) {
    const embed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(description)
      .setTimestamp()
      .setColor(this.client.config.Client.ErrorColor);
    return await message.reply({
      embeds: [embed],
      components: [
        this.row().setComponents(
          this.button()
            .setStyle(5)
            .setLabel("Link")
            .setURL(
              `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=${perm}&scope=bot%20applications.commands`
            )
        ),
      ],
    });
  }
  async collage(img1, img2, img3, img4) {
    try {
      var canvas = Canvas.createCanvas(4096, 4096); // Set canvas size to 4k (4096x4096)
      var ctx = canvas.getContext("2d");

      // Since the image takes time to load, you should await it
      const image1 = await Canvas.loadImage(img1);
      const image2 = await Canvas.loadImage(img2);
      const image3 = await Canvas.loadImage(img3);
      const image4 = await Canvas.loadImage(img4);

      // Wait for all images to load
      ctx.drawImage(image1, 0, 0, 2048, 2048); // Adjust dimensions for the first image
      ctx.drawImage(image2, 2048, 0, 2048, 2048); // Adjust dimensions for the second image
      ctx.drawImage(image3, 0, 2048, 2048, 2048); // Adjust dimensions for the third image
      ctx.drawImage(image4, 2048, 2048, 2048, 2048); // Adjust dimensions for the fourth image

      // Convert the canvas to a buffer
      let buff = await canvas.toBuffer();
      return buff;
    } catch (e) {
      console.error(e);
    }
  }

  async userQuery(query) {
    let userId = null;
    if (query) {
      let matches = query.match(/^<@!?(\d+)>$/);
      if (matches) {
        userId = matches[1];
      }
      if (userId === null) {
        if (!isNaN(query)) {
          userId = query;
        }
      }
    }
    return userId;
  }

  getRandom(arr, count) {
    let _arr = [...arr];
    return [...Array(count)]
      .map(() => _arr.splice(Math.floor(Math.random() * _arr.length), 1)[0])
      .filter((x) => x != undefined);
  }

  discordFormatTime(time, flag = "R") {
    return `<t:${Math.floor(time / 1000)}:${flag}>`;
  }
  async rolePerms(role) {
    const permissionNames = [
      "Administrator",
      "ManageGuild",
      "ManageRoles",
      "ManageChannels",
      "ManageNicknames",
      "ManageEmojisAndStickers",
      "ManageWebhooks",
      "ManageThreads",
      "BanMembers",
      "KickMembers",
    ];

    const check = new PermissionsBitField(role.permissions).any(
      permissionNames
    );
    return check;
  }
  async checkPerms(message, role, slash = false) {
    let serverowner = message?.member.id === message?.guild.ownerId;
    if (!serverowner) {
      if (message?.member.roles.highest.position <= role.position) {
        await this.editReply(
          message,
          {
            content: `You Can't Add Role To User Because Your Role Is Lower Then **${role.name}** Role.`,
            ephemeral: true,
          },
          slash
        );
        return true;
      }
    }
    if (
      message?.guild.members.cache.get(this.client.user.id).roles.highest
        .position <= role.position
    ) {
      await this.editReply(
        message,
        {
          content: `I Can't Add Role To User Because My Role Is Lower Then **${role.name}** Role.`,
          ephemeral: true,
        },
        slash
      );
      return true;
    }
    if (role.managed) {
      await this.editReply(
        message,
        `I Can't Add Role To User Because **${role.name}** Is A Managed Role.`,
        slash
      );
      return true;
    }
    const perms = await this.rolePerms(role);
    if (perms) {
      await this.editReply(
        message,
        {
          content: `I Can't Add **${role.name}** Role Because It Has Administrator Permissions.`,
          ephemeral: true,
        },
        slash
      );
      return true;
    }
  }
  async editReply(message, data, slash = false) {
    if (slash) {
      await message?.editReply(data);
    } else {
      await message?.reply(data);
    }
  }
  makeCode(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
};
