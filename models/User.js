/**
 * Created by almclean on 24/06/2014.
 */
/*jshint node: true */
"use strict";
var userService = require("../server/services/UserService");

function User(userName, password) {
    this.userName = userName;
    this.password = password;
}

// @param : userName = the userName to get resources for
// @return : resources = the collection of resources for the supplied user
User.prototype.resources = function resources(userName) {
    return userService.resources(userName);
};

// @param : userName = the userName to get resources for
// @return : groupList = the collection of groups for the supplied user
User.prototype.groups = function groups(userName) {
    return userService.groups(userName);
};

// @param : userName = the userName to get resources for
// @return : actions = the collection of actions for the supplied user
User.prototype.actions = function actions(userName) {
    return userService.actions(userName);
};

module.exports = User;

