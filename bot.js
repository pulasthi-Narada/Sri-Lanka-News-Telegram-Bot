require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const getNews = require('./news');

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
      'News provider: hirunews \n\n https://www.hirunews.lk/',
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

const getNewsforPreferredLanguage = async () => {
  let news;
  let ReadMore;

  // Matches /English get english news
  bot.onText(/\/English/, async function onLoveText(msg) {
    news = await getNews('/English');
    ReadMore = 'Read More';

    await sentNews(news, ReadMore, msg);
  });

  // Matches /සිංහල get sinhala news
  bot.onText(/\/සිංහල/, async function onLoveText(msg) {
    news = await getNews('/සිංහල');
    ReadMore = 'වැඩිදුර කියවන්න';

    await sentNews(news, ReadMore, msg);
  });

  // Matches /தமிழ் get tamil news
  bot.onText(/\/தமிழ்/, async function onLoveText(msg) {
    news = await getNews('/தமிழ்');
    ReadMore = 'மேலும் படிக்க';

    await sentNews(news, ReadMore, msg);
  });
};

//set news to Telegram
const sentNews = async (news, ReadMore, msg) => {
  // reverse news array for get latest news end of chat
  news.reverse();

  //sent news to Telegram bot
  for (const n of news) {
    await bot.sendMessage(
      msg.chat.id,
      `${n.image} \n\n ${n.title} \n\n ${ReadMore} \n ${n.ReadMore}\n\n ${n.dateAndTime}`,
    );
  }

  await bot.sendMessage(
    msg.chat.id,
    'News provider: hirunews \n\n https://www.hirunews.lk/',
  );
};

(async function () {
  await getNewsforPreferredLanguage();
})();
