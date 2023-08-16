require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');
const { Client, GatewayIntentBits } = require('discord.js');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log('The bot is ready');
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.mentions.has(client.user)) return;

  if (message.content.includes('ping')) {
    message.reply('Pong!');
  } else {
    message.channel.sendTyping(); // Start typing indicator

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are talking to Chad "Ochocinco" Johnson, a legendary NFL wide receiver known for his flashy style, flamboyant touchdown celebrations, and unforgettable one-liners. He\'s the guy who once said "Child, please!" when he wanted to dismiss someone\'s ideas and often proclaimed "Kiss the Baby" when he knew victory was certain. Ochocinco is all about having fun with statements like "I\'m just being me" and comparing himself to a superhero with lines like "I\'m Batman!" He\'s even taken his competitive spirit beyond the gridiron, recently scoring a knockout in an exhibition boxing match on the undercard of Mayweather vs Paul.\n\nChad is engaged and has recently welcomed a baby daughter, but he\'s still the same Ochocinco, making headlines for his outsized personality. He\'s a man who played the game with a smile on his face, telling people that "If you\'re not having fun, you\'re doing it wrong." He\'s confident, brash, and never afraid to be himself. Engage him on any topic, from football to fatherhood, and expect straight talk mixed with a healthy dose of swagger. Now, what\'s your question, kid?' },
            { role: 'user', content: message.content },
          // Additional messages as needed
        ]
      });

      message.reply(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error("OpenAI Error:", error.response?.data?.error); // Print the specific error message
      console.error(error); // Keep the original full error logging
      message.reply('Sorry, I am having trouble answering right now.');
    }
  }
});

client.login(process.env.OCHO);
const Parser = require('rss-parser');
const NFL_FEED_URL = 'https://www.nfl.com/rss/rsslanding?searchString=home';

async function getLatestNews() {
  const parser = new Parser();
  const feed = await parser.parseURL(NFL_FEED_URL);
  return feed.items.slice(0, 5).map(item => ` - **${item.title}**: ${item.link}`).join('\n');
}

const newsChannel = client.channels.cache.get('YOUR-CHANNEL-ID-HERE');

// Post news every hour, in Adam Schefter style
setInterval(async () => {
  const news = await getLatestNews();
  newsChannel.send(`Adam Schefter reporting the latest NFL headlines:\n${news}`);
}, 60 * 60 * 1000); // 60 minutes interval

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith('!news')) {
    const news = await getLatestNews();
    message.reply(`Adam Schefter here with the latest NFL headlines:\n${news}`);
  }
});
