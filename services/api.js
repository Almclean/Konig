/*jslint node: true */
"use strict";
var Promise = require('bluebird');
var r = Promise.promisifyAll(require('request'));

// Constructor
// @param : The Neo service root.
function Api() {
    this.connectionString = 'http://162.243.169.45:7474/db/data/';
}

Api.prototype.getSimpleJSONResponse = function (uri) {
    return r.getAsync(uri)
        .spread(function (response, body) {
            if (response.statusCode === 200) {
                return JSON.parse(body);
            }
        })
        .catch(function (e) {
            throw e;
        });
};

// Checks the service root to ensure that the REST service is operational.
Api.prototype.pingService = function () {
    return this.getSimpleJSONResponse(this.connectionString);
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
                indexes = "";
            if (result.hasOwnProperty('indexes')) {
                indexes = this.getSimpleJSONResponse(result.indexes);
            }
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
    return r.postAsync({
        uri: this.connectionString + 'cypher',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json; charset=UTF-8",
            "X-Stream": true
        },
        json: {query: queryText, params: bindings}
    })
        .spread(function (res, body, err) {
            if (!err) {
                return body;
            } else {
                throw err;
            }
        })
        .catch(function (err) {
            console.error('Query error : ' + err);
            throw err;
        });
};

// TODO Is this the best method to call for persist
// FIXME Proper error code parsing
Api.prototype.persist = function (queryText, bindings) {
    // TODO What are the right return codes here for success?
    return r.postAsync({
        uri: this.connectionString + 'cypher',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json; charset=UTF-8",
            "X-Stream": true
        },
        json: {query: queryText, params: bindings}
    })
        .spread(function (res, body, err) {
            if (!err) {
                return body;
            } else {
                throw err;
            }
        })
        .catch(function (err) {
            console.error('Query error : ' + err);
            throw err;
        });
};

module.exports = Api;
