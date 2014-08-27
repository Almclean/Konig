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
        $.each(labels, function (index, value) {
            $.each(value, function (index, v) {
                createElement(v, "#nodeTypeList", ".nodeConnect");
            });
        });
        // Populate the relationships
        $.each(relationshipTypes, function (index, value) {
            createElement(value.r, "#relationshipList", ".relationConnect");
        });

    });

    $('#executeQuery').on('click', function (event) {
        event.preventDefault();
        $.post('/api/nodeQuery', createQuery($('#node1List'), $('#rel1List'), $('#node2List')), function (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    console.log(JSON.stringify(data[i]));
                }
            }
        });
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
    function createQuery(fromNode, relationship, toNode) {
        // TODO This will need to loop per row and create query tuples
        var from = fromNode[0].textContent;
        var rel = relationship[0].textContent;
        var to = toNode[0].textContent;
        return {
            "title": "Party by Location",
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
});