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
  for (let i = 1; i <= numOfCoordFields; i++) {
    var item = document.createElement("div");
    item.className = "item";
    // label for coord field
    coordlabel = document.createElement("label");
    coordlabel.className = "label";
    coordlabel.innerHTML = `Slave${i} Co-ord`;
    // input field foir the coordinate
    coordinput = document.createElement("input");
    coordinput.setAttribute("type", "text");
    coordinput.setAttribute("id", `slave${i}Co-ordinate`);
    coordinput.setAttribute("placeholder", "Co - ordinate");
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
          console.log("marker is there");
          marker[i].setMap(null);
        }
        var coordslave = this.value.split(",");
        var [lat, long] = coordslave;
        // calling the function which calculates the parameters
        azimuth(parseFloat(lat), parseFloat(long), i);

        console.log(masterAzimuthArray);

        // Placing marker for each lat long of slave
        marker[i] = new google.maps.Marker({
          map: map,
          position: { lat: parseFloat(lat), lng: parseFloat(long) },
          icon: `images/${i}.png`,
        });
        bounds.extend({ lat: parseFloat(lat), lng: parseFloat(long) });
        map.fitBounds(bounds);
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
    var slaveSectionBorder = document.createElement("div");
    slaveSectionBorder.className = "sectionBorder";

    // Div which carries the header and item div
    var slaveInputSection = document.createElement("div");
    slaveInputSection.className = `slave${i}InputSection`;

    // Input Header
    var inputHeader = document.createElement("header");
    inputHeader.innerHTML = `Slave ${i}`;

    // div for each slave row INPUT
    var slavedivIn = document.createElement("div");
    slavedivIn.className = "inputSection";
    slavedivIn.setAttribute("id", `slave${i}Inputs`);
    inputArray = ["Radio", "Height", "Gain", "Tx Power"];
    for (let j = 0; j < inputArray.length; j++) {
      // creating a div with class item
      var slaveitem1 = document.createElement("div");
      slaveitem1.className = "item";
      // created a label for the slave name
      var slavelabel = document.createElement("LABEL");
      var text = document.createTextNode(inputArray[j]);
      slavelabel.appendChild(text);
      slavelabel.className = "label";
      // created input field to enter the co-ordinates of the slaves
      switch (inputArray[j]) {
        case "Radio":
          var slaveinput = document.createElement("select");
          slaveinput.className = "select";
          slaveinput.setAttribute("id", `slave${i}Radio`);
          radioList = {
            ion4l2: "23",
            ion4l3: "25",
            ion4l4: "27",
            ion4le: "0",
          };
          for (let [key, val] of Object.entries(radioList)) {
            var radioOption = document.createElement("option");
            radioOption.value = val;
            radioOption.innerHTML = key;
            slaveinput.add(radioOption);
          }

          break;
        default:
          var slaveinput = document.createElement("input");
          slaveinput.setAttribute("type", "text");
          slaveinput.setAttribute("id", `slave${i}` + inputArray[j]);
          slaveinput.setAttribute("placeholder", inputArray[j]);
      }

      slaveitem1.append(slavelabel, slaveinput);
      slavedivIn.append(slaveitem1);
    } // end of j loop for inputs
    slaveInputSection.append(inputHeader, slavedivIn);
    slaveSectionBorder.append(slaveInputSection);
    slavecontainer.append(slaveSectionBorder);

    // function to create output fields
    // createOutputs(i, outputContainer);

    // Populating the value of antgain and txpower in the fields
    document.getElementById(`slave${i}Gain`).value = 23;
    document.getElementById(`slave${i}Tx Power`).value = 27;

    // function called to create slave output fields
    createOutputTables(
      slaveInputSection,
      slaveSectionBorder,
      slavecontainer,
      i
    );

    // event listener on Radio Fields of Slave and the Transmit Power Fields
    document
      .querySelector(`#slave${i}Radio`)
      .addEventListener("change", function () {
        var slaveRadio = parseInt(this.value);
        document.getElementById(`slave${i}Gain`).value = slaveRadio;
        if (document.getElementById(`slave${i}Co-ordinate`).value != "") {
          var masterAngle = parseFloat($("#masterAngle").val());
          var changedAngle = parseFloat(
            (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
          );
          rsl = calculateTx(changedAngle, i);
          calcSNR(rsl, i);

          // parameters required to calculate the RSL
          // var masterTx = parseFloat(
          //   document.querySelector("#masterTxPower").value
          // );
          // var masterGain = parseInt(
          //   document.querySelector("#masterRadio").value
          // );
          // var frequency = parseInt(
          //   document.querySelector("#channelFreq").values
          // );
          // var slaveTx = parseFloat(
          //   document.getElementById(`slave${i}Tx Power`).value
          // );
          // var hopDist = parseFloat(
          //   document.querySelector(`#slave${i}Distance`).innerHTML
          // );
          // calculating RSL
          // rsl = (
          //   masterGain +
          //   masterTx +
          //   slaveRadio -
          //   4 -
          //   (20 * Math.log10(hopDist) +
          //     20 * Math.log10(frequency / 1000) +
          //     92.45)
          // ).toFixed(2);
          // populating the RSL value in the slave field
          // document.querySelector(`#slave${i}RSL`).innerHTML = rsl;
          // calcSNR(rsl, i);
        }
      });

    // Second event listener to change the parameters when tx power will change
    // This will not impact the calculations for the slave as slave tx power is used to calculate the rsl of Master
    document
      .getElementById(`slave${i}Tx Power`)
      .addEventListener("change", function () {
        var slaveTx = document.getElementById(`slave${i}Tx Power`).value;
        console.log(slaveTx);
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
    ["Throughput", "In Range"],
  ];
  $("<table>", { id: `slave${i}Table`, class: "table" }).appendTo(
    $(`#tableDiv${i}`)
  );
  for (let k = 0; k < tableArr.length; k++) {
    $("<tr>", { id: `Slave${i}row${k + 1}` }).appendTo($(`#slave${i}Table`));
    for (let j = 0; j <= 1; j++) {
      $("<th>", { html: tableArr[k][j] }).appendTo($(`#Slave${i}row${k + 1}`));
      $("<td>", {
        id: `slave${i}` + tableArr[k][j],
        html: "hello",
      }).appendTo($(`#Slave${i}row${k + 1}`));
    }
  }
  slaveSectionBorder.append(slaveInputSection);
  slavecontainer.append(slaveSectionBorder);
}

// function to create output fields
function createOutputFields(
  slaveInputSection,
  slaveSectionBorder,
  slavecontainer,
  i
) {
  var outputheader = document.createElement("header");
  outputheader.innerHTML = "Outputs";
  // Slave Div for outputs/results
  var slaveDivOut = document.createElement("div");
  slaveDivOut.className = "outputsection";
  slaveDivOut.setAttribute("id", `slave${i}Outputs`);
  outputArray = [
    "HAngle",
    "Distance",
    "Fresnel",
    "RSL",
    "SNR",
    "Fade Margin",
    "MCS",
    "Modulation",
    "FEC",
    "Link Rate",
    "Throughput",
    "H Range",
    "V Range",
  ];
  for (let j = 0; j < outputArray.length; j++) {
    var slaveitem2 = document.createElement("div");
    slaveitem2.className = "item";
    // created a label for the slave name
    var slavelabel = document.createElement("LABEL");
    var text = document.createTextNode(outputArray[j]);
    slavelabel.appendChild(text);
    slavelabel.className = "label";
    var slaveoutput = document.createElement("span");
    slaveoutput.className = "slavespan";
    slaveoutput.setAttribute("id", `slave${i}` + outputArray[j]);

    slaveitem2.append(slavelabel, slaveoutput);
    slaveDivOut.append(slaveitem2);
  }
  slaveInputSection.append(slaveDivOut);
  slaveSectionBorder.append(slaveInputSection);
  slavecontainer.append(slaveSectionBorder);
}

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
  // var masterRadio = parseFloat($("#masterRadio").val());
  var slaveRadio = parseFloat($(`#slave${i}Radio`).val());
  var masterTx = parseFloat($("#masterTxPower").val());
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
  document.querySelector(`#slave${i}Distance`).innerHTML = distance;

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

  // RSL calculation
  // var rsl = (
  //   masterTx +
  //   masterRadio +
  //   slaveRadio -
  //   4 -
  //   (20 * Math.log10(distance) + 20 * Math.log10(cf / 1000) + 92.45)
  // ).toFixed(2);

  // fresnel radius calculation
  var fres = (17.32 * Math.sqrt(distance / ((4 * cf) / 1000))).toFixed(2);

  //  Populating values if azimuth, hop distance and fresnel
  document.querySelector(`#slave${i}Azimuth`).innerHTML = angleb;
  document.getElementById(`slave${i}Fresnel Radius`).innerHTML = fres;
  // document.querySelector(`#slave${i}RSL`).innerHTML = rsl;

  // function called to check whether slave is in Master Range
  slaveInMasterRange(changedAngle, i);
}

