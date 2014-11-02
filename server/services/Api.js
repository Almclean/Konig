/*jslint node: true */
/*jshint -W079 */

"use strict";
var Promise = require("bluebird");
var r = Promise.promisifyAll(require("request"));
var ApiError = require("./../error/apiError");
var logger = require("winston");

// Constructor
// @param : The Neo service root.
function Api() {
    this.connectionString = "http://162.243.169.45:7474/db/data/";
}

Api.prototype.getSimpleJSONResponse = function (uri) {
    return r.getAsync({
        uri: uri,
        headers: {
            "Content-Type": "application/json",
            "X-Stream": true
        }}).spread(function (response, body) {
        if (response.statusCode === 200) {
            return JSON.parse(body);
        } else {
            throw new ApiError(__filename + " getSimpleJSONResponse: Invalid status code returned [" + response.statusCode + "] for uri [" + uri + "]");
        }
    }).catch(SyntaxError, function (e) {
        logger.error(__filename + " getSimpleJSONResponse: Unable to parse body invalid json. \nError : " + e);
        throw new ApiError(__filename + " getSimpleJSONResponse: Unable to parse body invalid json", e);
    }).error(function (e) {
        logger.error(__filename + " getSimpleJSONResponse: unexpected error. \nError : ", e);
        throw new ApiError(__filename + " getSimpleJSONResponse: unexpected error. \nError : ", e);
    });
};

// Checks the service root to ensure that the REST service is operational.
Api.prototype.pingService = function () {
    return this.getSimpleJSONResponse(this.connectionString);
};

Api.prototype.getNonAdminRelationships = function () {
    var queryText = [
        "MATCH (n)-[r]-(m)",
        "WHERE NOT has(r.admin)",
        "RETURN distinct type(r) as r"
    ].join("\n");
    return this.query(queryText, {});
};

Api.prototype.getNonAdminLabels = function () {
    var queryText = [
        "MATCH n WHERE NOT has(n.admin)",
        "RETURN distinct labels(n) as l"
    ].join("\n");

    return this.query(queryText, {});
};

Api.prototype.getMetaData = function () {
    return this.pingService().bind(this)
        .then(function (result) {
            var labels = this.getNonAdminLabels(),
                relationshipTypes = this.getNonAdminRelationships(),
                indexes = "",
                connectionString = this.connectionString;
            if (result.hasOwnProperty("indexes")) {
                indexes = this.getSimpleJSONResponse(result.indexes);
            }
            return Promise.props({
                labels: labels,
                indexes: indexes,
                relationships: relationshipTypes,
                connectionString: connectionString
            });
        }).catch(SyntaxError, function (e) {
            logger.error(__filename + " getMetaData: Unable to parse body invalid json. \nError : " + e);
            throw new ApiError(__filename + " getMetaData: Unable to parse body invalid json", e);
        }).error(function (e) {
            logger.error(__filename + " getMetaData: unexpected error. \nError : ", e);
            throw new ApiError(__filename + " getMetaData: unexpected error. \nError : ", e);
        });
};

// Performs direct Cypher queries, bindings optional.
Api.prototype.query = function (queryText, bindings) {
    return r.postAsync({
        uri: this.connectionString + "cypher",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json; charset=UTF-8",
            "X-Stream": true
        },
        json: {query: queryText, params: bindings}
    }).spread(function (res, body, err) {
        if (!err) {
            return body;
        } else {
            throw err;
        }
    }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
        logger.error(__filename + "query: Unable to parse body invalid json. \nError : " + e);
        throw new ApiError(__filename + " query: Unable to parse body invalid json", e);
    }).error(function (e) {
        logger.error(__filename + " query: unexpected error. \nError : ", e);
        throw new ApiError(__filename + " query: unexpected error. \nError : ", e);
    });

};

Api.prototype.persist = function (queryText, bindings) {
    this.query(queryText, bindings);
};

module.exports = Api;
