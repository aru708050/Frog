module.exports = {
  config: {
    name: "ownerlist",
    version: "1.0",
    author: "Arijit",
    role: 0,
    shortDescription: "Show bot owner list",
    longDescription: "Show list of all bot owners with name and UID",
    category: "info",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, api }) {
    const ownerUids = global.GoatBot.config.OWNER;

    if (!ownerUids || ownerUids.length === 0)
      return message.reply("❌ No owners found in bot configuration.");

    let finalList = "👑 | List of owners role\n";

    for (const uid of ownerUids) {
      try {
        const info = await api.getUserInfo(uid);
        const name = info[uid]?.name || "Unknown";
        finalList += `\n╭‣Name: ${name} 👑\n╰‣Uid: ${uid}\n`;
      } catch (e) {
        finalList += `\n╭‣Name: Unknown 👑\n╰‣Uid: ${uid}\n`;
      }
    }

    return message.reply(finalList);
  }
};