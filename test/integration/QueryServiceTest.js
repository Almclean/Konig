/**
 * Created by Ivan O'Mahony on 9/24/2014.
 */
/*jslint node: true */
"use strict";

var nock = require('nock');
var request = require('supertest');
var app = require('../../app');
var should = require("should");
var log = require('winston');
var _ = require('lodash');

describe('Query Service Integration Tests', function () {

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

    describe('POST /api/loadByTitle', function() {
        var scope = nock('http://162.243.169.45:7474')
            .post('/db/data/cypher', {'query':'MATCH (q:Query)-[:COMPRISED_OF]->(t:Triplet)\nWHERE q.title =~ "(?i).*Special.*"\nRETURN q, t'})
            .reply(200, {"columns":["q","t"],"data":[[{"extensions":{},"paged_traverse":"http://162.243.169.45:7474/db/data/node/320/paged/traverse/{returnType}{?pageSize,leaseTime}","labels":"http://162.243.169.45:7474/db/data/node/320/labels","outgoing_relationships":"http://162.243.169.45:7474/db/data/node/320/relationships/out","traverse":"http://162.243.169.45:7474/db/data/node/320/traverse/{returnType}","all_typed_relationships":"http://162.243.169.45:7474/db/data/node/320/relationships/all/{-list|&|types}","property":"http://162.243.169.45:7474/db/data/node/320/properties/{key}","all_relationships":"http://162.243.169.45:7474/db/data/node/320/relationships/all","self":"http://162.243.169.45:7474/db/data/node/320","outgoing_typed_relationships":"http://162.243.169.45:7474/db/data/node/320/relationships/out/{-list|&|types}","properties":"http://162.243.169.45:7474/db/data/node/320/properties","incoming_relationships":"http://162.243.169.45:7474/db/data/node/320/relationships/in","incoming_typed_relationships":"http://162.243.169.45:7474/db/data/node/320/relationships/in/{-list|&|types}","create_relationship":"http://162.243.169.45:7474/db/data/node/320/relationships","data":{"queryText":"MATCH (from:Party)-[rel:HAS_RATING]->(to:Rating) RETURN from, to, rel","version":1,"title":"Ivans special Party - Rel Query"}},{"extensions":{},"paged_traverse":"http://162.243.169.45:7474/db/data/node/321/paged/traverse/{returnType}{?pageSize,leaseTime}","labels":"http://162.243.169.45:7474/db/data/node/321/labels","outgoing_relationships":"http://162.243.169.45:7474/db/data/node/321/relationships/out","traverse":"http://162.243.169.45:7474/db/data/node/321/traverse/{returnType}","all_typed_relationships":"http://162.243.169.45:7474/db/data/node/321/relationships/all/{-list|&|types}","property":"http://162.243.169.45:7474/db/data/node/321/properties/{key}","all_relationships":"http://162.243.169.45:7474/db/data/node/321/relationships/all","self":"http://162.243.169.45:7474/db/data/node/321","outgoing_typed_relationships":"http://162.243.169.45:7474/db/data/node/321/relationships/out/{-list|&|types}","properties":"http://162.243.169.45:7474/db/data/node/321/properties","incoming_relationships":"http://162.243.169.45:7474/db/data/node/321/relationships/in","incoming_typed_relationships":"http://162.243.169.45:7474/db/data/node/321/relationships/in/{-list|&|types}","create_relationship":"http://162.243.169.45:7474/db/data/node/321/relationships","data":{"target":"Rating","sourceConstraint":"","relationship":"HAS_RATING","relConstraint":"","targetConstraint":"","source":"Party"}}],[{"extensions":{},"paged_traverse":"http://162.243.169.45:7474/db/data/node/322/paged/traverse/{returnType}{?pageSize,leaseTime}","labels":"http://162.243.169.45:7474/db/data/node/322/labels","outgoing_relationships":"http://162.243.169.45:7474/db/data/node/322/relationships/out","traverse":"http://162.243.169.45:7474/db/data/node/322/traverse/{returnType}","all_typed_relationships":"http://162.243.169.45:7474/db/data/node/322/relationships/all/{-list|&|types}","property":"http://162.243.169.45:7474/db/data/node/322/properties/{key}","all_relationships":"http://162.243.169.45:7474/db/data/node/322/relationships/all","self":"http://162.243.169.45:7474/db/data/node/322","outgoing_typed_relationships":"http://162.243.169.45:7474/db/data/node/322/relationships/out/{-list|&|types}","properties":"http://162.243.169.45:7474/db/data/node/322/properties","incoming_relationships":"http://162.243.169.45:7474/db/data/node/322/relationships/in","incoming_typed_relationships":"http://162.243.169.45:7474/db/data/node/322/relationships/in/{-list|&|types}","create_relationship":"http://162.243.169.45:7474/db/data/node/322/relationships","data":{"queryText":"MATCH (from:Party)-[rel:HAS_RATING]->(to:Rating) RETURN from, to, rel","version":1,"title":"Al's special query - cos im special"}},{"extensions":{},"paged_traverse":"http://162.243.169.45:7474/db/data/node/323/paged/traverse/{returnType}{?pageSize,leaseTime}","labels":"http://162.243.169.45:7474/db/data/node/323/labels","outgoing_relationships":"http://162.243.169.45:7474/db/data/node/323/relationships/out","traverse":"http://162.243.169.45:7474/db/data/node/323/traverse/{returnType}","all_typed_relationships":"http://162.243.169.45:7474/db/data/node/323/relationships/all/{-list|&|types}","property":"http://162.243.169.45:7474/db/data/node/323/properties/{key}","all_relationships":"http://162.243.169.45:7474/db/data/node/323/relationships/all","self":"http://162.243.169.45:7474/db/data/node/323","outgoing_typed_relationships":"http://162.243.169.45:7474/db/data/node/323/relationships/out/{-list|&|types}","properties":"http://162.243.169.45:7474/db/data/node/323/properties","incoming_relationships":"http://162.243.169.45:7474/db/data/node/323/relationships/in","incoming_typed_relationships":"http://162.243.169.45:7474/db/data/node/323/relationships/in/{-list|&|types}","create_relationship":"http://162.243.169.45:7474/db/data/node/323/relationships","data":{"target":"Rating","sourceConstraint":"","relationship":"HAS_RATING","relConstraint":"","targetConstraint":"","source":"Party"}}]]});

        it('Should find a query via a case in-sensitive search term', function(done) {
            request(app)
                .post('/api/loadByTitle')
                .send({'searchInput': 'Special'})
                .expect(200)
                .end(function (err, res) {
                    console.log("");
                    res.body.length.should.equal(2);
                    res.body[0].queryTitle.should.equal("Ivans special Party - Rel Query");
                    res.body[0].queryVersion.should.equal(1);
                    res.body[0].queryText.should.equal("MATCH (from:Party)-[rel:HAS_RATING]->(to:Rating) RETURN from, to, rel");
                    res.body[1].queryTitle.should.equal("Al's special query - cos im special");
                    res.body[1].queryVersion.should.equal(1);
                    res.body[1].queryText.should.equal("MATCH (from:Party)-[rel:HAS_RATING]->(to:Rating) RETURN from, to, rel");
                    scope.done();
                    done();
                });
        });
    });

});




