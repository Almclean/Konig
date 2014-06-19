/*jslint node: true */
"use strict";

module.exports = {
    options: {
        banner: '/*! <%= package.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    dist: {
        files: {
            './app.min.js': ['./app.js']
        }
    }
};