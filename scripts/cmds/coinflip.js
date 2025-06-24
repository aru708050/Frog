const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "coinflip",
    version: "3.0",
    author: "Arijit",
    description: "Flip a coin and win or lose 1M from your balance",
    category: "game",
    role: 0
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const uid = event.senderID;
    const userData = await usersData.get(uid);
    let userBalance = userData.money || 0;

    // If no choice provided, ask for reply
    if (!args[0]) {
      return message.reply("🪙 | Do you choose `head` or `tail`?\nReply with your choice within 30 seconds.", async (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "coinflip",
          author: uid
        });
      });
    }

    const choice = args[0].toLowerCase();
    if (!["head", "tail"].includes(choice)) {
      return message.reply("❌ Invalid choice. Please choose `head` or `tail`.");
    }

    if (userBalance < 1_000_000) {
      return message.reply("🚫 You need at least 1M to play.");
    }

    await handleCoinflip({ message, choice, uid, usersData });
  },

  onReply: async function ({ event, Reply, message, usersData }) {
    const { author } = Reply;
    if (event.senderID !== author) return;

    const choice = event.body.trim().toLowerCase();
    if (!["head", "tail"].includes(choice)) {
      return message.reply("❌ Invalid choice. Please reply with `head` or `tail`.");
    }

    const userData = await usersData.get(author);
    if ((userData.money || 0) < 1_000_000) {
      return message.reply("🚫 You need at least 1M to play.");
    }

    await handleCoinflip({ message, choice, uid: author, usersData });
  }
};

// Core game logic
async function handleCoinflip({ message, choice, uid, usersData }) {
  const coinSides = ["head", "tail"];
  const result = coinSides[Math.floor(Math.random() * 2)];

  const gifPath = path.join(__dirname, "assets", "coinflip.gif");
  const flipMsg = {
    body: "🌀 Flipping the coin...",
    attachment: fs.createReadStream(gifPath)
  };

  message.reply(flipMsg, async () => {
    await new Promise(res => setTimeout(res, 3000)); // simulate delay

    let resultMsg = `🪙 Coin landed on **${result.toUpperCase()}**!\n`;

    const userData = await usersData.get(uid);
    let newBalance = userData.money || 0;

    if (choice === result) {
      newBalance += 1_000_000;
      resultMsg += "🎉 You WON 1M!\n";
    } else {
      newBalance -= 1_000_000;
      resultMsg += "💀 You LOST 1M.\n";
    }

    await usersData.set(uid, { money: newBalance });
    resultMsg += `💼 Your New Balance: ${formatMoney(newBalance)}`;
    return message.reply(resultMsg);
  });
}

function formatMoney(amount) {
  return amount >= 1_000_000 ? (amount / 1_000_000) + "M" : amount.toString();
}