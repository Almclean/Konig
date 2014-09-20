/**
 * Created by Ivan on 8/16/2014.
 */

$(function () {
    $.getJSON('/api/savedQueries', function (data) {
        // TODO Render the data some nice way

        //var labels = data.labels;
        // Populate the nodeTypes
        $.each(data, function (index, value) {
            console.log(value);
            createQueryListItem(value.queryTitle, "#recentQueries");
        });

    });

    function createQueryListItem(title, listId) {
        var elem = ["<li>" + title + "</li`>"
        ].join('');
        $(listId).append(elem);
    }

    // TODO Edit button to load div to allow you to edit query

    // TODO Save button in Edit div to save changes made to query

    // TODO Execute button to test query work

    // TODO Div to show saved result

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

    var data = {
        "nodes": [
            {"name": "Myriel", "group": 1},
            {"name": "Napoleon", "group": 2},
            {"name": "Mlle.Baptistine", "group": 3}
        ],
        "links": [
            {"source": 0, "target": 1, "value": 1},
            {"source": 1, "target": 2, "value": 8},
            {"source": 2, "target": 0, "value": 10}
        ]
    };
    drawGraph(data);
});
