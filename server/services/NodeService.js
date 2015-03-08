/**
 * Created by almclean on 20/02/15.
 */
/*jslint node: true */
"use strict";

var util = require("util");
var Api = require("./Api");
var _ = require("lodash");
var apiInstance = new Api();

function NodeService() { }


// @Param label : Type of node to create
// @Param data : data to populate node with
NodeService.prototype.createNode = function (label, data) {
    var queryText = [
        util.format("CREATE (n:%s {data})", label),
        "RETURN id(n)"
    ].join("\n");

    return apiInstance.query(queryText, {data: data})
        .then(function (results) {
            if (results && results.data) {
                return _.first(_.flatten(results.data));
            } else if (results.exception) {
                throw results.exception;
            }
        });
};


// @Param nodeid : Neo4J specifier for the node id
// @Param data : JSON data to update node with.  Please note, this is a non-destructive update and other properties
//               are not changed.
NodeService.prototype.updateNode = function (nodeid, data) {
    var queryText = [
        "START n=node({nodeid})",
        "SET n += {data}",
        "RETURN n"
    ].join("\n");

    return apiInstance.query(queryText, {nodeid: nodeid, data: data})
        .then(function (results) {
            if (results && results.data) {
                return _.first(_.flatten(results.data));
            } else if (results.exception) {
                console.error(results.message);
                throw results.exception;
            }
        });
};

module.exports = NodeService;

