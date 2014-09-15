/*jslint node: true */
"use strict";

var nock = require('nock');
var request = require('supertest');
var app = require('../app');
var should = require("should");
var log = require('winston');
var _ = require('lodash');

describe('API Tests', function () {
    describe('GET /metadata', function () {
        var scope = null;
        beforeEach(function() {
            scope = nock('http://162.243.169.45:7474')
                .get('/db/data/')
                .reply(200, {"indexes": "http://162.243.169.45:7474/db/data/schema/index"})
                .get('/db/data/schema/index')
                .reply(200, [])
                .post('/db/data/cypher', {"query": "MATCH n WHERE NOT has(n.admin)\nRETURN distinct labels(n) as l", "params": {}})
                .reply(200, {"columns": ["l"], "data": [
                    [
                        ["Rating"]
                    ],
                    [
                        ["Location"]
                    ],
                    [
                        ["Account"]
                    ],
                    [
                        ["Party"]
                    ],
                    [
                        ["Query"]
                    ],
                    [
                        ["Triplet"]
                    ]
                ]})
                .post('/db/data/cypher', {"query": "MATCH (n)-[r]-(m)\nWHERE NOT has(r.admin)\nRETURN distinct type(r) as r", "params": {}})
                .reply(200, {"columns": ["r"], "data": [
                    ["ON"],
                    ["HAS_RATING"],
                    ["LOCATED_IN"],
                    ["OWNS"],
                    ["COMPRISED_OF"]
                ]});
        });

        it('Should respond with a JSON 200 response', function (done) {
            request(app)
                .get('/api/metaData')
                .expect(200)
                .end(function (err, res) {
                    scope.done();
                    done();
                });
        });

        it('Should respond with a valid metadata response and be parse-able', function(done) {
            request(app)
                .get('/api/metaData')
                .expect(200)
                .end(function (err, res) {
                    _.contains(res.body.labels.columns, 'l').should.equal(true);
                    _.contains(_.flatten(res.body.labels.data),'Rating').should.equal(true);
                    _.contains(_.flatten(res.body.labels.data),'Location').should.equal(true);
                    _.contains(_.flatten(res.body.labels.data),'Account').should.equal(true);
                    _.contains(_.flatten(res.body.labels.data),'Party').should.equal(true);
                    done();
                });
        });
    });

    describe('POST /api/authenticate', function() {
        var scope = nock('http://162.243.169.45:7474')
            .post('/db/data/cypher', {"query":"MATCH (user:AdminUser { name: {userName} })\nRETURN user","params":{"userName":"Al"}})
            .reply(200, {"columns":["user"],"data":[[{"data":{"password":"$2a$10$yFgDvzRz20/MhtgnxelJveTaHgTkIHmOIUQT9E6ahHCE4b.YzklyK","admin":"true","name":"Al"}}]]})

        it('Should authenticate with a sample password and salt', function(done) {
            request(app)
                .post('/api/authenticate')
                .send({usernameInput: 'Al', passwordInput: 'blah'})
                .expect(200)
                .end(function (err, res) {
                    res.body.authenticated.should.equal(true);
                    res.body.user.should.equal("Al");
                    scope.done();
                    done();
                });
        });
    });

//    describe('GET /api/savedQueries', function() {
//        it('Should return a valid list of saved queries from the DB', function(done) {
//            '1'.should.not.equal('1');
//        });
//    });
//
//    describe('POST /api/saveQuery', function() {
//        it('Should save a query in the DB successfully', function(done) {
//            '1'.should.not.equal('1');
//        });
//    });
});