// function which takes in the changed angle and gives the txpower based on the coverage of master
function calculateTx(angle, i) {
  var mRadio = parseFloat($("#masterRadio").val());
  var masterTx = parseFloat($("#masterTxPower").val());
  var slaveRadio = parseFloat($(`#slave${i}Radio`).val());
  var hopDist = parseFloat($(`#slave${i}Distance`).html());
  var cf = $("#channelFreq").val();
  console.log(mRadio, masterTx, slaveRadio, hopDist, cf);

  // Changing gain based on the angle
  if ((angle >= 330 && angle <= 335) || (angle >= 25 && angle <= 30)) {
    mRadio = mRadio * 0.2;
  }
  //  RSL calculation
  rsl = (
    masterTx +
    mRadio +
    slaveRadio -
    4 -
    (20 * Math.log10(hopDist) + 20 * Math.log10(cf / 1000) + 92.45)
  ).toFixed(2);

  //  Populating the value of RSL
  document.querySelector(`#slave${i}RSL`).innerHTML = rsl;
  // return mTx;
  return rsl;
}

// function azimuthangle(slavelat, slavelong, i) {
//   // inputs needed
//   var master = document.querySelector("#masterCoord").value.split(",");
//   var [masterlat, masterlong] = master;
//   var masterRadio = parseFloat(document.querySelector("#masterRadio").value);
//   var slaveRadio = parseFloat(document.querySelector(`#slave${i}Radio`).value);
//   var masterTx = parseFloat(document.querySelector("#masterTxPower").value);
//   var bw = document.querySelector("#channelBW").value;
//   // var noise = noisecalc(bw);
//   var cf = document.querySelector("#channelFreq").value;
//   // Degree to radian
//   var masterLat = deg2rad(parseFloat(masterlat));
//   var masterLong = deg2rad(parseFloat(masterlong));
//   var slaveLat = deg2rad(slavelat);
//   var slaveLong = deg2rad(slavelong);
//   var diffLat = deg2rad(slavelat - parseFloat(masterlat));
//   var diffLong = deg2rad(slavelong - parseFloat(masterlong));
//   var R = 6371; //Radius of the earth in km

