function validate_cookie() {

    // Prevent the reload from happening
    // IF ctrl + r is pressed, the cookie will be checked and the page will reload

    // 
    

    $('#loginModal').modal({
        backdrop: 'static',
        keyboard: false
    });
    
    
    $('#campus').select2({
        placeholder: 'Select a campus',
        theme: 'bootstrap4',
        dropdownParent: $('#loginModal')
    });
    
    
    session_id = localStorage.getItem('sessionID');
    // Check for cookie
    if (!session_id) {    

        $('#loginModal').modal('show');
    }


    $.ajax({
        url: 'https://onsite.gyc.tas.edu.au/i.php',
        type: 'POST',
        data: { 'session_id': session_id },
        // if there is an error, redirect to login
        error: function (response, error) {
            console.log(`Clean response ${response.responseText}`);
            error = JSON.parse(response.responseText);
            console.log(error);
            $('#loginModal').modal('show');
        },
        success: function (data) {
            // Two responses come through at the same time
            let session_id = data.data;
            console.log(data)
            // Update the session ID cookie
            localStorage.setItem('sessionID', session_id);
        }
    });

    return true;
}
