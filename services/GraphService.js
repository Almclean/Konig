/*jslint node: true */
"use strict";

var Api = require('../services/api');
var apiInstance = new Api();

var GraphService = function () {
    this.name = "graphService";
};

GraphService.prototype.getMetaData = function () {
    return apiInstance.getMetaData();
};

GraphService.prototype.getNodes = function (queryText) {
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

GraphService.prototype.getSavedQueries = function () {
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
        });};
module.exports = GraphService;

