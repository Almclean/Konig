/**
 * Created by almclean on 16/08/2014.
 */
/*jslint node: true */
"use strict";

var Api = require('../services/api');
var apiInstance = new Api();
var Query = require('../models/Query');

function QueryService () {}

// @Param : Title of query
// @Returns : array of matching queries complete with triplets
QueryService.prototype.loadByTitle = function (title) {
    var queryText = [
        'MATCH (q:Query {title: {title} })-[:COMPRISED_OF]->(t:Triplet)',
        'RETURN q, collect(t) as triplets'
    ].join('\n');
    return apiInstance.query(queryText, {title: title})
        .then(function (results) {
            var queries = [];
            for (var query in results) {
                if (results[query].hasOwnProperty("q")) {
                    var newQuery = results[query].q._data.data;
                    var triplets = {};
                    for (var i = 0; i < results[query].triplets.length; i++) {
                        triplets["triplet" + i] = results[query].triplets[i]._data.data;
                    }
                    newQuery.triplets = triplets;
                    queries.push(newQuery);
                }
            }
            var nq = new Query(queries[0]);
            console.log(JSON.stringify(nq, null, "\t"));
        }
    );
};

module.exports = QueryService;