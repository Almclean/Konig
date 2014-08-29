/**
 * Created by almclean on 16/08/2014.
 */
/*jslint node: true */
"use strict";

var Api = require('../services/api');
var apiInstance = new Api();
var Query = require('../models/Query');

//
// This is the set of services that will query the data container and return values.
// All queries will hit the api layer and that will delegate to the appropriate db layer
//
function QueryService() {
}

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

QueryService.prototype.getMetaData = function () {
    return apiInstance.getMetaData();
};

QueryService.prototype.getNodes = function (queryText) {
    return apiInstance.query(queryText)
        .then(function (results) {
            var retArray = [];
            if (results && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    // TODO We should have a better format to return this in
                    retArray.push({
                        from: results[i].from._data.data.name,
                        rel: results[i].rel._data.type,
                        to: results[i].to._data.data.name
                    });
                }
            }
            return retArray;
        })
        .catch(function (e) {
            throw e;
        });
};

QueryService.prototype.getSavedQueries = function () {
    // TODO Write query
    var queryText = [
        "MATCH (n:Party) RETURN n"
    ].join('\n');
    return apiInstance.query(queryText)
        .then(function (results) {
            var retArray = [];
            if (results && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    retArray.push(results[i].n._data.data.name);
                }
            }
            return retArray;
        })
        .catch(function (e) {
            throw e;
        });
};

module.exports = QueryService;