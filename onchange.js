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
  // slavesinput is the div which contains the slaves, will check if it is empty or not to prceed
  slavesinput = $("#slavesInput").html();
  // master radio changed so gain chagnes
  var masterGain = parseFloat($("#masterRadio").val().split(",")[0]);
  // populating the Master gain field with new gain
  $("#masterAntGain").val(masterGain);
  if (slavesinput != "") {
    var numOfSlaves = document.querySelector("#numberOfSlaves").value;
    var masterAngle = parseFloat($("#masterAngle").val());
    for (let i = 1; i <= numOfSlaves; i++) {
      // Before proceeding check if the co-ordinate field of the slave is not empty.
      if (document.querySelector(`#slave${i}Co-ordinate`).value != "") {
        changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        slaveInMasterRange(changedAngle, i);
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
        calculateTx(changedAngle, i);
        calcSNR(i);
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
        var hopDist = parseFloat($(`#Distance${i}1`).html());
        // fresnel radius calculation
        var fres = (
          17.32 * Math.sqrt(hopDist / ((4 * frequency) / 1000))
        ).toFixed(2);
        // populating fresnel radius
        document.getElementById(`Fresnel Radius${i}1`).innerHTML = fres;
        var changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        console.log(masterAngle, changedAngle);
        calculateTx(changedAngle, i);

        calcSNR(i);
      } else {
        continue;
      }
    }
  }
}

// function called when channel frequency is changed
function frequencyChanged() {}

// GENERAL FUNCTION
function calcSNR(i) {
  for (let j = 0; j <= 1; j++) {
    var rsl = $(`#RSL${i}${j}`).html();
    // SNR
    snr = (parseFloat(rsl) + noisefloor).toFixed(2);

    // fademargin
    fademargin =
      parseFloat(rsl) - parseFloat(refertable.rows[1].cells.item(0).innerHTML);

    console.log(snr, fademargin);

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
    document.querySelector(`#SNR${i}${j}`).innerHTML = snr;
    $(`#reportSlave${i}SNR${j}`).html(snr);
    document.getElementById(`Fade Margin${i}${j}`).innerHTML =
      fademargin.toFixed(2);
    $(`#reportSlave${i}FadeMargin${j}`).html(fademargin.toFixed(2));
    document.querySelector(`#MCS${i}${j}`).innerHTML = mcs;
    $(`#reportSlave${i}MCS${j}`).html(mcs);
    document.querySelector(`#Modulation${i}${j}`).innerHTML = modulation;
    $(`#reportSlave${i}Modulation${j}`).html(modulation);
    document.querySelector(`#FEC${i}${j}`).innerHTML = fec;
    $(`#reportSlave${i}FEC${j}`).html(fec);
    document.getElementById(`Link Rate${i}${j}`).innerHTML = linkrate;
    $(`#reportSlave${i}LinkRate${j}`).html(linkrate);
    document.querySelector(`#Throughput${i}${j}`).innerHTML = throughput;
    $(`#reportSlave${i}Throughput${j}`).html(throughput);
    // Check for Radio if from CPE group
    if ($(`#slave${i}Radio option:selected`).html().includes("CPE")) {
      console.log("CPE Radio");
      if (throughput > 300) {
        $(`#Throughput${i}${j}`).html(300);
        $(`#reportSlave${i}Throughput${j}`).html(300);
      }
    }
  }
  availability(i);
  // calling function which will calculate the ptmp throughput
  throughputPTMP();
}
