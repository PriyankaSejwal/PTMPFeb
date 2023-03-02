// Master parameters calculated

function slaveInMasterRange(changedAngle, i) {
  var hopDist = $(`#Distance${i}1`).html();
  var masterBeamwidth = parseInt($("#masterRadio").val().split(",")[1]);
  // upper and below vertical limit
  var upVerticalRange = Math.tan((5 * Math.PI) / 180) * hopDist;
  upVerticalRange = (upVerticalRange * 1000).toFixed(3);
  var belowVerticalRange = -upVerticalRange;
  // value of tx angle based on the master changed angle
  calculateTx(changedAngle, i);

  // calling function to calculate SNR and following parameters
  calcSNR(i);
  // checking for the slave inclusion in the master beamwidth range
  var halfBeam = masterBeamwidth / 2;
  var upperRightLimit = halfBeam;
  var upperLeftLimit = 360;
  var lowerRightLimit = 0;
  var lowerLeftLimit = 360 - halfBeam;
  console.log(upperRightLimit, upperLeftLimit, lowerRightLimit, lowerLeftLimit);
  if (
    (changedAngle < upperLeftLimit && changedAngle > lowerLeftLimit) ||
    (changedAngle > lowerRightLimit && changedAngle < upperRightLimit)
  ) {
    document.querySelector(`#Azimuth${i}1`).style.color = "Green";
    if (hopDist <= 5) {
      document.getElementById(`In Range${i}1`).innerHTML = "Yes";
      document.querySelector(`#Distance${i}1`).style.color = "Green";
      polyLine[i].setOptions({ strokeColor: "Green" });
    } else {
      document.getElementById(`In Range${i}1`).innerHTML = "No";
      document.querySelector(`#Distance${i}1`).style.color = "Red";
      polyLine[i].setOptions({ strokeColor: "Red" });
    }
  } else {
    document.getElementById(`In Range${i}1`).innerHTML = "No";
    document.querySelector(`#Azimuth${i}1`).style.color = "Red";
    document.querySelector(`#Distance${i}1`).style.color = "Black";
    polyLine[i].setOptions({ strokeColor: "Red" });
  }
}
