function createMasterTable() {
  var numOfSlaves = $("#numberOfSlaves").val();
  var numOfRows = $("#masterTable tr").length;
  var ArrMaster = [
    "Azimuth",
    "RSL",
    "SNR",
    "Fade Margin",
    "MCS",
    "Modulation",
    "FEC",
    "Link Rate",
    "Throughput",
  ];
  for (let j = 0; j < numOfSlaves; j++) {
    $("<th>", { html: `Slave ${j + 1}` }).appendTo(
      $(`#masterTable tr:nth-child(1)`)
    );
  }
  for (let i = 0; i < ArrMaster.length; i++) {
    for (let j = 0; j < numOfSlaves; j++) {
      $("<td>", { id: ArrMaster[i] + `${j + 1}0` }).appendTo(
        $(`#masterTable tbody tr:nth-child(${i + 2})`)
      );
    }
  }
}
