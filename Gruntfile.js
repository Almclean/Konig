'use strict';
var nodeOS = require('os');

// Basic Grunt wrapper. All commands must be in here
module.exports = function (grunt) {
    // measures the time each task takes
    require('time-grunt')(grunt);

    // load grunt config
    require('load-grunt-config')(grunt, {
        init: true, //auto grunt.initConfig
        data: { //data passed into config.  Can use with <%= operatingSys %>
            neo4j_start: ParseOSForNeo4j(grunt)
        }
    });
};


/**
 * The type of exception thrown when we have an invalid Parameter for grunt
 *
 * This may be due to the parameter being missing or an invalid value being passed
 *
 * @param message The message to return to the user
 * @constructor // TODO find out what this means to populate
 */
function ParameterException(message) {
    this.message = message;
    this.name = "ParameterException";
}

/**
 *
 * Attempts to find the correct start command
 *
 * @returns {*} The start script of the Neo4j server
 * @constructor
 */
function ParseOSForNeo4j(grunt) {
    var neo4j_start_cmd;
    var nos = nodeOS.type();
    grunt.log.writeln("Node OS Type is [" + nos + "]");

    switch (nos.toUpperCase()) {
        case "WINDOWS_NT":
            grunt.log.writeln("OS is Windows....we think");
            neo4j_start_cmd = ".\\bin\\win-neo4j-controller.bat start";
            break;
        case "LINUX":
            grunt.log.writeln("OS is Linux....we think");
            neo4j_start_cmd = "sudo service neo4j-service start";
            break;
        case "DARWIN":
            grunt.log.writeln("OS is Mac....we think");
            neo4j_start_cmd = "neo4j start";
            break;
        default:
            var msg = "Unable to parse Type of OS [" + nos + "] to figure out to start Neo4j";
            grunt.log.error(msg);
            throw new ParameterException(msg);
            break;
    }

    return neo4j_start_cmd;
};