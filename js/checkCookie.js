function validate_cookie() {
    

    // Prevent reloading
    reload = false;

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

        $('#form').remove();
        $('#loginModal').modal('show');
    }

    if (reload == false) {
        $(document).keydown(function (e) {
            if (e.ctrlKey && e.keyCode == 82) {
                e.preventDefault();
                console.log('Prevented reload');
                return false;
            }
        });
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
            // remove the session ID
            $('#form').remove();
            localStorage.removeItem('sessionID');
        },
        success: function (data) {
            // Two responses come through at the same time
            let session_id = data.data;
            console.log(data)
            // Update the session ID cookie
            reload = true;
            localStorage.setItem('sessionID', session_id);
        }
    });

    return true;
}
