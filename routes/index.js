/*jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var p = require('bluebird');
var logger = require('winston');
var UserService = require('../services/userService');
var QueryService = require('../services/queryService');
var _ = require('lodash');
var qs = new QueryService();
var us = new UserService();

// ---------------------- ---------------------

// Routes for pages

router.get('/', function (req, res) {
    res.render('index', { title: 'Konig'});
});

router.get('/admin', function (req, res) {
    res.render('admin', {title: 'Konig - Admin'});
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

// ---------------------- ---------------------

// Start of external query routes

router.get('/ext/query/list', function (req, res, next) {
    qs.getSavedQueries(200)
        .then(function(result) {
            var retval = [];
            _.forEach(result, function(item) {
                retval.push({'queryTitle' : item.queryTitle});
            });
            res.json(retval);
        });
});

router.post('/ext/query*', function (req, res, next) {
    console.log(req);
    res.send(req.path + '\n' + JSON.stringify(req.body) + '\n' + JSON.stringify(req.query));
});

// ---------------------- ---------------------

// Start of API calls
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

router.route('/api/loadByTitle')
    .post(function (req, res, next) {
        qs.loadByTitle(req.body.searchInput)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

router.route('/api/loadByTitleFuzzy')
    .post(function (req, res, next) {
        qs.loadByTitleFuzzy(req.body.searchInput)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

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

router.route('/api/savedQueries')
    .post(function (req, res, next) {
        qs.getSavedQueries(req.body.limit)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

router.route('/api/saveQuery')
    .post(function (req, res, next) {
        qs.saveQuery(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

module.exports = router;