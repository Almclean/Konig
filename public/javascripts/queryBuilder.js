/**
 * Created by almclean on 12/07/2014.
 */
"use strict";
/*jshint jquery: true */

$(function () {
    // On page load.

    // Pull in the metadata
    // Populate the drag drop area with it

    $.getJSON('/api/metaData', function(data) {
        var dataObj = JSON.parse(data);

        var labels = dataObj.labels,
            relationshipTypes = dataObj.relationships,
            indexes = dataObj.indexes;




    });
});