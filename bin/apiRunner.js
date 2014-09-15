#!/usr/bin/env node
// Tool for running the api commands on the command line !
var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var logger = require('winston');


function main() {
    "use strict";
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash("blah", salt, function (err, hash) {
            console.log(hash);
        });
    });
}

main();