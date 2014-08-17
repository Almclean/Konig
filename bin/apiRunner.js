#!/usr/bin/env node
// Tool for running the api commands on the command line !
var qs = new (require('../services/QueryService'))();
var Query = require('../models/Query');

function main() {
    "use strict";
    qs.loadByTitle("Party by Location");
}

main();