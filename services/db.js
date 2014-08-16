/*jslint node: true */
"use strict";

var neo4j = require('neo4j');
var Promise = require('bluebird');
var r = Promise.promisifyAll(require('request'));
var connectionString = 'http://162.243.169.45:7474';
var db = new neo4j.GraphDatabase(connectionString);

// Private helper function, just to get simple async json responses.
function getSimpleJSONResponse() {
    return r.getAsync(connectionString)
        .spread(function (response, body) {
            if (response.statusCode === 200) {
                return JSON.parse(body);
            }
        })
        .catch(function (e) {
            throw e;
        });
}

module.exports = {db: db, getSimpleJSONResponse: getSimpleJSONResponse};
