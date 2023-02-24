// Global Variables
var masterAzimuthArray = [];
var refertable, noisefloor;
window.onload = checkBandwidth();

// function to check the bandwidth and sleect the optarray
function checkBandwidth() {
  var bnwdth = parseInt(document.querySelector("#channelBW").value);
  var optarray;
  switch (bnwdth) {
    case 10:
      optarray = [5155, 5825];
      noisefloor = 89;
      refertable = document.querySelector("#throughput10MHz");
      break;
    case 20:
      optarray = [5160, 5815];
      noisefloor = 89;
      refertable = document.querySelector("#throughput20MHz");
      break;
    case 40:
      optarray = [5170, 5805];
      noisefloor = 86;
      refertable = document.querySelector("#throughput40MHz");
      break;
    case 80:
      optarray = [5190, 5785];
      noisefloor = 83;
      refertable = document.querySelector("#throughput80MHz");
  }
  console.log(optarray);
  createFreq(optarray);
}

// function to create frequencies
function createFreq(optarray) {
  console.log(optarray);
  var selectElement = document.getElementById("channelFreq");
  selectElement.innerHTML = "";
  var array = [];
  for (let i = optarray[0]; i <= optarray[1]; i += 5) {
    array.push(i);
  }
  for (opt in array) {
    var newoption = document.createElement("option");
    newoption.innerHTML = array[opt];
    newoption.value = array[opt];
    selectElement.options.add(newoption);
  }
}

function createSlavesCoordinateField() {
  document.getElementById("reportButton").disabled = false;
  var coordContainer = document.querySelector("#slaveCoordSection");
  coordContainer.innerHTML = "";
  var numOfCoordFields = document.querySelector("#numberOfSlaves").value;

  // clearing the columns of the Master Table created previously
  var numOfCol = $("#masterTable tr:nth-child(1) th").length;
  if (numOfCol > 1) {
    $("#masterTable tr").each(function () {
      for (let i = 1; i < numOfCol; i++) {
        console.log("Deleted columns");
        this.cells[1].remove();
      }
    });

    // clearing the Markers when number of slaves changed
    for (let i = 1; i < numOfCol; i++) {
      if (marker != "") {
        marker[i].setMap(null);
      }
    }
  }
  for (let i = 1; i <= numOfCoordFields; i++) {
    var item = document.createElement("div");
    item.className = "item";
    // label for coord field
    coordlabel = document.createElement("label");
    coordlabel.className = "label";
    coordlabel.innerHTML = `Slave${i} Co-ord`;
    // input field for the coordinate
    coordinput = document.createElement("input");
    coordinput.setAttribute("type", "text");
    coordinput.setAttribute("id", `slave${i}Co-ordinate`);
    coordinput.setAttribute("placeholder", "lat/long");
    coordinput.setAttribute("name", `slave${i}`);

    item.append(coordlabel, coordinput);
    coordContainer.append(item);
  }

  // Event Listener on each newly created slave coordinate field
  slavesCount = numOfCoordFields;
  marker = [];
  for (let i = 1; i <= slavesCount; i++) {
    document
      .querySelector(`#slave${i}Co-ordinate`)
      .addEventListener("change", function () {
        // if (masterAzimuthArray[i - 1] != "") {
        //   masterAzimuthArray[i - 1] = null;
        // }
        if (marker[i] != null) {
          marker[i].setMap(null);
        }
        var coordslave = this.value.split(",");
        var [lat, long] = coordslave;

        // Placing marker for each lat long of slave
        marker[i] = new google.maps.Marker({
          map: map,
          position: { lat: parseFloat(lat), lng: parseFloat(long) },
          icon: `images/${i}.png`,
        });
        bounds.extend({ lat: parseFloat(lat), lng: parseFloat(long) });
        map.fitBounds(bounds);

        // calling the function which calculates the parameters
        azimuth(parseFloat(lat), parseFloat(long), i);
      });
  }
}

