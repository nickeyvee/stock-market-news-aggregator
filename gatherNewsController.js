const service = require('./gatherNewsService')

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

let symbol = "f";
app.listen( port , () => console.log(`App listening on port ${ port }.`));


// --- EXPRESS MIDDLEWARE ---

app.use( '/', express.static( path.join(__dirname, 'views')) );
app.use( bodyParser.json() );   // to support JSON-encoded bodies.
app.use( bodyParser.urlencoded({ // to support URL-encoded bodies.
  extended: true
}));


// --- PROVIDE JSDOM INSTANCE USING A PROMISE ---

app.get( '/getdom', ( req, res ) => {

  service.getLatestFeed( symbol );

  res.end();
})
