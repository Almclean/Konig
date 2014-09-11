/*jslint node: true */
"use strict";

var nock = require('nock');
var request = require('supertest');
var app = require('../app');
var should = require("should");

describe('API Tests', function () {
    describe('GET /metadata', function () {
        var scope = nock('http://162.243.169.45:7474')
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
            '1'.should.not.equal('1');
        });
    });

    describe('GET /api/nodeQuery', function() {
        it('Should respond with a sample nodeset based on a given query', function(done) {
            '1'.should.not.equal('1');
        });
    });

    describe('POST /api/authenticate', function() {
        it('Should authenticate with a sample password and salt', function(done) {
            '1'.should.not.equal('1');
        });
    });

    describe('GET /api/savedQueries', function() {
        it('Should return a valid list of saved queries from the DB', function(done) {
            '1'.should.not.equal('1');
        });
    });

    describe('POST /api/saveQuery', function() {
        it('Should save a query in the DB successfully', function(done) {
            '1'.should.not.equal('1');
        });
    });
});



