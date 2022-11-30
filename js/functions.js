// User Selector Options
var user_selector = new UIChanger('user-selector');
var selector = new UIChanger('selector');
var selector_error = new UIChanger('selector_error');

// Student Actions
var student_actions = new UIChanger('student-actions');
// Reason Selector
var reason_selector = new UIChanger('reason-selector');
// Buttons
var submit_btn = new UIChanger('submit_btn');
var next_btn = new UIChanger('next_btn');
var back_btn = new UIChanger('back-arrow');
var yes_btn = new UIChanger('yes_btn');
var no_btn = new UIChanger('no_btn');
// User Details
var user_details = new UIChanger('user-details');

var refresh_btn = new UIChanger('refresh-symbol');

// if onsite cannot be reached, stop loading the page and show the error message
function checkConnectivity(retry) {
    // Check if the server is online
    $.ajax({
        url: 'https://onsitedev.gyc.tas.edu.au/',
        type: 'GET',
        success: function () {
            // If the server is online
            // Show the page
            console.log('Onsite is connected')
            if (retry == true) {
                location.reload();
            }
        }
    }).fail(function () {
        console.log('Onsite is disconnected')
        // Remove the body element
        document.querySelector('body').remove();
        // Create a new body, append it to the html
        let body = document.createElement('body');
        document.querySelector('html').appendChild(body);

        // Create a new div, append it to the body
        let modal = `
        <div class="modal fade" id="connectError" tabindex="-1" role="dialog" aria-labelledby="connectErrorLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="connectErrorLabel">⚠️ Error - Unable to connect ⚠️</h5>
                    </div>
                    <div class="modal-body">
                        <p>OnSite is unable to connect to the server. Please check your internet connection and try again.</p>
                        <p>If the problem persists, please contact the IT department.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="checkConnectivity(true)">Retry</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        body.innerHTML = modal;
        $('#connectError').modal({
            backdrop: 'static',
            keyboard: false
        })
        $('#connectError').modal('show');


        // Prevent escaping the modal
        




    }
    );
}

function student_actions_show(id) {
    // This function returns the values for the student functions
    // Get the student ID
    // Call the API using the student ID
    // Two is usually a Late + signout
    // One can be a signut or a signout

    document.getElementById('spinner').hidden = false;


    $.ajax({
        url: `https://onsitedev.gyc.tas.edu.au/api/2.0/studentactions?id=${id}`,
        method: "GET",
        dataType: "json",
        headers: {
            "session_id": localStorage.getItem('sessionID')
        },
        success: function (result) {
            // If the student has a signout
            // Generate the amount of buttons needed/the function value
            // for loop using length of array
            let options = ''
            for (i = 0; i < result.length; i++) {
                // Generate buttons for each signout
                // remove spacing 
                if (result[i] == 'Sign Out' || 'Sign In') {
                    id_name = result[i].replace(/\s/g, '');
                    options += `<button type="button" class="btn btn-primary btn-lg btn-bounce" id="${id_name}" onclick="UI_selector('${id_name}')">${result[i]}</button>`;
                }

            }
            // Show the buttons
            student_actions.show();
            student_actions.setHTML(options);

            document.getElementById('spinner').hidden = true;

        }, error: function (){
            createLog('student_actions_show() failed')
            selector_error.setHTML('An Error has occured - Student actions could not be loaded <br><br> Refresh the page and try again.')
        }
    });
}

function student() {
    $.ajax({
        url: "https://onsitedev.gyc.tas.edu.au/api/2.0/studentsearch?search=",
        method: "GET",
        headers: {
            "session_id": localStorage.getItem('sessionID')
        },
        dataType: "json",
        success: function (result) {
            // if response code is 401
            // Add options to select
            let options = '';
            // Create a selector
            // Add one empty option to the top of the list
            options += '<option value=""></option>';
            for (let i = 0; i < result.length; i++) {
                fullName = `${result[i].Given1} ${result[i].Given2} ${result[i].Surname}`;
                options += `<option value=${result[i].ID}>${fullName}</option>`;
            }
            // unhide the selector
            // Using new class UI changer
            selector.show();
            selector.setHTML(options);
            $("#selector").select2({
                placeholder: "Select a student",
                theme: "bootstrap4"
            });
        }, 
        error: function(){
            createLog('student() failed')
            selector_error.setHTML('An Error has occured - Students could not be loaded <br> Refresh the page and try again.')

        }
    
    });
}

