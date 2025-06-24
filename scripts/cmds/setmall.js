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
    name: "setmall",
    aliases: [],
    version: "1.3",
    author: "Arijit",
    countDown: 5,
    role: 2, // Admin only
    shortDescription: "Set balance for all users",
    longDescription: "Set all users' balance including the command sender.",
    category: "banking",
    guide: "{pn} <amount>"
  },

  onStart: async function ({ api, event, args, usersData, message }) {
    const amount = parseInt(args[0]);

    if (!args[0] || isNaN(amount) || amount < 0) {
      return message.reply("❌ | Please enter a valid positive amount.\n\n✅ Example: !setmall 1000000");
    }

    try {
      let allUsers = await usersData.getAll();
      const senderID = event.senderID;

      // Add sender manually if not in list
      if (!allUsers.find(u => u.userID === senderID)) {
        allUsers.push({ userID: senderID });
      }

      let count = 0;
      for (const user of allUsers) {
        if (user.userID) {
          await usersData.set(user.userID, amount, "money");
          count++;
        }
      }

      const formatted = formatAmount(amount);
      return message.reply(`✅ | Successfully set balance of ${count} users to ${formatted}`);
    } catch (err) {
      console.error("Error in setmall command:", err);
      return message.reply("❌ | Something went wrong while updating balances.");
    }
  }
};