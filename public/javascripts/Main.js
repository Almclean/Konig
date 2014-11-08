/*jshint jquery: true */
// Event Handlers
$(function () {
    "use strict";

    $("#signIn").on("submit", function (event) {
        event.preventDefault();
        $.post("/login", $("#signIn").serialize(), function(data) {
            console.log(data);
        });
    });
});