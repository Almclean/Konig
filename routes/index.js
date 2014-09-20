/*jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var p = require('bluebird');
var logger = require('winston');
var UserService = require('../services/userService');
var QueryService = require('../services/queryService');
var PersistService = require('../services/persistService');
var qs = new QueryService();
var ps = new PersistService();
var us = new UserService();

// GET Landing Page

router.get('/', function (req, res) {
    res.render('index', { title: 'Konig'});
});

/* GET home page. */
router.get('/home', function (req, res) {
    res.render('home', { title: 'Konig - Home' });
});

// Get the QueryBuilder page
router.get('/queryBuilder', function (req, res) {
    res.render('queryBuilder', { title: 'Konig - Query Builder'});
});

// Get the QueryEditor page
router.get('/queryEditor', function (req, res) {
    res.render('queryEditor', { title: 'Konig - Query Editor'});
});

// Start of API calls
router.get('/api/metaData', function (req, res, next) {
    qs.getMetaData()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            next(err);
        });
});

router.route('/api/nodeQuery')
    .post(function (req, res, next) {
        qs.getNodes(req.body.queryText)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

router.route('/api/authenticate')
    .post(function (req, res, next) {
        us.authenticate(req.body.usernameInput, req.body.passwordInput)
            .then(function (result) {
                logger.info('Successfully authenticated User: ' + result.user);
                res.json(result);
            })
            .catch(function (e) {
                var result = {"authenticated": false, "reason": "Invalid User Name/Password"};
                res.json(result);
            });
    });

router.get('/api/savedQueries', function (req, res, next) {
    qs.getSavedQueries()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            next(err);
        });
});

router.route('/api/saveQuery')
    .post(function (req, res, next) {
        ps.saveQuery(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

module.exports = router;