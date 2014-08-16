/**
 * Created by almclean on 16/08/2014.
 */
/*jslint node: true */
"use strict";

var Api = require('../services/api');
var apiInstance = new Api();
var Promise = require('bluebird');
var Query = require('../models/Query');

function QueryService () {}

QueryService.prototype.loadByTitle = function (title) {
    var queryText = [
        'MATCH '
    ]
};