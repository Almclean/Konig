/**
 * Created by almclean on 12/07/2014.
 */
"use strict";
/*jshint jquery: true */

$(function () {
    // Populate the drag drop area with it

    // Make query sentence a drag target
    $(".entityConnect").sortable();

    function createElement(value, listId, connector) {
        var elem = ["<li class=\"list-group-item ui-state-default\" id=\"drag-list\">",
            value,
            "</li>"
        ].join('');

        $(listId).append(elem).sortable({
            connectWith: ".entityConnect",
            helper: "clone",
            dropOnEmpty: true
        });
    }

    $.getJSON('/api/metaData', function (data) {
        var labels = data.labels,
            relationshipTypes = data.relationships;
        // Populate the nodeTypes
        $.each(labels, function (index, value) {
            createElement(value, "#nodeTypeList", ".nodeConnect");
        });
        // Populate the relationships
        $.each(relationshipTypes, function (index, value) {
            createElement(value, "#relationshipList", ".relationConnect");
        });

    });

    $('#executeQuery').on('click', function (event) {
        event.preventDefault();
        $.post('/api/nodeQuery', $('#query').serialize(), function (data) {
            console.log(data);
        });
    });
});