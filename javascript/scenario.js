/*
 * SCENARIO FUNCTIONS
 */
/* global tempType, defaultSettings, notOpen, errors */
var clientsideSavedStep; //Saves the step as a string after requesting from the server
var requestFirstStep = true; //Boolean to determine if the model needs to request the step file from the server
scenarioStepData = new Array(); //used to store user input, which is then printed in the onreadystatechange function within client.js

function tempTypeAddScenarioF() {
    //console.log(document.getElementsByClassName("frame").length);
    if (document.getElementsByClassName("frame").length !== 0) { //determine if all fields
        //initial core temp conversion
        var value = document.getElementById("init-core-temp").value;
        value = (value * 1.8) + 32;
        document.getElementById("init-core-temp").value = parseFloat(value).toFixed(2);
        //Step event air temp conversion
        var stepAirTemp = document.getElementsByClassName("air-temp");
        for (var i = 0; i < stepAirTemp.length; i++) {
            stepAirTemp[i].value = parseFloat((stepAirTemp[i].value * 1.8) + 32).toFixed(2);
        }
        //included in order to change symbol of step events
        var elements = document.getElementsByClassName("tempSymbol");
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = "(F)";
        }
    }

}
function tempTypeAddScenarioC() {
    if (defaultSettings === false) {
//initial core temp conversion
        var value = document.getElementById("init-core-temp").value;
        value = (value - 32) * 5 / 9;
        document.getElementById("init-core-temp").value = parseFloat(value).toFixed(2);
        //Step event air temp conversion
        var stepAirTemp = document.getElementsByClassName("air-temp");
        for (var i = 0; i < stepAirTemp.length; i++) {
            stepAirTemp[i].value = parseFloat((stepAirTemp[i].value - 32) * 5 / 9).toFixed(2);
        }
//included in order to change symbol of step events
        var elements = document.getElementsByClassName("tempSymbol");
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = "(C)";
        }
    }
}

