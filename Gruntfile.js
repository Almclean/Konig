'use strict';

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

// Basic Grunt wrapper. All commands must be in here
module.exports = function (grunt) {
    // measures the time each task takes
    require('time-grunt')(grunt);

    var neo4j_start_cmd;
    var os = grunt.option('OS') || 'WIN';
    if (os == "NO_OS") {
        var msg_no_os = "No OS parameter passed to grunt. Please set via --OS=win or --OS=mac";
        grunt.log.error(msg_no_os);
        throw new ParameterException(msg_no_os);
    } else {
        if (os.toUpperCase() == "WIN") {
            grunt.log.writeln("OS Set to " + os);
            neo4j_start_cmd = ".\\bin\\win-neo4j-controller.bat start";
        } else if (os.toUpperCase() == "MAC") {
            grunt.log.writeln("OS Set to " + os);
            neo4j_start_cmd = "echo TO FIND OUT";
        }
        else {
            var msg = "Invalid value [" + os + "] for OS parameter passed to grunt. Please set via --OS=win or --OS=mac";
            grunt.log.error(msg);
            throw new ParameterException(msg);
        }
    }
    // load grunt config
    require('load-grunt-config')(grunt, {
        init: true, //auto grunt.initConfig
        data: { //data passed into config.  Can use with <%= operatingSys %>
            neo4j_start: neo4j_start_cmd
        }
    });
}
;