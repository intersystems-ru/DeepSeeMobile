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

                //console.log("HERE:", d);
                var data = d.data;
                //this.config.xAxis.type="category";
                //this.config.xAxis.showEmpty = false;
                this.config.xAxis.title = {
                    text: data.axes[1].caption
                };
                this.config.yAxis.title = {
                    text: data.defaultCaption || data.axes[0].caption
                };
                var _pos = 0;
                this.config.xAxis.categories = [];
                this.config.series = [];
                for (var i = 0; i < data.axes[1].tuples.length; i++) {
                    this.config.xAxis.categories.push(data.axes[1].tuples[i].caption.toString());
                }

                for(var j = 0; j< data.axes[0].tuples.length; j++){
                var tempData = [];
                for(var i = 0; i< data.axes[1].tuples.length; i++){
                        tempData[i] = {
                        y: data.cells[i* data.axes[0].tuples.length + j],
                        drilldown: true,
                        cube: data.cubeName,
                        path: data.axes[1].tuples[i].path
                        };
                        
                    };
                
                this.config.series.push({
                        colorByPoint:  (data.axes[0].tuples.length>1) ? false : true,
                        data: tempData,
                        name: data.axes[0].tuples[j].caption
                        });
                }

            },
            config: {
                chart: {
                    type: 'bar',
                    events: {
                        drilldown: function (e) {
                            if(this._isDrilldown) return;
                            this._isDrilldown = true;
                            var chart = this;
                            //var catName = chart.options.xAxis[0].title.text;
                            
                            // Show the loading label
                            chart.showLoading('Doing drilldown ...');
                            var mc = require("MessageCenter");
                            mc.subscribe("data_acquired:drilldown", {
                                subscriber: this,
                                callback: function (d) {
                                    chart._categories = (this.axes[0].categories[0]==undefined) ? this.userOptions.xAxis.categories : this.axes[0].categories;
                                    chart.axes[0].categories = [];
                                    if(chart.userOptions&& chart.userOptions.xAxis) chart.userOptions.xAxis.categories = [];
                            
                            
                                    var transformedData = [];
                                    var _name = d.data.axes[0].caption;
                                    if (typeof d == "object" && (d.length != 0) && d.data != null && d.data != "null") {
                                        d = d.data;
                                        for (var i = 0; i < d.axes[1].tuples.length; i++) {
//                                            chart.options.xAxis[0].categories[i]= d.axes[1].tuples[i].caption.toString();
                                            chart.axes[0].categories[i]= d.axes[1].tuples[i].caption.toString();
                                        }
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
                                    var retVal = [{
                                        name: _name,
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
                                    chart = null;
                                },
                                once: true
                            });
                            mc.publish("data_requested:drilldown", {
                                cubeName: e.point.cube,
                                path: e.point.path
                                //name: chart.userOptions.axes[0]
                            });
                            mc = null;

                        },
                        drillup:function(e){
                            //console.log("DRILLUP");
                            this._isDrilldown = false;
                            if (this._categories) {this.axes[0].categories = this._categories;}
                        }
                    }
                },
                xAxis: {
                    categories: []
                },
                yAxis: {},
                legend:{enabled:false},
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
                //console.log("GOT DATA PIE:", this, retVal);
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
                //console.log(d, this);
                $("#widget" + this.id).parent().parent().find("h1").text("Widget is not yet implemented");
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
                                if(d && d.data ==null){return;}
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
        },
        "columnChart": {
            type: "highcharts",
            callback: function (d) {
                var data = d.data;
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
                        //drilldown: false,
                        cube: data.cubeName,
                        path: data.axes[1].tuples[i].path
                    };
                };

                this.config.series = [{
                    colorByPoint: true,
                    data: data.cells,
                    name: data.axes[0].caption
                }];

               
                //this.renderWidget();

            },
            config: {
                chart: {
                    type: 'column',
                    margin: 75,
                    options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    viewDistance: 25,
                    depth: 40
                    }
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: 'Notice the 3D'
                },
                legend:{
                    enabled:false
                },
                plotOptions: {
                    column: {
                        depth: 25
                    }
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    opposite: true
                },
                series: []
            }
        },
        
        "lineChart":{
            type: "highcharts",
            callback: function (d) {

               
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
//                    data.cells[i] = {
//                        y: data.cells[i],
//                        cube: data.cubeName,
//                        path: data.axes[1].tuples[i].path
//                    };
                };

                this.config.series = [{
//                    colorByPoint: true,
                    data: data.cells,
                    name: data.axes[0].caption,
                    lineWidth: 4
                }];

            },
            config:{
        title: {
            text: ''
        },
        subtitle: {
            text: 'It is allowed to use subtitle',
           
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        plotOptions: {
            series: {
                lineWidth: 3
            }
        },
        legend: {
            enabled:false
        },
        series: []
    }
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
    };
});