function displayContents(element) {
    var nextElementSibling = element.nextElementSibling;
    var previousElementSibling = element.previousElementSibling;
    if (nextElementSibling.getAttribute("style") === null) {
        nextElementSibling.style.display = 'block';
        element.style.backgroundColor = '#f0aa1e';
        element.style.borderColor = '#f0aa1e';
        if (nextElementSibling.id !== "full-data") {
            nextElementSibling.style.backgroundColor = '#ebedeb';
            nextElementSibling.style.padding = '15px 2.5% 20px 2.5%';
        }
        if (element.className === "step-button") {
            element.style.borderTop = '1px solid grey';
            previousElementSibling.style.borderTop = '1px solid grey';
            previousElementSibling.style.borderBottom = '1px solid #f0aa1e';
            previousElementSibling.style.backgroundColor = '#f0aa1e';
        }
        if (element.className === "activity-button" || element.className === "environment-button" || element.className === "clothing-button") {
            element.style.marginBottom = '0';
            element.style.boxShadow = '2px 0px 1px grey';
            nextElementSibling.style.boxShadow = '2px 2px 1px grey';
            element.style.border = '1px solid grey';
            element.style.backgroundColor = '#ffe1a5';
            element.style.borderRadius = '5px 5px 0 0';
            nextElementSibling.style.borderRadius = '0 0 5px 5px';
            nextElementSibling.style.backgroundColor = '#FFFFFF';
        }
    } else {
        nextElementSibling.removeAttribute("style");
        element.removeAttribute("style");
        if (element.className === "step-button") {
            previousElementSibling.removeAttribute("style");
        }
    }
}
function pandolfMetabolicDisplay(element) {
    if (element.className === "pandolf-button") {
        var nextElementSibling = element.nextElementSibling;
        nextElementSibling = nextElementSibling.nextElementSibling;
        nextElementSibling.style.backgroundColor = "#ebedeb";
        nextElementSibling = nextElementSibling.nextElementSibling;
        element.style.backgroundColor = '#f0aa1e';
        console.log("Pandolf Selected: " + nextElementSibling);
        nextElementSibling.style.display = 'block';
        var metabolicElements = document.getElementsByClassName("metabolic-div").length;
        for (var i = 0; i < metabolicElements; i++) {
            document.getElementsByClassName("metabolic-div")[i].style.display = 'none';
            document.getElementsByClassName("pandolf-div")[i].style.display = 'block';
        }
        element.value = "selected";
    }
    if (element.className === "metabolic-button") {
        var previousElementSibling = element.previousElementSibling;
        previousElementSibling = previousElementSibling.previousElementSibling;
        previousElementSibling.style.backgroundColor = "#ebedeb"; //remove bg color from pandolf
        previousElementSibling.value = "";
        var nextElementSibling = element.nextElementSibling;
        element.style.backgroundColor = '#f0aa1e';
        console.log("Metabolic Selected: " + nextElementSibling);
        nextElementSibling = nextElementSibling.nextElementSibling;
        var metabolicElements = document.getElementsByClassName("metabolic-div").length;
        for (var i = 0; i < metabolicElements; i++) {
            document.getElementsByClassName("metabolic-div")[i].style.display = 'block';
            document.getElementsByClassName("pandolf-div")[i].style.display = 'none';

        }
    }
}
function addStep() {
    /*Executed exclusively once the model has been selected by the user.
     * Makes a request to the server for the body of the step event once.
     * This is done to reduce load time and reduce server requests.
     *
     * For the first step event, a request is made to the server.java file using XMLHttpRequest
     * in order to obtain the scenario-stepevent.html file. The process is as follows:
     * 1. A variable "xhttp" represents XMLHttpRequest object
     * 2. Open method specifies a request to get the step event file
     * 3. The request is sent
     * 4. xhttp then waits for the ready state to be 4 (meaning that the request was successful)
     * 5. The step is then appended to the "frames-container" element
     * 6. "requestFirstStep" is then made false so multiple unnecissary requests for a step aren't made
     *
     */
    var container = document.getElementById("frames-container");
    if (requestFirstStep === true) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "./models/scenario-stepevent.html");
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                container.innerHTML += (this.responseText);
                requestFirstStep = false;
                //included to convert temp on load.
                //Before adding, temperature would not convert.
                if (tempType === "F") {
                    tempTypeAddScenarioF();
                }
                if (defaultSettings === false) {
                    if (tempType === "C") {
                        tempTypeAddScenarioC();
                    }
                }
                defaultSettings = false;
                addStepNumbers();
            }
        };
    } else {
        var LastElement = container.lastElementChild;
        var newStepEvent = LastElement.cloneNode(true);
        /*For IE users: updates new step to reflect dropdown choices from previous step.
         * all future dropdown choices must be added as below in order to correctly
         * display on new step*/
        newStepEvent.getElementsByClassName("grade")[0].value = LastElement.getElementsByClassName("grade")[0].value;
        newStepEvent.getElementsByClassName("terrain")[0].value = LastElement.getElementsByClassName("terrain")[0].value;
        newStepEvent.getElementsByClassName("load")[0].value = LastElement.getElementsByClassName("load")[0].value;
        newStepEvent.getElementsByClassName("hydr")[0].value = LastElement.getElementsByClassName("hydr")[0].value;
        newStepEvent.getElementsByClassName("ws")[0].value = LastElement.getElementsByClassName("ws")[0].value;
        newStepEvent.getElementsByClassName("bgt")[0].value = LastElement.getElementsByClassName("bgt")[0].value;
        newStepEvent.getElementsByClassName("cloth")[0].value = LastElement.getElementsByClassName("cloth")[0].value;
        container.appendChild(newStepEvent);
        addStepNumbers();
    }

}

/*Function called to delete a step within SCENARIO*/
function deleteStep(element) {
    if (document.getElementsByClassName("frame").length > 1) {
        var frame = element.parentElement;
        var frameParent = frame.parentElement;
        frameParent.removeChild(frame);
        addStepNumbers();
    } else {
        document.getElementById("submit-error").innerHTML = "ERROR: NEED TO HAVE AT LEAST ONE STEP";
    }
}
//Called on add or delete of a step. Finds all step-button elements and adds step number to button
function addStepNumbers() {
    var numberOfStepButtonsOnScreen = document.getElementsByClassName('step-button').length;
    for (var i = 0; i < numberOfStepButtonsOnScreen; i++) {
        document.getElementsByClassName('step-button')[i].innerHTML = "STEP EVENT " + parseInt(i + 1);
    }
}

