/*
 *
 * Author: robert.bernier
 *
 * SEARCH DOCUMENT FOR "//COMMENTED OUT FOR SCENARIO ONLY VERSION: ON 8/26/16" TO RE-ADD LINES NEEDED FOR JWARN AND TIME SERIES MODELS
 */
var notOpen = true; //determines the state of the slide menu
var tempType = "C"; //used to determine what temerature type the user has specified
var errors = 0; //represents how many errors are on the page
var defaultSettings = true; //Used to preserve default values before allowing user input. then immediately switch to false to allow user to make setting adjustments to page
var model = 0; //determines the model type

/*Function called when user clicks on navigation icon / menu button.
 * dependent on the state of the side menu upon clicking, styles are
 * added to either extend the menu or retract it*/
function menuSlide() {
    document.getElementById("side-menu").style.display = "block";
    if (notOpen === false) {
        document.getElementById("nav-information").innerHTML = "";
        document.getElementById("side-menu").style.marginLeft = "-100%";
        document.getElementById("usariem-icon").style.float = "none";
        document.getElementById("usariem-icon").style.display = "block";
        document.getElementById("usariem-icon").style.margin = "0 auto";
        notOpen = true;
        document.getElementById("side-menu-shadow").style.opacity = "0";
        window.setTimeout(partB, 0300);
        function partB() {
            document.getElementById("side-menu-shadow").style.display = "none";
        }
    } else {
        mainMenu();
        document.getElementById("side-menu").style.marginLeft = "0%";
        document.getElementById("nav-information").innerHTML = "<p>MENU ></p>";
        document.getElementById("nav-information").style.margin = "24px 0";
        document.getElementById("usariem-icon").style.float = "left";
        document.getElementById("usariem-icon").style.margin = "0";
        document.getElementById("side-menu-shadow").style.display = "block";
        document.getElementById("side-menu-shadow").style.opacity = "0.60";
        notOpen = false;
    }
}

/*Function is called either when the user first opens the navigation or when
 * clicking "back" within the navigation. Displays model, settings, and exit
 * menu buttons.*/
function mainMenu() {
    document.getElementById("nav-information").innerHTML = "<p>MENU ></p>";
    document.getElementById("side-menu").innerHTML =
            "<button onClick='modelMenu();'>Models</button>\n\
<button onClick='menuItem(0);'>Settings</button>\n\
<button class='back-button' onClick='menuItem(-2);'>Exit Menu</button>";
}

/*Function is called when the user clicks "Models" from within the navigation.
 * Currently, the function displays JWARN, HSDA Timeseries, and SCENARIO options.*/
function modelMenu() {
    document.getElementById("nav-information").innerHTML = "<p>MENU > MODELS</p>";
    document.getElementById("side-menu").innerHTML =
            "<button onClick='menuItem(1);'>JWARN MODEL</button><button onClick='menuItem(2);'>HSDA Time Series</button><button onClick='menuItem(3);'>SCENARIO MODEL</button>\n\
<button class='back-button' onClick='menuItem(-1);'>Back</button>";
}

/*Function called when user selects a button from the navigation menu.
 * menuSlection is passed to function which can be >= -2. each selection
 * corresponds to a partucular function that is either displayed on the
 * menu or body of the page. menuSelection 1 and onward are inteneded to
 * be used for models.
 *
 *For each model selection, a request is made to the server.java file using XMLHttpRequest. The process is as follows:
 * 1. A variable "xhttp" represents XMLHttpRequest object
 * 2. Open method requests the specific file from the server
 * 3. The request is sent
 * 4. xhttp then waits for the ready state to be 4 (meaning that the request was successful)
 * 5. The requested file is then displayed within the user's browser
 */
function menuItem(menuSelection) {
    if (menuSelection === 1) {
        model = "jwarn";
        defaultSettings = true;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "./models/jwarn.html", true);//request is made to get jwarn html file
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                document.getElementById("input-field").innerHTML = this.responseText;//html is printed to page
                menuSlide();
                tempTypeAdd();
                defaultSettings = false;
            }
        };
    }
//TIME SERIES MODEL

    if (menuSelection === 2) {
        model = "timeseries";
        defaultSettings = true;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "./models/timeseries.html", true);//request is made to get timeseries html file
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                document.getElementById("input-field").innerHTML = this.responseText;//html is printed to page
                menuSlide();
                tempTypeAdd();
                defaultSettings = false;
            }
        };
    }

    if (menuSelection === 3) {
        model = "scenario";
        defaultSettings = true;
        requestFirstStep = true; //SCENARIO STEP RESET
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "./models/scenario.html", true);//request is made to get scenario html file
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                document.getElementById("input-field").innerHTML = this.responseText;//html is printed to page
                addStep();
                menuSlide();
                tempTypeAdd();
            }
        };
    }
    if (menuSelection === 0) {//User settings
        document.getElementById("nav-information").innerHTML = "<p>MENU > SETTINGS</p>";
        document.getElementById("side-menu").innerHTML =
                "<h2 align='center'>Settings</h2><div class='table-container'><div class='table-item-full'>Temperature Conversion</div>\n\
                <div class='table-item-full' id='tempSettings'></div></div>\n\
                <button class='back-button' onClick='menuItem(-1);'>Back</button>";
        if (tempType === "F") {
            document.getElementById("tempSettings").innerHTML = "<input id='celsius-button' type='radio' name='temp' onClick='conversionSettings(0)'>C\n\
               <input type='radio' name='temp' onClick='conversionSettings(1)' checked>F";
        }
        if (tempType === "C") {
            document.getElementById("tempSettings").innerHTML = "<input id='celsius-button' type='radio' name='temp' onClick='conversionSettings(0)' checked>C\n\
               <input type='radio' name='temp' onClick='conversionSettings(1)'>F";
        }

    }
    if (menuSelection === -1) { //used to travel back a level in the navigation.
        mainMenu();
    }
    if (menuSelection === -2) { //used to exit menu
        notOpen = false;
        menuSlide();
    }
}

