/**
 * Created by almclean on 24/06/2014.
 */

"use strict";
var userService = require("../services/userService");

function User(userName, password) {
    this.userName = userName;
    this.password = password;
}

// @param : inputPassword = password to check against
// @return : boolean = true if the person has supplied the correct password otherwise false
User.prototype.authenticate = function authenticate(userName, inputPassword) {
    return userService.authenticate(userName, inputPassword);
};

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

