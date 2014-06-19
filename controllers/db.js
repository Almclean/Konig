/*jslint node: true */
"use strict";

var neo4j = require('neo4j');
var r = require('request');

var connectionString = 'http://localhost:7474';
var defaultNeoRoot = 'http://localhost:7474/db/data';

// Test for an active rest connection to the DB
// No point in connecting if there isn't one...
// Can make the connectionStrings available via config later

var db = null;
var resp = r(defaultNeoRoot, function testNeo4jRestConnection(err, response, body) {
    if (err) {
        console.log('Cannot find active Neo4J Rest Service @ ' + defaultNeoRoot);
        throw err;
    }
});

db = new neo4j.GraphDatabase(connectionString);
console.log('Neo4J Server Available.');

module.exports = db;
