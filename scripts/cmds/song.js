const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "song",
    version: "2.2",
    author: "@RI F AT",
    countDown: 5,
    role: 0,
    shortDescription: "Search & send song audio",
    longDescription: "Send MP3 by searching or identifying from reply",
    category: "media",
    guide: {
      en: "{pn} <song name> or reply to audio/video"
    }
  },

  onStart: async function ({ api, event, args }) {
    const queryInput = args.join(" ");
    const { messageReply } = event;

    try {
      let searchQuery = queryInput;

      // Song recognition from reply
      if (!searchQuery && messageReply?.attachments?.[0]?.url) {
        const fileUrl = messageReply.attachments[0].url;
        const recognizeRes = await axios.get(
          `https://music-recognition.onrender.com/identify?audioUrl=${encodeURIComponent(fileUrl)}`
        );
        const { title, artist } = recognizeRes?.data || {};
        if (!title || !artist) return api.sendMessage("Couldn't recognize the song.", event.threadID, event.messageID);
        searchQuery = `${title} ${artist}`;
      }

      if (!searchQuery) return api.sendMessage("Enter a song name or reply to audio/video.", event.threadID, event.messageID);

      const res = await axios.get(`https://api.agatz.xyz/api/ytplay?message=${encodeURIComponent(searchQuery)}`);
      const { title } = res?.data?.data?.audio || {};
      const audioUrl = res?.data?.data?.audio?.url;

      if (!audioUrl || !audioUrl.startsWith("http")) {
        return api.sendMessage("MP3 not found.", event.threadID, event.messageID);
      }

      const audioRes = await axios({
        url: audioUrl,
        method: "GET",
        responseType: "stream"
      });

      // Add a proper filename to make Messenger show it cleanly
      const fileName = title ? `${title}.mp3` : "song.mp3";
      audioRes.data.path = path.basename(fileName);

      api.sendMessage({
        body: title,
        attachment: audioRes.data
      }, event.threadID, event.messageID);

    } catch (err) {
      console.error("song cmd error:", err.message);
      api.sendMessage("Error fetching song.", event.threadID, event.messageID);
    }
  }
};