function downloadExport() {
  var exportoption = $("#reportExport").val();
  if (exportoption == "print") {
    window.print();
  } else if (exportoption == "excel") {
    window.alert("Excel download");
  }
  $("#reportExport").prop("selectedIndex", 0);
}