/*Function sends information to the server from the scenario UI*/
function passValueScenario() {
    errors = 0;
    var FrameLength = parseInt(document.getElementsByClassName("frame").length + 1); //where 1 signifies the set of initial values (activity, environment,and clothing), specified within the Initial values tab.
    var scenarioOneTimeValues = []; //array to store all one-time scenario values
    var scenarioStepArray = []; //array that will be used in order to pass all step data to scenario model
    //Check to see if there are more than the maximum number of steps allowed. if so, throw error.
    var numberOfSteps = 0;
    var numStepsArray = new Array();
    for (var i = 0; i < document.getElementsByClassName("duration").length; i++) {
        var durationOfFrame = document.getElementsByClassName("duration")[i].value;
        numStepsArray.push(durationOfFrame);
        numberOfSteps = parseInt(numberOfSteps) + parseInt(durationOfFrame);
    }
//search array for values less than 1. if found, return true
    var foundLessThanOne = false;
    for (var i = 0; i < numStepsArray.length; i++) {
        if (numStepsArray[i] < 1) {
            foundLessThanOne = true;
        }
    }

    if (numberOfSteps > 180 || isNaN(numberOfSteps) === true || foundLessThanOne === true) { //Can only haave a total of three hours (180 minutes) of steps per model run
        if (numberOfSteps > 180) {
            document.getElementById("submit-error").innerHTML = "ERROR: Too Many Steps. Sum of all steps can't be greater than 180 minutes (3 hours)";
        }
        if (isNaN(numberOfSteps) === true) {
            document.getElementById("submit-error").innerHTML = "ERROR: Duration count did not resolve to a number";
        }
        if (foundLessThanOne === true) {
            document.getElementById("submit-error").innerHTML = "ERROR: One or more step durations is less than one";
        }
    } else {
        document.getElementById("submit-error").innerHTML = "";
        //ADD ONE-TIME VALUES TO ARRAY
        var initCoreTemp = document.getElementById("init-core-temp").value;
        if (tempType === "F") {
            initCoreTemp = (initCoreTemp - 32) * 5 / 9;
            scenarioOneTimeValues.push(initCoreTemp);
        }
        if (tempType === "C") {
            scenarioOneTimeValues.push(initCoreTemp);
        }
        scenarioOneTimeValues.push(document.getElementById("accl").value);
        var height = document.getElementById("height").value / 100; //convert height from CM to M
        scenarioOneTimeValues.push(height);
        scenarioOneTimeValues.push(document.getElementById("weight").value);
        scenarioOneTimeValues.push(document.getElementById("pfat").value);
        scenarioOneTimeValues.push(document.getElementById("age").value);
        console.log("One Time Values: " + scenarioOneTimeValues);
        //ADD STEP VALUES TO ARRAY
        document.getElementById("ServerResponse").innerHTML = ""; //clear all output
        for (var frameInQuestion = 0; frameInQuestion < FrameLength; frameInQuestion++) {
            var grade = document.getElementsByClassName("grade")[frameInQuestion].value;
            var terrain = document.getElementsByClassName("terrain")[frameInQuestion].value;
            var load = document.getElementsByClassName("load")[frameInQuestion].value;
            var mRate = document.getElementsByClassName("metabolic")[frameInQuestion].value;
            var speed = document.getElementsByClassName("speed")[frameInQuestion].value;
            var hydr = document.getElementsByClassName("hydr")[frameInQuestion].value;
            var airTemp = document.getElementsByClassName("air-temp")[frameInQuestion].value;
            if (tempType === "F") {
                airTemp = (airTemp - 32) * 5 / 9;
            }
            var relHum = document.getElementsByClassName("rel-hum")[frameInQuestion].value;
            var bgt = parseFloat(document.getElementsByClassName("bgt")[frameInQuestion].value);
            var ws = document.getElementsByClassName("ws")[frameInQuestion].value;
            var cloth = document.getElementsByClassName("cloth")[frameInQuestion].value;
            if (frameInQuestion > 0) {//Checks to see if initial step values have been already passed to array; if frameInQuestion is zero
                var durationOfFrame = document.getElementsByClassName("duration")[frameInQuestion - 1].value;
                for (var i = 0; i < durationOfFrame; i++) {//if so, find duration value and loop step until complete
                    if (document.getElementsByClassName("pandolf-button")[0].value !== "selected") { //If metabolic is selected.
                        scenarioStepArray.push(0);//passes 0,1,0 to model instead of user specified values.
                        scenarioStepArray.push(1);
                        scenarioStepArray.push(0);
                        scenarioStepArray.push(mRate);
                    } else {
                        scenarioStepArray.push(grade);
                        scenarioStepArray.push(terrain);
                        scenarioStepArray.push(load);
                    }
                    scenarioStepArray.push(speed);
                    scenarioStepArray.push(hydr);
                    scenarioStepArray.push(airTemp);
                    scenarioStepArray.push(relHum);
                    scenarioStepArray.push(ws);
                    scenarioStepArray.push(bgt);
                    scenarioStepArray.push(cloth);
                }
            } else {//if not, push first values to array
                if (document.getElementsByClassName("pandolf-button")[0].value !== "selected") { //If metabolic is selected.
                    scenarioStepArray.push(0);//passes 0,1,0 to model instead of user specified values.
                    scenarioStepArray.push(1);
                    scenarioStepArray.push(0);
                    scenarioStepArray.push(mRate);
                } else {
                    scenarioStepArray.push(grade);
                    scenarioStepArray.push(terrain);
                    scenarioStepArray.push(load);
                }
                scenarioStepArray.push(speed);
                scenarioStepArray.push(hydr);
                scenarioStepArray.push(airTemp);
                scenarioStepArray.push(relHum);
                scenarioStepArray.push(ws);
                scenarioStepArray.push(bgt);
                scenarioStepArray.push(cloth);
            }
        }
        console.log("STEP ARRAY OUTPUT: " + scenarioStepArray + " ARRAY LENGTH: " + scenarioStepArray.length);
        var array = scenarioOneTimeValues + "," + scenarioStepArray;
        validationSubmit(array);
        if (errors === 0) {
            scenarioOneTimeData = scenarioOneTimeValues;
            scenarioStepData = scenarioStepArray;
            sendInformation(array, "scenario"); //call handler without metabolic rate
        } else {
            document.getElementById("ServerResponse").innerHTML = "";
            console.log("The number of errors was: " + errors);
        }
    }
}

