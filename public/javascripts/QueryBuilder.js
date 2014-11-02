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
                $(ui.sender).sortable("cancel");
            }
        }
    });

    $.getJSON("/api/metaData", function (data) {
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

    $("#executeQuery").on("click", function (event) {
        event.preventDefault();
        $.post("/api/nodeQuery", createQuery($("#node1List"), $("#rel1List"), $("#node2List"), today()), function (data) {
            if (data && data.nodes.length) {
                console.log(JSON.stringify(data));
                console.log("Result");

                // Graph stuff
                var graphWidth = $("#modalContent").width() - 5,
                    graphHeight = (graphWidth / 2) - 5;

                var color = d3.scale.category20();

                var force = d3.layout.force()
                    .charge(-100)
                    .linkDistance(200)
                    .size([graphWidth, graphHeight]);

                var svg = d3.select("#graph").append("svg")
                    .attr("width", graphWidth)
                    .attr("height", graphHeight);

                drawGraph(color, force, svg, data);
            } else {
                $("#graph").append("<p>No Results returned for that Query !</p>");
            }

        });
    });

    $("#querySave").on("click", function (event) {
        event.preventDefault();
        $.post("/api/saveQuery", createQuery($("#node1List"), $("#rel1List"), $("#node2List"), $("#queryName")[0].value), function (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    console.log(JSON.stringify(data[i]));
                }
            }
        });
        $("#saveQueryModal").modal("hide");
    });

    // Start of functions
    function createElement(value, listId) {
        var elem = ["<li class=\"list-group-item\" id=\"drag-list_" + value + "\">",
            value,
            "</li>"
        ].join("");

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
            "queryText": "MATCH (from:" + from + ")-[rel:" + rel + "]->(to:" + to + ") RETURN from, to, rel, labels(from) as lblFm, labels(to) as lblTo",
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
            dd = "0" + dd
        }
        if (mm < 10) {
            mm = "0" + mm
        }
        return mm + "-" + dd + "-" + now.getFullYear() + "-" + now.getTime();
    }

    var drawGraph = function (color, force, svg, graph) {
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

        var gnodes = svg.selectAll("g.gnode")
            .data(graph.nodes)
            .enter()
            .append("g")
            .classed("gnode", true);

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
                return "translate(" + [d.x, d.y] + ")";
            });
        });
    };
});