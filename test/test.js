/*jslint node: true */

var nock = require('nock');
var request = require('supertest');
var app = require('../app');
var should = require("should");

describe('API Tests', function () {
    "use strict";
    describe('GET /metadata', function () {
        nock.recorder.rec();
        var dbScope = nock('http://162.243.169.45:7474')
            .log(console.log)
            .get('/db/data/').times(3);

        it('Should respond with a JSON 200 response', function (done) {
            request(app)
                .get('/api/metaData')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    dbScope.done();
                    done();
                });
        });
    });
});



