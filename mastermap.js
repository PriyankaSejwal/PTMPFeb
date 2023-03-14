var map, reportMap, bounds, reportbounds, masterMarker;
function initMap() {
  var options = {
    zoom: 12,
    center: { lat: 28.776534, lng: 78.12354 },
  };
  map = new google.maps.Map(document.getElementById("map"), options);
  bounds = new google.maps.LatLngBounds();
  // Installation Report Map
  reportMap = new google.maps.Map(
    document.querySelector("#reportmap"),
    options
  );
  reportbounds = new google.maps.LatLngBounds();
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
  marker[0] = new google.maps.Marker({
    map: map,
    position: pos,
    icon: image,
  });
  reportmarker[0] = new google.maps.Marker({
    map: reportMap,
    position: pos,
    icon: image,
  });
  console.log(masterMarker);
  bounds.extend(pos);
  map.fitBounds(bounds);

  reportbounds.extend(pos);
  reportMap.fitBounds(reportbounds);

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
