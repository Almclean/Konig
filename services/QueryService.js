/**
 * Created by almclean on 16/08/2014.
 */
/*jslint node: true */
"use strict";

var Api = require('../services/api');
var apiInstance = new Api();
var Promise = require('bluebird');
var Query = require('../models/Query');

function QueryService () {}

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
            console.log(JSON.stringify(queries, null, "\t"));
        }
    );
};

module.exports = QueryService;