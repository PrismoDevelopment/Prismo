const { URL, URLSearchParams } = require('url');
const https = require('https');

function getContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'PrismoBot/2.0' } }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`Request failed! Status Code: ${res.statusCode} for ${url}`));
      }
      res.setEncoding('utf-8');
      let rawData = '';
      res.on('data', (chunk) => (rawData += chunk));
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          if (parsedData.results && parsedData.results[0] && parsedData.results[0].url) {
            resolve({ url: parsedData.results[0].url });
          } else {
            resolve(parsedData);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => reject(e));
  });
}

const urls = {
  blush: "https://nekos.best/api/v2/blush",
  bonk: "https://nekos.best/api/v2/bonk",
  cry: "https://nekos.best/api/v2/cry",
  cuddle: "https://nekos.best/api/v2/cuddle",
  dance: "https://nekos.best/api/v2/dance",
  fact: "https://nekos.life/api/v2/fact",
  feed: "https://nekos.best/api/v2/feed",
  gecg: "https://nekos.life/api/v2/img/gecg",
  kill: "https://nekos.best/api/v2/shoot",
  kiss: "https://nekos.best/api/v2/kiss",
  lick: "https://nekos.best/api/v2/bite",
  megumin: "https://nekos.best/api/v2/neko",
  meow: "https://nekos.life/api/v2/img/meow",
  nom: "https://nekos.best/api/v2/nom",
  poke: "https://nekos.best/api/v2/poke",
  slap: "https://nekos.best/api/v2/slap",
  wallpaper: "https://nekos.life/api/v2/img/wallpaper",
  wink: "https://nekos.best/api/v2/wink",
  woof: "https://nekos.life/api/v2/img/woof",
};

const discordActions = {};
for (const endpoint of Object.keys(urls)) {
  discordActions[endpoint] = async function (queryParams = '') {
    let url = new URL(urls[endpoint]);
    if (queryParams !== '') {
      url.search = new URLSearchParams(queryParams);
    }
    return await getContent(url.toString());
  };
}
module.exports = discordActions;
