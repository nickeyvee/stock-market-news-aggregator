const request_promise = require('request-promise');
const cheerio = require('cheerio');

function scrapeFeedburner(tickerSymbol) {

   const feed_urls = [];
   const url_feed = `http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=${ tickerSymbol }&fmt=xml`;

   return request_promise(url_feed)
      .then(xml => {
         const $ = cheerio.load(xml, {
            xmlMode: true
         });
         $('channel').find('item').each((i, el) => {
            feed_urls.push($(el).find('link').text());
         })
         return feed_urls;
      })
}

function getArticleData(arr) {

   const operations = arr.map((url, i) => {
      return request_promise(url).then(html => {

         const $ = cheerio.load(html);
         const title = $('div#left-column-div').find('h1').text().trim();
         const time = $('span[itemprop="datePublished"]').text().trim();
         const body = $('div#articlebody').find('p').text().trim();

         return {
            title: title,
            published: time,
            body: body
         }
      })
   })
   return Promise.all(operations);
}

module.exports = {
   scrapeFeedburner,
   getArticleData
}