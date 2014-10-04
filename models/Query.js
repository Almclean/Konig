/**
 * Created by almclean on 16/08/2014.
 */
/*jslint node: true */
"use strict";

function Query (propMap) {
    this.queryTitle = propMap.title;
    this.queryVersion = propMap.version;
    this.queryText = propMap.queryText;
    this.triplets = propMap.triplets;
    this.url = propMap.url;
}

module.exports = Query;

