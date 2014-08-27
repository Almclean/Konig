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

    function createElement(value, listId, connector) {
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
        var serialized = $('#node1List').sortable('serialize');
        //var serialized1 = $('#rel1List').sortable('serialize');
        //var serialized2 = $('#node2List').sortable('serialize');
        $.post('/api/nodeQuery', serialized, function (data) {
            console.log(data);
        });
    });
});