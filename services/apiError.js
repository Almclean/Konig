/**
 * Created by Ivan O'Mahony on 9/10/2014.
 */
"use strict";
// The set of Errors for the API layer
function ApiError(message, error) {
    this.name = "ApiError";
    this.message = (message || "");
    this.error = (error || "");
}

ApiError.prototype = Error.prototype;

module.exports = ApiError;
