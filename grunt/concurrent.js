/*jslint node: true */
"use strict";

module.exports = {
    first: ["gitpull"],
    second: ["npm-install"],
    third: ["newer:uglify", "mochaTest:test", "jshint"]
};