const cheerio = require('cheerio');
const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const gatherNewsService = {

   getLatestFeed: ( tickerSymbol, callback ) => {
      let completed_requests = 0;  
      
      const articleMetadata = [];
      const articleUrls = [];
      const urlString = `http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=${ tickerSymbol }&fmt=xml`;  


      /*
      * The first step will be to extract all the article source url's and
      * article metadata from nasdaq article feeds.
      *
      * Our list (arrays) of articleUrl's and articleMetaData will recieve 
      * unique keys for their items so we can merge the two datasets
      * once we have all the information.
      */

      JSDOM.fromURL( urlString ).then( dom => {
         const document = dom.window.document;
         const items = document.querySelectorAll('item');         
         
         let key = 0;
         items.forEach( ( item ) => {
            const title = item.querySelector('title').innerHTML
            const timeStamp = item.children[5].innerHTML;
            const articleSource = item.children[6].innerHTML

            key += 1;            
            // console.log("------------------------------------------------");
            // console.log(`TITLE: ${ title }\n`);
            // console.log(`TIMESTAMP: ${ timeStamp }\n`); 
            // console.log(`ORIGINAL ARTICLE URL: ${ articleSource }`);

            articleMetadata.push({
               "key": key,
               "title": title,
               "url": articleSource,
               "timestamp": timeStamp
            });
            articleUrls.push({ "key": key, "url": articleSource })      
            });

      })
      .then( () => {

      /*
      * Now that we have extracted the url's from our feed, we 
      * can go out and get the article text from our list (articleUrls).
      */

      const articleTextBodies = [];     

      function getArticleTextSync( articleUrls ) {
         const article = articleUrls.pop()

         request( article.url, ( error, response, html ) => {
            let $ = cheerio.load( html );            
            if ( !error && response.statusCode == 200 ) {

               const body = $('div#articlebody').find('p').text().trim();
               articleTextBodies.push({ "key": article.key, "body": body });
            }
            if ( articleUrls.length ) {
               getArticleTextSync( articleUrls );
            } else {
               mergeData( articleMetadata, articleTextBodies );  
               // for ( let article of articleTextBodies ) {
               //    console.log("------------------------------------------------");
               //    console.log( article );
               // }
            }
         })
      }
      getArticleTextSync( articleUrls );

      const mergedData = [];

      function mergeData( metadataFrag, articleTextFrag ) {
         articleTextFrag.reverse();

         let curr = metadataFrag.pop();

         let match = articleTextFrag.find( b => {
            return curr.key === b.key;
         })

         mergedData.push({
            "key": curr.key,
            "title": curr.title,
            "url": curr.url,
            "body": match.body,
            "timestamp": curr.timestamp
         });

         if ( articleMetadata.length ) {
            mergeData( metadataFrag, articleTextFrag );
         } else {
            mergedData.reverse();
            callback( mergedData );
         }
      }
      })
   }
}
module.exports = gatherNewsService;
