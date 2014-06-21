
// Event Handlers
$(function () {
    var neoBaseUrl = "http://localhost:7474/db/data/";

    // Ping the base url for connectivity.
    setInterval(function() {
        var uptimePingRequest = $.get(neoBaseUrl);

        uptimePingRequest.success(function() {
            if ($('#srvStatus').hasClass('label-danger')) {
                console.log('DB Connection Ok');
                $('#srvStatus')
                    .removeClass('label-danger')
                    .addClass('label-success')
                    .text('Connection Ok');
            }
        });

        uptimePingRequest.error(function() {
            "use strict";
            if ($('#srvStatus').hasClass('label-success')) {
                console.log('DB Connection Failure');
                $('#srvStatus')
                    .removeClass('label-success')
                    .addClass('label-danger')
                    .text('No Connection');
            }
        });

    }, 2000);

});