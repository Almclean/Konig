#!/usr/bin/env node
// Tool for running the api commands on the command line !
var Promise = require('bluebird');
var util = require('util');
//var QS = require('../services/QueryService');
var neo = require('neo4j-js');
Promise.promisifyAll(neo);


function main() {
    "use strict";
//    var qs1 = new QS();
//    console.log(qs1.loadByTitle('Any old bollocks'));
    neo.connectAsync('http://162.243.169.45:7474/db/data/')
        .spread(function(err, graph) {
            Promise.promisifyAll(graph);
            var queryText = [
                'MATCH n WHERE NOT has(n.admin)',
                'RETURN distinct labels(n) as l'
            ].join('\n');

            graph.queryAsync(queryText)
                .then(function(result) {
                    console.log(result);
                });
        })
        .catch(function (e) {
            console.error('Connection issue encountered');
            throw e;
        });

    neo.connect('http://162.243.169.45:7474/db/data/', function(err, graph) {
        Promise.promisifyAll(graph);
        var queryText = [
            'MATCH n WHERE NOT has(n.admin)',
            'RETURN distinct labels(n) as l'
        ].join('\n');

        graph.queryAsync(queryText)
            .then(function(result) {
                console.log(result);
            });
    });

}

main();