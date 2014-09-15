/**
 * Created by Ivan O'Mahony on 9/11/2014.
 */
"use strict";
// The set of Errors for the API layer
function UserError(message, error) {
    this.name = "UserError";
    this.message = (message || "");
    this.error = (error || "");
}

UserError.prototype = Error.prototype;

module.exports = UserError;
