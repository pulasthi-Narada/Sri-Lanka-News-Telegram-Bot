require('dotenv').config();
const cheerio = require('cheerio');
const xmlToJson = require('xml-to-json-stream');
const parser = xmlToJson({ attributeMode: false });
const TelegramBot = require('node-telegram-bot-api');

// set Telegram  token to access the HTTP API
const token = process.env.TELEGRAMTOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Listen for any kind of message.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // get message
  const messageText = msg.text.trim();

  if (
    messageText !== 'English' &&
    messageText !== 'සිංහල' &&
    messageText !== 'தமிழ்'
  ) {
    await bot.sendMessage(
      chatId,
      'News provider: adaderana \n\n http://www.adaderana.lk/',
    );

    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [['English'], ['සිංහල'], ['தமிழ்']],
      }),
    };
    bot.sendMessage(msg.chat.id, 'ok.', opts);
    console.log(msg);
  }
});
