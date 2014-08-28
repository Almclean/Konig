/*jslint node: true */
"use strict";
var Promise = require('bluebird');
var dbLib = require('./db')
var db = dbLib.getConnection();
Promise.promisifyAll(db);

// Constructor
// @param : The Neo service root.
function Api() { }

// Checks the service root to ensure that the REST service is operational.
Api.prototype.pingService = function () {
    return dbLib.getSimpleJSONResponse(dbLib.connectionString + '/db/data/');
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
                //relationshipTypes = this.getNonAdminRelationships(),
                indexes = "";
            if (result.hasOwnProperty('indexes')) {
                indexes = dbLib.getSimpleJSONResponse(result.indexes);
            }
            return Promise.props({
                labels: labels,
                indexes: indexes
//                relationships: relationshipTypes
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
