const service = require('./gatherNewsService')

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.listen( port , () => console.log(`App listening on port ${ port }.`));


// --- EXPRESS MIDDLEWARE ---

app.use( '/', express.static( path.join(__dirname, 'views')) );
app.use( bodyParser.json() );   // to support JSON-encoded bodies.
app.use( bodyParser.urlencoded({ // to support URL-encoded bodies.
  extended: true
}));


app.get( '/getnews/', ( req, res ) => {
   let tickerSymbol = req.query.ticker;

   if( tickerSymbol === undefined ) tickerSymbol = "f";

   const callback = ( data ) => {
      res.json({ data });
      res.end();
   }
   service.getLatestFeed( tickerSymbol, callback );
})
