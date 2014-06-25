/**
 * Created by almclean on 24/06/2014.
 */
"use strict";

var UserService = function () {
    this.name = "UserService";
};

UserService.prototype.authenticate = function (inputPassword) {
    return false;
};

module.exports = new UserService();