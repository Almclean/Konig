/*jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var p = require('bluebird');
var UserService = require('../services/UserService');
var GraphService = require('../services/GraphService');
var gs = new GraphService();
var us = new UserService();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Konig' });
});

// Get the QueryBuilder page
router.get('/queryBuilder', function (req, res) {
    res.render('queryBuilder', { title: 'Query Builder'});
});

// Start of API
router.get('/api/metaData', function (req, res, next) {
    gs.getMetaData()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            next(err);
        });
});

router.route('/authenticate')
    .post(function (req, res, next) {
        var username = req.body.usernameInput,
            password = req.body.passwordInput;

        us.authenticate(username, password)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (e) {
                next(e);
            });
    });

module.exports = router;