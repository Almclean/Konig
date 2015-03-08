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
        "RETURN n"
    ].join("\n");

    return apiInstance.query(queryText, {data: data})
        .then(function (results) {
            if (results && results.data) {
                return _.first(_.flatten(results.data)).metadata;
            } else if (results.exception) {
                throw results.exception;
            }
        });
};

NodeService.prototype.updateNode = function (nodeid, data) {

    var queryText = [
        "",
        ""
    ].join("\n");

    return apiInstance.query(queryText)

    return null;
};

module.exports = NodeService;

