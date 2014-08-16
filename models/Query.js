/**
 * Created by almclean on 16/08/2014.
 */
/*jslint node: true */
"use strict";

function Query (propMap) {
    this.queryTitle = propMap.queryTitle;
    this.queryVersion = propMap.queryVersion;
    this.queryText = propMap.queryText;
    this.triplets = propMap.triplets;
}

module.exports = Query;


