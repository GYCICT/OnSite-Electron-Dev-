function validate_cookie() {
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
        url: 'https://onsitedev.gyc.tas.edu.au/i.php',
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
            console.log(data);
        }
    });

    return true;
}
