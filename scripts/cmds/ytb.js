 const yts = require("yt-search");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const spinner = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

module.exports = {
  config: {
    name: "ytb",
    version: "2.0",
    author: "Nyx Modified",
    countDown: 5,
    role: 0,
    description: { en: "YouTube audio/video search and download with full info" },
    category: "MEDIA",
    guide: {
      en: "{pn} -v <name/url> : Video\n{pn} -a <name/url> : Audio"
    }
  },

  onStart: async function({ args, message, event, commandName, api }) {
    const type = args[0];
    const query = args.slice(1).join(" ");
    if (!type || !query) return message.reply("Please provide type and query/url.");

    if (type !== "-v" && type !== "-a") return message.reply("Invalid type. Use -v (video) or -a (audio).");

    const loading = await message.reply(`${spinner[0]} Processing...`);
    let frame = 0;
    const interval = setInterval(async () => {
      frame = (frame + 1) % spinner.length;
      await api.editMessage(`${spinner[frame]} Processing...`, loading.messageID);
    }, 200);

    try {
      if (query.startsWith("http")) {
        if (type === "-v") await downloadVideo(query, message);
        else if (type === "-a") await downloadYouTubeAudio(extractVideoId(query), message);
      } else {
        const results = await searchYouTube(query);
        if (results.length === 0) {
          clearInterval(interval);
          await api.unsendMessage(loading.messageID);
          return message.reply("⛔ No results found.");
        }
        const list = results.map((r, i) => `${i + 1}. ${r.title}`).join("\n");
        const listMsg = await message.reply({
          body: `🎬 Choose:\n\n${list}`,
          attachment: await Promise.all(results.map(v => getStreamFromURL(v.thumbnail)))
        });

        global.GoatBot.onReply.set(listMsg.messageID, {
          commandName,
          messageID: listMsg.messageID,
          author: event.senderID,
          searchResults: results,
          type
        });
      }
    } catch (e) {
      clearInterval(interval);
      await api.unsendMessage(loading.messageID);
      await message.reply(`❌ Error: ${e.message}`);
    }
    clearInterval(interval);
    await api.unsendMessage(loading.messageID);
  },

  onReply: async ({ event, api, Reply, message }) => {
    const { searchResults, type } = Reply;
    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > searchResults.length) return message.reply("❌ Invalid choice.");

    const selected = searchResults[choice - 1];
    await api.unsendMessage(Reply.messageID);

    const loading = await message.reply(`${spinner[0]} Downloading...`);
    let frame = 0;
    const interval = setInterval(async () => {
      frame = (frame + 1) % spinner.length;
      await api.editMessage(`${spinner[frame]} Downloading...`, loading.messageID);
    }, 200);

    try {
      if (type === "-v") await downloadVideo(selected.url, message);
      else if (type === "-a") await downloadYouTubeAudio(extractVideoId(selected.url), message);
    } catch (e) {
      await message.reply(`❌ Download error: ${e.message}`);
    }
    clearInterval(interval);
    await api.unsendMessage(loading.messageID);
  }
};

async function searchYouTube(query) {
  const s = await yts(query);
  return s.videos
    .filter(v => v.duration.seconds <= 600)
    .map(v => ({
      id: v.videoId,
      title: v.title,
      duration: v.timestamp,
      thumbnail: v.thumbnail,
      url: `https://www.youtube.com/watch?v=${v.videoId}`
    }));
}

async function downloadVideo(url, message) {
  const { data } = await axios.get(`${global.GoatBot.config.nyx}api/ytv?d=${encodeURIComponent(url)}&type=mp4`);
  const info = await getVideoDetails(extractVideoId(url));
  const pathTemp = path.join(__dirname, 'ytb_video.mp4');
  const video = await axios({ url: data.url, responseType: 'arraybuffer' });
  fs.writeFileSync(pathTemp, video.data);

  await message.reply({
    body: `🎬 Title: ${info.title}
⌛ Duration: ${info.duration}
👁️ Views: ${info.views}
📅 Uploaded: ${info.uploadDate}
👤 Channel: ${info.author}
🔗 URL: ${info.url}`,
    attachment: fs.createReadStream(pathTemp)
  });
  fs.unlinkSync(pathTemp);
}

async function downloadYouTubeAudio(videoId, message) {
  const { data } = await axios.get(`${global.GoatBot.config.nyx}api/ytv?d=https://www.youtube.com/watch?v=${videoId}&type=mp3`);
  const info = await getVideoDetails(videoId);
  const pathTemp = path.join(__dirname, 'ytb_audio.mp3');
  const audio = await axios({ url: data.url, responseType: 'arraybuffer' });
  fs.writeFileSync(pathTemp, audio.data);

  await message.reply({
    body: `🎵 Title: ${info.title}
⌛ Duration: ${info.duration}
👁️ Views: ${info.views}
📅 Uploaded: ${info.uploadDate}
👤 Channel: ${info.author}
🔗 URL: ${info.url}`,
    attachment: fs.createReadStream(pathTemp)
  });
  fs.unlinkSync(pathTemp);
}

async function getVideoDetails(videoId) {
  const v = await yts({ videoId });
  return {
    title: v.title,
    duration: v.duration.timestamp,
    views: v.views,
    uploadDate: v.uploadDate,
    author: v.author.name,
    url: `https://www.youtube.com/watch?v=${videoId}`
  };
}

async function getStreamFromURL(url) {
  const res = await axios({ url, responseType: 'stream' });
  return res.data;
}

function extractVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : url.split("/").pop();
}