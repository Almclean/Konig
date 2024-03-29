/*jslint node: true */
"use strict";

var express = require("express");
var session = require("express-session");
var path = require("path");
var favicon = require("static-favicon");
var logger = require("./server/util/Logger");
var bodyParser = require("body-parser");
var passport = require("passport");
var routes = require("./server/routes/Index");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "server/views"));
app.set("view engine", "jade");

app.use(favicon(__dirname + "/public/icons/favicon.ico"));
app.use(express.static(path.join(__dirname, "public")));
app.use(require("morgan")("combined", { "stream": logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({ secret: "IMABIGSECRET",
                  resave : true,
                  saveUninitialized : true}
));
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

var server = app.listen(3001, function () {
    logger.info("Started application, listening on : " + server.address().port + "\n");
});

module.exports = app;