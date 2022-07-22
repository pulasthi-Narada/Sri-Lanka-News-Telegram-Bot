require('dotenv').config();
const cheerio = require('cheerio');
const axios = require('axios').default;

const englishNewsPageBaseUrl =
  'https://www.hirunews.lk/english/local-news.php?pageID=1';

const sinhalaNewsPageBaseUrl =
  'https://www.hirunews.lk/local-news.php?pageID=1';

const tamilNewsPageBaseUrl =
  'https://www.hirunews.lk/tamil/local-news.php?pageID=1';

let requestNextPage = false;

//get sinhala News from provided web page
const GetNewsForSelectedLanguage = async (language) => {
  let page;
  const news = [];
  let selectedPageBaseUrl;

  // Request News Page based on select language
  switch (language) {
    case '/English':
      page = await GetRequestNewsPage(englishNewsPageBaseUrl);
      selectedPageBaseUrl = englishNewsPageBaseUrl;
      break;
    case '/සිංහල':
      page = await GetRequestNewsPage(sinhalaNewsPageBaseUrl);
      selectedPageBaseUrl = sinhalaNewsPageBaseUrl;
      break;
    case '/தமிழ்':
      page = await GetRequestNewsPage(tamilNewsPageBaseUrl);
      selectedPageBaseUrl = tamilNewsPageBaseUrl;
      break;
  }

  news.push(...scrapNewsFromPage(page));

  //check news available in next page related to current date
  while (requestNextPage) {
    const pageNumber = parseInt(
      selectedPageBaseUrl[selectedPageBaseUrl.length - 1],
    );

    selectedPageBaseUrl = selectedPageBaseUrl.replace(
      pageNumber,
      pageNumber + 1,
    );

    page = await GetRequestNewsPage(selectedPageBaseUrl);
    news.push(...scrapNewsFromPage(page));
  }

  return [...news];
};

// Request news page using axios
const GetRequestNewsPage = async (newsPage) => {
  let $;
  await axios

    .get(newsPage)
    .then(function (response) {
      // handle success
      $ = cheerio.load(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

  return $;
};

// scrap News From given Page
const scrapNewsFromPage = (page) => {
  const $ = page;
  const news = [];
  let currentDate;

  if ($) {
    // get html elements arry contain news
    const newsElements = $('.section > .trending-section  > .row ');

    //
    newsElements.each(function (index, element) {
      // get news title
      const title = $(element).find('img').attr('alt');
      // get image url
      const image = $(element).find('img').attr('src');
      //get Read More url
      const ReadMore = $(element).find('a').attr('href');
      // get news date and time
      const dateAndTime = $(element)
        .find('.middle-tittle-time')
        .text()
        .replaceAll('\n', '');

      // get currentDate from frist news
      if (!currentDate) {
        currentDate = dateAndTime.slice(
          dateAndTime.indexOf(','),
          dateAndTime.indexOf('-'),
        );

        currentDate = currentDate.replace(',', '');
      }

      //check data is not empty
      if (title && image && ReadMore && dateAndTime) {
        //push news  only in current Date
        if (dateAndTime.includes(currentDate)) {
          news.push({ title, image, ReadMore, dateAndTime });
          requestNextPage = true;
        } else {
          requestNextPage = false;
        }
      }
    });
  }

  return news;
};

module.exports = GetNewsForSelectedLanguage;
