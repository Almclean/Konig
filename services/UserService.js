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
                console.log(storedHash);
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

// Go and get the resources for this user from the data container
UserService.prototype.resources = function (userName) {
    return false;
};

module.exports = new UserService();