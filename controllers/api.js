// use strict ?
var db = require('./db');
var util = require('util');
var events = require('events');

var Api = function() {
    // Superclass constructor.
    events.EventEmitter.call(this);
    var that = this;

    this.query = function (queryText) {
        db.query(queryText, {}, function(err, results) {
            if (err) { 
                that.emit('queryError', err);
            } else {
                console.log(results);
                that.emit('queryResult', results);
            }
        });
    };

};

util.inherits(Api, events.EventEmitter);

module.exports = new Api();
