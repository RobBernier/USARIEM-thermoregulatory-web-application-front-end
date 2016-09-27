/*
 * TIMESERIES FUNCTIONS
 */
/* global tempType, defaultSettings */

function tempTypeAddTimeseriesF() {
    document.getElementById("air-temp").min = 30;
    document.getElementById("air-temp").max = 130;
    var value = document.getElementById("air-temp").value;
    value = (value * 1.8) + 32;
    document.getElementById("air-temp").value = value;
    document.getElementById("init-core-temp").min = 30;
    document.getElementById("init-core-temp").max = 130;
    var value = document.getElementById("init-core-temp").value;
    value = (value * 1.8) + 32;
    document.getElementById("init-core-temp").value = value;
}
function tempTypeAddTimeseriesC() {
    document.getElementById("air-temp").min = -1.11;
    document.getElementById("air-temp").max = 54.44;
    document.getElementById("init-core-temp").min = 0;
    document.getElementById("init-core-temp").max = 100;
    if (defaultSettings === false) {
        var value = document.getElementById("air-temp").value;
        value = (value - 32) * 5 / 9;
        document.getElementById("air-temp").value = value;

        var value = document.getElementById("init-core-temp").value;
        value = (value - 32) * 5 / 9;
        document.getElementById("init-core-temp").value = value;
    }
}

function validationSteps(idToValidate) {

    var init = document.getElementById("init-time-step");
    var final = document.getElementById("final-time-step");
    var stepRes = document.getElementById("step");
    console.log(idToValidate);
    //Remove all errors from time step fields 
    var errorMessageTag = init.nextElementSibling;
    errorMessageTag.innerHTML = "";
    errorMessageTag = final.nextElementSibling;
    errorMessageTag.innerHTML = "";
    errorMessageTag = stepRes.nextElementSibling;
    errorMessageTag.innerHTML = "";

    if (idToValidate === "init-time-step") {
        
        errorMessageTag = init.nextElementSibling;//determine location of error element
        if (init.value < 0) {
            errorMessageTag.innerHTML = "init < 0";
        }
        //Written to correct form validation issue involving error message 
        //being printed in cases of valid step resolution value
        var m = final.value - init.value;
        var my_bool;
        if (m < 0) {
            my_bool = true;
        } else {
            false;
        }
        if (my_bool === true) {
            errorMessageTag.innerHTML = "init > final";
        }
        if(isNaN(init.value)){
           errorMessageTag.innerHTML = "init is not a number";
        }
        if (final.value < parseFloat(init.value) + parseFloat(stepRes.value)) {
            errorMessageTag = final.nextElementSibling;
            errorMessageTag.innerHTML = "Final < init + stepres";
        }
    }
    if (idToValidate === "final-time-step") {
        errorMessageTag = final.nextElementSibling;//determine location of error element

        if (final.value < 1) {
            errorMessageTag.innerHTML = "Final < 1";
        }
        if (final.value < init.value) {
            errorMessageTag.innerHTML = "Final < init";
        }
        if (final.value < parseFloat(init.value) + parseFloat(stepRes.value)) {
            errorMessageTag.innerHTML = "Final < init + stepres";
        }
        if(isNaN(final.value)){
           errorMessageTag.innerHTML = "init is not a number";
        }
    }
    if (idToValidate === "step") {
        errorMessageTag = stepRes.nextElementSibling;//determine location of error element
        if (stepRes.value < 1) {
            errorMessageTag.innerHTML = "stepRes < 1";
            console.log("error");
        }
        if (stepRes.value > final.value) {
            errorMessageTag.innerHTML = "stepRes > final";
        }
        if(isNaN(stepRes.value)){
           errorMessageTag.innerHTML = "init is not a number";
        }
        if (final.value < parseFloat(init.value) + parseFloat(stepRes.value)) {
            errorMessageTag = final.nextElementSibling;
            errorMessageTag.innerHTML = "Final < init + stepres";
        }
    }
}

/*Function which is called when the user clicks submit. All information
 * is passed into an array. Then the function checks if global variable 
 * F is selected. If so, it converts item values from Farenheit to Celsius.
 * If validationSubmit returns no errors, sendInformation() is called which 
 * passes the array and the model name to the function. Otherwise, any previous
 * server response on the page is removed*/
function passValueTimeSeries() {
    errors = 0;
    var array = [document.getElementById("air-temp").value,
        document.getElementById("rel-hum").value,
        document.getElementById("ws").value,
        document.getElementById("sun").value,
        document.getElementById("alt").value,
        document.getElementById("wrk-rate").value,
        0, //0 by default in HSDA 2004 Interface
        document.getElementById("accl").value,
        document.getElementById("hydr").value,
        document.getElementById("height").value,
        document.getElementById("weight").value,
        document.getElementById("init-core-temp").value,
        document.getElementById("init-time-step").value,
        document.getElementById("final-time-step").value,
        document.getElementById("step").value
    ];
    if (tempType === "F") {
        array[0] = (array[0] - 32) * 5 / 9;
        array[11] = (array[11] - 32) * 5 / 9;
    }
    validationSubmit(array);
    if (errors === 0) {
        sendInformation(array, "timeseries");
    } else {
        document.getElementById("ServerResponse").innerHTML = "";
        console.log("The number of errors was: " + errors);
    }
}