function UI_selector(bool) {
    // show back

    if (bool == 'SignIn') {
        signin();
    }

    refresh_btn.hide();
    back_btn.show();
    if (bool == 'SignOut') {
        // Hide user selector
        user_selector.hide();
        // Hide Student Options and add the class of d-none
        student_actions.hide();
        student_actions.addClass('d-none');
        // Show Reason Selector
        reason_selector.show();
        // Add back_btn & Submit btn
        submit_btn.show();
        submit_btn.setHTML('Sign Out');
        submit_btn.setFunction("submit('SignOut')");
        back_btn.setFunction("UI_selector(false)");
        // Hide next/no/yes/user_details
        next_btn.hide();
        yes_btn.hide();
        user_details.hide();

        // Clean the URL
        cleanURL();
    } else if (bool == 'signout-complete') {
        user_selector.hide();
        reason_selector.hide();
        next_btn.hide();
        submit_btn.hide();

    } else if (bool == 'Late') {
        student_actions.hide();
        student_actions.addClass('d-none');
        reason_selector.show();
        // Change the function of the submit button
        submit_btn.setFunction("submit('Late')");
        // Show Buttons
        submit_btn.show();
        // Hide user_selector
        user_selector.hide();
        // Change submit text to Late
        submit_btn.setHTML('Late');
    } else { // If false 
        // Show refresh
        refresh_btn.show();
        user_selector.show();
        reason_selector.hide();
        // Hide selector + back_btn
        selector.hide();
        back_btn.hide();
        // Hide Student Actions
        student_actions.hide();
        student_actions.removeClass('d-none');
        // Hide Submit
        submit_btn.hide();

    }

    // If button is clicked then hide the search and show the reasons
    const reasons =
        [
            {
                type: 'SignOut',
                ReasonID: 19,
                Description: "Appointment ",
                DefaultTimeBlocks: 2
            },
            {
                type: 'SignOut',
                ReasonID: 1,
                Description: "Illness ",
                DefaultTimeBlocks: -1
            },
            {
                type: 'SignOut',
                ReasonID: 24,
                Description: "Study Leave ",
                DefaultTimeBlocks: -1
            },
            {
                type: 'SignOut',
                ReasonID: 42,
                Description: "Approved absence - See Office Staff ",
                DefaultTimeBlocks: -1
            },

            {
                type: 'Late',
                ReasonID: 20,
                Description: "Other"
            },
            {
                type: 'Late',
                ReasonID: 21,
                Description: "Personal / Family Issue"
            },
            {
                type: 'Late',
                ReasonID: 22,
                Description: "Slept in"
            },
            {
                type: 'Late',
                ReasonID: 24,
                Description: "Study Leave"
            },
            {
                type: 'Late',
                ReasonID: 23,
                Description: "Transport Issues"
            },
            {
                type: 'Late',
                ReasonID: 19,
                Description: "Appointment"
            }
        ]



    // Add Buttons to select
    let buttons = '';
    for (let i = 0; i < reasons.length; i++) {
        // Only display type that is equal to bool 
        if (reasons[i].type != bool) {
            // Skip the reason
            continue;
        }
        console.table(reasons[i]);
        buttons += '<div class="grid">' + '<input type="radio" class="radiobutton" name="btn_signout" id="btn_' + [i] + '" value="' + reasons[i].ReasonID + '">' + '<label for="btn_' + [i] + '">' + reasons[i].Description + '</label>' + '</div>';
    }

    reason_selector.setHTML(buttons);


    // Only one active button at a time
    const btns = document.querySelectorAll('input[type="radio"]');
    btns.forEach(btn => btn.addEventListener('click', function () {
        btns.forEach(btn => btn.checked = false);
        this.checked = true;
        // Scroll to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
    }
    ));


}