//   // Hop Distance Calculation
//   var a =
//     Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
//     Math.sin(diffLong / 2) *
//       Math.sin(diffLong / 2) *
//       Math.cos(masterLat) *
//       Math.cos(slaveLat);
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   var distance = Math.round(R * c * 100) / 100; // Distance in km

//   // Azimuth Calculation
//   var y = Math.sin(slaveLong - masterLong) * Math.cos(slaveLat);
//   var x =
//     Math.cos(masterLat) * Math.sin(slaveLat) -
//     Math.sin(masterLat) * Math.cos(slaveLat) * Math.cos(slaveLong - masterLong);
//   var bearing = Math.atan2(y, x);
//   bearing = rad2deg(bearing);
//   var anglea = ((bearing + 360) % 360).toFixed(2);
//   var angleb = ((anglea - 180 + 360) % 360).toFixed(2);

//   // fresnel radius calculation
//   var fres = (17.32 * Math.sqrt(distance / ((4 * cf) / 1000))).toFixed(2);

//   // RSL
//   rsl = (
//     masterTx +
//     masterRadio +
//     slaveRadio -
//     4 -
//     (20 * Math.log10(distance) + 20 * Math.log10(cf / 1000) + 92.45)
//   ).toFixed(2);

//   // SNR
//   snr = parseFloat(rsl) + noisefloor;

