// Event Handlers
$(function () {
    "use strict";

    var neoBaseUrl = "http://localhost:7474/db/data/";

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

    }, 30000);

    $('#signIn').on('submit', function (event) {
        event.preventDefault();
        $.post('/authenticate', $('#signIn').serialize(), function (data) {
            if (data.authenticated === true) {
                $('#usernameInput').css('visibility', 'hidden');
                $('#passwordInput').css('visibility', 'hidden');
                $('#btnSignIn').text('Log Out');
                $('#welcome').text('Welcome ' + data.user);
            }
        });
    });
});