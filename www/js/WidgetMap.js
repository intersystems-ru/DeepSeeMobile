/**
 * Hash-table<br>
 * Connects widget types from DeepSee to mobile realization.<br>
 * E.g. DeepSee has "barChart", which we interpret as Widget with type "highcharts" and subtype "bar" (which gets into HighcharstWidget with type "bar")
 * @module WidgetMap
 */
define([], function () {
    return {
        "barChart": {

            type: "highcharts",
            callback: function (data) {

                console.log("HERE:", data);
                var retVal = [
//                    {
//                    name: "Профиль",
//                    colorByPoint: true,
//                    data: []
//                }
                ];

                for (var d = 0; d < data.length; d++) {
                    retVal.push({
                        name: data[d].name,
                        data:[{name:"Профиль",y:data[d].data, drilldown: true,path: data[d].path,
                        cube: data[d].cube}],
                        
                        
                    });
                };
                this.config.series = retVal;
                console.log('retval = ', retVal);
                this.renderWidget();

            },
            config: {
                chart: {
                    type: 'bar',
                    events: {
                        drilldown: function (e) {
                            console.log(e.point);

                            var chart = this;
                            //series = drilldowns[e.point.name];

                            // Show the loading label
                            chart.showLoading('Doing drilldown ...');
                            var mc = require("MessageCenter");
                            mc.subscribe("data_acquired:drilldown", {
                                subscriber: this,
                                callback: function (d) {
                                    //console.log(d);
                                    var transformedData = [];
                                    if (typeof d == "object" && (d.length != 0) && d.data!=null && d.data!="null") {
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
                                    console.log('afterconv',d);
                                    var data=d;
                                    var retVal = [{
                                            name: "Drilldown",
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
                                    //console.log(retVal);
                                    chart.hideLoading();
                                    chart.addSeriesAsDrilldown(e.point, retVal[0]);
                                },
                                once: true
                            });
                            mc.publish("data_requested:drilldown", {
                                cubeName: e.point.cube,
                                path: e.point.path
                            })
                            mc = null;

                        }
                    }
                },
                xAxis: {
                    categories: ['']
                },

                series: [],
                drilldown: {
                    series: []
                }

            }
        },
        "pieChart": {
            type: "highcharts",
            callback: function (data) {
                var retVal = [];
                for (var d = 0; d < data.length; d++) {
                    retVal.push([data[d].name, data[d].data]);
                };
                console.log("GOT DATA PIE:", this,retVal);
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
                series: [{type:"pie",data:[]}]
            }
        },
        "speedometer": {
            type: "highcharts",
            callback: function (d) {
                
                chart = $('#widget' + this.id).highcharts();
                if (!chart) this.renderWidget();
                if (chart && chart.series && chart.series.length>0) {
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
	        data: [80]}]

            },

        },
        "null": {
            type: "none",
            callback: function (d) {
                console.log(d);
            },
            title: "Not implemented",
            config: {},
            filters: []
        },
        "pivot": {
            type: "pivot",
            convertor: function (d) {
                console.log("Pivot Got Data:", d);
               var transformedData = {data:[],measures:['Count'],rows:["Статус"],cols:["Пол"]};
                 //TODO: Получать заголовок
                for (var i = 0; i< d.data.axes[1].tuples.length; i++){
                    for (var j = 0; j< d.data.axes[0].tuples.length; j++){
                        transformedData.data.push({
                        "Статус":d.data.axes[1].tuples[i].caption,
                        "Пол":d.data.axes[0].tuples[j].caption,
                        "Count":d.data.cells[i*d.data.axes[1].tuples.length + j]
                        });
                    
                };
                };
                return transformedData;
                        
            },
            callback:function(d){
                this.config = $.extend(this.config, d);
            },
            config: {},
            filters: []
        }
    };
});