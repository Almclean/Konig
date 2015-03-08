#!/usr/bin/env node
// Tool for running the api commands on the command line !
var api = new (require('../../server/services/Api'))();
var util = require('util');
var _ = require('lodash');

function main() {
    "use strict";
    console.log('About to submit query');

    var nodeid = 983;
    var data = {name: "Another Name", some: "thingelse"};

    var queryText = [
        "START n=node({nodeid})",
        "SET n += {data}",
        "RETURN n"
    ].join("\n");

    console.time("queryTime");
    api.query(queryText, {nodeid: nodeid, data: data})
        .then(function (results) {
            console.log("Got something back.");
            if (results && results.data) {
                console.log(_.first(_.flatten(results.data)));
                console.timeEnd("queryTime");
            } else if (results.exception) {
                console.error(results.message);
                throw results.exception;
            }
        });

}

main();
