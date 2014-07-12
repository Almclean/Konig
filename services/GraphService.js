/*jslint node: true */
"use strict";

var _serviceRoot_ = 'http://localhost:7474/db/data/';
var Api = require('../services/api');
var apiInstance = new Api(_serviceRoot_);

var GraphService = function () {
    this.name = "graphService";
};

GraphService.prototype.getMetaData = function () {
    return apiInstance.getMetaData();
};

module.exports = GraphService;

