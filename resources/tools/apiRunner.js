#!/usr/bin/env node
// Tool for running the api commands on the command line !
var Promise = require('bluebird');
var util = require('util');
var qs = new (require('../../server/services/QueryService'))();
var r = Promise.promisifyAll(require('request'));
var api = new (require('../../server/services/Api'))();
var _ = require('lodash');

function main() {
  "use strict";
    console.log('About to submit query');
    r.postAsync({
        uri : "http://localhost:3001/ext/query?title=Post refactor query",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json; charset=UTF-8",
            "X-Stream": true
        },
        json:
            [{from : {name : "MS"},
             to : {name : "Scotland"}}]
        })
        .spread(function(res, body, err) {
        console.log(body);
    });

  // Send a post to the routing service
  // Find the query
  // bind the triplet information to the query ?
  // Return using getNodes.

}

main();
