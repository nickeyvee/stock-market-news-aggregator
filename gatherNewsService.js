"use strict";

const request_promise = require('request-promise');
const cheerio = require('cheerio');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const gatherNewsService = {

   getLatestFeed: ( tickerSymbol, callback ) => {

      const articleUrls = [];
      const urlString = `http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=${ tickerSymbol }&fmt=xml`;  

      /*
      * The first step will be to extract all the article source url's and
      * from nasdaq article feeds.
      */

      JSDOM.fromURL( urlString ).then( dom => {
         const document = dom.window.document;
         const items = document.querySelectorAll('item');         
         
         items.forEach( ( item ) => {
            const ArticleSource = item.children[6].innerHTML
            articleUrls.push( ArticleSource );      
         });
      })
      .then( () => {

      /*
      * Now that we have extracted the url's from our feed, we 
      * can go out and get the article text from our list (articleUrls).
      */     

      function asyncOperation( url ) {
         return request_promise( url )
      };

      function parallelAsync() {

         let key = 0;         
         const Operations = articleUrls.map( url => {

            return asyncOperation( url ).then( html => {

               key += 1;
               const $ = cheerio.load( html );
               const title = $('div#left-column-div').find('h1').text().trim();
               const time = $('span[itemprop="datePublished"]').text().trim();
               const body = $('div#articlebody').find('p').text().trim();
                  
               return {
                  id: key,
                  title: title,
                  bobdy: body,
                  timestamp: time
               }
            });
         });
         return Promise.all( Operations );
      }
      
      parallelAsync().then( data => {
         const Sorted = data.sort(( a, b )=> {
            return a.id - b.id;
         })
         callback( Sorted );
      });

      })
   }
}
module.exports = gatherNewsService;
