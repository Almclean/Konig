/**
 * Created by almclean on 24/06/2014.
 */
"use strict";
var db = require('./db');
var util = require('util');
var events = require('events');

var UserService = function () {
    this.name = "UserService";
    events.EventEmitter.call(this);
};

util.inherits(UserService, events.EventEmitter);

// Go and check if this user password matches the database
UserService.prototype.authenticate = function (userName, inputPassword) {
    var that = this;

    var queryText = "MATCH (user:Adminstration { name:\"" + userName + "\" }) RETURN user";
    console.log("Query will be " + queryText);
    db.query(queryText, {}, function (err, results) {
        var storedPwd;
        if (err) {
            console.log('### Event : signInError');
            that.emit('signInError', {"user": userName, "authenticated": false, "reason": err});
        } else {
            console.log('--- DB Results : ' + JSON.stringify(results));
            storedPwd = results[0].user._data.data.password;
            // TODO I know this shouldn't be logged here!
            console.log("--- DB Results [Pwd] :" + storedPwd);
            if (inputPassword.toUpperCase() === storedPwd.toUpperCase()) {
                console.log('### Event : signInSuccess');
                that.emit('signInSuccess', {"user": userName, "authenticated": true});
            } else {
                console.log('### Event : signInFail');
                that.emit('signInFail', {"user": userName, "authenticated": false, "reason": "Invalid Password"});
            }
        }
    });
};

// Go and get the resources for this user from the data container
UserService.prototype.resources = function (userName) {
    return false;
};

module.exports = new UserService();