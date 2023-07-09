// Before allowing the page to be accessed, force the user to sign in.
//
// This is done by checking the cookie 'signed_in' and if it is not set, redirect the user to the sign in page.
//
// If the cookie is set, then the user is allowed to access the page.
// Declare the variables
var error = new UIChanger('error');
var success_text = new UIChanger('successmsg');
var siteID = new UIChanger('campus');


function auth(){
    let key = document.getElementById('LoginPassword').value;
    // Make the expiry date 2 years from now
    let expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 2);
    if(!getLocation()) {
        return;
    }

    // Ajax request with a header to send the key
    $.ajax({
        url: 'https://onsitedev.gyc.tas.edu.au/api/2.0/auth.php',
        type: 'GET',
        headers: {
            'API-Key': key
        },
        success: function(result){
            console.log(result);
            if (result.Error){
                // If there is an error, display error for 3 seconds
                error.show();
                // set document text to the error message
                error.setHTML(result.Error);
                // reset to hidden in 3 seconds
                setTimeout(function(){ error.hide(); }, 2500);
            }
            
            if (result.SessionID){
                // If there is no error, set the cookie
                // Save to local storage
                localStorage.setItem('sessionID', result.SessionID);
                // Show the success message and wait 2 seconds before redirecting
                success_text.show();
                // reload
                location.reload();
            }
}
    });
    
}


function getLocation () {
    // SiteID is the selected option value from the dropdown
    let ID = siteID.getValue();
    console.log(ID);
    // If the siteID value == 0, then the user has not selected a site
    if (ID == 0){
        // Show the error message and wait 2 seconds before hiding it
        error.show();
        error.setHTML('Please select a site');
        setTimeout(function(){ error.hide(); }, 2000);
        return false;
    } else {
        // add the site ID to local storage
        localStorage.setItem('siteID', ID);
        localStorage.setItem('siteName', siteID.getOptionText());
        console.log("SiteID:" + localStorage.getItem('siteID'));
        return true;
    }
}
