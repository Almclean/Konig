/**
 * Created by almclean on 12/07/2014.
 */
"use strict";
/*jshint jquery: true */

$(function () {
    // Populate the drag drop area with it

    $.getJSON('/api/metaData', function (data) {

        var labels = data.labels,
            relationshipTypes = data.relationships,
            indexes = data.indexes;

        // Populate the nodeTypes
        $.each(labels, function (index, value) {
            var elem = ["<li class=\"list-group-item\">",
                value,
                "</li>"
            ].join('');

            $("#nodeTypeList").append(elem);
        });

        // Populate the relationships
        $.each(relationshipTypes, function (index, value) {
            var elem = ["<li class=\"list-group-item\">",
                value,
                "</li>"
            ].join('');

            $("#relationshipList").append(elem);
        });
    });
});