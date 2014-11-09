/*jslint node: true */
"use strict";

var express = require("express");
var router = express.Router();
var logger = require("winston");
var UserService = require("../services/userService");
var QueryService = require("../services/queryService");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var _ = require("lodash");
var qs = new QueryService();
var us = new UserService();

// Passport Setup
passport.use(new LocalStrategy({passReqToCallback: true}, function(req, username, password, done) {
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
            logger.info("Authenticating user : " + userObj.userName);
            return us.authenticate(userObj.userName, password);
        })
        .then(function(result) {
            if (result && result.authenticated) {
                logger.info("Successfully authenticated User: " + result.user.userName);
                return done(null, result);
            } else {
                logger.error("Invalid password");
                return done(null, false, {message: "Incorrect Password."});
            }
        });
}));

passport.serializeUser(function(authResult, done) {
    console.log("Serializing user " + authResult.user.userName);
    done(null, authResult.user);
});

passport.deserializeUser(function(user, done) {
    console.log("Getting user :" + user.userName);
    us.getByUserName(user.userName)
        .then(function(user) {
            done(null, user);
        });
});

// ---------------------- ---------------------

// Routes for pages

router.get("/login", function(req, res) {   
    res.render("index", {title: "Konig - login"});
});

router.post("/login", passport.authenticate('local', {failureRedirect: "/login"}),
    function(req, res) {
        res.redirect("/home");
    });

router.get("/", ensureAuthenticated,
    function (req, res) {
        res.redirect("/home");
});

router.get("/admin", ensureAuthenticated,
    function (req, res) {
        res.render("admin", {title: "Konig - Admin"});
});

/* GET home page. */
router.get("/home", ensureAuthenticated,
    function (req, res) {
        res.render("home", { title: "Konig - Home" });
});

// Get the QueryBuilder page
router.get("/queryBuilder", ensureAuthenticated,
    function (req, res) {
        res.render("queryBuilder", { title: "Konig - Query Builder"});
});

// Get the QueryEditor page
router.get("/queryEditor", ensureAuthenticated,
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

function ensureAuthenticated(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log("Not logged in, redirecting !");
        res.redirect('/login');
    }
}

module.exports = router;