// function to create slaves field
function createSlavesField() {
  // calling the main slave section in which slave 1,2 ,3 etc will be stored
  document.getElementById("slavesInput").innerHTML = "";
  var slavecontainer = document.getElementById("slavesInput");
  var number_of_slaves = document.querySelector("#numberOfSlaves").value;
  // Creating slaves section for each slave
  for (let i = 1; i <= number_of_slaves; i++) {
    // Main div for each slave section having border details
    var slaveSectionBorder = $("<div>", { class: "sectionBorder" }).appendTo(
      slavecontainer
    );
    // Div which carries the header and item div
    var slaveInputSection = $("<div>", { class: `slave${i}InputSection` });
    slaveInputSection.appendTo(slaveSectionBorder);

    // Input Header
    var inputHeader = $("<header>", { html: `Slave ${i}` });
    // div for each slave row INPUT
    var slavedivIn = $("<div>", { class: "inputSection" });
    // Appending header and slaveDivIn to
    slaveInputSection.append(inputHeader, slavedivIn);
    var inputArray = ["Radio", "Gain", "Tx Power", "Height"];
    var nameArray = ["Radio", "Gain", "Tx", "Height"];
    for (let j = 0; j < inputArray.length; j++) {
      // creating a div with class item
      var slaveitem1 = $("<div>", { class: "item" }).appendTo(slavedivIn);
      // created a label for the slave name
      var slavelabel = $("<label>", {
        text: inputArray[j],
        class: "label",
      });
      // created input field to enter the co-ordinates of the slaves
      switch (inputArray[j]) {
        case "Radio":
          var slaveinput = $("<select>", {
            class: "select",
            id: `slave${i}Radio`,
          });
          // OPT GROUP 1
          var optGroup1 = $("<optgroup>", {
            label: "Integrated Dish Antenna",
          }).appendTo(slaveinput);
          // OPT GROUP 2
          var optGroup2 = $("<optgroup>", {
            label: "Integrated Flat Panel Antenna",
          }).appendTo(slaveinput);
          // OPT GROUP 3
          var optGroup3 = $("<optgroup>", {
            label: "External Antenna",
          }).appendTo(slaveinput);

          radioList = {
            ion4l2: "23",
            ion4l2_CPE: "23",
            ion4l3: "25",
            ion4l3_CPE: "25",
            ion4l4: "27",
            ion4le: "0",
            ion4le_CPE: "0",
          };
          for (let [key, val] of Object.entries(radioList)) {
            var radioOption = $("<option>", { value: val, html: key });
            if (key.includes("l2_CPE")) {
              optGroup2.append(radioOption);
            } else if (key.includes("e")) {
              optGroup3.append(radioOption);
            } else {
              optGroup1.append(radioOption);
            }
          }
          break;
        default:
          var slaveinput = $("<input>", {
            type: "text",
            id: `slave${i}` + nameArray[j],
            placeholder: inputArray[j],
          });
      }
      slaveitem1.append(slavelabel, slaveinput);
    } // end of j loop for inputs

    // function to create output fields
    // createOutputs(i, outputContainer);

    // Populating the value of antgain and txpower in the fields
    $(`#slave${i}Gain`).val(23);
    $(`#slave${i}Gain`).prop("disabled", true);
    $(`#slave${i}Tx`).val(27);
    $(`#slave${i}Height`).val(0);

    // function called to create slave output fields
    createOutputTables(
      slaveInputSection,
      slaveSectionBorder,
      slavecontainer,
      i
    );

    // event listener on Radio Fields of Slave and the Transmit Power Fields
    $(`#slave${i}Radio`).change(function () {
      var selection = $(`#slave${i}Radio option:selected`);
      var radioGain = parseFloat(selection.val());
      document.getElementById(`slave${i}Gain`).value = radioGain;
      var radioType = selection.html();
      if (radioType.includes("le")) {
        $(`#slave${i}Gain`).prop("disabled", false);
        // CAN ALSO HAVE A POP MESSAGE ASKING USER TO INPUT GAIN.
        $(`#slave${i}Gain`).focus();
        // for (let j = 0; j <= 1; j++) {
        //   $(`.reset${i}${j}`).html(" ");
        // }
      } else {
        $(`#slave${i}Gain`).prop("disabled", true);
        if (document.getElementById(`slave${i}Co-ordinate`).value != "") {
          var masterAngle = parseFloat($("#masterAngle").val());
          var changedAngle = parseFloat(
            (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
          );
          rsl = calculateTx(changedAngle, i);
          calcSNR(i);
        }
      }
    });

    // Second Event Listener which gets fired when the gain value is changed for external antennas
    $(`#slave${i}Gain`).change(function () {
      if ($(`#slave${i}Gain`).val() > 35) {
        window.alert("Gain must be less than 35. ");
      } else {
        if ($(`#slave${i}Co-ordinate`).val() != "") {
          var masterAngle = parseFloat($("#masterAngle").val());
          var changedAngle = parseFloat(
            (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
          );
          calculateTx(changedAngle, i);
          calcSNR(i);
        }
      }
    });

    // Third event listener to change the parameters when tx power will change
    // This will not impact the calculations for the slave as slave tx power is used to calculate the rsl of Master
    $(`#slave${i}Tx`).change(function () {
      if (document.getElementById(`slave${i}Co-ordinate`).value != "") {
        var masterAngle = parseFloat($("#masterAngle").val());
        var changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        calculateTx(changedAngle, i);
        calcSNR(i);
      }
    });
  }
}

function createOutputTables(
  slaveInputSection,
  slaveSectionBorder,
  slavecontainer,
  i
) {
  $("<div>", { id: `tableDiv${i}`, class: "slaveTableDiv" }).appendTo(
    slaveInputSection
  );
  var tableArr = [
    ["Distance", "Fresnel Radius"],
    ["Azimuth", "RSL"],
    ["SNR", "Fade Margin"],
    ["MCS", "Modulation"],
    ["FEC", "Link Rate"],
    ["Throughput", "PTMP Throughput"],
    ["In Range"],
  ];
  $("<table>", { id: `slave${i}Table`, class: "table" }).appendTo(
    $(`#tableDiv${i}`)
  );
  for (let k = 0; k < tableArr.length; k++) {
    $("<tr>").appendTo($(`#slave${i}Table`));
    for (let j = 0; j <= 1; j++) {
      $("<th>", { html: tableArr[k][j] }).appendTo(
        $(`#slave${i}Table tr:nth-child(${k + 1})`)
      );
      $("<td>", {
        id: tableArr[k][j] + `${i}1`,
        class: `reset${i}1`,
        html: "hello",
      }).appendTo($(`#slave${i}Table tr:nth-child(${k + 1})`));
    }
  }
  // slaveSectionBorder.append(slaveInputSection);
  // slavecontainer.append(slaveSectionBorder);
}

// function to create output fields

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function rad2deg(rad) {
  return (rad * 180) / Math.PI;
}

// New function which only calculates azimuth angle dist and fresnel radius first
function azimuth(slavelat, slavelong, i) {
  // parameters required
  var masterAngle = parseFloat($("#masterAngle").val());
  var master = document.querySelector("#masterCoord").value.split(",");
  var [masterlat, masterlong] = master;
  var cf = $("#channelFreq").val();

  // Degree to radian
  var masterLat = deg2rad(parseFloat(masterlat));
  var masterLong = deg2rad(parseFloat(masterlong));
  var slaveLat = deg2rad(slavelat);
  var slaveLong = deg2rad(slavelong);
  var diffLat = deg2rad(slavelat - parseFloat(masterlat));
  var diffLong = deg2rad(slavelong - parseFloat(masterlong));
  var R = 6371; //Radius of the earth in km

  // Hop Distance Calculation
  var a =
    Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
    Math.sin(diffLong / 2) *
      Math.sin(diffLong / 2) *
      Math.cos(masterLat) *
      Math.cos(slaveLat);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = Math.round(R * c * 100) / 100; // Distance in km
  // Populating the value of distance
  document.querySelector(`#Distance${i}1`).innerHTML = distance;

  // Azimuth Calculation
  var y = Math.sin(slaveLong - masterLong) * Math.cos(slaveLat);
  var x =
    Math.cos(masterLat) * Math.sin(slaveLat) -
    Math.sin(masterLat) * Math.cos(slaveLat) * Math.cos(slaveLong - masterLong);
  var bearing = Math.atan2(y, x);
  bearing = rad2deg(bearing);
  var anglea = ((bearing + 360) % 360).toFixed(2);
  var angleb = ((anglea - 180 + 360) % 360).toFixed(2);
  // converting master azimuth angle based on the master orientation angle
  var changedAngle = parseFloat((anglea - masterAngle + 360) % 360);
  masterAzimuthArray[i - 1] = anglea;
  console.log(masterAzimuthArray);

  // fresnel radius calculation
  var fres = (17.32 * Math.sqrt(distance / ((4 * cf) / 1000))).toFixed(2);

  //  Populating values if azimuth, hop distance and fresnel
  document.querySelector(`#Azimuth${i}0`).innerHTML = anglea;
  document.querySelector(`#Azimuth${i}1`).innerHTML = angleb;
  document.getElementById(`Fresnel Radius${i}1`).innerHTML = fres;
  // document.querySelector(`#slave${i}RSL`).innerHTML = rsl;

  // function called to check whether slave is in Master Range
  slaveInMasterRange(changedAngle, i);
}

// function which takes in the changed angle and gives the txpower based on the coverage of master
function calculateTx(angle, i) {
  var mRadio = parseFloat($("#masterRadio").val());
  var masterTx = parseFloat($("#masterTxPower").val());
  var slaveGain = parseFloat($(`#slave${i}Gain`).val());
  var slaveTx = parseFloat($(`#slave${i}Tx`).val());
  var hopDist = parseFloat($(`#Distance${i}1`).html());
  var cf = $("#channelFreq").val();
  console.log(mRadio, masterTx, slaveGain, hopDist, cf);

  // Changing gain based on the angle
  if ((angle >= 330 && angle <= 335) || (angle >= 25 && angle <= 30)) {
    var mRadio = mRadio * 0.2;
  }
  var eirpVal = [
    slaveTx + mRadio + slaveGain - 4,
    // change this mRadio to original mRadio value if master doesnot gets affected even when slave is at the ends of the main lobe
    masterTx + mRadio + slaveGain - 4,
  ];
  console.log(eirpVal);
  for (let j = 0; j <= 1; j++) {
    //  RSL calculation
    rsl =
      parseFloat(eirpVal[j]) -
      (20 * Math.log10(hopDist) + 20 * Math.log10(cf / 1000) + 92.45).toFixed(
        2
      );
    console.log("RSLs: ", rsl);

    //  Populating the value of RSL
    document.querySelector(`#RSL${i}${j}`).innerHTML = rsl.toFixed(2);
  }
}

function checkMasterRange() {
  var numOfSlaves = document.getElementById("numberOfSlaves").value;
  if (numOfSlaves != "") {
    var masterAngle = parseFloat(document.querySelector("#masterAngle").value);
    for (let i = 1; i <= masterAzimuthArray.length; i++) {
      if (document.getElementById(`slave${i}Co-ordinate`).value != "") {
        var changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        var hopDist = document.querySelector(`#Distance${i}1`).innerHTML;
        // checking if the changed angle will make a change to the txpower and the calculations followed

        calculateTx(changedAngle, i);
        //  calling function to calculate SNR etc
        calcSNR(i);

        // This one to check for the Range

        // upper and below vertical limit
        var upVerticalRange = Math.tan((5 * Math.PI) / 180) * hopDist;
        upVerticalRange = (upVerticalRange * 1000).toFixed(3);
        var belowVerticalRange = -upVerticalRange;
        console.log(upVerticalRange, belowVerticalRange);
        // document.getElementById(`slave${i}V Range`).innerHTML =  upVerticalRange + "," + belowVerticalRange;
        if (
          (changedAngle < 360 && changedAngle > 330) ||
          (changedAngle > 0 && changedAngle < 30)
        ) {
          if (hopDist <= 5) {
            document.getElementById(`In Range${i}1`).innerHTML = "Yes";
            document.querySelector(`#Distance${i}1`).style.color = "Green";
            document.querySelector(`#Azimuth${i}1`).style.color = "Green";
          } else {
            document.getElementById(`In Range${i}1`).innerHTML = "No";
            document.querySelector(`#Distance${i}1`).style.color = "Red";
            document.querySelector(`#Azimuth${i}1`).style.color = "Green";
          }
        } else {
          document.getElementById(`In Range${i}1`).innerHTML = "No";
          document.querySelector(`#Azimuth${i}1`).style.color = "Red";
          document.querySelector(`#Distance${i}1`).style.color = "Black";
        }
      }
    }
  }
}

//  function which will calculate the throughput for the slaves in a PTMP arrangement.
function throughputPTMP() {
  var numOfSlaves = $("#numberOfSlaves").val();
  var throughputArr = [];
  var weightedThroughputArr = [];
  var total = 0;
  if ($(`#Throughput${eval(numOfSlaves)}1`).html() != "") {
    for (let i = 1; i <= numOfSlaves; i++) {
      var slaveThghpt = $(`#Throughput${i}1`).html();
      console.log(slaveThghpt);
      throughputArr[i - 1] = parseFloat(slaveThghpt) / 2;
      total += throughputArr[i - 1];
    }
    console.log(total);
    for (let i = 1; i <= numOfSlaves; i++) {
      var weightedPercent = throughputArr[i - 1] / total;
      console.log(weightedPercent);
      var weightedThroughput = (weightedPercent * throughputArr[i - 1]).toFixed(
        2
      );
      document.getElementById(`PTMP Throughput${i}1`).innerHTML =
        weightedThroughput;
      weightedThroughputArr[i - 1] = weightedThroughput;
    }
  }

  console.log(weightedThroughputArr);
}
