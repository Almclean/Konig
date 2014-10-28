/**
 * Created by Ivan O'Mahony on 9/14/2014.
 */
/*jslint node: true */
"use strict";

var GraphTransformer = require('../../server/services/graphTransformer');
var GraphTransformerError = require('../../server/error/graphTransformerError');

describe('graphTransformer', function () {
    describe('#toClientGraph()', function () {
        it('should throw a GraphTransformerError if no data is passed', function () {
            var gt = new GraphTransformer();
            (function () {
                gt.toClientGraph();
            }).should.throw(GraphTransformerError, {message: "toClientGraph: Triplets not defined"});
        });
        it('should throw a GraphTransformerError if an empty string passed', function () {
            var gt = new GraphTransformer();
            (function () {
                gt.toClientGraph("");
            }).should.throw(GraphTransformerError, {message: "toClientGraph: Triplets not defined"});
        });
        it('should process a single valid data', function () {
            var gt = new GraphTransformer();
            var res = gt.toClientGraph(validData);
            res.should.eql(expected);
        });
        it('should process multiple valid datasets', function () {
            var gt = new GraphTransformer();
            var res = gt.toClientGraph(validDataSet);
            res.should.eql(expectedDataSet);
        });
    });
});

var validData = {
    "triplets": [
        [
            {"source": {
                "type": "node",
                "label": "Party",
                "url": "http://162.243.169.45:7474/db/data/node/282",
                "data": {
                    "name": "MS"
                }
            }},
            {"relationship": {
                "type": "relationship",
                "label": "LOCATED_IN",
                "url": "http://162.243.169.45:7474/db/data/relationship/160",
                "data": {
                    "name": "LOCATED_IN"
                }
            }},
            {"target": {
                "type": "node",
                "label": "Location",
                "url": "http://162.243.169.45:7474/db/data/node/158",
                "data": {
                    "name": "Scotland"
                }
            }
            }
        ]
    ]
};

var expected = {"nodes": [
    {"name": "MS", "group": "Party", "url": "http://162.243.169.45:7474/db/data/node/282"},
    {"name": "Scotland", "group": "Location", "url": "http://162.243.169.45:7474/db/data/node/158"}
], "links": [
    {"source": 0, "target": 1, "value": 1, "url": "http://162.243.169.45:7474/db/data/relationship/160"}
]};

var validDataSet = {
    "triplets": [
        [
            {"source": {
                "type": "node",
                "label": "Party",
                "url": "http://162.243.169.45:7474/db/data/node/282",
                "data": {
                    "name": "MS"
                }
            }},
            {"relationship": {
                "type": "relationship",
                "label": "LOCATED_IN",
                "url": "http://162.243.169.45:7474/db/data/relationship/160",
                "data": {
                    "name": "LOCATED_IN"
                }
            }},
            {"target": {
                "type": "node",
                "label": "Location",
                "url": "http://162.243.169.45:7474/db/data/node/158",
                "data": {
                    "name": "Scotland"
                }
            }
            }
        ],
        [
            {"source": {
                "type": "node",
                "label": "Party",
                "url": "http://162.243.169.45:7474/db/data/node/283",
                "data": {
                    "name": "GS"
                }
            }},
            {"relationship": {
                "type": "relationship",
                "label": "LOCATED_IN",
                "url": "http://162.243.169.45:7474/db/data/relationship/161",
                "data": {
                    "name": "LOCATED_IN"
                }
            }},
            {"target": {
                "type": "node",
                "label": "Location",
                "url": "http://162.243.169.45:7474/db/data/node/159",
                "data": {
                    "name": "Ireland"
                }
            }
            }
        ],
        [
            {"source": {
                "type": "node",
                "label": "Party",
                "url": "http://162.243.169.45:7474/db/data/node/284",
                "data": {
                    "name": "JPM"
                }
            }},
            {"relationship": {
                "type": "relationship",
                "label": "LOCATED_IN",
                "url": "http://162.243.169.45:7474/db/data/relationship/164",
                "data": {
                    "name": "LOCATED_IN"
                }
            }},
            {"target": {
                "type": "node",
                "label": "Location",
                "url": "http://162.243.169.45:7474/db/data/node/158",
                "data": {
                    "name": "Scotland"
                }
            }
            }
        ]

    ]
};

var expectedDataSet = {"nodes": [
    {"name": "MS", "group": "Party", "url": "http://162.243.169.45:7474/db/data/node/282"},
    {"name": "Scotland", "group": "Location", "url": "http://162.243.169.45:7474/db/data/node/158"},
    {"name": "GS", "group": "Party", "url": "http://162.243.169.45:7474/db/data/node/283"},
    {"name": "Ireland", "group": "Location", "url": "http://162.243.169.45:7474/db/data/node/159"},
    {"name": "JPM", "group": "Party", "url": "http://162.243.169.45:7474/db/data/node/284"}
], "links": [
    {"source": 0, "target": 1, "value": 1, "url": "http://162.243.169.45:7474/db/data/relationship/160"},
    {"source": 2, "target": 3, "value": 1, "url": "http://162.243.169.45:7474/db/data/relationship/161"},
    {"source": 4, "target": 1, "value": 1, "url": "http://162.243.169.45:7474/db/data/relationship/164"}
]};