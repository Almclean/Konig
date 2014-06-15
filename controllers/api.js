"use strict";

var db = require('./db');
var util = require('util');
var events = require('events');

function Api() {
    events.EventEmitter.call(this);
}

util.inherits(Api, events.EventEmitter);

Api.prototype.query = function(queryText) {
    var that = this;
    
    db.query(queryText, {}, function (err, results) {
        if (err) {
            console.log('Emitting an error');
            that.emit('queryError', err);
        } else {
            console.log('--- DB Results : ' + results);
            that.emit('queryResult', results);
        }
    });
};

module.exports = new Api();
