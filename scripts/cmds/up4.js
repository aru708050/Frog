 const { execSync } = require('child_process');
const os = require('os');

module.exports = {
  config: {
    name: 'up4',
    version: '1.0.0',
    author: 'Nyx',
    category: 'MEDIA'
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const formatBytes = b => (b / 1024 / 1024 / 1024).toFixed(2) + ' GB';

    const msg = await api.sendMessage("▰\n𝗦𝘆𝘀𝘁𝗲𝗺 𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴...", event.threadID);
    const messageID = msg.messageID;

    await delay(1000);
    const platform = os.platform();
    const release = os.release();
    const hostname = os.hostname();

    await api.editMessage(
      `▰▰\n𝗦𝘆𝘀𝘁𝗲𝗺: ${platform}\n𝗥𝗲𝗹𝗲𝗮𝘀𝗲: ${release}\n𝗛𝗼𝘀𝘁: ${hostname}`,
      messageID, event.threadID
    );

    await delay(1000);
    const version = execSync('uname -v').toString().trim();
    const arch = os.arch();
    const uptime = new Date(os.uptime() * 1000).toISOString().substr(11, 8);

    await api.editMessage(
      `▰▰▰\n𝗦𝘆𝘀𝘁𝗲𝗺: ${platform}\n𝗥𝗲𝗹𝗲𝗮𝘀𝗲: ${release}\n𝗛𝗼𝘀𝘁: ${hostname}\n\n𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${version}\n𝗠𝗮𝗰𝗵𝗶𝗻𝗲: ${arch}\n𝗨𝗽𝘁𝗶𝗺𝗲: ${uptime}`,
      messageID, event.threadID
    );

    await delay(1000);

    const cpuModel = os.cpus()[0].model.split('@')[0].trim();
    const cpuCores = os.cpus().length;
    const loadavg = os.loadavg().map(l => l.toFixed(2)).join(', ');

    const cpuUsage = await new Promise(res => {
      const stats1 = os.cpus()[0].times;
      const idle1 = stats1.idle;
      const total1 = Object.values(stats1).reduce((a, b) => a + b, 0);
      setTimeout(() => {
        const stats2 = os.cpus()[0].times;
        const idle2 = stats2.idle;
        const total2 = Object.values(stats2).reduce((a, b) => a + b, 0);
        const usage = 100 - ((idle2 - idle1) / (total2 - total1)) * 100;
        res(usage.toFixed(1));
      }, 500);
    });

    const totalRAM = os.totalmem();
    const freeRAM = os.freemem();
    const usedRAM = totalRAM - freeRAM;
    const ramUsage = ((usedRAM / totalRAM) * 100).toFixed(1);

    await api.editMessage(
      `▰▰▰▰\n𝗖𝗣𝗨: ${cpuUsage}% of ${cpuCores} cores\n𝗠𝗼𝗱𝗲𝗹: ${cpuModel}\n𝗥𝗔𝗠: ${formatBytes(usedRAM)} / ${formatBytes(totalRAM)} (${ramUsage}%)\n𝗟𝗼𝗮𝗱 Avg: ${loadavg}`,
      messageID, event.threadID
    );

    await delay(1500);

    // ⏱ Media check with timeout (3 sec max wait)
    async function tryFetchMedia(timeoutMs = 3000) {
      return new Promise(async (resolve) => {
        let done = false;
        setTimeout(() => {
          if (!done) resolve(false);
        }, timeoutMs);
        try {
          const stream = await global.utils.getStreamFromURL("http://160.191.129.54:5000/cdn/qUoICPxuC.png");
          done = true;
          resolve(stream);
        } catch {
          resolve(false);
        }
      });
    }

    let mediaStatus = "🟢 𝗠𝗲𝗱𝗶𝗮: 𝗔𝗹𝗹𝗼𝘄𝗲𝗱";
    const testImg = await tryFetchMedia();
    if (!testImg) {
      mediaStatus = "🔴 𝗠𝗲𝗱𝗶𝗮: 𝗕𝗹𝗼𝗰𝗸𝗲𝗱";
    } else {
      await api.sendMessage({ attachment: testImg }, event.threadID);
    }

    const diskRaw = execSync('df -h /').toString().split('\n')[1].split(/\s+/);
    const totalDisk = diskRaw[1];
    const usedDisk = diskRaw[2];
    const diskUsage = diskRaw[4];
    const totalProc = execSync('ps -e --no-headers | wc -l').toString().trim();
    const runningProc = execSync('ps r --no-headers | wc -l').toString().trim();

    const users = await usersData.getAll();
    const threads = await threadsData.getAll();

    const networkInfo = Object.entries(os.networkInterfaces())
      .map(([name, intf]) => `• ${name}: ${intf.map(i => i.address).join(', ')}`)
      .join('\n');

    await api.editMessage(
`▰▰▰▰▰\n𝗦𝘆𝘀𝘁𝗲𝗺 𝗦𝘁𝗮𝘁𝘂𝘀 ✅

𝗢𝗦: ${platform} ${release}
𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${version}
𝗨𝗽𝘁𝗶𝗺𝗲: ${uptime}
𝗔𝗿𝗰𝗵: ${arch}

𝗖𝗣𝗨: ${cpuUsage}% of ${cpuCores} cores
𝗠𝗼𝗱𝗲𝗹: ${cpuModel}
𝗟𝗼𝗮𝗱: ${loadavg}

𝗥𝗔𝗠: ${formatBytes(usedRAM)} / ${formatBytes(totalRAM)} (${ramUsage}%)
𝗗𝗶𝘀𝗸: ${usedDisk} / ${totalDisk} (${diskUsage})

𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝘀: ${totalProc} total, ${runningProc} running
𝗨𝘀𝗲𝗿𝘀: ${users.length}
𝗚𝗿𝗼𝘂𝗽𝘀: ${threads.length}
${mediaStatus}

𝗡𝗲𝘁𝘄𝗼𝗿𝗸:
${networkInfo}`,
      messageID, event.threadID
    );
  }
};