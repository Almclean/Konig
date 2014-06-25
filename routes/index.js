/*jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var p = require('bluebird');
var api = p.promisifyAll(require('../services/api'));

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Konig' });
});

// Start of API commands
router.route('/api/rawquery')
    .post(function (req, res, next) {
        var queryText = req.body.cql;
        console.log('CQL : ' + queryText);

        // Send off the query to the API...
        api.query(queryText)
            .then(function (results) {
                console.log('retval = results');
                res.json(Subgraph(results));
            }).done();
    });

module.exports = router;
