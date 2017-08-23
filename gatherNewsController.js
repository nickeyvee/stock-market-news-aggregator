const service = require('./gatherNewsService')

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// --- EXPRESS MIDDLEWARE ---

app.use( bodyParser.urlencoded({ // to support URL-encoded bodies.
  extended: true
}));
app.use( bodyParser.json() );   // to support JSON-encoded bodies.
app.set( 'port', ( process.env.PORT || 3000 ));
app.use( '/', express.static( path.join(__dirname, 'views')) );


app.get( '/getnews/', ( req, res ) => {
   let tickerSymbol = req.query.ticker;

   if( tickerSymbol === undefined ) tickerSymbol = "f";

   const callback = ( data ) => {
      res.json({ data });
      res.end();
   }
   service.getLatestFeed( tickerSymbol, callback );
})


app.listen( app.get("port"), () => {
   console.log( "App listening on port " + app.get("port"));
});
