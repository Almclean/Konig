#!/usr/bin/env node
// Tool for running the api commands on the command line !
var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var logger = require('winston');
var qs = new (require('.././QueryService'))();
var r = Promise.promisifyAll(require('request'));
var api = new (require('.././api'))();
var _ = require('lodash');

function main() {
  "use strict";

    r.getAsync('http://localhost:3001/ext/query/list')
    	.spread(function (response, results) {
    		_.forEach(JSON.parse(results), function (result) {
    			console.log('Looking for query title : ' + result.queryTitle);
    			qs.loadByTitle(result.queryTitle)
    				.then(function(query) {
    					console.log(JSON.stringify(query, null, '\t'));
    				});
    		});
    	});
}

main();