//   // fademargin
//   fademargin =
//     parseFloat(rsl) - parseFloat(refertable.rows[1].cells.item(0).innerHTML);

//   // mcs, modulation, etc
//   var rowlength = document.getElementById("throughput20MHz").rows.length;
//   for (let t = 1; t < rowlength; t++) {
//     var min = refertable.rows[t].cells.item(0).innerHTML;
//     var max = refertable.rows[t].cells.item(1).innerHTML;
//     if (parseFloat(rsl) >= min && parseFloat(rsl) <= max) {
//       var mcs = refertable.rows[t].cells.item(2).innerHTML;
//       var modulation = refertable.rows[t].cells.item(3).innerHTML;
//       var fec = refertable.rows[t].cells.item(4).innerHTML;
//       var linkrate = refertable.rows[t].cells.item(5).innerHTML;
//       var throughput = refertable.rows[t].cells.item(6).innerHTML;
//     } else if (parseFloat(rsl) < min) {
//       break;
//     } else {
//       continue;
//     }
//   }
//   document.querySelector(`#slave${i}Azimuth`).innerHTML = angleb;
//   document.querySelector(`#slave${i}Distance`).innerHTML = distance;
//   document.getElementById(`slave${i}Fresnel Radius`).innerHTML = fres;
//   document.querySelector(`#slave${i}RSL`).innerHTML = rsl;
//   document.querySelector(`#slave${i}SNR`).innerHTML = snr;
//   document.getElementById(`slave${i}Fade Margin`).innerHTML = fademargin;
//   document.querySelector(`#slave${i}MCS`).innerHTML = mcs;
//   document.querySelector(`#slave${i}Modulation`).innerHTML = modulation;
//   document.querySelector(`#slave${i}FEC`).innerHTML = fec;
//   document.getElementById(`slave${i}Link Rate`).innerHTML = linkrate;
//   document.querySelector(`#slave${i}Throughput`).innerHTML = throughput;
//   document.getElementById(`slave${i}In Range`).innerHTML = " ";
//   // document.getElementById(`slave${i}V Range`).innerHTML = " ";

//   return anglea;
// }

// function to calculate the noise figure basis of the bandwidth
// function noisecalc(bw) {
//   var value;
//   switch (bw) {
//     case "10":
//       value = 89;
//       refertable = document.querySelector("#throughput10MHz");
//       break;
//     case "20":
//       value = 89;
//       refertable = document.querySelector("#throughput20MHz");
//       break;
//     case "40":
//       value = 86;
//       refertable = document.querySelector("#throughput40MHz");
//       break;
//     case "80":
//       value = 83;
//       refertable = document.querySelector("#throughput80MHz");
//       break;
//   }
//   console.log(refertable);
//   return [value, refertable];
// }

function checkMasterRange() {
  var numOfSlaves = document.getElementById("numberOfSlaves").value;
  if (numOfSlaves != "") {
    var masterAngle = parseFloat(document.querySelector("#masterAngle").value);
    for (let i = 1; i <= masterAzimuthArray.length; i++) {
      if (document.getElementById(`slave${i}Co-ordinate`).value != "") {
        var changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        var hopDist = document.querySelector(`#slave${i}Distance`).innerHTML;
        // checking if the changed angle will make a change to the txpower and the calculations followed

        rsl = calculateTx(changedAngle, i);
        //  calling function to calculate SNR etc
        calcSNR(rsl, i);

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
            document.getElementById(`slave${i}In Range`).innerHTML = "Yes";
            document.querySelector(`#slave${i}Distance`).style.color = "Green";
            document.querySelector(`#slave${i}Azimuth`).style.color = "Green";
          } else {
            document.getElementById(`slave${i}In Range`).innerHTML = "No";
            document.querySelector(`#slave${i}Distance`).style.color = "Red";
            document.querySelector(`#slave${i}Azimuth`).style.color = "Green";
          }
        } else {
          document.getElementById(`slave${i}In Range`).innerHTML = "No";
          document.querySelector(`#slave${i}Azimuth`).style.color = "Red";
          document.querySelector(`#slave${i}Distance`).style.color = "Black";
        }
      }
    }
  }
}