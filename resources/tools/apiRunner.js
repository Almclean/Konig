#!/usr/bin/env node
// Tool for running the api commands on the command line !
var Promise = require('bluebird');
var r = Promise.promisifyAll(require('request'));
var bcrypt = require('bcrypt');
var api = new (require('../../server/services/Api'))();
var _ = require('lodash');

function main() {
  "use strict";
    console.log('About to submit query');

    bcrypt.hash("blah", 10, function(err, hash) {
        console.log(hash);
    });

    console.log("Password matches hash : " + bcrypt.compareSync("blah", "$2a$10$mlXKznVWibJ7bQDLMwP/6eV4RZvWxVLw1h4UNKnDbmOfYVQOHfwKq"));

  // Send a post to the routing service
  // Find the query
  // bind the triplet information to the query ?
  // Return using getNodes.

}

main();
