/**
 * Created by Ivan O'Mahony on 9/24/2014.
 */
/*jslint node: true */
"use strict";

var nock = require("nock");
var request = require("supertest");
var app = require("../../app");
var should = require("should");
var log = require("winston");
var _ = require("lodash");

describe("User Service Integration Tests", function () {

    describe("POST /api/authenticate", function() {
        var scope = nock("http://162.243.169.45:7474")
            .post("/db/data/cypher", {"query":"MATCH (user:AdminUser { name: {userName} })\nRETURN user","params":{"userName":"Al"}})
            .reply(200, {"columns":["user"],"data":[[{"data":{"password":"$2a$10$yFgDvzRz20/MhtgnxelJveTaHgTkIHmOIUQT9E6ahHCE4b.YzklyK","admin":"true","name":"Al"}}]]});

        it("Should authenticate with a sample password and salt", function(done) {
            request(app)
                .post("/api/authenticate")
                .send({usernameInput: "Al", passwordInput: "blah"})
                .expect(200)
                .end(function (err, res) {
                    res.body.authenticated.should.equal(true);
                    res.body.user.should.equal("Al");
                    scope.done();
                    done();
                });
        });
    });
});




