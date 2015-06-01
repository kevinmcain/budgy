var jsonData;
$(function () {

    $('#login-form-link').click(function (e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    loadJSON(function (response) {
        // Parse JSON string into object
        jsonData = JSON.parse(response);
    });
});

$(document).ready(function(){

    $('.popup').popover();

    $('.popup').on('click', function (e) {
        $('.popup').not(this).popover('hide');
    });
});

$('a[rel=popover]').popover({
    html: 'true',
    placement: 'right'
})

$('a[rel=popover1]').popover({
    html: 'true',
    placement: 'left'
})

function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'json/document.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


function validate() {
    //Check to see if jsonData contains the username and password that user has provided.
    var username = $("#username").val();
    var password = $("#password").val();

    var result = $.grep(jsonData, function (e) {
        return e.username == username && e.password == password;
    });

    if (result.length == 1) {
        $("#loginPage").hide();
        $("#afterLogin").show();
    }
}

function homePage() {
    $("#afterLogin").hide();
    $("#afterLogin").show();
}

function manageEnvelopes()
{
    $("#afterLogin").hide();
    $("#manageEnvelope").show();
}

function manageEnvelopes2()
{
    $("#manageEnvelope").hide();
    $("#manageEnvelope").show();
}

function envelopebacktoHome()
{
    $("#manageEnvelope").hide();
    $("#afterLogin").show();
}

function manageTransactions()
{
    $("#afterLogin").hide();
    $("#transactions").show();
}

function envelopestoTransactions()
{
    $("#manageEnvelope").hide();
    $("#transactions").show();
}

function transactionsbacktoHome()
{
    $("#transactions").hide();
    $("#afterLogin").show();
}

function transactionstoEnvelopes()
{
    $("#transactions").hide();
    $("#manageEnvelope").show();
}

function homelogout()
{
    $("#afterLogin").hide();
    $("#loginPage").show();
}

function envelopelogout()
{
    $("#manageEnvelope").hide();
    $("#loginPage").show();
}

function transactionlogout()
{
    $("#transactions").hide();
    $("#loginPage").show();
}