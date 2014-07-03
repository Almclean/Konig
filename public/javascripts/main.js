// Event Handlers
$(function () {
    "use strict";

    var neoBaseUrl = "http://localhost:7474/db/data/",
        interval = 2000;

    // Ping the base url for connectivity.
    setInterval(function () {
        var uptimePingRequest = $.get(neoBaseUrl);

        uptimePingRequest.success(function () {
            if ($('#srvStatus').hasClass('label-danger')) {
                $('#srvStatus')
                    .removeClass('label-danger')
                    .addClass('label-success')
                    .text('Connection Ok');
            }
            interval = 30000;
        });

        uptimePingRequest.error(function () {
            "use strict";
            if ($('#srvStatus').hasClass('label-success')) {
                $('#srvStatus')
                    .removeClass('label-success')
                    .addClass('label-danger')
                    .text('No Connection');
            }
        });

    }, interval);

    $('#signIn').on('submit', function (event) {
        event.preventDefault();
        $.post('/authenticate', $('#signIn').serialize(), function (data) {
            if (data.authenticated === true) {
                $('#signIn').fadeOut();
                $('#welcome').text('Welcome ' + data.user);
            }
        });
    });
});