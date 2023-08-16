require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

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

client.on('messageCreate', message => {
  if (message.content === 'ping') {
    message.reply('Pong!');
  }
});

client.login(process.env.TOKEN);
