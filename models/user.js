/**
 * Created by almclean on 24/06/2014.
 */

"use strict";
var userService = require('../services/UserService');

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
    return userService.resources(userName)
};