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

    }, 30000);

    $('#signIn').on('submit', function (event) {
        event.preventDefault();
        console.info('Submitting Username/Password : ' + $(this).serialize());
        $.post('/authenticate', $('#signIn').serialize(), function (data) {
            console.info('Auth : ' + data.authenticated);
            if (data.authenticated === true) {
                hideElement("usernameInput");
                hideElement("passwordInput");
                $('#btnSignIn').text('Log Out');
                $('#welcome').text('Welcome ' + data.user);
            }
        });
    });

    function hideElement(inputName) {
        console.info("Hiding Element : " + inputName);
        document.getElementsByName(inputName)[0].style.visibility = 'hidden';
    }
});