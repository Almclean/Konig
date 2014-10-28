/**
 * Created by almclean on 16/08/2014.
 */
/*jslint node: true */
"use strict";

var Api = require('./api');
var apiInstance = new Api();
var Query = require('../../models/Query');
var QueryError = require('./../error/queryError');
var GraphTransformer = require('../services/graphTransformer');
var gt = new GraphTransformer();
var logger = require('winston');
var _ = require('lodash');

//
// This is the set of server that will query the data container and return values.
// All queries will hit the api layer and that will delegate to the appropriate db layer
//
function QueryService() {
}

QueryService.prototype.getMetaData = function () {
    return apiInstance.getMetaData();
};

QueryService.prototype.getNodes = function (queryText) {
    logger.info(methodEntry({'method': 'getNodes', 'query': JSON.stringify(queryText)}));
    return apiInstance.query(queryText)
        .then(function (results) {
            if (results.hasOwnProperty('data')) {
                var serverNodes = [];
                _.chain(results.data)
                    .flatten(true)
                    .chunk(results.columns.length)
                    .map(function (data) {
                        serverNodes.push([
                            {
                                "source": {
                                    "type": _.contains(data[0].self, "node") ? "node" : "relationship",
                                    "label": data[3][0],
                                    "url": data[0].self,
                                    "data": {
                                        "name": data[0].data.name
                                    }
                                }
                            },
                            {
                                "relationship": {
                                    "type": _.contains(data[2].self, "node") ? "node" : "relationship",
                                    "label": data[2].type,
                                    "url": data[2].self,
                                    "data": {
                                        "name": data[2].type
                                    }
                                }
                            },
                            {
                                "target": {
                                    "type": _.contains(data[1].self, "node") ? "node" : "relationship",
                                    "label": data[4][0],
                                    "url": data[1].self,
                                    "data": {
                                        "name": data[1].data.name
                                    }
                                }
                            }
                        ]);
                    });
                return gt.toClientGraph({"triplets": serverNodes});
            } else {
                logger.warn(__filename + " getNodes: No data returned to parse");
            }
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " getNodes: Unable to parse body invalid json. \nError : " + e);
            throw new QueryError(__filename + " getNodes: Unable to parse body invalid json", e);
        }).error(function (e) {
            logger.error(__filename + " getNodes: unexpected error. \nError : ", e);
            throw new QueryError(__filename + " getNodes: unexpected error. \nError : ", e);
        });
};

QueryService.prototype.getSavedQueries = function (limit) {
    var queryText = [
        "MATCH (q:Query)-[COMPRISED_OF]->(t:Triplet) return q,t LIMIT " + limit
    ].join('\n');
    logger.info(methodEntry({'method': 'getSavedQueries', 'query': JSON.stringify(queryText)}));
    return apiInstance.query(queryText)
        .then(function (results) {
            return parseQueries(results);
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " getSavedQueries: Unable to parse body invalid json. \nError : " + e);
            throw new QueryError(" getSavedQueries: Unable to parse body invalid json", e);
        }).error(function (e) {
            logger.error(__filename + " getSavedQueries: unexpected error. \nError : ", e);
            throw new QueryError(__filename + " getSavedQueries: unexpected error. \nError : ", e);
        });
};

QueryService.prototype.loadByTitle = function (title) {
    var queryText = [
        'MATCH (q:Query)-[:COMPRISED_OF]->(t:Triplet)',
        'WHERE q.title = {title}',
        'RETURN distinct(q) AS Query, COLLECT(t) AS Triplets'
    ].join('\n');
    logger.info(methodEntry({'method': 'loadByTitle', 'query': JSON.stringify(queryText)}));
    return apiInstance.query(queryText, {title: title})
        .then(function (results) {
            return parseQuery(results);
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " loadByTitle: Unable to parse body invalid json. \nError : " + e);
            throw new QueryError(" loadByTitle: Unable to parse body invalid json", e);
        }).error(function (e) {
            logger.error(__filename + " loadByTitle: unexpected error. \nError : ", e);
            throw new QueryError(__filename + " loadByTitle: unexpected error. \nError : ", e);
        });
};

