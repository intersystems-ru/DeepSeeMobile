/**
 * Hash-table<br>
 * Connects widget types from DeepSee to mobile realization.<br>
 * E.g. DeepSee has "barChart", which we interpret as Widget with type "highcharts" and subtype "bar" (which gets into HighcharstWidget with type "bar")
 * @module WidgetMap
 */
define([
    "MessageCenter",
    "charts/LineChart",
    "charts/ColumnChart",
    "charts/BarChartStacked",
    "charts/BarChart",
    "charts/PieChart",
    "charts/AreaChart",
    "charts/TimeChart",
    "charts/XYChart"
    /* TODO: add widgets
    "charts/BubbleChart",
    "charts/HiLowChart",
    "charts/TreeMap"*/],
    function (
        mc,
        lineChart,
        columnChart,
        barChartStacked,
        barChart,
        pieChart,
        areaChart,
        timeChart,
        xyChart
        /* TODO: add widgets
        bubbleChart,
        hiLowChart,
        treeMapChart*/
        ) {

    var map = {};

    map.lineChart = lineChart;
    map.columnChart = columnChart;
    map.barChartStacked = barChartStacked;
    map.areaChart = areaChart;
    map.barChart = barChart;
    map.pieChart = pieChart;
    map.timeChart = timeChart;
    map.xyChart = xyChart;
    /* TODO: add widgets
    map.bubbleChart = bubbleChart;
    map.hilowChart = hiLowChart;
    map.treeMapChart = treeMapChart;
    */

    // column chart stacked same as barChartStacked except type
    map.columnChartStacked = {};
    $.extend(true, map.columnChartStacked, barChartStacked);
    map.columnChartStacked.config.chart.type = "column";

    // linechart markers same as linechart
    map.lineChartMarkers = {}
    $.extend(true, map.lineChartMarkers, lineChart);
    map.lineChartMarkers.config.plotOptions.series.marker.enabled = true;

    map.pivot =  {
        type: "pivot",
        config: {},
        filters: []
    };
    map.textMeter = {
        type: "textMeter",
            callback: function (d) {
            this.config.textData = d;
        },
        title: "",
        config: {},
        filters: []
    };

    map["null"] = {
        type: "none",
        callback: function (d) {
            $("#widget" + this.id).text("Widget is not yet implemented").css("text-align", "center");
        },
        title: "Not implemented",
        config: {},
        filters: []
    };

    return map;
});