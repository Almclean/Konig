/*jslint node: true */
"use strict";

var express = require("express");
var router = express.Router();
var logger = require("winston");
var UserService = require("../services/userService");
var QueryService = require("../services/queryService");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var _ = require("lodash");
var qs = new QueryService();
var us = new UserService();

// Passport Setup
passport.use(new LocalStrategy(function(username, password, done) {
    console.log("In passport handler.");
    return us.getByUserName(username)
        .then(function(userObj) {
            if (userObj) {
                return userObj;
            } else {
                logger.error("Invalid username : " + username);
                return done(null, false, {message: "Invalid UserName."});
            }
        })
        .then(function(userObj) {
            logger.info("Authenticating user : " + userObj.username);
            return us.authenticate(userObj.username, userObj.password);
        })
        .then(function(result) {
            if (result && result.authenticated) {
                logger.info("Successfully authenticated User: " + result.user);
                return done(null, result);
            } else {
                logger.error("Invalid password");
                return done(null, false, {message: "Incorrect Password."});
            }
        });
}));

// ---------------------- ---------------------

// Routes for pages

router.get("/login", function(req, res) {   
    res.render("index", {title: "Konig - login"});
});

router.post("/login", passport.authenticate('local', {successRedirect: "/home",
                                                      failureRedirect: "/login"}
));

router.get("/", passport.authenticate('local', {failureRedirect: "/login"}),
    function (req, res) {
        res.render("index", { title: "Konig"});
});

router.get("/admin", passport.authenticate('local', {failureRedirect: "/login"}),
    function (req, res) {
        res.render("admin", {title: "Konig - Admin"});
});

/* GET home page. */
router.get("/home", passport.authenticate('local', {failureRedirect: "/login"}),
    function (req, res) {
        res.render("home", { title: "Konig - Home" });
});

// Get the QueryBuilder page
router.get("/queryBuilder", passport.authenticate('local', {failureRedirect: "/login"}),
    function (req, res) {
        res.render("queryBuilder", { title: "Konig - Query Builder"});
});

// Get the QueryEditor page
router.get("/queryEditor", passport.authenticate('local', {failureRedirect: "/login"}),
    function (req, res) {
        res.render("queryEditor", { title: "Konig - Query Editor"});
});

// ---------------------- ---------------------

// Start of external query routes

router.route("/ext/query*")
    .get(function (req, res, next) {
        qs.getSavedQueries(200)
            .then(function (result) {
                var retval = [];
                _.forEach(result, function (item) {
                    retval.push({queryTitle: item.queryTitle});
                });
                res.json(retval);
            });
    })
    .post(function (req, res, next) {
        if (req.query.title && req.body) {
            qs.loadByTitle(req.query.title)
                .then(function (queryObject) {
                    return [queryObject, req.body];
                })
                .spread(function (queryObject, bindings) {
                    return qs.executeBoundQuery(queryObject, bindings);
                })
                .then(function (result) {
                    logger.info(result);
                    res.json(result);
                })
                .catch(function (e) {
                    next(e);
                });
        }
    });

// ---------------------- ---------------------

router.route("/api/loadByTitle")
    .post(function (req, res, next) {
        qs.loadByTitle(req.body.searchInput)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

router.route("/api/loadByTitleFuzzy")
    .post(function (req, res, next) {
        qs.loadByTitleFuzzy(req.body.searchInput)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

router.get("/api/metaData", function (req, res, next) {
    qs.getMetaData()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            next(err);
        });
});

router.route("/api/nodeQuery")
    .post(function (req, res, next) {
        qs.getNodes(req.body.queryText)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

router.route("/api/savedQueries")
    .post(function (req, res, next) {
        qs.getSavedQueries(req.body.limit)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

router.route("/api/saveQuery")
    .post(function (req, res, next) {
        qs.saveQuery(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

router.route("/api/updateQuery")
    .put(function (req, res, next) {
        qs.updateQuery(req.body.update)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                next(err);
            });
    });

module.exports = router;