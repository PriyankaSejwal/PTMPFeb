// Master parameters calculated

function slaveInMasterRange(changedAngle, i) {
  var hopDist = document.querySelector(`#slave${i}Distance`).innerHTML;
  // upper and below vertical limit
  var upVerticalRange = Math.tan((5 * Math.PI) / 180) * hopDist;
  upVerticalRange = (upVerticalRange * 1000).toFixed(3);
  var belowVerticalRange = -upVerticalRange;
  // document.getElementById(`slave${i}V Range`).innerHTML =
  //   upVerticalRange + "," + belowVerticalRange;
  // value of tx angle based on the master changed angle
  var rsl = calculateTx(changedAngle, i);

  // calling function to calculate SNR and following parameters
  calcSNR(rsl, i);
  // checking for the slave inclusion in the master beamwidth range
  if (
    (changedAngle < 360 && changedAngle > 330) ||
    (changedAngle > 0 && changedAngle < 30)
  ) {
    if (hopDist <= 5) {
      document.getElementById(`slave${i}In Range`).innerHTML = "In Range";
      document.querySelector(`#slave${i}Distance`).style.color = "Green";
      document.querySelector(`#slave${i}Azimuth`).style.color = "Green";
    } else {
      document.getElementById(`slave${i}In Range`).innerHTML = "Out";
      document.querySelector(`#slave${i}Distance`).style.color = "Red";
      document.querySelector(`#slave${i}Azimuth`).style.color = "Green";
    }
  } else {
    document.getElementById(`slave${i}In Range`).innerHTML = "Out";
    document.querySelector(`#slave${i}Azimuth`).style.color = "Red";
    document.querySelector(`#slave${i}Distance`).style.color = "Black";
  }
}
