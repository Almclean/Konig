/**
 * Created by Ivan O'Mahony on 9/14/2014.
 */

"use strict";
// The set of Errors for the API layer
function GraphTransformerError(message, error) {
    this.name = "GraphTransformerError";
    this.message = (message || "");
    this.error = (error || "");
}

GraphTransformerError.prototype = Error.prototype;

module.exports = GraphTransformerError;

