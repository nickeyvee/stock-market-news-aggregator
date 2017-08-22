const cheerio = require('cheerio');
const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const gatherNewsService = {

   getLatestFeed: ( symbol ) => {
      let completed_requests = 0;  
      
      const articles = [];
      const articleSources = [];
      const urlString = `http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=${ symbol }&fmt=xml`;  

      function getArticleBody() {
         Promise.all( articles.map( article => {
            // console.log( article.url );
            JSDOM.fromURL( article.url ).then( dom => {
               // console.log( article.url );
               // console.log("------------------------");
               // console.log( `ARTICLE ID: ${ article.id }\n`);
               // console.log( document.querySelector('.article-header').textContent);                  

               const document = dom.window.document;
               const body = document.querySelector( '#left-column-div' );

               body.querySelectorAll('p').forEach( item => {
                  console.log( item.textContent );
                  article.textBody = item.textContent;
               })
            })
         }))                   
      }

      JSDOM.fromURL( urlString ).then(dom => {
         const document = dom.window.document;
         const items = document.querySelectorAll('item');         
         let chain = Promise.resolve();
         
         let id = 0;
         items.forEach( ( item ) => {
            const title = item.querySelector('title').innerHTML
            const timeStamp = item.children[5].innerHTML;
            const articleSource = item.children[6].innerHTML

            id += 1;            
            // console.log("------------------------");
            // console.log(`TITLE: ${ title }\n`);
            // console.log(`TIMESTAMP: ${ timeStamp }\n`); 
            // console.log(`ORIGINAL ARTICLE URL: ${ articleSource }`);

            articles.push({
               "id": id,
               "title": title,
               "url": articleSource,
               "timestamp": timeStamp
               });      
            });

      })
      .then( () => {

         function loop( callback ) {
            for ( let index = 0; index < articles.length; index++ ) {
               console.log(index, articles.length );            
               scrapeSite( articles[ index ].url, articles[ index ] );
               
               if( index+ 1 === articles.length ) {
                  callback();
               }
            }
         }
            
         function scrapeSite( url, item ) {
            request( url, ( error, response, html ) => {

               let $ = cheerio.load( html );            

               if ( !error ) {
                  let body = $('div#articlebody').find('p').text().trim();
                  item.body = body;

                  // console.log( item.body );
               }
            })
         }

         function logResults() {
            console.log( articles );
         }
         
         loop( logResults );
      })
   }
}
module.exports = gatherNewsService;
