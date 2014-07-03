#!/usr/bin/env node
// Tool for running the api commands on the command line !
var _serviceRoot = 'http://localhost:7474/db/data/';
var api = new (require('../services/api'))(_serviceRoot);

function main() {
    "use strict";

    api.getMetaData().then(function (result) {
        console.log(JSON.stringify(result, null, '\t'))
    });
}

main();