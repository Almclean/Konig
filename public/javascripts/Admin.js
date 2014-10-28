/*jshint jquery: true */
// Event Handlers
$(function () {
    "use strict";

    var interval = 10000;

    function pingBaseUrlMetadata() {
        var uptimePingRequest = $.get('/api/metaData');
        console.log('Value of interval is now : ' + interval);
        uptimePingRequest.success(function (data) {
            if ($('#srvStatus').hasClass('label-danger')) {
                $('#srvStatus')
                    .removeClass('label-danger')
                    .addClass('label-success')
                    .text('Connection Ok');
                $('#connectionString')
                    .text(data.connectionString);
            }
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
    setInterval(pingBaseUrlMetadata , interval);
});