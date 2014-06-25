/**
 * Created by almclean on 24/06/2014.
 */
"use strict";

var service = require('../services/UserService');


function User(username, password) {
    this.username = username;
    this.password = password;
}

// @param : pass = password to check against ?
User.prototype.authenticate = function authenticate(inputPassword) {
    return service.authenticate(inputPassword);
};