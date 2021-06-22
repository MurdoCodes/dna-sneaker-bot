// Require Module
const { ipcRenderer } = require('electron')
const path = require('path');
const mysql = require('mysql');
const Swal = require('sweetalert2');
const NOTIFICATION_ICON = path.resolve('src/assets/img/logo.png');

// Mysql Setup
const dbTableUsers = 'users';
var conn = mysql.createConnection({
    host: process.env.dbHost,
    user: process.env.dbUser, 
    password: process.env.dbPass,
    database: process.env.dbName
});
conn.connect((err) => {
    if(err) return console.log(err.stack);
    const NOTIFICATION_TITLE = 'DNA ShoeBot';
    const NOTIFICATION_BODY = `App is now ready to use!`;
    new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY, icon: NOTIFICATION_ICON });
});


$(window).on('load', function() {
    ipcRenderer.send('check-session', { name: 'login' });
    ipcRenderer.on('checksession-response', (event, arg) => {
        if(arg.length){
            $('#loginRegistrationModal').modal('hide');
            $("#logo-container").css("display", "flex");
        }else{
            $('#loginRegistrationModal').modal('show');
            $('#loginRegistrationModal').on('hidden.bs.modal', function () {
                $("#logo-container").css("display", "flex");
            });
        }        
    })

    // $getResult = `SELECT * FROM ${process.env.dbName}.${dbTableUsers} `
});

/**
 * Registration Form and Functions
 */
document.getElementById("registerEmail").addEventListener("input", () => { // Validate Email on Registration
    let email = $("#registerEmail").val();
    let $registerEmail = $("#registerEmail");
    let $submitRegistration = $("#submitRegistration");

    if (validateEmail(email)) {
        $registerEmail.css("border-color", "green");
        $submitRegistration.prop("disabled", false); 
    } else {
        $registerEmail.css("border-color", "red");
        $submitRegistration.prop("disabled", true);
    }
});

document.getElementById("submitRegistration").addEventListener("click", () => { // Submit Registration Form Event
    if(checkForm() == true){
        let registerEmail = document.getElementById('registerEmail').value;
        let registerPassword = document.getElementById('registerPassword').value;
        // Check if user already exist
        $selectQuery = `SELECT * FROM ${process.env.dbName}.${dbTableUsers} WHERE users_email = '${registerEmail}'`;
        conn.query($selectQuery, (err, results, fields) => {
            if(err) throw err;
            if(results && results.length){
                Swal.fire({
                    title: 'Oops... Registration Failed!!!',
                    text: `${registerEmail} already exist! Click to register!`,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Ok!',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        $("#registerEmail").css("border-color", "#ccc");
                        $("#submitRegistration").prop("disabled", true);
                        document.getElementById("registrationForm").reset();
                    }
                  });
            }else{
                register();
            }        
        });
    }
});
document.getElementById("clearRegistration").addEventListener("click", () => { // Clear Registration Form Event
    document.getElementById("registrationForm").reset();
    $("#registerEmail").css("border-color", "#ccc");
    $("#submitRegistration").prop("disabled", true);
});
function register(){ // Registration Function
    let registerTitle = document.getElementById('registerTitle').value;
    let registerName = document.getElementById('registerName').value;
    let registerEmail = document.getElementById('registerEmail').value;
    let registerMobile = document.getElementById('registerMobile').value;
    let registerPassword = document.getElementById('registerPassword').value;

    // Insert user
    $insertQuery = `INSERT INTO ${process.env.dbName}.${dbTableUsers} (users_id, users_title, users_name, users_email, users_mobile, users_password) VALUES ('', '${registerTitle}', '${registerName}', '${registerEmail}', '${registerMobile}', '${registerPassword}')`;
    conn.query($insertQuery, (err, results, fields) => {
        if(err) throw err;
        const NOTIFICATION_TITLE = 'Congratulations!!!';
        const NOTIFICATION_BODY = `You have successfully registered as ${registerName} with the email of ${registerEmail}! Click to continue login!`;

        new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
        .onclick = () => {
            alert("Logged in succesfully!");
            conn.end(() => {console.log("Database Connection Closed!");});
        };

        Swal.fire({
            title: 'Congratulations!',
            text: `You have successfully registered as ${registerName} with the email of ${registerEmail}! Click ok to continue login!`,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok!',
        }).then((result) => {
            if (result.isConfirmed) {
                appLogin(registerEmail, registerPassword);
            }
        });
        
    });
}

