/*jshint jquery: true */
// Event Handlers
$(function () {
    "use strict";
    $("#signIn").on("submit", function (event) {
        event.preventDefault();
        $.post("/api/authenticate", $("#signIn").serialize(), function (data) {
            if (data.authenticated === true) {
                window.location.assign("/home");
            } else {
                $("#btnLogin")
                    .removeClass("btn-success")
                    .addClass("btn-danger");
                $("#lblInfo").text(data.reason);
            }
        });
    });
});