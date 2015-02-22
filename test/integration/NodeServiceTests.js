/**
 * Created by almclean on 22/02/15.
 */
/*jslint node: true */
"use strict";

var nock = require("nock");
var request = require("supertest");
var app = require("../../app");
var should = require("should");
var log = require("winston");
var _ = require("lodash");


describe("Node Service Integration Tests", function () {
    describe("POST /entity/THING : data { field1 : blah, field2 : blah ", function () {

        it("Should parse the input REST call and create the appopriate object in the db", function (done) {
           request(app)
               .post("/entity/Thing", {data: {blah : "blah1"}})
               .expect(200)
               .end(function(err, res) {
                   _.contains(res.node.index).should.equal(true);
                   done();
               });
        });

    });
});