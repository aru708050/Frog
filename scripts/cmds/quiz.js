const axios = require("axios");
module.exports = {
  config: {
    name: "quiz",
    aliases: ["trivia"],
    version: "1.0",
    author: "UPoL 🐔",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Test your knowledge with a fun quiz challenge!"
    },
    longDescription: {
      en: "Answer questions from various categories and earn rewards for your knowledge! Challenge yourself now!"
    },
    category: "game",
    guide: {
      en: "{pn} [category] - If no category is provided, a list of available categories will be shown."
    },
  },

  onReply: async function ({ event, api, Reply, usersData }) {
    const { questionData, correctAnswer, nameUser } = Reply;
    if (event.senderID !== Reply.author) return;

    const userReply = event.body.trim().toUpperCase();
    const resultMessage = userReply === correctAnswer.toUpperCase() ? 
      `✅ **Correct!**\n🎉 **Great job, ${nameUser}!**\n💸 You've earned:\n\n**${Math.floor(Math.random() * 1000) + 1000} coins**\n⭐ **${Math.floor(Math.random() * 5) + 5} EXP**` :
      `❌ **Incorrect!**\n⚠️ **Sorry, ${nameUser},** the correct answer was: **${correctAnswer}**`;

    if (userReply === correctAnswer.toUpperCase()) {
      api.unsendMessage(Reply.messageID).catch(console.error);

      const senderID = event.senderID;
      const userData = await usersData.get(senderID);
      await usersData.set(senderID, {
        money: userData.money + Math.floor(Math.random() * 500) + 500,
        exp: userData.exp + Math.floor(Math.random() * 5) + 5,
        data: userData.data
      });
    } else {
      api.unsendMessage(Reply.messageID).catch(console.error);
    }

    return api.sendMessage(resultMessage, event.threadID);
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID } = event;

    if (args.length === 0) {
      try {
        const categories = [
          "✨ Anime ✨",
          "🍚 Bangla 🍚",
          "🧬 Biology 🧬",
          "🧪 Chemistry 🧪",
          "💻 Coding 💻",
          "📚 English 📚",
          "🍕 Food 🍕",
          "📖 Grammar 📖",
          "🗣️ Hindi 🗣️",
          "🙏 Hindu 🙏",
          "📜 History 📜",
          "🌙 Islam 🌙",
          "➗ Math ➗",
          "🎬 Movie 🎬",
          "🎶 Music 🎶",
          "🔬 Physics 🔬",
          "🎲 Random 🎲",
          "🔬 Science 🔬"
        ];

        const categoryList = categories.map(cat => `💡 ${cat}`).join("\n");

        const msg = `
🌟 **Welcome to the Quiz!** 🎉

🌈 **Choose Your Category** and test your knowledge! 💡

🔮 **Available Categories:**

${categoryList}

To start playing, type: \`quiz <category>\`

**Ready to challenge yourself? Let's go! 🚀**
        `;
        return api.sendMessage(msg, threadID, messageID);
      } catch (error) {
        console.error("Error fetching categories:", error);
        return api.sendMessage("❌ Oops! Couldn't fetch categories. Try again later.", threadID, messageID);
      }
    }

    const category = args.join(" ").toLowerCase();
    try {
      const response = await axios.get(`https://upol-quiz-game.onrender.com/categories/${category}`);
      const quizData = response.data.questions[Math.floor(Math.random() * response.data.questions.length)];
      const { question, options, answer } = quizData;
      const namePlayerReact = await usersData.getName(event.senderID);

      let optionsText = `**Question:** ${question}\n\n**Options:**\n`;
      Object.entries(options).forEach(([key, value]) => {
        optionsText += `  ➡️ **${key}:** ${value}\n`;
      });

      const msg = {
        body: `${optionsText}\n\n🌈 **Answer using A, B, C, or D.**\n📝 **Good luck!**`
      };

      api.sendMessage(msg, threadID, async (error, info) => {
        if (error) {
          console.error("Error sending quiz message:", error);
          return;
        }

        global.GoatBot.onReply.set(info.messageID, {
          type: "reply",
          commandName: "quiz",
          author: event.senderID,
          messageID: info.messageID,
          questionData: quizData,
          correctAnswer: answer,
          nameUser: namePlayerReact
        });
      });
    } catch (error) {
      console.error("Error fetching quiz question:", error);
      return api.sendMessage("❌ Something went wrong while fetching the quiz question. Please try again later.", threadID, messageID);
    }
  }
};
