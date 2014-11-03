/**
 * Created by Ivan on 8/16/2014.
 */

$(function () {

    // TODO Should we try load all queries here. This affect search in that in the search box we could just load the
    // list for the already loaded queries. However will that end up being a lot of data in the client?
    var queries = {};
    $.post("/api/savedQueries", {limit: 10}, function (data) {
        if (data) {
            $.each(data, function (index, value) {
                queries[value.url] = value;
            });
        }
    });

    $("#queries").on("click", function (event) {
        event.preventDefault();
        $("#recentQueries").empty();
        Object.keys(queries).forEach(function (key) {
            createQueryListItem(queries[key].queryTitle, key, "#recentQueries");
        });
    });

    function createQueryListItem(title, id, listId) {
        var elem = ["<li id=\"" + id + "\" class=\"queryItem\"><h4><span class= \"label label-primary\">" + title + "</span></h4></li`>"
        ].join("");
        $(listId).append(elem);
    }

    $("#frmSearch").on("submit", function (event) {
        event.preventDefault();
        $.post("/api/loadByTitleFuzzy", $("#frmSearch").serialize(), function (data) {
            if (data) {
                $("#searchResults").empty();
                $.each(data, function (index, value) {
                    createQueryListItem(value.queryTitle, value.url, "#searchResults");
                });
            }
        });
    });

    $("#recentQueries").on("click", "li.queryItem", function (event) {
        event.preventDefault();
        var qry = queries[$(this)[0].id];
        $("#qTitle").val(qry.queryTitle);
        $("#qVersion").val(qry.queryVersion);
        $("#qText").val(qry.queryText);
        $("#qtSrc").val(qry.triplets[0].source);
        $("#qtSrcFlt").val(qry.triplets[0].sourceConstraint);
        $("#qtRel").val(qry.triplets[0].relationship);
        $("#qtRelFlt").val(qry.triplets[0].relationshipConstraint);
        $("#qtTrg").val(qry.triplets[0].target);
        $("#qtTrgFlt").val(qry.triplets[0].targetConstraint);
        $.post("/api/nodeQuery", {queryText: qry.queryText}, function (data) {
            $("#graph").empty();
            if (!data || data.nodes.length == 0) {
                $("#graph").append("<p>No Results returned for that Query !</p>");
            } else {
                var color = d3.scale.category20();

                var graphWidth = $("#graph").width() - 15,
                    graphHeight = (graphWidth / 2) - 15;

                var force = d3.layout.force()
                    .charge(-100)
                    .linkDistance(150)
                    .size([graphWidth, graphHeight]);

                var svg = d3.select("#graph").append("svg")
                    .attr("width", graphWidth)
                    .attr("height", graphHeight);

                drawGraph(color, force, svg, data);
            }
        });
    });

    function drawGraph(color, force, svg, graph) {
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
    }

    function drawGraphDefaults() {
        var data = {
            "nodes": [
                {"name": "Konig", "group": 1},
                {"name": "Awesome", "group": 2}
            ],
            "links": [
                {"source": 0, "target": 1, "value": 8}
            ]
        };
        var color = d3.scale.category20();

        var graphWidth = $("#graph").width() - 5,
            graphHeight = (graphWidth / 2) - 5;

        var force = d3.layout.force()
            .charge(-100)
            .linkDistance(150)
            .size([graphWidth, graphHeight]);

        var svg = d3.select("#graph").append("svg")
            .attr("width", graphWidth)
            .attr("height", graphHeight);
        drawGraph(color, force, svg, data);
    }

    drawGraphDefaults();
});
