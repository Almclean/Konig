/*jslint node: true */
"use strict";

var Promise = require('bluebird');
var util = require('util');
var neo4j = Promise.promisifyAll(require('neo4j-js'));

function Db(connectionString) {
    this.connectionString = connectionString;
    var that = this;
    neo4j.connect(connectionString, setup);

    function setup(err, graph) {
        if (!err) {
            Promise.promisifyAll(graph);
            that.dbInstance = graph;
        } else {
            throw err;
        }
    }
}

module.exports = Db;
