/*jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var p = require('bluebird');
var api = p.promisifyAll(require('../services/api'));
var userService = p.promisifyAll(require('../services/UserService'));


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
                res.json(results);
            }).done();
    });

router.route('/authenticate')
    .post(function (req, res, next) {
        console.log(req.body);
        var username = req.body.usernameInput;
        var password = req.body.passwordInput;
        console.log("Going to call user service. username = " + username + " pwd = " + password);
        userService.authenticate(username, password);
        userService.once('signInSuccess', function (results) {
            console.log('retval = ' + JSON.stringify(results));
            res.json(results);
        });
    });

module.exports = router;