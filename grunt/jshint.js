/*jslint node: true */
"use strict";

module.exports = {
    options: {
        reporter: require("jshint-stylish"),
        debug: true,
        node: true
    },
    target: ["./public/javascript/*.js", "./server/**/*.js"]
};