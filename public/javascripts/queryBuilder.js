/**
 * Created by almclean on 12/07/2014.
 */
"use strict";
/*jshint jquery: true */

$(function () {
    // Populate the drag drop area with it

    function createElement(value, listId) {
        var elem = ["<li class=\"list-group-item\" id=\"drag-list\">",
            value,
            "</li>"
        ].join('');

        $(listId).append(elem).sortable();
    }

    $.getJSON('/api/metaData', function (data) {

        var labels = data.labels,
            relationshipTypes = data.relationships,
            indexes = data.indexes;

        // Populate the nodeTypes
        $.each(labels, function (index, value) {
            createElement(value, "#nodeTypeList");
        });

        // Populate the relationships
        $.each(relationshipTypes, function (index, value) {
            createElement(value, "#relationshipList");
        });
    });
});