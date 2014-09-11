/**
 * Created by Ivan O'Mahony on 9/10/2014.
 */
"use strict";
// The set of Errors for the API layer
function QueryError(message, error) {
    this.name = "ApiError";
    this.message = (message || "");
    this.error = (error || "");
}

QueryError.prototype = Error.prototype;

module.exports = QueryError;
