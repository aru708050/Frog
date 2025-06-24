const fs = require('fs');

function formatAmount(num) {
  const suffixes = ["", "K", "M", "B", "T", "Q", "QQ", "S"];
  const tier = Math.log10(num) / 3 | 0;

  if (tier === 0) return "$" + num.toString();

  const suffix = suffixes[tier] || "";
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return "$" + scaled.toFixed(2).replace(/\.00$/, "") + suffix;
}

module.exports = {
  config: {
    name: "setsall",
    aliases: [],
    version: "1.0",
    author: "Arijit",
    countDown: 5,
    role: 2, // Only admin can use
    shortDescription: "Set balance for all users",
    longDescription: "Set the same balance amount for all users who have used the bot.",
    category: "banking",
    guide: "{pn} <amount>"
  },

  onStart: async function ({ api, args, usersData, message }) {
    const amount = parseInt(args[0]);

    if (!args[0] || isNaN(amount) || amount < 0) {
      return message.reply("❌ | Please enter a valid positive number.\n\n✅ Example: !setsall 1000000");
    }

    try {
      const allUsers = await usersData.getAll();
      let count = 0;

      for (const user of allUsers) {
        await usersData.set(user.userID, amount, "money");
        count++;
      }

      const formatted = formatAmount(amount);
      return message.reply(`✅ | Successfully set balance of ${count} users to ${formatted}`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ | An error occurred while setting balances.");
    }
  }
};