function submit(event) {


    let StudentName = document.getElementById('selector').options[document.getElementById('selector').selectedIndex].text

    if (event == 'SignOut') {
        if (document.querySelector('input[name="btn_signout"]:checked') == null) {
            // unhide reason-check
            document.getElementById('reason-check').hidden = false;
            // Scroll to the top of the page
            window.scrollTo(0, 0);
            // wait 1 second and remove the class
            setTimeout(function () { document.getElementById('reason-check').hidden = true; }, 2000);
            return;
        }

        let ReasonText = document.querySelector('input[name="btn_signout"]:checked').nextElementSibling.innerText.toLowerCase();
        let StudentID = document.getElementById('selector').value;
        let ReasonID = document.querySelector('input[name="btn_signout"]:checked').value

        // Append the details to url
        URLSearch = new URLSearchParams(window.location.search);
        URLSearch.append('studentID', StudentID);
        URLSearch.append('reasonID', ReasonID);
        URLSearch.append('reasonText', ReasonText);
        // Add to the URL without a refresh
        window.history.pushState({}, '', `${window.location.pathname}?${URLSearch.toString()}`);
        // Hide the old buttons
        submit_btn.hide();
        back_btn.setFunction("UI_selector('SignOut')");
        // Hide
        UI_selector('signout-complete');
        // Show the new buttons
        yes_btn.show();
        // Set the text
        const user_entry = document.getElementById('user-details');
        user_entry.hidden = false;
        user_entry.innerHTML = `
    <p>Are you sure you want to sign out <a style="color: blue;">${StudentName}</a> for <a style="color: blue;">${ReasonText}</a>?
    </p>
    `
    }

    if (event == 'Late') {
        if (document.querySelector('input[name="btn_signout"]:checked') == null) {
            // unhide reason-check
            document.getElementById('reason-check').hidden = false;
            // Scroll to the top of the page
            window.scrollTo(0, 0);
            // wait 1 second and remove the class
            setTimeout(function () { document.getElementById('reason-check').hidden = true; }, 2000);
            return;
        }

        let StudentID = document.getElementById('selector').value;
        let ReasonID = document.querySelector('input[name="btn_signout"]:checked').value

        // Append the details to url
        URLSearch = new URLSearchParams(window.location.search);
        URLSearch.append('studentID', StudentID);
        URLSearch.append('reasonID', ReasonID);
        // Add to the URL without a refresh
        window.history.pushState({}, '', `${window.location.pathname}?${URLSearch.toString()}`);
        // Sign In the student


    }


    // Using the URL to get the data
    urlParams = new URLSearchParams(window.location.search);
    StudentID = urlParams.get('studentID');
    ReasonID = urlParams.get('reasonID');
    ReasonText = urlParams.get('reasonText');

    const data = {
        StudentName: StudentName,
        StudentID: StudentID,
        ReasonID: ReasonID,
        ReasonText: ReasonText,
    }


    if (event == 'Late') {
        Late(data);
    }

    // send the data to the signout function
    if (event == true) {
        signout(data, true);
    } else {
        signout(data, false);
    }
}

function cleanURL() {
    // Clean the URL
    window.history.pushState({}, '', `${window.location.pathname}`);
}

function signout(data, event) {

    // Using the passed data as variables
    let StudentName = data.StudentName;
    let StudentID = data.StudentID;
    let ReasonID = data.ReasonID;
    let ReasonText = data.ReasonText;
    let SiteID = localStorage.getItem('siteID');

    if (event == false) { return; }

    success(StudentName, 'signed out');

    if (event == true) {
        // Put request
        $.ajax({
            url: `https://onsitedev.gyc.tas.edu.au/api/2.0/studentsignout?id=${StudentID}&reason=${ReasonID}&reasontext=${ReasonText}&siteid=${SiteID}`,
            method: "GET",
            dataType: "json",
            headers: {
                "session_id": localStorage.getItem('sessionID')
            },
            // log the response
            success: function (result) {
                if (result == true) {
                    // Redirect
                    setTimeout(function () { location.reload() }, 2000);
                } else {
                    // hide the form
                    createLog(result)
                    document.getElementById("success").hidden = true;
                    // show the success message
                    document.getElementById("form").hidden = true;
                    document.getElementById("fail").hidden = false;
                    // set the text 
                    document.getElementById("message-text").innerHTML = `
                    <p> An Error has occured. Please try again Later. </p>`
                    // Redirect to the home page
                    setTimeout(function () { location.reload() }, 2000);
                }
            }
        });
    }
}

