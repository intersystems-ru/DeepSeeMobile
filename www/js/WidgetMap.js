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
    "charts/TimeChart"
    /*"charts/BubbleChart",
    "charts/XYChart",
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
        timeChart
        /* TODO: add widgets
        bubbleChart,
        xyChart,
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
    /* TODO: add widgets
    map.bubbleChart = bubbleChart;
    map.xyChart = xyChart;
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

    /*map.timeChart = {};
    $.extend(true, map.timeChart, lineChart);
    map.timeChart.config.zoomType = 'x';
    map.timeChart.config.pinchType = 'x';*/


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

/*
    return {
        "speedometer": {
            type: "highcharts",
            callback: function (d) {

                chart = $('#widget' + this.id).highcharts();
                if (!chart) this.renderWidget();
                if (chart && chart.series && chart.series.length > 0) {
                    var point = chart.series[0].points[0],
                        newVal;

                    newVal = d[0].data;
                    point.update(newVal);
                }
            },
            config: {
                chart: {
                    type: 'solidgauge'
                },


                pane: {
                    center: ['50%', '60%'],
                    size: '100%',
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },

                tooltip: {
                    enabled: false
                },

                // the value axis
                yAxis: {
                    min: 0,
                    max: 30000,

                    stops: [
                [0.1, '#55BF3B'], // green
                      [0.5, '#ffff00'], // yellow
                      [0.9, '#DF5353'] // red
               ],
                    lineWidth: 0,
                    minorTickInterval: null,
                    tickPixelInterval: 400,
                    tickWidth: 0,
                    title: {
                        y: -70
                    },
                    labels: {
                        y: 16
                    }
                },

                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            y: 5,
                            borderWidth: 0,
                            useHTML: true
                        }
                    }
                },


                credits: {
                    enabled: false
                },

                series: [{
                    name: 'Speed',
                    data: [80]
                }]

            },

        },
        "":{
            type:"highcharts",
            callback: function (d) {
                var data = d.data;
                for (var i = 0; i < data.axes[1].tuples.length; i++) {
                    data.cells[i] = [data.axes[1].tuples[i].caption.toString(), data.cells[i]];
                };

                this.config.series = [{
                    data: data.cells,
                    name: data.axes[0].caption
                }];
                 

                //console.log(this.config);
                //this.renderWidget();

            },
            config:{
        chart: {
            type: 'pyramid',
            marginRight: 100
        },
        title: {
            text: ''
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>({point.y:,.0f})',
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    softConnector: true
                }
            }
        },
        
        series: [{}]
    }
        }
    };*/
});