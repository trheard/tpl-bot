import fetch from 'node-fetch';
import DiscordJS from 'discord.js';
import xml2js from 'xml2js';

const { Client, Intents } = DiscordJS; 
const INJURY_FEED_URL = 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30&tags=fs/nfl';

async function getLatestInjuryNews() {
  const response = await fetch(INJURY_FEED_URL);
  const xmlData = await response.text();

  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlData, (err, result) => {
      if (err) reject(err);

      const items = result.rss.channel[0].item.slice(0, 5);

      const news = items.map(item => ` - **${item.title[0]}**: ${item.link[0]}`).join('\n');

      resolve(news);
    });
  });
}

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT
  ]
});

client.on('ready', () => {
  console.log('The bot is ready, reporting as Stephania Bell');

  // Post injury news every hour
  setInterval(async () => {
    const injuryNewsChannel = client.channels.cache.get('1135702895178821647'); 

    // Replace with your channel ID
    const news = await getLatestInjuryNews();

    injuryNewsChannel.send(`Stephania Bell here with the latest NFL injury news:\n${news}`);
  }, 60 * 60 * 1000); // 60 minutes interval
});

client.on('messageCreate', message => {
  if (message.author.bot || !message.mentions.has(client.user)) return;

  // Responding to mentions in the main channel
  if (message.channel.id === '1135702895178821647') { 
    // Replace with your main channel ID
    message.reply(`Hi, this is Stephania Bell. How can I assist you with fantasy football insights or NFL injury news?`);
  }
});

client.login(process.env.BELL);