function Late(data) {

    // Using the passed data as variables
    let StudentName = data.StudentName;
    let StudentID = data.StudentID;
    let ReasonID = data.ReasonID;

    success(StudentName, 'signed in');

    // Put request
    $.ajax({
        url: `https://onsitedev.gyc.tas.edu.au/api/2.0/studentLate?id=${StudentID}&reason=${ReasonID}`,
        method: "GET",
        dataType: "json",
        headers: {
            "session_id": localStorage.getItem('sessionID')
        },
        // log the response
        success: function (result) {
            if (result == true) {
                // Hide Form
                document.getElementById("form").hidden = true;
                // Show the success message
                document.getElementById("success").hidden = false;
                // Set the text
                document.getElementById("message-text").innerHTML = `
                        <p>Successfully signed in <a style="color: blue;">${StudentName}</a>`
                // Redirect
                setTimeout(function () { location.reload() }, 2000);
            } else {
                console.log(`Would've worked and sent https://onsitedev.gyc.tas.edu.au/api/2.0/studentLate?id=${StudentID}&reason=${ReasonID}`);
                // hide the form
                createLog(result)
                document.getElementById("success").hidden = true;
                document.getElementById("form").hidden = true;
                // show the success message
                document.getElementById("fail").hidden = false;
                // set the text 
                document.getElementById("message-text").innerHTML = `
                        <p> An Error has occured. Please try again Later. </p>`
                // Redirect to the home page
                setTimeout(function () { location.reload() }, 2000);
            }
        }
    });
}

function signin() {
    // Get the student ID
    let StudentID = document.getElementById('selector').value;
    let StudentName = document.getElementById('selector').options[document.getElementById('selector').selectedIndex].text;

    success(StudentName, 'signed in');

    $.ajax({
        url: `https://onsitedev.gyc.tas.edu.au/api/2.0/studentsignin?id=${StudentID}`,
        method: "GET",
        dataType: "json",
        headers: {
            "session_id": localStorage.getItem('sessionID')
        },
        // log the response
        success: function (result) {
            if (result == true) {
                // add directory
                setTimeout(function () { location.reload() }, 3000);
            } else {
                // hide the form
                // disable success message
                // Create a log
                createLog(result)
                document.getElementById("success").hidden = true;
                document.getElementById("form").hidden = true;
                // show the success message
                document.getElementById("fail").hidden = false;
                // set the text 
                document.getElementById("message-text").innerHTML = `
                <p> An Error has occured. Please try again Later. </p>`
                // Redirect to the home page
                setTimeout(function () { location.reload() }, 3000);
            }
        }
    });
}

function success(StudentName, action) {
    // Hide all buttons
    document.getElementById("form").hidden = true;
    // Hide back_btn
    refresh_btn.hide();
    back_btn.hide();
    // Hide refresh_btn
    // scroll to bottom
    window.scrollTo(0, document.body.scrollHeight);
    // show the success message
    document.getElementById("success").hidden = false;
    // change version to grey
    document.querySelector('.footer').style.backgroundColor = 'grey';
    // change background to grey
    document.getElementById("wrapper").style.backgroundColor = "grey";
    // Set the text
    document.getElementById("message-text").innerHTML = `
    <p>Successfully ${action} <a style="color: #00A4E0;">${StudentName}</a>`
}

function createLog(log) {
    // Save the log to local storage
    // local datetime

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let milliseconds = date.getMilliseconds();

    // random number
    // make a random log id

    let datetime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    localStorage.setItem(`log-${datetime}-${milliseconds}`, JSON.stringify(log));
}

function heartBeat() {
    // check if the user is still logged in

    let data = {
        "session_id": localStorage.getItem('sessionID'),
        "sitename": localStorage.getItem('siteName'),
        "version": localStorage.getItem('version'),
        "user_agent": navigator.userAgent,
    }


    $.ajax({
        url: `https://onsitedev.gyc.tas.edu.au/api/2.0/heartbeat.php`,
        method: "POST",
        headers: {
            "session_id": localStorage.getItem('sessionID')
        },
        data: data,
        // console log the response
        success: function (result) {
            console.log(result);
        }, error: function (result) {
            console.log(result);
        }
    });


}
