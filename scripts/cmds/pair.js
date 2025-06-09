const axios = require("axios");
const fs = require("fs-extra");

  module.exports = {
  config: {
    name: "pair",
    aliases: ["rpair"],
    version: "1.0",
    author: "RUBISH",
    countDown: 20,
    role: 0,
    shortDescription: "Pairing command with multiple types",
    longDescription: "This command allows you to create random pairs with various types. Specify the pair type using the {pn} <pairType> command, or leave it blank to get a random pair.",
    category: "Entertainment",
    guide: "{pn} \n{pn} <pairType>\nExample - {pn} 1 , {pn} 2 , {pn} 3 , {pn} 4 , {pn} 5"
  },


  onStart: async function ({ api, event, threadsData, usersData, args }) {
    let pairType;

    if (!args[0]) {

      pairType = Math.floor(Math.random() * 5) + 1;
    } else {
      pairType = parseInt(args[0]);

      if (isNaN(pairType) || pairType < 1 || pairType > 5) {
        return api.sendMessage("Invalid pair type. Please use a number between 1 and 5.", event.threadID, event.messageID);
      }

      args.shift(); 
    }

    switch (pairType) {
      case 1:
        return module.exports.pairType1({ api, event, threadsData, usersData, args });
      case 2:
        return module.exports.pairType2({ api, event, threadsData, usersData, args });
      case 3:
        return module.exports.pairType3({ api, event, threadsData, usersData, args });
      case 4:
        return module.exports.pairType4({ api, event, threadsData, usersData, args });
      case 5:
        return module.exports.pairType5({ api, event, threadsData, usersData, args });
      default:
        return api.sendMessage("⚠ | Please use a number between 1 and 5.", event.threadID, event.messageID);
    }
  },

  pairType1: async function ({ api, event, threadsData, usersData, args }) {
    const { threadID, messageID, senderID } = event;
    const { participantIDs } = await api.getThreadInfo(threadID);
    var namee = (await usersData.get(senderID)).name
    const botID = api.getCurrentUserID();
    const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
    var id = listUserID[Math.floor(Math.random() * listUserID.length)];
    var name = (await usersData.get(id)).name
    var arraytag = [];
    arraytag.push({ id: senderID, tag: namee });
    arraytag.push({ id: id, tag: name });

    let Avatar = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

    let gifLove = (await axios.get(`https://i.ibb.co/y4dWfQq/image.gif`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8"));

    let Avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

    var imglove = [];

    imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
    imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
    imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));

    var msg = {
      body: `🥰Successful pairing!\n\n💌Wish you two hundred years of happiness\n\n💕Double ratio: ${Math.floor(Math.random() * 101)}%\n${namee} 💓+💓 ${name}`,
      mentions: arraytag,
      attachment: imglove
    };

    return api.sendMessage(msg, threadID, messageID);
  },

  pairType2: async function ({ api, event, threadsData, usersData, args }) {
    const { loadImage, createCanvas } = require("canvas");
    let pathImg = __dirname + "/assets/background.png";
    let pathAvt1 = __dirname + "/assets/any.png";
    let pathAvt2 = __dirname + "/assets/avatar.png";

    var id1 = event.senderID;
    var name1 = await usersData.getName(id1);
    var ThreadInfo = await api.getThreadInfo(event.threadID);
    var all = ThreadInfo.userInfo
    for (let c of all) {
      if (c.id == id1) var gender1 = c.gender;
    };
    const botID = api.getCurrentUserID();
    let ungvien = [];
    if (gender1 == "FEMALE") {
      for (let u of all) {
        if (u.gender == "MALE") {
          if (u.id !== id1 && u.id !== botID) ungvien.push(u.id)
        }
      }
    }
    else if (gender1 == "MALE") {
      for (let u of all) {
        if (u.gender == "FEMALE") {
          if (u.id !== id1 && u.id !== botID) ungvien.push(u.id)
        }
      }
    }
    else {
      for (let u of all) {
        if (u.id !== id1 && u.id !== botID) ungvien.push(u.id)
      }
    }
    var id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
    var name2 = await usersData.getName(id2);
    var rd1 = Math.floor(Math.random() * 100) + 1;
    var cc = ["0", "-1", "99,99", "-99", "-100", "101", "0,01"];
    var rd2 = cc[Math.floor(Math.random() * cc.length)];
    var djtme = [`${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd2}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`];

    var tile = djtme[Math.floor(Math.random() * djtme.length)];

    var background = [
      "https://i.ibb.co/RBRLmRt/Pics-Art-05-14-10-47-00.jpg"
    ];

    let getAvtmot = (
      await axios.get(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

    let getAvthai = (
      await axios.get(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(pathAvt2, Buffer.from(getAvthai, "utf-8"));

    let getbackground = (
      await axios.get(`${background}`, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

    let baseImage = await loadImage(pathImg);
    let baseAvt1 = await loadImage(pathAvt1);
    let baseAvt2 = await loadImage(pathAvt2);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 111, 175, 330, 330);
    ctx.drawImage(baseAvt2, 1018, 173, 330, 330);
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);
    fs.removeSync(pathAvt2);
    return api.sendMessage({
      body: `
      Congratulations ${name1}『💗』

      Looks like your destiny brought you together with ${name2}『❤』

      Your link percentage is ${tile}%『🔗』`,
      mentions: [{
        tag: `${name2}`,
        id: id2
      }, { tag: `${name1}`, id: id1 }],
      attachment: fs.createReadStream(pathImg)
    },
      event.threadID,
      () => fs.unlinkSync(pathImg),
      event.messageID
    );
  },

  // Implement pairType3, pairType4, and pairType5 similarly...
  pairType3: async function ({ api, event, threadsData, usersData, args }) {
    // Pairing logic for type 3
    const { threadID, messageID, senderID } = event;
    const { participantIDs } = await api.getThreadInfo(threadID);
    var namee = (await usersData.get(senderID)).name
    const botID = api.getCurrentUserID();
    const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
    var id = listUserID[Math.floor(Math.random() * listUserID.length)];
    var name = (await usersData.get(id)).name
    var arraytag = [];
    arraytag.push({ id: senderID, tag: namee });
    arraytag.push({ id: id, tag: name });

    let Avatar = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

    let gifLove = (await axios.get(`https://i.ibb.co/y4dWfQq/image.gif`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8"));

    let Avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

    var imglove = [];

    imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
    imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
    imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));

    var msg = {
      body: `🥰Successful pairing!\n\n💌Wish you two hundred years of happiness\n\n💕Double ratio: ${Math.floor(Math.random() * 101)}%\n${namee} 💓+💓 ${name}`,
      mentions: arraytag,
      attachment: imglove
    };

    return api.sendMessage(msg, threadID, messageID);
  },


  pairType4: async function ({ api, event, threadsData, usersData, args }) {
      // Pairing logic for type 4
      const { threadID, messageID, senderID } = event;
      const { participantIDs } = await api.getThreadInfo(threadID);
      var namee = (await usersData.get(senderID)).name
      const botID = api.getCurrentUserID();
      const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
      var id = listUserID[Math.floor(Math.random() * listUserID.length)];
      var name = (await usersData.get(id)).name
      var arraytag = [];
      arraytag.push({ id: senderID, tag: namee });
      arraytag.push({ id: id, tag: name });

      let Avatar = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

      let gifLove = (await axios.get(`https://i.ibb.co/y4dWfQq/image.gif`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8"));

      let Avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

      var imglove = [];

      imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
      imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
      imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));

      var msg = {
        body: `
✅ | Successful pairing!
        
💌Wish you two hundred years of happiness

💕Double ratio: ${Math.floor(Math.random() * 101)}%

${namee} 💓+💓 ${name}`,
        mentions: arraytag,
        attachment: imglove
      };

      return api.sendMessage(msg, threadID, messageID);
    },

    pairType5: async function ({ api, event, threadsData, usersData, args }) {
   
      const { threadID, messageID, senderID } = event;
      const { participantIDs } = await api.getThreadInfo(threadID);
      var namee = (await usersData.get(senderID)).name
      const botID = api.getCurrentUserID();
      const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
      var id = listUserID[Math.floor(Math.random() * listUserID.length)];
      var name = (await usersData.get(id)).name
      var arraytag = [];
      arraytag.push({ id: senderID, tag: namee });
      arraytag.push({ id: id, tag: name });

      let Avatar = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

      let gifLove = (await axios.get(`https://i.ibb.co/y4dWfQq/image.gif`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8"));

      let Avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

      var imglove = [];

      imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
      imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
      imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));

      var msg = {
        body: `
🎉 Congratulations to ${namee} & ${name}!

Wishing you endless love, laughter, and adventures together! May your bond grow stronger with each passing day.

💕Double ratio: ${Math.floor(Math.random() * 101)}%

${namee} 💓+💓 ${name}`,
        mentions: arraytag,
        attachment: imglove
      };

      return api.sendMessage(msg, threadID, messageID);
    },
  };
