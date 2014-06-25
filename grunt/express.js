/*jslint node: true */
"use strict";

var path = require('path');

module.exports = {
    options: {
        port: 3001,
        hostname: 'localhost'
    },
    livereload: {
        options: {
            server: path.resolve('./app'),
            livereload: true,
            serverreload: true,
            bases: [path.resolve('./public'), path.resolve('./routes'), path.resolve('./services')]
        }
    }
};