/**
 * Login Form and Functions
 */
document.getElementById("loginEmail").addEventListener("input", () => {   // Validate Login Email Address 
    let email = $("#loginEmail").val();
    let $registerEmail = $("#loginEmail");
    let $submitRegistration = $("#loginSubmit");

    if (validateEmail(email)) {
        $registerEmail.css("border-color", "green");
        $submitRegistration.prop("disabled", false); 
    } else {
        $registerEmail.css("border-color", "red");
        $submitRegistration.prop("disabled", true);
    }
});

document.getElementById("loginSubmit").addEventListener('click', (e) => { // Login click Event
    e.preventDefault();
    let email = $("#loginEmail").val();
    let password = $("#loginPassword").val();
    appLogin(email, password);
});

function appLogin(email, password){ // Login Function

    $selectQuery = `SELECT * FROM ${process.env.dbName}.${dbTableUsers} WHERE users_email = '${email}' && users_password = '${password}'`;
    conn.query($selectQuery, (err, results, fields) => {
        if(err) throw err;
        var userEmail = results[0].users_email;
        var userId = results[0].users_id.toString();

        if(results && results.length){
            var cookie = { url: 'https://sneaker-bot.com', name: userEmail, value: userId, session: true, expirationDate: 9999999999999999 }
            ipcRenderer.send('session-message', cookie);
            ipcRenderer.on('session-response', (event, arg) => {
                $('#loginRegistrationModal').modal('hide');
                $updateQuery = `UPDATE ${process.env.dbName}.${dbTableUsers} SET users_status = 'online' WHERE users_id='${userId}'`;
                conn.query($updateQuery, (err, results, fields) => {
                    if(err) throw err;
                })
            })            
        }else{
            Swal.fire({
                title: 'Oops... Login Failed!!!',
                text: `Incorrect email and password!`,
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Ok!',
                }).then((result) => {
                if (result.isConfirmed) {
                    $("#registerEmail").css("border-color", "#ccc");
                    $("#submitRegistration").prop("disabled", true);
                    document.getElementById("registrationForm").reset();
                }
            });
        }        
    });

    
}

/**
 * Logout Function
 */
document.getElementById("logout").addEventListener('click', (e) => { // Logout app, remove session
    ipcRenderer.send('check-session', { name: 'login' });
    ipcRenderer.on('checksession-response', (event, arg) => {
        var userId = arg[0].value
        $updateQuery = `UPDATE ${process.env.dbName}.${dbTableUsers} SET users_status = 'offline' WHERE users_id='${userId}'`;
        conn.query($updateQuery, (err, results, fields) => {
            if(err) throw err;
            if(arg.length){
                ipcRenderer.send('logout-session', { name: 'logout' });
                window.location.href = path.resolve('src/html/index.html');
            }
        })               
    })
})
/**
 * Check Form Value
 * Validate Email Address
 */
function checkForm(){ // Check if form input has value
    let registerTitle = document.getElementById('registerTitle').value;
    let registerName = document.getElementById('registerName').value;
    let registerEmail = document.getElementById('registerEmail').value;
    let registerMobile = document.getElementById('registerMobile').value;
    let registerPassword = document.getElementById('registerPassword').value;

    if (registerTitle == null || registerTitle == "", registerName == null || registerName == "", registerEmail == null || registerEmail == "", registerMobile == null || registerMobile == "", registerPassword == null || registerPassword == "") {
        return false;
    }
    return true;
}
function validateEmail(email) { // Validate Email
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}