// javascript file containing function which will be called when certain parameters:
//  tx power, antenna gain, channel bw, frequency, height undergo a change

// Checking the value of the Master angle : to lie in 0 to 360 range.

function checkAngle() {
  var masterAngle = document.getElementById("masterAngle").value;
  if (masterAngle < 0 || masterAngle > 360) {
    window.alert("Master Angle can be in range 0 to 360");
  } else {
    checkMasterRange();
  }
}

// Master changes
// when Master Radio changes

function masterRadioChanged() {
  console.log("masterRadioChange function called");
  // slavesinput is the div which contains the slaves, will check if it is empty or not to prceed
  slavesinput = document.getElementById("slavesInput").innerHTML;
  // master radio changed so gain chagnes
  var masterGain = parseFloat(document.querySelector("#masterRadio").value);
  // populating the gain field with new gain
  document.querySelector("#masterAntGain").value = masterGain;
  if (slavesinput != "") {
    var numOfSlaves = document.querySelector("#numberOfSlaves").value;
    var masterAngle = parseFloat($("#masterAngle").val());
    for (let i = 1; i <= numOfSlaves; i++) {
      // Before proceeding check if the co-ordinate field of the slave is not empty.
      if (document.querySelector(`#slave${i}Co-ordinate`).value != "") {
        changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        rsl = calculateTx(changedAngle, i);
        calcSNR(rsl, i);
      } else {
        continue;
      }
    }
  }
}

// function to be called when transmit power is changed
function masterTxChange() {
  // var masterTx = parseFloat(document.querySelector("#masterTxPower").value);
  // var masterGain = parseFloat(document.querySelector("#masterRadio").value);
  var masterAngle = parseFloat($("#masterAngle").val());
  var slavesinput = document.querySelector("#slavesInput").innerHTML;
  if (slavesinput != "") {
    var numOfSlaves = document.querySelector("#numberOfSlaves").value;
    // var bandwidth = document.querySelector("#channelBW").value;
    // var frequency = document.querySelector("#channelFreq").value;
    for (let i = 1; i <= numOfSlaves; i++) {
      if (document.querySelector(`#slave${i}Co-ordinate`).value != "") {
        changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        rsl = calculateTx(changedAngle, i);
        // var slaveGain = parseFloat(
        //   document.querySelector(`#slave${i}Radio`).value
        // );
        // var slaveTxPower = parseFloat(
        //   document.getElementById(`slave${i}Tx Power`).value
        // );
        // var hopDist = parseFloat(
        //   document.querySelector(`#slave${i}Distance`).innerHTML
        // );
        // rsl = (
        //   masterGain +
        //   masterTx +
        //   slaveGain -
        //   4 -
        //   (20 * Math.log10(hopDist) + 20 * Math.log10(frequency / 1000) + 92.45)
        // ).toFixed(2);

        // // populating the RSL value in the slave field
        // document.querySelector(`#slave${i}RSL`).innerHTML = rsl;
        calcSNR(rsl, i);
      } else {
        continue;
      }
    }
  }
}

// function called when bandwidth changed
function bandwidthChange() {
  // var bw = document.querySelector("#channelBW").value;
  // var masterAngle = parseFloat($("#masterAngle").val());
  var frequency = document.querySelector("#channelFreq").value;
  // var masterGain = parseFloat(document.querySelector("#masterRadio").value);
  // var masterTx = parseFloat(document.querySelector("#masterTxPower").value);
  var masterAngle = parseFloat($("#masterAngle").val());
  var slavesinput = document.getElementById("slavesInput").innerHTML;
  if (slavesinput != "") {
    var numOfSlaves = document.querySelector("#numberOfSlaves").value;
    for (let i = 1; i <= numOfSlaves; i++) {
      // Check if value of slave co-ordinate is not mepty before proceeding
      if (document.querySelector(`#slave${i}Co-ordinate`).value != "") {
        var hopDist = parseFloat($(`#slave${i}Distance`).html());
        // fresnel radius calculation
        var fres = (
          17.32 * Math.sqrt(hopDist / ((4 * frequency) / 1000))
        ).toFixed(2);
        // populating fresnel radius
        document.getElementById(`slave${i}Fresnel Radius`).innerHTML = fres;
        var changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        console.log(masterAngle, changedAngle);
        rsl = calculateTx(changedAngle, i);

        calcSNR(rsl, i);
      } else {
        continue;
      }
    }
  }
}

// function called when channel frequency is changed
function frequencyChanged() {}

// GENERAL FUNCTION
function calcSNR(rsl, i) {
  // SNR
  snr = (parseFloat(rsl) + noisefloor).toFixed(2);

  // fademargin
  fademargin =
    parseFloat(rsl) - parseFloat(refertable.rows[1].cells.item(0).innerHTML);

  // mcs, modulation, etc
  var rowlength = document.getElementById("throughput20MHz").rows.length;
  for (let t = 1; t < rowlength; t++) {
    var min = refertable.rows[t].cells.item(0).innerHTML;
    var max = refertable.rows[t].cells.item(1).innerHTML;
    if (parseFloat(rsl) >= min && parseFloat(rsl) <= max) {
      var mcs = refertable.rows[t].cells.item(2).innerHTML;
      var modulation = refertable.rows[t].cells.item(3).innerHTML;
      var fec = refertable.rows[t].cells.item(4).innerHTML;
      var linkrate = refertable.rows[t].cells.item(5).innerHTML;
      var throughput = refertable.rows[t].cells.item(6).innerHTML;
    } else if (parseFloat(rsl) < min) {
      break;
    } else {
      continue;
    }
  }
  document.querySelector(`#slave${i}SNR`).innerHTML = snr;
  document.getElementById(`slave${i}Fade Margin`).innerHTML = fademargin;
  document.querySelector(`#slave${i}MCS`).innerHTML = mcs;
  document.querySelector(`#slave${i}Modulation`).innerHTML = modulation;
  document.querySelector(`#slave${i}FEC`).innerHTML = fec;
  document.getElementById(`slave${i}Link Rate`).innerHTML = linkrate;
  document.querySelector(`#slave${i}Throughput`).innerHTML = throughput;
}
