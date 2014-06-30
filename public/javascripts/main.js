// Event Handlers
$(function () {
    "use strict";

    var neoBaseUrl = "http://localhost:7474/db/data/";

    // Ping the base url for connectivity.
    setInterval(function () {
        var uptimePingRequest = $.get(neoBaseUrl);

        uptimePingRequest.success(function () {
            if ($('#srvStatus').hasClass('label-danger')) {
                console.log('DB Connection Ok');
                $('#srvStatus')
                    .removeClass('label-danger')
                    .addClass('label-success')
                    .text('Connection Ok');
            }
        });

        uptimePingRequest.error(function () {
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

    $('#btnSignIn').click(function (e) {
        console.log('Login button was clicked. Inputs were User : [' + $('#usernameInput').val() + '] Pwd : [' + $('#passwordInput').val() + ']');
        event.preventDefault();
        // TODO Should we really just submit the form here
        $.post('/authenticate', { name: $('#usernameInput').val(), pwd: $('#passwordInput').val() }, function (data) {
            // Just log for now...
            console.log(JSON.stringify(data));
            if (data.authenticated === true) {
                console.log("Auth!");
                hideElement("usernameInput");
                hideElement("passwordInput");
                hideElement("btnSignIn");
                $('#welcome')
                    .text('Welcome ' + data.user);
            }
        });
        return false;
    });

    function hideElement(input_id) {
        console.log("Hiding Element : " + input_id);
        document.getElementById(input_id).style.visibility = 'hidden';
    }
});