/*
 * JWARN FUNCTIONS
 */
/* global tempType, defaultSettings */

function tempTypeAddJwarnF() {
    document.getElementById("air-temp").min = 30;
    document.getElementById("air-temp").max = 130;
    var value = document.getElementById("air-temp").value;
    value = (value * 1.8) + 32;
    document.getElementById("air-temp").value = value;
}
function tempTypeAddJwarnC() {
    document.getElementById("air-temp").min = -1.11;
    document.getElementById("air-temp").max = 54.44;
    if (defaultSettings === false) {
        var value = document.getElementById("air-temp").value;
        value = (value - 32) * 5 / 9;
        document.getElementById("air-temp").value = value;
    }
}
/*Function which is called when the user clicks submit. All information
 * is passed into an array. Then the function checks if global variable 
 * F is selected. If so, it converts item values from Farenheit to Celsius.
 * If validationSubmit returns no errors, sendInformation() is called which 
 * passes the array and the model name to the function. Otherwise, any previous
 * server response on the page is removed*/
function passValueJWARN() {
    errors = 0;
    var array = [document.getElementById("air-temp").value,
        document.getElementById("rel-hum").value,
        document.getElementById("ws").value,
        document.getElementById("sun").value,
        document.getElementById("alt").value,
        document.getElementById("wrk-rate").value,
        0, //Work extn, zero by default in HSDA 2004 interface
        document.getElementById("accl").value,
        document.getElementById("hydr").value,
        document.getElementById("height").value,
        document.getElementById("weight").value
    ];
    if (tempType === "F") {
        array[0] = (array[0] - 32) * 5 / 9;
    }
    validationSubmit(array);
    if (errors === 0) {
        sendInformation(array, "jwarn");
    } else {
        document.getElementById("ServerResponse").innerHTML = "";
        console.log("The number of errors was: " + errors);
    }

}