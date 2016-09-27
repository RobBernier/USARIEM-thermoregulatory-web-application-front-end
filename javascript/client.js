/*
 *
 * Author: robert.bernier
 * Purpose: Gather data from input field and send to server
 */
/* global tempType, errors, parseFloat, scenarioStepData, scenarioOneTimeData */

//Form Validation functions to be called by passValue Functions
/*function used to determine if any fields are left blank.
 * If so, error is displayed in an alert box.
 * Function then checks to ensure all error message fields are
 * blank. if not, errors is incremented, which prevents data from
 * being passed to the server*/
function validationSubmit(array) {
  //Checks to ensure there are no empty fields and that all error fields are blank.
  for (var i = 0; i < array.length; i++) {
    if (array[i] === null || array[i] === "") {
      alert("Fill all blank fields");
      errors++;
      break;
    }
  }
  for (var i = 0; i < document.getElementsByClassName("error-message").length; i++) {
    var message = document.getElementsByClassName("error-message");
    if (message[i].innerHTML !== "") {
      errors++;
    }
  }
}

/*
 * For each model, an array is passed to the server.java file using XMLHttpRequest. The process is as follows:
 * 1. A variable "xhttp" represents XMLHttpRequest object
 * 2. Open method specifies a request to pass data to the server using POST method
 * 3. Dependent on model, a unique string is passed using the send method
 * 4. xhttp then waits for the ready state to be 4 (meaning that the request was successful) [shown in xhttp.onreadystatechange]
 * 5. The model's output (array) is then parsed using JSON and displayed within the user's browser accordingly
 *
 */
var xhttp = new XMLHttpRequest(); //new XMLHttpRequest object is made
function sendInformation(array, modelType) {
  xhttp.open("POST", "/model/" + modelType + "", true);
  if (modelType === "jwarn") {
    xhttp.send("{<" + modelType + ">[" + array[0] + "," + array[1] + "," + array[2] + "," + array[3] + "," + array[4] + "," + array[5] + "," + array[6] + "," + array[7] + "," + array[8] + "," + array[9] + "," + array[10] + "]}");
  }
  if (modelType === "timeseries") {
    xhttp.send("{<" + modelType + ">[" + array[0] + "," + array[1] + "," + array[2] + "," + array[3] + "," + array[4] + "," + array[5] + "," + array[6] + "," + array[7] + "," + array[8] + "," + array[9] + "," + array[10] + "," + array[11] + "," + array[12] + "," + array[13] + "," + array[14] + "]}");
  }
  if (modelType === "scenario") {
    if (document.getElementsByClassName("pandolf-button")[0].value !== "selected") { //If metabolic is selected.
      console.log("metabolic will be called");
      modelType = "metabolicScenario";
    }
    var stringPassedToServer = "{<" + modelType + ">[";

    for (var i = 0; i < array.length; i++) {
      stringPassedToServer = stringPassedToServer + "" + array[i] + "";
    }
    stringPassedToServer = stringPassedToServer + "]}";
    console.log("PASSED TO MODEL: " + stringPassedToServer);
    outputFunction();
    model = "scenario";
  }
}

/*function is called when server makes a response based on user requests.
 * A JSON parser object is created to parse the incoming data into seperate
 * objects, which are then printed to the ServerResponse filed depentent on
 * model name.*/
