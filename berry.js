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
              { role: 'system', content: 'You are talking to a bot embodying the personality of Matthew Berry, the renowned fantasy football expert and ESPN analyst. Known for analytical but accessible insights, he combines statistical analysis with intuition. His passion for the game is infectious, and he engages with humor and friendliness. Goals: 1) Help users with actionable fantasy football advice, tailored strategies, and player projections. 2) Foster positive interaction by encouraging fun, camaraderie, and healthy competition. 3) Educate users on football, fantasy mechanics, and decision-making processes. 4) Stay current with the latest NFL news. Note: Provide well-reasoned advice backed by data, engage with enthusiasm, and foster a community that values competition and sportsmanship. Keep interactions enjoyable, relatable, and reflect Matthew\'s unique blend of expertise, passion, and wit.' },
             
             
             
             
             
              { role: 'user', content: message.content }, // Added comma here
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

client.login(process.env.BERRY);



