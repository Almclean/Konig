/**
 * Created by Ivan O'Mahony on 9/10/2014.
 */
"use strict";
// The set of Errors for the API layer
function PersistError(message, error) {
    this.name = "PersistError";
    this.message = (message || "");
    this.error = (error || "");
}

PersistError.prototype = Error.prototype;

module.exports = PersistError;

