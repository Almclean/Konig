/*jslint node: true */
"use strict";

var neo4j = require('neo4j');
var Promise = require('bluebird');
var r = Promise.promisifyAll(require('request'));
var connectionString = 'http://162.243.169.45:7474';
var db = null;

// Private helper function, just to get simple async json responses.
function getSimpleJSONResponse(uri) {
    return r.getAsync(uri)
        .spread(function (response, body) {
            if (response.statusCode === 200) {
                return JSON.parse(body);
            }
        })
        .catch(function (e) {
            throw e;
        });
}

function getDbConnection() {
    if (!db) {
        db = new neo4j.GraphDatabase(connectionString);
        return db;
    } else {
        return db;
    }
}

module.exports = {getConnection: getDbConnection, getSimpleJSONResponse: getSimpleJSONResponse, connectionString: connectionString};
