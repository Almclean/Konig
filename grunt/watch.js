/*jslint node: true */
"use strict";

module.exports = {
    tasks: [ 'express:restart' ],
    options: {
        event: ['added', 'deleted', 'changed'],
        interval: 1000,
        reload: true,
        livereload: true
    }
};

