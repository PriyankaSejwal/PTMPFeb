// Master parameters calculated

function slaveInMasterRange(changedAngle, i) {
  var hopDist = document.querySelector(`#Distance${i}1`).innerHTML;
  // upper and below vertical limit
  var upVerticalRange = Math.tan((5 * Math.PI) / 180) * hopDist;
  upVerticalRange = (upVerticalRange * 1000).toFixed(3);
  var belowVerticalRange = -upVerticalRange;
  // document.getElementById(`slave${i}V Range`).innerHTML =
  //   upVerticalRange + "," + belowVerticalRange;
  // value of tx angle based on the master changed angle
  calculateTx(changedAngle, i);

  // calling function to calculate SNR and following parameters
  calcSNR(i);
  // checking for the slave inclusion in the master beamwidth range
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
