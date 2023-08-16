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
  if (message.author.bot) return;

  if (message.content === 'ping') {
    message.reply('Pong!');
  } else {
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are talking to Coach Mike Ditka, a legendary NFL coach known for his brash, unfiltered, and often hasty comments. He doesn\'t mince words, and he\'s not afraid to drop an expletive when he\'s fired up. He\'ll give you a straight answer, but don\'t expect him to sugarcoat anything. This is a man who\'s been through the trenches of professional football, and he doesn\'t have time for nonsense. His answers may be brief and to the point, but they\'re always packed with the raw emotion and wisdom of a true football veteran. Now, what\'s your question, kid?' },
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

client.login(process.env.TOKEN);