var outputFunction = xhttp.onreadystatechange = function() {
  //if (this.readyState === 4) {
  console.log("received");
  //var j = JSON.parse(this.responseText);
  //console.log(j.model);
  if (model === "jwarn") {
    var myArray = j.data; //the array
    document.getElementById("ServerResponse").innerHTML = "<div class='table-container'><div class='table-item-full'>Work Rest:<br/>" + myArray[0] + "</div><div class='table-item-full'>Max Endurance Time:</br>" + myArray[1] + "</div><div class='table-item-full'>Water Requirements:</br>" + myArray[2] + "</div><div class='table-item-full'>Max Water Requirements:" + myArray[3] + "</div><div class='table-item-full'>Heat Casualty:" + myArray[4] + "</div></div>";
  }
  if (model === "timeseries") {
    var mySecondArray = j.tsArr; //the array
    document.getElementById("ServerResponse").innerHTML = "<canvas id='canvas' width='600' height='400'></canvas>";
    graph(mySecondArray, "timeseries", document.getElementById("final-time-step").value, "canvas", true, "Temperature", "Time (minutes)");
  }
  if (model === "scenario") {
    var data = new Array(10);
      var a = 38;
      var b = 70;
    for (var i = 0; i < 10; i++){
      if(i < 4){
        a = a + 1;
        b = b + 1;
      }
      if(i > 4 && i < 7){
        a = a - 1;
        b = b - 1;
      }else{
          a = a + 1;
          b = b + 1;
      }
      data[i] = new Array(2);
      data[i][0] = parseInt(a);
      data[i][1] = parseInt(b);
    }

    var coreTemp = new Array(); //array to contain core temerature
    var heartRate = new Array(); //array to contain heart rate
    for (var i = 0; i < data.length; i++) {
      coreTemp.push(data[i][0]);
      heartRate.push(data[i][1]);
    }
    var string = "<canvas id='canvasCoreTemp' width='600' height='400'></canvas>\n\
            <br/><canvas id='canvasHeartRate' width='600' height='400'></canvas>\n\
            <a onclick='displayContents(this);'><button class='no-print'>SEE FULL DATA</button></a>\n\
            <div id='full-data' class='dropdown-contents'></div>";
    document.getElementById("ServerResponse").innerHTML = string;
    dataToTable(scenarioOneTimeData, scenarioStepData, coreTemp, heartRate);
    graph(coreTemp, "scenario", coreTemp.length - 1, "canvasCoreTemp", true, "Core Body Temperature", "Time (minutes)"); //where coreTemp.length tells the graph the number of steps
    graph(heartRate, "scenario", coreTemp.length - 1, "canvasHeartRate", false, "Heart Rate (bpm)", "Time (minutes)"); //where heartRate.length tells the graph the number of steps
  }
  /*
      } else {
          document.getElementById("ServerResponse").innerHTML = "<p style='color:red;'>loading...</p>";
      }*/
  /*Function used to graph HSDA Timeseries model but may be repurposed for
   * other models at a later time.*/
  function graph(myArray, model, xrng, canvasName, isTemeratureGraph, labelY, labelX) {
    var minValue = myArray[0]; //Default for max and min set to first item in array
    var maxValue = myArray[0];
    for (var i = 0; i < myArray.length; i++) { //loop to determine the maximum and minimum values of array
      if (myArray[i] < minValue) {
        minValue = myArray[i];
      }
      if (myArray[i] > maxValue) {
        maxValue = myArray[i];
      }
    }
    minValue = parseInt(minValue - 1); //minus 1 to give the graph extra space on bottom
    maxValue = parseInt(maxValue + 1); //plus 1 to give the graph extra space on top
    var yrng = maxValue - minValue;
    //console.log(myArray);
    var canvas = document.getElementById(canvasName);
    if (canvas.getContext) {
      var graph = canvas.getContext('2d');
      var offset = 40; //offsets the graph in order to shift the graph on the x and y axis. allows space for canvas labels
      var canvasWidth = parseInt(document.getElementById(canvasName).getAttribute("width")) - offset; //Width of the graph as defined within the html
      var canvasHeight = parseInt(document.getElementById(canvasName).getAttribute("height")) - (offset * 2); //Height of the graph as defined within the html, with offset
      var yrange = yrng; //Range of values, 40C for time series
      var viewWidth = document.getElementById(canvasName).offsetWidth; //Get actual width of canvas on screen, then scale graph notches accordingly
      if (viewWidth < 400) { //Mobile styling
        var notchFreqX = 6;
        var notchFreqY = 6;
        var offset = 80;
        graph.font = 'italic 14pt Calibri';
      }
      if (viewWidth > 400) { //Tablet / smaller window styling
        var notchFreqX = 10;
        var notchFreqY = 10;
        var offset = 70;
        graph.font = 'italic 12pt Calibri';
      }
      graph.strokeStyle = '#890c08'; //Graphs the output data from model to the screen as a red line
      graph.lineWidth = 4;
      graph.beginPath();
      var dataLength = myArray.length;
      if (model === "scenario") {
        dataLength = parseInt(dataLength - 1); //where minus one represents the data correctly on the canvas
      }

      for (var i = 0; i < myArray.length; i++) {
        //console.log("Canvas Width " + canvasWidth);
        x = (i * canvasWidth / dataLength);
        y = (canvasHeight - (((myArray[i]) - minValue) * canvasHeight) / yrange);
        graph.lineTo(x + offset, y);
      }
      graph.stroke();
      graph.lineWidth = 1; //Graphs the x and y axis lines to the screen
      graph.strokeStyle = '#000000';
      graph.beginPath();
      graph.lineTo(offset, 0);
      graph.lineTo(offset, canvasHeight);
      graph.lineTo(canvasWidth + offset, canvasHeight);
      graph.stroke();
      graph.save();
      graph.translate(15, (canvasHeight / 2) + 20); //Graphs temperature label (y axis)to the screen
      graph.rotate(-Math.PI / 2);
      graph.textAlign = 'center';
      if (isTemeratureGraph === true) {
        if (tempType === "F") {
          minValue = (minValue * 1.8) + 32;
          graph.fillText(labelY + " (F)", 15, 0);
        }
        if (tempType === "C") {
          graph.fillText(labelY + " (C)", 15, 0);
        }
      } else {
        graph.fillText(labelY, 15, 0);
      }
      graph.restore();
      graph.save();
      graph.translate((canvasWidth / 2), canvasHeight + 55); //Graphs time label (x axis)to the screen
      graph.textAlign = 'center';
      graph.fillText(labelX, 15, 15);
      graph.restore();
      /*Variable is determined by taking xrng, which is equal to the final time step
       * and dividing by the notch frequency, which is dependent on the client's screen size.
       * The values are then printed equal distance apart from one another across the x axis.
       * the notch number is then incremented by itself and the loop reitterates
       * */
      var notchNumbersForXAxis = xrng / notchFreqX;
      for (var i = 0; i < canvasWidth; i = i + canvasWidth / notchFreqX) {
        graph.moveTo(i + offset, canvasHeight + offset);
        if (i + canvasWidth / notchFreqX === canvasWidth) {
          graph.fillText(Math.round(notchNumbersForXAxis), i + offset, canvasHeight + offset / 3);
        } else {
          graph.fillText(parseFloat(notchNumbersForXAxis).toFixed(1), i + offset, canvasHeight + offset / 3);
        }
        graph.stroke();
        if (viewWidth > 400) {
          graph.moveTo(i + offset + 25, canvasHeight);
          graph.lineTo(i + offset + 15, canvasHeight + 7);
          graph.stroke();
        } else {
          graph.moveTo(i + offset + 50, canvasHeight);
          graph.lineTo(i + offset + 35, canvasHeight + 13);
          graph.stroke();
        }
        notchNumbersForXAxis = notchNumbersForXAxis + xrng / notchFreqX;
      }
      /*Variable is determined by taking yrng, which is equal to the max temp value specified
       * minus the lowest temp specified by the graph function. (by default, the value is 45 - 37).
       * yrng is then divided by the notch frequency, which is dependent on the client's screen size.
       * The values are then printed equal distance apart from one another across the y axis.
       * the notch number is then incremented by itself and the loop reitterates
       * */
      var notchNumbersForYAxis = 0;
      for (var i = canvasHeight; i > 0; i = i - (canvasHeight / notchFreqY)) {
        graph.moveTo(offset / 3, canvasHeight);
        graph.fillText(parseFloat(notchNumbersForYAxis + minValue).toFixed(1), offset / 3, i + 5); // where 5 offsets all numbers on the y axis to give a slightly more accurate reading
        graph.stroke();
        notchNumbersForYAxis = notchNumbersForYAxis + yrng / notchFreqY;
      }
    }
  }
};
