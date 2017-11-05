'use strict';
const util = require('util');
const expect = require('chai').expect;

describe('gatherNewsService.js', function() {
   it('should exist in location', function() {
      const gatherNewsService = require('../newsGatherService.js');
      expect(gatherNewsService).to.not.be.undefined;
   })
});

// import our news service
const gatherNewsService = require('../newsGatherService.js');


describe('scrapeFeedBurner', function() {
   it('Should return an array of urls from feedburner', function() {
      gatherNewsService.scrapeFeedburner('amzn').then(data => {
         expect(data).to.be.an('Array');
      })
   })
})