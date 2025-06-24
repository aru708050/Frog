 
const axios = require("axios");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const mediaUrls = [
  "", "", ""
];

module.exports = {
  config: {
    name: "help",
    aliases: ["use"],
    version: "1.25",
    author: "Ayanokōji",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Explore command usage 📖" },
    longDescription: { en: "View detailed command usage, list commands by page, or filter by category ✨" },
    category: "info",
    guide: {
      en: "🔹 {pn} [pageNumber]\n🔹 {pn} [commandName]\n🔹 {pn} -c <categoryName>"
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData }) {
    try {
      const { threadID } = event;
      const prefix = getPrefix(threadID) || "!";

      const getAttachment = async () => {
        try {
          const randomUrl = mediaUrls[Math.floor(Math.random() * mediaUrls.length)];
          if (!randomUrl) return null;
          const response = await axios.get(randomUrl, { responseType: "stream" });
          return response.data;
        } catch (error) {
          console.warn("Failed to fetch media:", error.message);
          return null;
        }
      };

      // PAGE VIEW
      if (args.length === 0 || !isNaN(args[0])) {
        const categories = {};
        const commandList = [];

        for (const [name, value] of commands) {
          const category = value.config.category?.toLowerCase() || "uncategorized";
          if (!categories[category]) categories[category] = [];
          categories[category].push(name);
          commandList.push(name);
        }

        const totalCommands = commandList.length;
        Object.keys(categories).forEach(cat => {
          categories[cat].sort((a, b) => a.localeCompare(b));
        });

        const sortedCategories = Object.keys(categories).sort();
        const page = parseInt(args[0]) || 1;
        const itemsPerPage = 5;
        const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

        if (page < 1 || page > totalPages)
          return message.reply(`🚫 Invalid page! Please choose between 1 and ${totalPages}.`);

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pagedCategories = sortedCategories.slice(start, end);

        let msg = `✨ [ Guide For Beginners - Page ${page} ] ✨\n\n`;
        for (const category of pagedCategories) {
          const cmds = categories[category];
          const title = category.toUpperCase();
          msg += `╭──── [ ${title} ]\n`;
          msg += `│ ✧ ${cmds.join("✧ ")}\n`;
          msg += `╰───────────────◊\n`;
        }

        msg += `\n╭─『 ARIYAN BOT 』\n`;
        msg += `╰‣ Total commands: ${totalCommands}\n`;
        msg += `╰‣ Page ${page} of ${totalPages}\n`;
        msg += `╰‣ A Personal Facebook Bot\n`;
        msg += `╰‣ ADMIN: Ariyan\n`;
        msg += `╰‣ To see usage of a command, type: ${prefix}help [commandName]`;

        return message.reply({
          body: msg,
          attachment: await getAttachment()
        });
      }

      // CATEGORY FILTER -c <category>
      if (args[0].toLowerCase() === "-c") {
        if (!args[1]) return message.reply("🚫 Please specify a category!");
        const categoryName = args[1].toLowerCase();
        const filteredCommands = Array.from(commands.values()).filter(
          (cmd) => (cmd.config.category?.toLowerCase() === categoryName)
        );

        if (filteredCommands.length === 0)
          return message.reply(`🚫 No commands found in "${categoryName}" category.`);

        const cmdNames = filteredCommands.map(cmd => cmd.config.name).sort((a, b) => a.localeCompare(b));
        const title = categoryName.toUpperCase();

        let msg = `✨ [ ${title} Commands ] ✨\n\n`;
        msg += `╭──── [ ${title} ]\n`;
        msg += `│ ✧ ${cmdNames.join("✧ ")}\n`;
        msg += `╰───────────────◊\n`;
        msg += `\n╭─『 ARIYAN BOT 』\n`;
        msg += `╰‣ Total commands in this category: ${cmdNames.length}\n`;
        msg += `╰‣ A Personal Facebook Bot\n`;
        msg += `╰‣ ADMIN: Ariyan`;

        return message.reply({
          body: msg,
          attachment: await getAttachment()
        });
      }

      // INDIVIDUAL COMMAND
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command)
        return message.reply(`🚫 Command "${commandName}" not found.`);

      const configCommand = command.config;
      const author = configCommand.author || "Unknown";
      const longDescription = configCommand.longDescription?.en || "No description";
      const guideBody = configCommand.guide?.en || "No guide available.";
      const usage = guideBody.replace(/{pn}/g, prefix).replace(/{n}/g, configCommand.name);

      let msg = `✨ [ Command: ${configCommand.name.toUpperCase()} ] ✨\n\n`;
      msg += `╭─── 📜 Details ───\n` +
        `│ 🔹 Name: ${configCommand.name}\n` +
        `│ 📝 Description: ${longDescription}\n` +
        `│ 🌐 Aliases: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n` +
        `│ 🛠 Version: ${configCommand.version || "1.0"}\n` +
        `│ ⏳ Cooldown: ${configCommand.countDown || 1}s\n` +
        `│ ✍ Author: ${author}\n` +
        `╰───────────────◊\n` +
        `╭─── 📚 Usage ───\n` +
        `│ ${usage}\n` +
        `╰───────────────◊\n` +
        `╭─── 📌 Notes ───\n` +
        `│ Customize as needed with ♡ Ariyan bot ♡\n` +
        `╰───────────────◊\n` +
        `╭─『 ARIYAN BOT 』\n` +
        `╰‣ Total commands: ${commands.size}\n` +
        `╰‣ A Personal Facebook Bot\n` +
        `╰‣ ADMIN: Ariyan`;

      return message.reply({
        body: msg,
        attachment: await getAttachment()
      });

    } catch (error) {
      console.error("Help command error:", error);
      await message.reply("⚠ An error occurred. Please try again later.");
    }
  },
};