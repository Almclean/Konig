/*jslint node: true */
"use strict";

var neo4j = require('neo4j');

var connectionString = 'http://localhost:7474';
var db = new neo4j.GraphDatabase(connectionString);

module.exports = db;
