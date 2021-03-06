﻿# Stock Market News Aggregator

An API using Node.js that gathers sources for a specified stock and assembles a list of the articles and accompanying article metadata.

I couldn't find a decent API that provides stock news articles in a straightforward way so I created this service. This project is actually a feature of a larger project I'm currently working on which is why the functionality is so specific.

## How to use

1) Open the app on DigitalOcean

2) Use the endpoint `/getnews/<stockTickerName>` in the address bar to tell the service what stock news you are looking for.

   Ex: To get the latest news about Amazon Inc you would use the endpoint: `/getnews/amzn`

3) You will receive a list of articles and the accompanying article metadata from Nasdaq's website related to your search parameter in JSON format. Do with it as you please!


### Quicktip:
> If you didn't know about it already, make sure to check out the [JsonViewer chrome extension](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc), it will layout JSON bodies in tree format automatically for easy viewing.