QueryService.prototype.loadByTitleFuzzy = function (title) {
    var queryText = [
        'MATCH (q:Query)-[:COMPRISED_OF]->(t:Triplet)',
        'WHERE q.title =~ "(?i).*' + title + '.*"',
        'RETURN q, t'
    ].join('\n');
    logger.info(methodEntry({'method': 'loadByTitleFuzzy', 'query': JSON.stringify(queryText)}));
    return apiInstance.query(queryText)
        .then(function (results) {
            return parseQueries(results);
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " loadByTitle: Unable to parse body invalid json. \nError : " + e);
            throw new QueryError(" loadByTitle: Unable to parse body invalid json", e);
        }).error(function (e) {
            logger.error(__filename + " loadByTitle: unexpected error. \nError : ", e);
            throw new QueryError(__filename + " loadByTitle: unexpected error. \nError : ", e);
        });
};

QueryService.prototype.saveQuery = function (queryText) {
    logger.info(methodEntry({'method': 'saveQuery', 'query': JSON.stringify(queryText)}));
    return apiInstance.query(createStatement(queryText))
        .then(function (results) {
            logger.info(results);
            //FIXME We need proper error codes here
            return {"persist": "success"};
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " saveQuery: Unable to parse body invalid json. \nError : " + e);
            throw new QueryError(__filename + " saveQuery: Unable to parse body invalid json", e);
        }).error(function (e) {
            logger.error(__filename + " saveQuery: unexpected error. \nError : ", e);
            throw new QueryError(__filename + " saveQuery: unexpected error. \nError : ", e);
        });
};

// ---------------------- ---------------------

// Start of internal methods

// Parses returned data from Neo4j into a Query model object
function parseQuery(results) {
    if (results.hasOwnProperty('data')) {
        var flatArray = _.flatten(results.data, true);
        var query = flatArray[0];
        var tripletArray = [];
        _.forEach(flatArray[1], function (triplet) {
            tripletArray.push(triplet.data);
        });
        return new Query({
            url: query.self,
            title: query.data.title,
            version: query.data.version,
            queryText: query.data.queryText,
            triplets: tripletArray
        });
    }
}

// TODO - Can this just replace the parseQuery?
// Parses returned data from Neo4j into a collection of Query model object
function parseQueries(results) {
    var retArray = [];
    if (results.hasOwnProperty('data')) {
        _.chain(results.data)
            .flatten(true)
            .chunk(results.columns.length)
            .map(function (data) {
                retArray.push(new Query({
                    url: data[0].self,
                    title: data[0].data.title,
                    version: data[0].data.version,
                    queryText: data[0].data.queryText,
                    triplets: data[1].data
                }));
            });
    } else {
        logger.warn(__filename + " parseQueries: No data returned to parse");
    }
    return retArray;
}

// Creates an insert statement from the given query
function createStatement(query) {
    var persistString = "CREATE (Q1:Query {title: \"" + query.title + "\", version: " + query.version + ", queryText: \"" + query.queryText + "\"})";
    // TODO Can we do this better???
    for (var i = 0; i < query.triplets.length; i++) {
        var source = query.triplets[i][0].source;
        var relationship = query.triplets[i][1].relationship;
        var target = query.triplets[i][2].target;
        var create = "\nCREATE (T" + i + ":Triplet {source: \"" + source.type + "\", relationship: \"" + relationship.type + "\", target: \"" + target.type + "\"" +
            ", sourceConstraint: \"" + source.filter + "\", relConstraint: \"" + relationship.filter + "\", targetConstraint: \"" + target.filter + "\"})";
        var rel = "\nCREATE (Q1)-[:COMPRISED_OF]->(T" + i + ")";
        persistString += create;
        persistString += rel;
    }
    return persistString;
}

// Chunks an Array into a collection of Arrays of size n
function chunk(array, n) {
    if (array.length === 0) return [];
    return [_.first(array, n)].concat(chunk(_.rest(array, n), n));
}

var methodEntry = _.template(__filename + ' : <%= method %> : parameter(s) [[ <%= query %> ]]');

_.mixin(
    {
        chunk: chunk
    });

module.exports = QueryService;