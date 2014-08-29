/*jslint node: true */
"use stri§ct";

var neo4j = require('neo4j');
var Promise = require('bluebird');
var neo = Promise.promisifyAll(require('neo4j-js'));

function Db(connectionString) {
    this.connectionString = connectionString;
    neo.connectAsync(this.connectionString).bind(this)
        .then(function (graph) {
            console.log('Connected');
            this.dbInstance = Promise.promisifyAll(graph);
        })
        .catch(function (e) {
            "use strict";
            console.err('Hit a problem');
            throw e;
        });
}

module.exports = Db;
