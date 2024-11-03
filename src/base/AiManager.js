const Fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const { json } = require("body-parser");
module.exports = class AiManager {
  /**
   *
   * @param {import('./PrismoClient')} client
   */
  constructor(client) {
    this.client = client;
    this.baseURL = "https://ai.grootbot.pro";
    this.theDevs = "https://devmind.thedevs.org";
  }

  async magicAvatar(image, gender) {
    try {
      const url = new URL("/magic", this.baseURL);
      url.searchParams.append("image", image);
      url.searchParams.append("gender", gender);
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "succeed") {
        const image = await Fetch(data.image);
        const buffer = await image.buffer();
        return { status: "success", data: buffer };
      } else {
        return { status: "error", data: data };
      }
    } catch (error) {
      return { status: "error", data: error.message };
    }
  }

  async swap(baseImage, swapImage, nsfw = false) {
    try {
      const url = new URL("/swap", this.baseURL);
      url.searchParams.append("target_image", baseImage);
      url.searchParams.append("source_image", swapImage);
      url.searchParams.append("nsfw", nsfw);
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "succeed") {
        const image = await Fetch(data.image);
        const buffer = await image.buffer();
        return { status: "success", data: buffer };
      } else {
        return { status: "error", data: data };
      }
    } catch (error) {
      return { status: "error", data: error.message };
    }
  }
  async imagine(text) {
    try {
      const url = new URL("/imagine", this.theDevs);
      const payload = { q: text, num_outputs: 4 };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `theDevs_iloveyou`,
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        },
        body: JSON.stringify(payload)
      };
      const response = await Fetch(url, options);
      const data = await response.json();
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  async qr(text, urll) {
    try {
      const url = new URL("/qr", this.baseURL);
      url.searchParams.append("q", text);
      url.searchParams.append("url", urll);
      const response = await fetch(url);
      const data = await response.json();
      return { status: "success", data: data[0] };
    } catch (error) {
      return { status: "error", data: error.message };
    }
  }

  async upscale(img) {
    try {
      const url = new URL("/upscale", this.baseURL);
      url.searchParams.append("image", img);
      url.searchParams.append("nsfw", "true");
      const response = await fetch(url);
      const data = await response.json();
      const image = await Fetch(data);
      const buffer = await image.buffer();
      return { status: "success", data: buffer };
    } catch (error) {
      return { status: "error", data: error.message };
    }
  }

  async bard(text) {
    try {
      const url = new URL("/bard", this.baseURL);
      let oka = { q: text };
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(oka),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      return data.content;
    } catch (error) {
      return { status: "error", data: error.message };
    }
  }

  async bardExplain(image, text = null) {
    try {
      const url = new URL("/define", this.baseURL);

      // Append text to the query parameters if provided
      url.searchParams.append("image", image);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      return data.content;
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }

  async mascot(text) {
    try {
      const url = new URL("/mascot", this.baseURL);
      let oka = { q: text, num_outputs: 4 };
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(oka),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: "error", data: error.message };
    }
  }
};
