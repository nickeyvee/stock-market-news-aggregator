const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const service = require('./gatherNewsService')

const app = express();
const port = (process.env.PORT || 3000);

app.use( bodyParser.urlencoded({ // to support URL-encoded bodies.
   extended: true
 }));
 app.use( bodyParser.json() );   // to support JSON-encoded bodies.
 app.use( '/', express.static( path.join(__dirname, 'views')) );
 
 
 app.get( '/getnews', ( req, res ) => {
    res.redirect('/');
 }); 

app.get('/getnews/:ticker', (req, res) => {
   let tickerSymbol = req.params.ticker;

   service.scrapeFeedburner(tickerSymbol)
      .then(list => {
         return service.getArticleData(list)
      })
      .then(data => {
         const sorted = data.sort((a, b) => {
            return new Date(b.published) - new Date(a.published);
         });
         res.json({
            sorted
         });
         res.end();
      });
})


app.listen(port, () => {
   console.log("App listening on port " + port);
});