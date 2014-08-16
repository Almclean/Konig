/*jslint node: true */
"use strict";
var Promise = require('bluebird');
var db = require('./db');
var r = Promise.promisifyAll(require('request'));
Promise.promisifyAll(db);

// Constructor
// @param : The Neo service root.
function Api(serviceRoot) {
    this.serviceRoot = serviceRoot;
}

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

// Checks the service root to ensure that the REST service is operational.
Api.prototype.pingService = function () {
    return getSimpleJSONResponse(this.serviceRoot);
};

Api.prototype.getNonAdminRelationships = function () {
    var queryText = [
            'MATCH (n)-[r]-(m)',
            'WHERE NOT has(r.admin)',
            'RETURN distinct type(r) as r'
    ].join('\n');
    return this.query(queryText, {});
};

Api.prototype.getNonAdminLabels = function () {
    var queryText = [
        'MATCH n WHERE NOT has(n.admin)',
        'RETURN distinct labels(n) as l'
    ].join('\n');

    return this.query(queryText, {});
};

Api.prototype.getMetaData = function () {
    return this.pingService().bind(this)
        .then(function (result) {
            var labels = this.getNonAdminLabels(),
                relationshipTypes = this.getNonAdminRelationships(),
                indexes = getSimpleJSONResponse(result.indexes);
            return Promise.props({
                labels: labels,
                indexes: indexes,
                relationships: relationshipTypes
            });
        })
        .catch(function (e) {
            throw e;
        });
};

// Performs direct Cypher queries, bindings optional.
Api.prototype.query = function (queryText, bindings) {
    return db.queryAsync(queryText, bindings)
        .then(function (results) {
            return results;
        })
        .catch(function (e) {
            throw e;
        });
};

module.exports = Api;
