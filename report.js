var reportmarker = [];
var reportpolyline = [];
$("#reportButton").click(function () {
  // Report Map Marker and Polyline display

  // for (let i = 0; i < marker.length; i++) {
  //   pos = marker[i].getPosition();
  //   reportmarker[i] = new google.maps.Marker({
  //     map: reportMap,
  //     position: pos,
  //     icon: `images/${i}.png`,
  //   });
  //   reportbounds.extend(pos);
  // }
  // for (let j = 1; j < marker.length; j++) {
  //   reportpolyline[j-1] = new google.maps.Polyline({
  //     map: reportMap,
  //     path: [marker[0].getPosition(), marker[j].getPosition()],
  //     strokeOpacity: 0.4,
  //   });
  // }
  reportMap.fitBounds(reportbounds);
  reportMap.setZoom(14);

  // Populating the Summary for Master and each Slave
  var numSlaves = $("#numberOfSlaves").val();
  $("#reportMasterRadio").html($("#masterRadio option:selected").html());
  $("#reportMasterCo-ord").html($("#masterCoord").val());
  $("#reportMasterBeam").html($("#masterRadio").val().split(",")[1]);
  $("#reportNumOfSlaves").html(numSlaves);
  $("#reportMaxRange").html("5 Km");
  $("#reportBandwidth").html($("#channelBW").val());
  $("#reportFrequency").html($("#channelFreq").val());

  // Slave Summary
  for (let i = 1; i <= numSlaves; i++) {
    $(`#reportSlave${i}Name`).html($(`#slave${i}Radio option:selected`).html());
    $(`#reportSlave${i}Co-ordinate`).html($(`#slave${i}Co-ordinate`).val());
    $(`#reportSlave${i}Gain`).html($(`#slave${i}Gain`).val());
    $(`#reportSlave${i}Power`).html($(`#slave${i}Tx`).val());
    $(`#reportSlave${i}Loss`).html("2");
    $(`#reportSlave${i}Height`).html($(`#slave${i}Height`).val());
  }
});

function creatingReportDiv() {
  var numOfSlaves = parseInt($("#numberOfSlaves").val());
  console.log(numOfSlaves);
  for (let i = 1; i <= numOfSlaves; i++) {
    // For Slave i Row 1, this will contain the summary of the parameters and the path profile in one row.
    var heading = $("<div>", { class: "heading", html: "Slave Summary" });
    var table = $("<table>", {
      class: "table table-condensed table-striped",
      id: `slave${i}SummaryTable`,
    });
    var tBody = $("<tbody>");
    heading.appendTo(
      $("<div>", {
        class: "report-content",
        id: `slave${i}ReportContent1`,
      }).appendTo(
        $("<div>", {
          class: "col-6 report-holder",
        }).appendTo(
          $("<div>", { class: "row", id: `slave${i}Row1` }).appendTo(
            $(".modal-body")
          )
        )
      )
    );
    // appending table to Slave Report Content
    table.appendTo($(`#slave${i}ReportContent1`));
    tBody.appendTo(`#slave${i}SummaryTable`);

    // Second col-6 to be added to row 1
    var heading = $("<div>", { class: "heading", html: "Path Profile" });
    heading.appendTo(
      $("<div>", {
        class: "report-content",
        id: `slave${i}ReportContent2`,
      }).appendTo(
        $("<div>", { class: "col-6 report-holder" }).appendTo(`#slave${i}Row1`)
      )
    );

    // Summary Array
    var summaryArray = [
      "Name",
      "Co-ordinate",
      "Gain",
      "Power",
      "Loss",
      "Height",
    ];
    var labelArray = [
      "Name",
      "Co-ordinate",
      "Antenna Gain",
      "Tx Power",
      "Cable Loss",
      "Height",
    ];
    var unitArray = ["", "", " dB", " dBm", " dBm", " m"];
    for (let k = 1; k <= summaryArray.length; k++) {
      $("<tr>").appendTo(`#slave${i}SummaryTable`);
      $("<th>", { html: labelArray[k - 1] }).appendTo(
        $(`#slave${i}SummaryTable tr:nth-child(${k})`)
      );
      $("<span>", { id: `reportSlave${i}` + summaryArray[k - 1] }).appendTo(
        $("<td>").appendTo($(`#slave${i}SummaryTable tr:nth-child(${k})`))
      );
      $("<span>", { html: unitArray[k - 1] }).appendTo(
        `#slave${i}SummaryTable tr:nth-child(${k}) td:nth-of-type(${1})`
      );
    }

    // Row 2 for Slave i, this will contain the calculated stats both uplink and  downlink
    var heading = $("<div>", {
      class: "heading",
      html: `Slave ${i} Statistic`,
    });
    heading.appendTo(
      $("<div>", {
        class: "report-content",
        id: `slave${i}ReportContent3`,
      }).appendTo(
        $("<div>", { class: "col-12 report-holder" }).appendTo(
          $("<div>", { class: "row", id: `slave${i}Row2` }).appendTo(
            ".modal-body"
          )
        )
      )
    );

    // creating table for stats
    var table = $("<table>", {
      class: "table table-condensed table-striped",
      id: `slave${i}StatsTable`,
    });

    var tBody = $("<tbody>");

    // appending table to the reort content
    table.appendTo($(`#slave${i}ReportContent3`));
    tBody.appendTo($(`#slave${i}StatsTable`));

    // Creating tr td in the Stats table
    var labelStats = [
      "Distance",
      "Fresnel Radius",
      "Azimuth",
      "RSL",
      "SNR",
      "Fade Margin",
      "MCS",
      "Link Rate",
      "Throughput",
      "Link Availability",
    ];
    var statsArray = [
      "Distance",
      "Fresnel",
      "Azimuth",
      "RSL",
      "SNR",
      "FadeMargin",
      "MCS",
      "LinkRate",
      "Throughput",
      "Availability",
    ];
    var unitArray = [
      " Km",
      " m",
      " °",
      " dBm",
      " dB",
      " dB",
      "",
      " Mbps",
      " Mbps",
      " %",
    ];
    for (let k = 1; k <= statsArray.length; k++) {
      $("<tr>").appendTo(`#slave${i}StatsTable`);
      $("<th>", { html: labelStats[k - 1] }).appendTo(
        `#slave${i}StatsTable tr:nth-child(${k})`
      );
      for (let j = 0; j <= 1; j++) {
        $("<span>", { id: `reportSlave${i}` + statsArray[k - 1] + j }).appendTo(
          $("<td>").appendTo(`#slave${i}StatsTable tr:nth-child(${k})`)
        );
        $("<span>", { html: unitArray[k - 1] }).appendTo(
          `#slave${i}StatsTable tr:nth-child(${k}) td:nth-of-type(${j + 1})`
        );
      }
    }
  }
}
