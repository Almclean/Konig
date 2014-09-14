/**
 * Created by Ivan O'Mahony on 9/14/2014.
 */
"use strict";
var GraphTransformerError = require('./graphTransformerError');
var logger = require('winston');

// This represents the server side functions to transform the client side graph (d3 node / links) to the server side
// model
function GraphTransformer() {
}
// Given a server graph transform it into a client side graph, see tests for sample data sets
GraphTransformer.prototype.toClientGraph = function (data) {
    if (typeof data === 'undefined' || data === "") {
        logger.error("toClientGraph: Triplets not defined");
        throw new GraphTransformerError("toClientGraph: Triplets not defined");
    }
    var nodes = {};
    // Create node list, this should be a unique set
    for (var i = 0; i < data.triplets.length; i++) {
        nodes[data.triplets[i][0].source.url] = data.triplets[i][0].source;
        nodes[data.triplets[i][2].target.url] = data.triplets[i][2].target;
    }
    var uniqueNodes = [];
    for (var key in nodes) {
        uniqueNodes.push({"name": nodes[key].data.name, "group": nodes[key].label, "url": nodes[key].url});
    }
    var links = [];
    // Loop relationships next
    for (var j = 0; j < data.triplets.length; j++) {
        var srcIndex = indexOfNode(uniqueNodes, data.triplets[j][0].source.url);
        var targetIndex = indexOfNode(uniqueNodes, data.triplets[j][2].target.url);
        links.push({"source": srcIndex, "target": targetIndex, "value": 1, "url": data.triplets[j][1].relationship.url});
    }
    return {"nodes": uniqueNodes, "links": links};
};

function indexOfNode(nodes, value) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].url == value) {
            return i;
        }
    }
}

module.exports = GraphTransformer;