/*Make input and ouput in a human readible format and print*/
function printInputAndOutput() {
    var string = "<style type='text/css' media='print'>.no-print{display:none;} body{font-size: 1.0em;}.activity-button{display:none;}";
    if (document.getElementById("graph-display-option").checked === false) {
        string += "canvas{display:none;}";
    } else {
        string += "canvas{display:block;}";
    }
    if (document.getElementById("initial-display-option").checked === false) {
        string += "#initial-response-table{display:none;}";
    } else {
        string += "#initial-response-table{display:block;}";
    }
    if (document.getElementById("step-display-option").checked === false) {
        string += "#step-response-table{display:none;}";
    } else {
        string += "#step-response-table{display:block;}#model-output{page-break-before: always;}";
    }
    if (document.getElementById("model-display-option").checked === false) {
        string += "#output-response-table{display:none;}";
    } else {
        string += "#output-response-table{display:block;}";
    }
    if (document.getElementById("key-display-option").checked === false) {
        string += "#key-response-table{display:none;}";
    } else {
        string += "#key-response-table{display:block;}";
    }
    string += "</style>";
    document.getElementsByTagName("head")[0].innerHTML += string;
    window.print();
}

function dataToTable(scenarioOneTimeInput, scenarioStepInput, outputOne, outputTwo) {//Used to print scenario output
    console.log(outputOne.toString());
    console.log(outputTwo.toString());
    //initial value input
    var tableString = "<fieldset style='margin:auto auto 20px auto;'><fieldset class='no-print' style='width:250px;'>\n\
    <table style='margin:0 auto;'><tr><td colspan='2'><h4>Printing Options</h4></td><tr><tr><td><input style='width:auto;'id='graph-display-option' type='checkbox' checked></input></td><td>Print Graphs</td></tr>\n\
    <tr><td><input style='width:auto;' id='initial-display-option' type='checkbox' checked></input></td><td>Print Initial Values</td></tr>\n\
    <tr><td><input style='width:auto;' id='step-display-option' type='checkbox' checked></input></td><td>Print Step Event Data</td></tr>\n\
    <tr><td><input style='width:auto;' id='model-display-option' type='checkbox' checked></input></td><td>Print Model Output</td></tr>\n\
    <tr><td><input style='width:auto;' id='key-display-option' type='checkbox' checked></input></td><td>Print Table Keys</td></tr></table>\n\
    <a style='color:#f0aa1e;' href='#' class='no-print' onclick='printInputAndOutput();'>Print Data Selected</a></fieldset>\n\
    <div id='initial-response-table'><h4 align='center'>Initial Value Input</h4><table border='1px' style='font-size:.6em; margin: 0 auto;'><tr><th>initial core temp (C)</th><th>acclimation*</th><th>height</th><th>weight</th><th>body fat</th><th>age</th></tr><tr>";

    for (var i = 0; i < scenarioOneTimeInput.length; i++) {
        tableString += "<td>" + scenarioOneTimeInput[i] + "</td>";
    }
    tableString += "</tr></table><p style='font-size: .7em'>* see key for details</p></div>";
    //step events
    tableString += "<div id='step-response-table'><h4 align='center'>Step Event Input</h4>";
    if (scenarioStepInput.length % 10 === 0) {
        tableString += "<table border='1px' style='font-size:.6em; margin: 0 auto;'><tr><th></th><th>grade (%)</th><th>terrain</th><th>load (kg)</th>\n\
        <th>speed (km/h)</th><th>hydration*</th><th>air temp (C)</th><th>relative humidity (%)</th>\n\
        <th>wind speed (m/s)</th><th>black globe temp (C)</th><th>cloth*</th>";
        var stepSize = 10;
    }
    if (scenarioStepInput.length % 11 === 0) {
        tableString += "<table border='1px' style='font-size:.6em; margin: 0 auto;'><tr><th></th><th>grade (%)</th><th>terrain</th><th>load (kg)</th>\n\
        <th>metabolic rate (watts)</th><th>speed (km/h)</th><th>hydration*</th><th>air temp (C)</th><th>relative humidity (%)</th>\n\
        <th>wind speed (m/s)</th><th>black globe temp (C)</th><th>cloth*</th>";
        var stepSize = 11;
    }

    var stepCounter = 0;
    var clothingList = new Array();//array of clothing options made. used to dynamically print table key
    for (var i = 0; i < scenarioStepInput.length; i++) {
        var a = parseInt(i + 1);
        if (a % stepSize === 0) { //clothing item
            if (stepCounter !== 0) {
                clothingList.push(scenarioStepInput[parseInt(i)]);
            }
        }
        if (i % stepSize === 0) {
            tableString += "</tr><tr><td>";
            if (stepCounter !== 0) {
                tableString += "STEP " + stepCounter;
            } else {
                tableString += "Initial Values";
            }
            tableString += "</td>";
            stepCounter++;
        }
        tableString += "<td>" + scenarioStepInput[i] + "</td>";
    }
    tableString += "</tr></table><p style='font-size: .7em'>* see key for details</p></div>";
    //core temp output
    tableString += "<div id='output-response-table'><h4 id='model-output' align='center'>Model output</h4><table border='1px' style='font-size:.6em; margin: 0 auto;'><tr><td></td><th>core body temp (C)</th><th>heart rate (bpm)</th></tr>";
    stepCounter = 0;
    for (var i = 0; i < outputOne.length; i++) {
        if (i % 1 === 0) {
            tableString += "</tr><tr><td>";
            if (stepCounter !== 0) {
                tableString += "MINUTE " + stepCounter;
            } else {
                tableString += "Initial Output";
            }
            tableString += "</td>";
            stepCounter++;
        }
        tableString += "<td>" + parseFloat(outputOne[i]).toFixed(1) + "</td><td>" + parseInt(outputTwo[i]) + "</td>";
    }
    tableString += "</tr></table><div id='key-response-table'><h4>Table Key</h4>\n\
    <table border='1px' style='font-size:.6em; margin: 0 auto;'>\n\
    <tr><th>acclimation</th><td>0 = none</td><td>1 = partial</td><td>2 = fully</td></tr>\n\
    <tr><th>hydration</th><td>0 = none</td><td>4.16666 = partial</td><td>8.33333 = fully</td></tr></table><br/>";
    var NewclothingList = new Array();
    console.log("This is the clothing list: " + clothingList);
    //traverse array and remove duplicate numbers
    tableString += "<table border='1px' style='font-size:.6em; margin: 0 auto;'><tr><th colspan='2'>Clothing</th></tr>";
    clothingList.sort();
    //NewclothingList.push(clothingList[0]);

    //0 is impossible value that will be overwritten @ i = 0 in loop below
    var currentClothType = 0;
    for (var i = 0; i < clothingList.length; i++) {

        if (currentClothType !== clothingList[i]){
            NewclothingList.push(clothingList[i]);
            currentClothType = clothingList[i];

        }
        /*
        if (clothingList[i] === clothingList[i+1]) {
            console.log("CURRENT CLOTHING VALUE " + clothingList[i]);
            console.log("NEW CLOTHING VALUE " + clothingList[i+1]);
        } else {
            NewclothingList.push(clothingList[i]);
        }
        */

    }





    for (var i = 0; i < NewclothingList.length; i++) {

        var tempVal = NewclothingList[i];

        switch (tempVal) {
            case "1":
                tableString += "<tr><td>1</td><td>MOPP Level 0 - BDU</td></tr>";
                break;
            case "2":
                tableString += "<tr><td>2</td><td>MOPP Level 1 - BDO [open] over BDU</td></tr>";
                break;
            case "3":
                tableString += "<tr><td>3</td><td>MOPP Level 2 - BDO [open] over BDU + boots</td></tr>";
                break;
            case "4":
                tableString += "<tr><td>4</td><td>MOPP Level 3 - BDO [open] over BDU + boots + mask + hood</td></tr>";
                break;
            case "5":
                tableString += "<tr><td>5</td><td>MOPP Level 4 - BDO [closed] over BDU + boots + mask + hood + gloves</td></tr>";
                break;
            case "6":
                tableString += "<tr><td>6</td><td>Nude  (SHORTS + T-SHIRT)</td></tr>";
                break;
            case "7":
                tableString += "<tr><td>7</td><td>BDU temperate woodland [open]</td></tr>";
                break;
            case "8":
                tableString += "<tr><td>8</td><td>BDU temperate woodland [closed]</td></tr>";
                break;
            case "9":
                tableString += "<tr><td>9</td><td>BDU hot weather woodland</td></tr>";
                break;
            case "10":
                tableString += "<tr><td>10</td><td>Desert Battledress (DBDU) [open]</td></tr>";
                break;
            case "11":
                tableString += "<tr><td>11</td><td>Desert Battledress (DBDU) [closed]</td></tr>";
                break;
            case "12":
                tableString += "<tr><td>12</td><td>DBDU + flak vest [open]</td></tr>";
                break;
            case "13":
                tableString += "<tr><td>13</td><td>DBDU + flak vest [closed]</td></tr>";
                break;
            case "14":
                tableString += "<tr><td>14</td><td>Woodland BDO with DBDU [open]</td></tr>";
                break;
            case "15":
                tableString += "<tr><td>15</td><td>Woodland BDO with DBDU [closed]</td></tr>";
                break;
            case "16":
                tableString += "<tr><td>16</td><td>Battledress Overgarment (BDO) [closed]</td></tr>";
                break;
            case "17":
                tableString += "<tr><td>17</td><td>Battledress Overgarment (BDO) [open] [zipped]</td></tr>";
                break;
            case "18":
                tableString += "<tr><td>18</td><td>Battledress Overgarment (BDO) [open] [unzipped]</td></tr>";
                break;
            case "19":
                tableString += "<tr><td>19</td><td>BDO + WBDU + flak vest [closed] impermable hood</td></tr>";
                break;
            case "20":
                tableString += "<tr><td>20</td><td>Combat Vehicle Crewman (CVC) alone [open]</td></tr>";
                break;
            case "21":
                tableString += "<tr><td>21</td><td>Combat Vehicle Crewman (CVC) alone [closed]</td></tr>";
                break;
            case "22":
                tableString += "<tr><td>22</td><td>Saratoga Overgarment {USMC} [open]</td></tr>";
                break;
            case "23":
                tableString += "<tr><td>23</td><td>Saratoga Overgarment {USMC} [closed]</td></tr>";
                break;
            case "24":
                tableString += "<tr><td>24</td><td>Saratoga Overgarment with DBDU {USMC} [open]</td></tr>";
                break;
            case "25":
                tableString += "<tr><td>25</td><td>Saratoga Overgarment with DBDU {USMC} [closed]</td></tr>";
                break;
            case "26":
                tableString += "<tr><td>26</td><td>Air Force Flight Suite alone [open]</td></tr>";
                break;
            case "27":
                tableString += "<tr><td>27</td><td>Air Force Flight Suite alone [closed]</td></tr>";
                break;
            case "28":
                tableString += "<tr><td>28</td><td>Air Force PBI Saratogo Suite alone [open]</td></tr>";
                break;
            case "29":
                tableString += "<tr><td>29</td><td>Air Force PBI Saratogo Suite alone [closed]</td></tr>";
                break;
            case "30":
                tableString += "<tr><td>30</td><td>ECWCS complete system</td></tr>";
                break;
            case "31":
                tableString += "<tr><td>31</td><td>BDU wet weather + parka + trousers [open]</td></tr>";
                break;
            case "32":
                tableString += "<tr><td>32</td><td>Desert BDU (DBDU) wet + parka + trousers [open]</td></tr>";
                break;
            case "33":
                tableString += "<tr><td>33</td><td>AirCrew WBDU 2-piece alone [open]</td></tr>";
                break;
            case "34":
                tableString += "<tr><td>34</td><td>AirCrew WBDU 2-piece alone [closed]</td></tr>";
                break;
            case "35":
                tableString += "<tr><td>35</td><td>Fuel Handlers (TAP) {HP41}</td></tr>";
                break;
            case "36":
                tableString += "<tr><td>36</td><td>ACU</td></tr>";
                break;
            case "37":
                tableString += "<tr><td>37</td><td>APFU</td></tr>";
                break;
            case "38":
                tableString += "<tr><td>38</td><td>DCU</td></tr>";
                break;
            case "39":
                tableString += "<tr><td>39</td><td>STEPO</td></tr>";
                break;
            case "40":
                tableString += "<tr><td>40</td><td>EOD SUIT</td></tr>";
                break;
            case "41":
                tableString += "<tr><td>41</td><td>JSLIST (MOPP4)</td></tr>";
                break;
            case "42":
                tableString += "<tr><td>42</td><td>FJSLIST over HWBDU (MOPP4)</td></tr>";
                break;
        }
    }

    tableString += "</div></fieldset></div>";
    document.getElementById("full-data").innerHTML += tableString;
}

