/**
 * Created by almclean on 24/06/2014.
 */
/*jslint node: true */
"use strict";
var Api = require('./api');
var apiInstance = new Api();
var UserError = require('./error/userError');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var _ = require('lodash');
Promise.promisifyAll(bcrypt);
var logger = require('winston');

var UserService = function () {
    this.name = "UserService";
};

// Go and check if this user password matches the database
UserService.prototype.authenticate = function (userName, inputPassword) {
    var queryText = [
        "MATCH (user:AdminUser { name: {userName} })",
        "RETURN user"
    ].join('\n');
    return apiInstance.query(queryText, {userName: userName})
        .then(function (results) {
            if (results && results.data) {
                var storedHash = _.find(_.pluck(_.flatten(results.data), 'data'), 'password').password;
                return bcrypt.compareAsync(inputPassword, storedHash);
            }
        })
        .then(function (result) {
            var retval = {};
            if (result) {
                retval = {"user": userName, "authenticated": true};
            } else {
                retval = {"user": userName, "authenticated": false, "reason": "Invalid User Name/Password"};
            }
            return retval;
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " authenticate: Unable to authenticate user. \nError : " + e);
            throw new UserError(__filename + " authenticate: Unable to authenticate user.", e);
        }).error(function (e) {
            logger.error(__filename + " authenticate: Unable to authenticate user. \nError : ", e);
            throw new UserError(__filename + " authenticate: Unable to authenticate user.", e);
        });
};

// Go and get the groups for this User.
UserService.prototype.groups = function (userName) {
    var queryText = [
        "MATCH (n {name : {userName} })-[IS_IN]-(g)",
        "RETURN g"
    ].join('\n');
    return apiInstance.query(queryText, {userName: userName})
        .then(function (results) {
            var retArray = [];
            if (results && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    retArray.push(results[i].group._data.data.name);
                }
            }
            return retArray;
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " groups: Unable to get groups for user. \nError : " + e);
            throw new UserError(__filename + " groups: Unable to get groups for user.", e);
        }).error(function (e) {
            logger.error(__filename + " groups: Unable to get groups for user. \nError : ", e);
            throw new UserError(__filename + " groups: Unable to get groups for user.", e);
        });
};

// Go and get the actions for this User
UserService.prototype.actions = function (userName) {
    var queryText = [
        "MATCH (n {name : {userName} })-[IS_IN]-(g)-[HAS_ACTION]-(action:Action) ",
        "RETURN g,action"
    ].join('\n');
    return apiInstance.query(queryText, {userName: userName})
        .then(function (results) {
            // TODO
            // Need to work out here how to populate a map of
            // Group => Action from the sample response.
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " groups: Unable to get actions for user. \nError : " + e);
            throw new UserError(__filename + " groups: Unable to get actions for user.", e);
        }).error(function (e) {
            logger.error(__filename + " groups: Unable to get actions for user. \nError : ", e);
            throw new UserError(__filename + " groups: Unable to get actions for user.", e);
        });
};

UserService.prototype.resources = function (userName) {
    var queryText = [
        "MATCH (n {name : {userName} })-[IS_IN]-(g)-[HAS_ACTION]-(action:Action)-[ON]-(re:Resource) ",
        "RETURN DISTINCT n,action,re"
    ].join('\n');
    return apiInstance.query(queryText, {userName: userName})
        .then(function (results) {
            // TODO
            // Should we return an array of tuples here ?
            // e.g. [(user, Action, Resource), (user, Action, Resource
            // ??
        }).catch(SyntaxError, function (e) { // TODO What would be the error here to catch
            logger.error(__filename + " groups: Unable to get resources for user. \nError : " + e);
            throw new UserError(__filename + " groups: Unable to get resources for user.", e);
        }).error(function (e) {
            logger.error(__filename + " groups: Unable to get resources for user. \nError : ", e);
            throw new UserError(__filename + " groups: Unable to get resources for user.", e);
        });
};

module.exports = UserService;