// Require Module
const mysql = require('mysql');

// Open Login/Registration on App Load
$(window).on('load', function() {
    $('#loginRegistrationModal').modal('show');
    $('#loginRegistrationModal').on('hidden.bs.modal', function () {
        $("#logo-container").css("display", "flex");
    });    
});

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
    console.log("Database Connected Succesfully!!");
});

// Validate Email on input Event
document.getElementById("registerEmail").addEventListener("input", () => {    
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

// Submit Registration Form Event
document.getElementById("submitRegistration").addEventListener("click", () => {
    if(checkForm() == true){
        let registerEmail = document.getElementById('registerEmail').value;
        // Check if user already exist
        $selectQuery = `SELECT * FROM ${process.env.dbName}.${dbTableUsers} WHERE users_email = '${registerEmail}'`;
        conn.query($selectQuery, (err, results, fields) => {
            if(err) throw err;
            if(results && results.length){
                const NOTIFICATION_TITLE = 'Registration Failed!!!';
                const NOTIFICATION_BODY = `${registerEmail} already exist! Click to register!`;

                new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
                .onclick = () => {
                    document.getElementById("registrationForm").reset();
                    conn.end(() => {console.log("Database Connection Closed!");});
                };
            }else{
                register();
            }        
        });
    }else{
        console.log("Please fill out the required fields!!!");
    }    
});

// Clear Registration Form Event
document.getElementById("clearRegistration").addEventListener("click", () => {
    document.getElementById("registrationForm").reset();
    $("#registerEmail").css("border-color", "#ccc");
    $("#submitRegistration").prop("disabled", true);
});

// Registration Function
function register(){
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
        
    });
}

// Check if form input has value
function checkForm(){
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

// Validate Email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}