/**
 * Created by Ivan O'Mahony on 9/1/2014.
 */
/*jslint node: true */
"use strict";
var Api = require('./api');
var apiInstance = new Api();
var PersistError = require('./persistError');
var logger = require('winston');

//
// This is the set of services that will persist data to the data container and return success or not.
// All persists will hit the api layer and that will delegate to the appropriate db layer
//
function PersistService() {
}

PersistService.prototype.saveQuery = function (query) {
    return apiInstance.query(createStatement(query))
        .then(function (results) {
            logger.info(results);
            //FIXME We need proper error codes here
            return {"persist": "success"};
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " saveQuery: Unable to parse body invalid json. \nError : " + e);
            throw new PersistError(__filename + " saveQuery: Unable to parse body invalid json", e);
        }).error(function (e) {
            logger.error(__filename + " saveQuery: unexpected error. \nError : ", e);
            throw new PersistError(__filename + " saveQuery: unexpected error. \nError : ", e);
        });
};

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

module.exports = PersistService;