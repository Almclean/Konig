/**
 * Created by almclean on 24/06/2014.
 */
"use strict";
var db = require('./db');
var util = require('util');
var events = require('events');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');
Promise.promisifyAll(bcrypt);
Promise.promisifyAll(db);

var UserService = function () {
    this.name = "UserService";
    events.EventEmitter.call(this);
};

util.inherits(UserService, events.EventEmitter);

// Go and check if this user password matches the database
UserService.prototype.authenticate = function (userName, inputPassword) {
    var queryText = [
        "MATCH (user:Adminstration { name: {userName} })",
        "RETURN user"
    ].join('\n');

    return db.queryAsync(queryText, {userName: userName})
        .then(function (results) {
            if (results && results.length > 0) {
                var storedHash = results[0].user._data.data.password;
                return bcrypt.compareAsync(inputPassword, storedHash);
            }
        })
        .then(function (result) {
            var retval = {};
            if (result) {
                retval = {"user": userName, "authenticated": true};
            } else {
                retval = {"user": userName, "authenticated": false, "reason": "Invalid Password"};
            }
            return retval;
        })
        .catch(function (e) {
            throw e;
        });
};

// Go and get the groups for this User.
UserService.prototype.groups = function (userName) {
    var queryText = [
        "MATCH (n {name : {userName} })-[IS_IN]-(group)",
        "RETURN g"
    ].join('\n');
    return db.queryAsync(queryText, {userName: userName})
        .then(function (results) {
            var retArray = [];
            if (results && results.length > 0) {
                for (var i = 0; i < results.length ; i++) {
                    retArray.push(results[i].group._data.data.name);
                }
            }
            return retArray;
        })
        .catch(function (e) {
            throw e;
        });
};

// Go and get the actions for this User
UserService.prototype.actions = function (userName) {
    var queryText = [
        "MATCH (n {name : {userName} })-[IS_IN]-(g)-[HAS_ACTION]-(action:Action) ",
        "RETURN g,action"
    ].join('\n');
    return db.queryAsync(queryText, {userName: userName})
        .then(function (results) {
            // TODO
            // Need to work out here how to populate a map of
            // Group => Action from the sample response.
        })
        .catch(function (e) {
            throw e;
        });
};

UserService.prototype.resources = function (userName) {
    var queryText = [
         "MATCH (n {name : {userName} })-[IS_IN]-(g)-[HAS_ACTION]-(action:Action)-[ON]-(re:Resource) ",
        "RETURN DISTINCT n,action,re"
    ].join('\n');
    return db.queryAsync(queryText, {userName: userName})
        .then(function (results) {
            // TODO
            // Should we return an array of tuples here ?
            // e.g. [(user, Action, Resource), (user, Action, Resource
            // ??
        })
        .catch(function (e) {
            throw e;
        });
};

module.exports = new UserService();