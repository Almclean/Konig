#!/usr/bin/env node
// Tool for running the api commands on the command line !
var api = new (require('../../server/services/Api'))();
var util = require('util');
var _ = require('lodash');

function main() {
    "use strict";
    console.log('About to submit query');
    var label = "TEST";
    var data = {name: "Al", text: "This is some random text"};

    var queryText = [
        util.format("CREATE (n:%s {data})", label),
        "RETURN id(n)"
    ].join("\n");

    console.time("queryTime");
    api.query(queryText, {data: data})
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
