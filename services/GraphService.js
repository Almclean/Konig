/*jslint node: true */
"use strict";

var _serviceRoot_ = 'http://localhost:7474/db/data/';
var Api = require('../services/api');
var apiInstance = new Api(_serviceRoot_);

var GraphService = function () {
    this.name = "graphService";
};

GraphService.prototype.getMetaData = function () {
    return apiInstance.getMetaData();
};

GraphService.prototype.getNodes = function (node1, rel1, node2) {
    var queryText = [
        "MATCH (n: {node1} )-[ {rel1} ]->( {node2} )",
        "RETURN g"
    ].join('\n');
    return apiInstance.query(queryText, {node1: node1, rel1: rel1, node2:node2})
        .then(function (results) {
            var retArray = [];
            if (results && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    retArray.push(results[i].group._data.data.name);
                }
            }
            return retArray;
        })
        .catch(function (e) {
            throw e;
        });
};

module.exports = GraphService;

