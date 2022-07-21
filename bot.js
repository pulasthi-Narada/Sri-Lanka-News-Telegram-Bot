require('dotenv').config();
const cheerio = require('cheerio');
const xmlToJson = require('xml-to-json-stream');
const parser = xmlToJson({ attributeMode: false });
const TelegramBot = require('node-telegram-bot-api');

// set Telegram  token to access the HTTP API
const token = process.env.TELEGRAMTOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message

  bot.sendMessage(chatId, 'Received your message');

  console.log(msg);
});
