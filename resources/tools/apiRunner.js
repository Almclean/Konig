#!/usr/bin/env node
// Tool for running the api commands on the command line !
var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var logger = require('winston');
var qs = new (require('../../server/services/QueryService'))();
var r = Promise.promisifyAll(require('request'));
var api = new (require('../../server/services/Api'))();
var _ = require('lodash');

function main() {
  "use strict";

  qs.loadByTitle("Post refactor query")
    .then(function (queryObject) {
        var sampleTriplets = [{ from: {name: "MS"}, rel: {}, to: {name: "Scotland"}}];
        var cypherQuery = queryObject.queryText;
        var splitArr = cypherQuery.split("RETURN");
        var whereClause = "";

        _.forEach(sampleTriplets, function (triplet) {
            whereClause += "WHERE "
            _.forEach(triplet, function (clauseObject, identifier) {
                if (_.size(clauseObject) > 0) {
                    whereClause += identifier + '.';
                    _.forEach(clauseObject, function (value, key) {
                        whereClause += key + ' = ' + '\"' + value + '\" ';
                    });
                }
            });
        });
        console.log('Where Clause = ' + whereClause);
    });

  // Send a post to the routing service
  // Find the query
  // bind the triplet information to the query ?
  // Return using getNodes.

}

main();
