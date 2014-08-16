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
    res.render('index', { title: 'Konig - Home' });
});

// Get the QueryBuilder page
router.get('/queryBuilder', function (req, res) {
    res.render('queryBuilder', { title: 'Konig - Query Builder'});
});

// Get the QueryEditor page
router.get('/queryEditor', function (req, res) {
    res.render('queryEditor', { title: 'Konig - Query Editor'});
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

router.route('/api/nodeQuery')
    .post(function (req, res, next) {
        var node1 = req.body.node1,
            rel1 = req.body.rel,
            node2 = req.body.node2;

        gs.getNodes(node1, rel1, node2)
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

router.get('/api/savedQueries', function (req, res, next) {
    gs.getSavedQueries()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            next(err);
        });
});
module.exports = router;