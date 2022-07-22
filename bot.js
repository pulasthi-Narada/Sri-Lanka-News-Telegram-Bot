require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const news = require('./news');

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
    messageText !== '/English' &&
    messageText !== '/සිංහල' &&
    messageText !== '/தமிழ்'
  ) {
    await bot.sendMessage(
      chatId,
      'News provider: adaderana \n\n http://www.adaderana.lk/',
    );

    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [['/English'], ['/සිංහල'], ['/தமிழ்']],
      }),
    };
    await bot.sendMessage(msg.chat.id, 'ok.', opts);
  }
});

// Matches /English sent english news
bot.onText(/\/English/, async function onLoveText(msg) {
  await bot.sendMessage(msg.chat.id, 'ff');
});

// Matches /සිංහල sent sinhala news
bot.onText(/\/සිංහල/, async function onLoveText(msg) {
  await bot.sendMessage(msg.chat.id, 'd');
});

// Matches /தமிழ் sent tamil news
bot.onText(/\/தமிழ்/, async function onLoveText(msg) {
  await bot.sendMessage(msg.chat.id, 'தமிழ்?');
});
