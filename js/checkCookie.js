function validate_cookie() {
    session_id = localStorage.getItem('sessionID');
    // Check for cookie
    if (!session_id) {
        $('#loginModal').modal({
            backdrop: 'static',
            keyboard: false
        });

        // Create the selector for the siteID dropdown
        $('#campus').select2({
            placeholder: 'Select a campus',
            theme: 'bootstrap4',
            dropdownParent: $('#loginModal')
        });

        // Get the list of sites from the API
        

        $('#loginModal').modal('show');
    }

    $.ajax({
        url: 'https://onsite.gyc.tas.edu.au/i.php',
        type: 'POST',
        data: { 'session_id': session_id },
        // if there is an error, redirect to login
        error: function (response, status, error) {
            console.log(response.responseText);
            error = JSON.parse(response.responseText);
            console.log(error.status);
            $('#loginModal').modal('show');
        },
        success: function (data) {
            // Two responses come through at the same time
            console.log(data);
        }
    });

    return true;
}
