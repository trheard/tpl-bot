require('dotenv').config();

// Required modules
const { Configuration, OpenAIApi } = require('openai');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios'); // Required for making HTTP requests

// OpenAI API configuration
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

// Discord bot configuration
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// SportsDB API key
const SPORTSDB_API_KEY = '60130162'; // TODO: Replace with your actual API key

// Function to get player stats from SportsDB API
async function getPlayerStats(name) {
    // Construct endpoint URL with player name
    const endpoint = `https://www.thesportsdb.com/api/v1/json/${SPORTSDB_API_KEY}/searchplayers.php?p=${name}`;
    try {
      const response = await axios.get(endpoint);
      // Log the response data
      // Accessing 'player' property instead of 'players' as per the response structure
      const player = response.data.player[0];
      return player.strPlayer; // Accessing the 'strPlayer' property of the player object
    } catch (err) {
      console.error(err);
      // Error handling if the player's data could not be retrieved
      return `Could not retrieve stats for ${name}`;
    }
  }  
  

client.on('ready', () => {
  console.log('Matthew Berry bot is ready');
});

client.on('messageCreate', async message => {
  if (!message.mentions.has(client.user)) return;
  message.channel.sendTyping();

  try {
    // Extract player name by finding the word after "see"
    // TODO: You may need to refine this logic to accurately extract player names from various message formats
    const words = message.content.split(' ');
    const seeIndex = words.indexOf('see');
    const playerName = seeIndex !== -1 ? words[seeIndex + 1] : 'Unknown Player'; // Modify as needed

    // Get the player stats using the SportsDB API
    const playerStats = await getPlayerStats(playerName);

    // Generate a response using OpenAI's API
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are a fantasy football analyst bot named Matthew Berry. Analyze ${playerName}'s fantasy prospects using these player stats: ${playerStats}` },
        { role: 'user', content: message.content }
      ]
    });

    // Send the generated response as a reply
    message.reply(response.data.choices[0].message.content);
  } catch (err) {
    console.error(err);
    // Generic error handling message
    message.reply('Sorry, having trouble analyzing right now.');
  }
});

client.login(process.env.TOKENB);
