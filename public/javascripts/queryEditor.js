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
            createQueryListItem(value.queryTitle, value.queryVersion, value.queryText, "#savedQueriesTable");
        });

    });

    function createQueryListItem(title, version, text, tblId) {
        var elem = ["<tr><td>" + title + "</td>",
                "<td>" + version + "</td>",
                "<td>" + text + "</td></tr>"
        ].join('');

        $(tblId).append(elem);
    }

    // TODO Edit button to load div to allow you to edit query

    // TODO Save button in Edit div to save changes made to query

    // TODO Execute button to test query work

    // TODO Div to show saved result
});