/*function used to validate all temperature fields where
 * cmin & cmax = celsius min & max,
 * fmin & fmax = farenheit min & max,
 * and id = the field in question.*/
function validationTemperature(cmin, cmax, fmin, fmax, element) {
    //update slider or input field
    if (notOpen === true) { //prevents unwanted changes when the menu is open
        if (element.name === "input") { //determines the type of input that triggered the function
            var sliderField = element.nextElementSibling;
            if (tempType === "F") {//If temp type is F, convert for slider (slider is always in C)
                var value = (element.value - 32) * 5 / 9;
                sliderField.value = value;
            } else {
                sliderField.value = element.value;
            }
        }
        if (element.name === "slider") {//determines the type of input that triggered the function
            var inputField = element.previousElementSibling;
            if (tempType === "F") {//If temp type is F, convert to F for input (slider is always in C)
                var value = (element.value * 1.8) + 32;
                inputField.value = parseFloat(value).toFixed(2);//round to two decimal places for readability
            } else {
                inputField.value = element.value;
            }
        }
    }
    if (element.name === 'input') {
        var inputElement = element;
        var firstElement = element.nextElementSibling;
        var message = firstElement.nextElementSibling;
    }
    if (element.name === 'slider') {
        var inputElement = element.previousElementSibling;
        var message = element.nextElementSibling;
    }
    if (tempType === "F") {
        var value = (inputElement.value - 32) * 5 / 9;
        if (inputElement.value < fmin || inputElement.value > fmax || isNaN(element.value)) {
            message.innerHTML = "* Temperature must be between " + parseInt(cmin) + "° - " + cmax + "° Celsius, or " + fmin + "° - " + fmax + "° Farenheit";
        } else {
            message.innerHTML = "";
        }
    }
    if (tempType === "C") {
        if (inputElement.value < cmin || inputElement.value > cmax || isNaN(element.value)) {
            message.innerHTML = "* Temperature must be between " + parseInt(cmin) + "° - " + cmax + "° Celsius, or " + fmin + "° - " + fmax + "° Farenheit";
        } else {
            message.innerHTML = "";
        }
    }
}

/*function used to validate all other fields that are not
 * temperature related.*/
function validationNonTemperature(min, max, element, inputLabelInQuestion, units) {
    //update either slider or inpput field
    if (element.name === 'input') {
        var firstElement = element.nextElementSibling;
        var message = firstElement.nextElementSibling;
    }
    if (element.name === 'slider') {
        var message = element.nextElementSibling;
    }
    if (element.className === "metabolic") {
        var Mrst = mifflinMRst(document.getElementById("weight").value, document.getElementById("height").value, document.getElementById("age").value);
        min = Mrst; //used only for metabolic
    }
    if (element.value < min || element.value > max || isNaN(element.value)) {
        if (element.className === "metabolic") {
        min = element.min; //used only for metabolic
    }
        message.innerHTML = "* " + inputLabelInQuestion + " should be between " + min + " - " + max + " " + units;
    } else {
        message.innerHTML = "";
        if (notOpen === true) {
            if (element.name === 'input') {
                var nextElementSibling = element.nextElementSibling;
                nextElementSibling.value = element.value;
            }
            if (element.name === 'slider') {
                    var previousElementSibling = element.previousElementSibling;
                    previousElementSibling.value = element.value;

            }
        }
    }
}


/*
 * If celsius or farenheit, Update symbol displayed on model form accordingly. 0 = Celsius 1 = Farenheit
 */
function conversionSettings(temperatureSelection) {
    if (temperatureSelection === 0) {
        if (tempType !== "C") {
            tempType = "C";
            tempTypeAdd();
        }
    } else if (temperatureSelection === 1) {
        if (tempType !== "F") {
            tempType = "F";
            tempTypeAdd();
        }
    }
}
function tempTypeAdd() {
    if (tempType === "F") {
        var elements = document.getElementsByClassName("tempSymbol");
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = "(F)";
        }
        if (model === "jwarn") {
            tempTypeAddJwarnF();
        }
        if (model === "timeseries") {
            tempTypeAddTimeseriesF();
        }
        if (model === "scenario") {
            tempTypeAddScenarioF();
        }
    }
    if (tempType === "C") {
        var elements = document.getElementsByClassName("tempSymbol");
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = "(C)";
        }
        if (model === "jwarn") {
            tempTypeAddJwarnC();
        }
        if (model === "timeseries") {
            tempTypeAddTimeseriesC();
        }
        if (model === "scenario") {
            tempTypeAddScenarioC();
        }

    }
}
