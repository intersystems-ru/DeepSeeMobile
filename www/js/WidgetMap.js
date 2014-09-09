/**
 * Hash-table<br>
 * Connects widget types from DeepSee to mobile realization.<br>
 * E.g. DeepSee has "barChart", which we interpret as Widget with type "highcharts" and subtype "bar" (which gets into HighcharstWidget with type "bar")
 * @module WidgetMap
 */
define(['MessageCenter'], function (mc) {
    return {
        "barChart": {

            type: "highcharts",
            callback: function (d) {

                console.log("HERE:", d);
                var data = d.data;
                //this.config.xAxis.type="category";
                //this.config.xAxis.showEmpty = false;
                this.config.xAxis.title = {
                    text: data.axes[1].caption
                };
                this.config.yAxis.title = {
                    text: data.axes[0].caption
                };
                for (var i = 0; i < data.axes[1].tuples.length; i++) {
                    this.config.xAxis.categories.push(data.axes[1].tuples[i].caption.toString());
                    data.cells[i] = {
                        y: data.cells[i],
                        drilldown: true,
                        cube: data.cubeName,
                        path: data.axes[1].tuples[i].path
                    };
                };

                this.config.series = [{
                    colorByPoint: true,
                    data: data.cells,
                    name: data.axes[0].caption
                }];

                console.log(this.config);
                //this.renderWidget();

            },
            config: {
                chart: {
                    type: 'bar',
                    events: {
                        drilldown: function (e) {

                            var chart = this;
                            console.log(">",this);
                            var _categories = this.axes[0].categories;
                            this.axes[0].categories = [];
                            console.log("chart=", chart);
                            console.log("[pint = ", e.point);
                            // Show the loading label
                            chart.showLoading('Doing drilldown ...');
                            var mc = require("MessageCenter");
                            mc.subscribe("data_acquired:drilldown", {
                                subscriber: this,
                                callback: function (d) {
                                    console.log('Drilldown data:', d);
                                    var transformedData = [];
                                    if (typeof d == "object" && (d.length != 0) && d.data != null && d.data != "null") {
                                        d = d.data;
                                        for (var i = 0; i < d.axes[1].tuples.length; i++) {
                                            transformedData.push({
                                                name: d.axes[1].tuples[i].caption,
                                                path: d.axes[1].tuples[i].path,
                                                cube: d.cubeName,
                                                data: d.cells[i]
                                            });
                                        }
                                        d = transformedData;
                                    }
                                    var data = d;
                                    console.log(chart);
                                    var retVal = [{
                                        name: chart.userOptions.yAxis.title.text,
                                        data: []
                                        }]
                                    for (var i = 0; i < data.length; i++) {
                                        retVal[0].data.push({
                                            name: data[i].name,
                                            y: data[i].data,
                                            path: data[i].path,
                                            cube: data[i].cube
                                        });
                                    };
                                    chart.hideLoading();
                                    chart.addSeriesAsDrilldown(e.point, retVal[0]);
                                    chart.axes[0].categories = _categories;
                                },
                                once: true
                            });
                            mc.publish("data_requested:drilldown", {
                                cubeName: e.point.cube,
                                path: e.point.path
                                //name: chart.userOptions.axes[0]
                            });
                            mc = null;

                        }
                    }
                },
                xAxis: {
                    categories: []
                },
                yAxis: {},

                series: [],
                drilldown: {
                    series: []
                }

            }
        },
        "pieChart": {
            type: "highcharts",
            callback: function (_d) {
                var data = _d.data;
                var retVal = [];
                this.config.series[0].name = data.axes[0].caption;
                for (var d = 0; d < data.axes[1].tuples.length; d++) {
                    retVal.push([data.axes[1].tuples[d].caption, data.cells[d]]);
                };
                console.log("GOT DATA PIE:", this, retVal);
                this.config.series[0].data = retVal;
                //                this.renderWidget();
            },
            config: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                        }
                    }
                },
                series: [{
                    type: "pie",
                    data: []
                }]
            }
        },
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
        "null": {
            type: "none",
            callback: function (d) {
                console.log(d,this);
                $("#widget"+this.id).parent().parent().find("h1").text("Widget is not yet implemented");
            },
            title: "Not implemented",
            config: {},
            filters: []
        },
        "pivot": {
            type: "pivot",
            convertor: function (d) {
                
                var rowsAxisCaption = d.data.axes[1].caption || "Rows";
                var transformedData = {
                    data: [],
                    measures: ['Count'],
                    cols: ['Cols'],
                    rows: [rowsAxisCaption],

                };
                //TODO: Получать заголовок
                for (var i = 0; i < d.data.axes[1].tuples.length; i++) {
                    for (var j = 0; j < d.data.axes[0].tuples.length; j++) {
                        var dataEntry = {};
                        dataEntry[rowsAxisCaption] = d.data.axes[1].tuples[i].caption;
                        dataEntry["Cols"] = d.data.axes[0].tuples[j].caption;
                        dataEntry["Count"] = d.data.cells[i * d.data.axes[0].tuples.length + j];
                        dataEntry["rowDrilldown"] = d.data.axes[1].tuples[i].path;
                        transformedData.data.push(dataEntry);

                    };
                };
                return transformedData;

            },
            callback: function (d, _widget) {
                d.onDrillDown = (function (mc) {
                    return function (path) {
                        mc.subscribe("data_acquired:drilldown", {
                            subscriber: _widget,
                            callback: function (d) {
                                this.onDataAcquired(d, true);
                            },
                            once: true
                        })
                        mc.publish("data_requested:drilldown", {
                            cubeName: "HoleFoods",
                            path: path,
                            widget: _widget
                            //name: chart.userOptions.axes[0]
                        });

                    };
                })(mc);
                this.config = $.extend(this.config, d);
            },
            config: {},
            filters: []
        }
    };
});