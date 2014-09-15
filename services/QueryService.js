/**
 * Created by almclean on 16/08/2014.
 */
/*jslint node: true */
"use strict";

var Api = require('./api');
var apiInstance = new Api();
var Query = require('../models/query');
var QueryError = require('./queryError');
var GraphTransformer = require('../services/graphTransformer');
var gt = new GraphTransformer();
var logger = require('winston');

//
// This is the set of services that will query the data container and return values.
// All queries will hit the api layer and that will delegate to the appropriate db layer
//
function QueryService() {
}

// @Param : Title of query
// @Returns : array of matching queries complete with triplets
QueryService.prototype.loadByTitle = function (title) {
    var queryText = [
        'MATCH (q:Query {title: {title} })-[:COMPRISED_OF]->(t:Triplet)',
        'RETURN q, collect(t) as triplets'
    ].join('\n');
    return apiInstance.query(queryText, {title: title})
        .then(function (results) {
            var queries = [];
            if (results) {
                results.data.forEach(function (element, outerIndex, array) {
                    if (Array.isArray(element)) {
                        var triplets = {};
                        element.forEach(function (element, dataIndex, array) {
                            if (Array.isArray(element)) {
                                element.forEach(function (element, tripletIndex, array) {

                                    triplets['triplet' + tripletIndex] = element.data;
                                });
                            } else {
                                queries.push(element.data);
                            }
                            if (queries[outerIndex]) {
                                queries[outerIndex].triplets = triplets;
                            }
                        });
                    }
                });
            }
            var queryObjectArray = [];
            queries.forEach(function (element, index, array) {
                queryObjectArray.push(new Query(element));
            });
            return queryObjectArray;
        }
    );
};

QueryService.prototype.getMetaData = function () {
    return apiInstance.getMetaData();
};

QueryService.prototype.getNodes = function (queryText) {
    return apiInstance.query(queryText)
        .then(function (results) {
            var serverNodes = [];
            if (results && results.data.length > 0) {
                for (var i = 0; i < results.data.length; i++) {
                    serverNodes.push([{"source": {
                            "type": isNodeOrRel(results.data[i][0].self),
                            "label": "Party", //TODO
                            "url": results.data[i][0].self,
                            "data": {
                                "name": results.data[i][0].data.name
                            }
                        }                        },
                        {"relationship": {
                            "type": isNodeOrRel(results.data[i][2].self),
                            "label": "LOCATED_IN",
                            "url": results.data[i][2].self,
                            "data": {
                                "name": results.data[i][2].type
                            }
                        }},
                        {"target": {
                            "type": isNodeOrRel(results.data[i][1].self),
                            "label": "Location",
                            "url": results.data[i][1].self,
                            "data": {
                                "name": results.data[i][1].data.name
                            }
                        }
                        }
                    ]);
                }
            }
            return gt.toClientGraph({"triplets": serverNodes});
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " getNodes: Unable to parse body invalid json. \nError : " + e);
            throw new QueryError(__filename + " getNodes: Unable to parse body invalid json", e);
        }).error(function (e) {
            logger.error(__filename + " getNodes: unexpected error. \nError : ", e);
            throw new QueryError(__filename + " getNodes: unexpected error. \nError : ", e);
        });
};

QueryService.prototype.getSavedQueries = function () {
    var queryText = [
        "MATCH (q:Query)-[COMPRISED_OF]->(t:Triplet) return q,t"
    ].join('\n');
    return apiInstance.query(queryText)
        .then(function (results) {
            var retArray = [];
            if (results.data && results.data.length > 0) {
                for (var i = 0; i < results.data.length; i++) {
                    var props = {};
                    props ["title"] = results.data[i][0].data.title;
                    props ["version"] = results.data[i][0].data.version;
                    props ["queryText"] = results.data[i][0].data.queryText;
                    // TODO Test how multiple Triplets will return from DB
                    retArray.push(new Query(props));
                }
            }
            return retArray;
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " getSavedQueries: Unable to parse body invalid json. \nError : " + e);
            throw new QueryError(" getSavedQueries: Unable to parse body invalid json", e);
        }).error(function (e) {
            logger.error(__filename + " getSavedQueries: unexpected error. \nError : ", e);
            throw new QueryError(__filename + " getSavedQueries: unexpected error. \nError : ", e);
        });
};

function isNodeOrRel(str){
    var re = /node/i;
    return (re.test(str)) ? "node" : "relationship";
}
module.exports = QueryService;