function checkMinMetabolicRate(mass, height, age) {
    console.log("mass " + mass);
    console.log("height " + height);
    console.log("age " + age);
    var Mrst = mifflinMRst(mass, height, age);//calculate min value
    console.log("Mrst = " + Mrst);
    /*loop to find all instances of metabolic selected and store their location in array.
     *..where "1" signifies the set of initial values (activity, environment,and clothing), specified within the Initial values tab.
     */
    var frameLength = document.getElementsByClassName("frame").length + 1;
    console.log(frameLength);
    for (var i = 0; i < frameLength; i++) {
        document.getElementsByClassName("metabolic")[i].min = Mrst;
        document.getElementsByClassName("metabolic-slider")[i].min = Mrst;
        document.getElementsByClassName("metabolic-slider")[i].value = document.getElementsByClassName("metabolic")[i].value;
        if (Mrst > document.getElementsByClassName("metabolic")[i].value) {
            document.getElementsByClassName("metabolic")[i].value = Mrst;
        }
        document.getElementsByClassName("metabolic-slider")[i].min = Mrst;
    }
}

/**
 *  method pandolfMetCalc
 *  M = 1.5W + 2.0(W + L)(L/W)^2 + ?(W + L)(1.5V^2 + 0.35VG)
 *  M = Metabolic Rate (watts)
 *  W = Nude body weight (kg)
 *  L = Load (clothing + equipment), (kg)
 *  ? = terrain factor (unitless) (1.0 = treadmill)
 *  V = walking velocity (m/s)
 *  G = Grade (%) 0% = flat surface
 *  rt = threshold speed (m/s) over which the running correction is applied
 * run = whether walking or running. 1=run, 0=walk. If running the correction factor can be applied
 */
// inputs: mass = body mass (kg), height (m), age (yrs)
//calculates minimum metabolic rate possible for entry by user
var mifflinMRst = function calcMifflinMRst(mass, height, age) {
    height = height / 100;//CONVERT CM TO M
    //calculate resting energy expenditure Kcal
    var REE = (10 * mass + 6.25 * height * 100 - 5 * age + 5); //EDIT: added ")" at end of declaration
    //MODIFIED BY  robert.bernier
    //convert to watts
    Mrst = REE * 4184 / (24 * 60 * 60);
    Mrst = Math.ceil(Mrst);//round up to the nearest whole number
    return Mrst;
};



/* some conversions

 1 m/s = 3.6 km/h
 1 m/s = 2.23694 m/h
 runWalkThreshold = 4.5 m/hr = 7.24 km/h = 2.01168 m/s
 */

/* Terrain factors
 Black top	1.0
 Dirt Road	1.1
 Light Brush	1.2
 Heavy Brush	1.5
 Packed Snow 	1.6
 Marsh 		1.8
 Sand		2.1
 */
