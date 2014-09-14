/**
 * Created by almclean on 12/07/2014.
 */
"use strict";
/*jshint jquery: true */

$(function () {
    // Make query sentence a drag target
    $(".entityConnect").sortable({
        receive: function (event, ui) {
            // so if > 1
            if ($(this).children().length > 1) {
                $(ui.sender).sortable('cancel');
            }
        }
    });

    $.getJSON('/api/metaData', function (data) {
        var labels = data.labels,
            relationshipTypes = data.relationships;
        // Populate the nodeTypes
        $.each(labels.data, function (index, value) {
            $.each(value, function (index, v) {
                createElement(v, "#nodeTypeList", ".nodeConnect");
            });
        });
        // Populate the relationships
        $.each(relationshipTypes.data, function (index, value) {
            $.each(value, function (index, v) {
                createElement(v, "#relationshipList", ".relationConnect");
            });

        });

    });

    $('#executeQuery').on('click', function (event) {
        event.preventDefault();
        $.post('/api/nodeQuery', createQuery($('#node1List'), $('#rel1List'), $('#node2List'), today()), function (data) {
            if (data) {
                console.log(JSON.stringify(data));
                console.log("Result");
                $('#graph').show()
                    .css('background-color', 'white')
                    .css('width', '50%')
                    .css('height', '50%');
                drawGraph(data);
            }
        });
    });

    $('#querySave').on('click', function (event) {
        event.preventDefault();
        $.post('/api/saveQuery', createQuery($('#node1List'), $('#rel1List'), $('#node2List'), $('#queryName')[0].value), function (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    console.log(JSON.stringify(data[i]));
                }
            }
        });
        $('#saveQueryModal').modal('hide')
    });

    // Start of functions
    function createElement(value, listId) {
        var elem = ["<li class=\"list-group-item\" id=\"drag-list_" + value + "\">",
            value,
            "</li>"
        ].join('');

        $(listId).append(elem).sortable({
            connectWith: ".entityConnect",
            helper: "clone",
            opacity: 0.6,
            placeholder: "ui-state-highlight",
            dropOnEmpty: true
        });
    }

    // Given 3 lists nodeFrom, relationships and nodeTo create a Query object
    // Simple query to start with just one row of data
    function createQuery(fromNode, relationship, toNode, queryTitle) {
        // TODO This will need to loop per row and create query tuples
        var from = fromNode[0].textContent;
        var rel = relationship[0].textContent;
        var to = toNode[0].textContent;
        return {
            "title": queryTitle,
            "version": 1,
            "queryText": "MATCH (from:" + from + ")-[rel:" + rel + "]->(to:" + to + ") RETURN from, to, rel",
            "triplets": [
                [
                    {
                        "source": {
                            "type": from,
                            "filter": null
                        }
                    },
                    {
                        "relationship": {
                            "type": rel,
                            "filter": null
                        }
                    },
                    {
                        "target": {
                            "type": to,
                            "filter": null
                        }
                    }
                ]
            ]
        };
    }

    function today() {
        var now = new Date();
        var dd = now.getDate();
        var mm = now.getMonth() + 1; //January is 0!
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        return mm + '-' + dd + '-' + now.getFullYear() + '-' + now.getTime();
    }

//    var graph =
//    {
//        "links": [
//            {
//                "source": 0,
//                "target": 1,
//                "url": "http://162.243.169.45:7474/db/data/relationship/160",
//                "value": 1
//            },
//            {
//                "source": 2,
//                "target": 3,
//                "url": "http://162.243.169.45:7474/db/data/relationship/161",
//                "value": 1
//            },
//            {
//                "source": 4,
//                "target": 1,
//                "url": "http://162.243.169.45:7474/db/data/relationship/164",
//                "value": 1
//            }
//        ],
//        "nodes": [
//            {
//                "group": "Party",
//                "name": "MS",
//                "url": "http://162.243.169.45:7474/db/data/node/282"
//            },
//            {
//                "group": "Location",
//                "name": "Scotland",
//                "url": "http://162.243.169.45:7474/db/data/node/158"
//            },
//            {
//                "group": "Party",
//                "name": "GS",
//                "url": "http://162.243.169.45:7474/db/data/node/283"
//            },
//            {
//                "group": "Location",
//                "name": "Ireland",
//                "url": "http://162.243.169.45:7474/db/data/node/159"
//            },
//            {
//                "group": "Party",
//                "name": "JPM",
//                "url": "http://162.243.169.45:7474/db/data/node/284"
//            }
//        ]
//    };

    // Graph stuff
    var width = 960,
        height = 500;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-100)
        .linkDistance(150)
        .size([width, height]);

    var svg = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    var drawGraph = function (graph) {
        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function (d) {
                return Math.sqrt(d.value);
            });

        var gnodes = svg.selectAll('g.gnode')
            .data(graph.nodes)
            .enter()
            .append('g')
            .classed('gnode', true);

        var node = gnodes.append("circle")
            .attr("class", "node")
            .attr("r", 10)
            .style("fill", function (d) {
                return color(d.group);
            })
            .call(force.drag);

        gnodes.append("text")
            .text(function (d) {
                return d.name;
            });

        force.on("tick", function () {
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            gnodes.attr("transform", function (d) {
                return 'translate(' + [d.x, d.y] + ')';
            });
        });
    };
});