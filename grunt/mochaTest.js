/*jslint node: true */
"use strict";

module.exports = {
    test: {
        options: {
            reporter: 'spec'
        },
        src: ['test/**/*.js']
    },
    options: {
        colors: true,
        log: true
    }
};