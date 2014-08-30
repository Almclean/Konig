#!/usr/bin/env node
// Tool for running the api commands on the command line !
var Promise = require('bluebird');
var QS = require('../services/QueryService');
var neo = require('neo4j-js');
var nock = require('nock');
Promise.promisifyAll(neo);


function main() {
    "use strict";
    var qs1 = new QS();
    nock.recorder.rec();
    qs1.loadByTitle('Party by Location')
        .then(function (results) {
            console.log(results);
        });
}

main();