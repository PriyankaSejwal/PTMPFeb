var map, bounds, masterMarker;
function initMap() {
  var options = {
    zoom: 12,
    center: { lat: 28.776534, lng: 78.12354 },
  };
  map = new google.maps.Map(document.getElementById("map"), options);
  bounds = new google.maps.LatLngBounds();
}

function placeMasterOnMap() {
  masterAzimuthArray = [];
  var masterCoord = document.querySelector("#masterCoord").value.split(",");

  var pos = {
    lat: parseFloat(masterCoord[0]),
    lng: parseFloat(masterCoord[1]),
  };
  const image = "images/icons8-internet-antenna-32.png";
  if (masterMarker != null) {
    masterMarker.setMap(null);
  }
  masterMarker = new google.maps.Marker({
    map: map,
    position: pos,
    icon: image,
  });
  console.log(masterMarker);
  bounds.extend(pos);
  map.fitBounds(bounds);

  // function which when called will check if slave co-ord details are there
  // then will recalculate everything with new master co-ordinates
  coordMasterChange();
}

function coordMasterChange() {
  var numOfSlaves = document.querySelector("#numberOfSlaves").value;
  if (numOfSlaves != "") {
    for (i = 1; i <= numOfSlaves; i++) {
      if (document.querySelector(`#slave${i}Co-ordinate`).value != "") {
        var coordSlave = document
          .querySelector(`#slave${i}Co-ordinate`)
          .value.split(",");
        var [lat, long] = coordSlave;
        var azimuthCal = azimuthangle(parseFloat(lat), parseFloat(long), i);
        masterAzimuthArray[i - 1] = azimuthCal;
      } else {
        continue;
      }
      console.log(masterAzimuthArray);
    }
  }
}
