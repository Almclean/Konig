/*jshint jquery: true */
// Event Handlers
$(function () {
    "use strict";

    var interval = 2000;

    function pingBaseUrlMetadata() {
        var uptimePingRequest = $.get('/api/metaData');
        console.log('Value of interval is now : ' + interval);
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
            if ($('#srvStatus').hasClass('label-success')) {
                $('#srvStatus')
                    .removeClass('label-success')
                    .addClass('label-danger')
                    .text('No Connection');
            }
        });
    }

    // Ping the base url for connectivity.
    setInterval(pingBaseUrlMetadata, interval);

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