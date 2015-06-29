/*jslint node: true */
/*jshint -W079 */

"use strict";
var Promise = require("bluebird");
var r = Promise.promisifyAll(require("request"));
var ApiError = require("./../error/ApiError");
var logger = require("winston");

// Constructor
// @param : The Neo service root.
function Api() {
    this.connectionString = "http://162.243.169.45:7474/db/data/";
}


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

Api.prototype.persist = function (queryText, bindings) {
    this.query(queryText, bindings);
};

module.exports = Api;
