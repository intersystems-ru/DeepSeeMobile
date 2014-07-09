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
                var data = data.data;
                var retVal = [];
                for (var d = 0; d < data.length; d++) {
                    retVal.push({
                        name: data[d].name,
                        data: [data[d].data]
                    });
                };
                this.chartConfig.series = retVal;
                this.renderWidget();

            },
            chartConfig: {
                chart: {
                    type: 'bar'
                },
                xAxis: {
                    categories: ['Профиль']
                },
                yAxis: {
                    title: {
                        text: 'Людей'
                    }
                },
                series: []
            }
        },
        "pieChart": {
            type: "highcharts",
            callback: function (data) {
                var data = data.data;
                var retVal = [];
                for (var d = 0; d < data.length; d++) {
                    retVal.push([data[d].name, data[d].data]);
                };

                this.chartConfig.series[0].data = retVal;
                this.renderWidget();
            },
            chartConfig: {
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
                    type: 'pie',
                    name: 'Очередь',
                    data: [
                            ['Firefox', 45.0],
                            ['IE', 26.8],
                        {
                            name: 'Chrome',
                            y: 12.8,
                            sliced: true,
                            selected: true
                            },
                            ['Safari', 8.5],
                            ['Opera', 6.2],
                            ['Others', 0.7]
                        ]
                    }]
            }
        },
        "speedometer": {
            type: "highcharts",
            callback: function (d) {
                chart = $('#widget' + this.id).highcharts();
                if (!chart) this.renderWidget();
                if (chart) {
                    var point = chart.series[0].points[0],
                        newVal;

                    newVal = d.data[0].data;
                    point.update(newVal);
                }
            },
            chartConfig: {
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
                    name: 'People',
                    data: [80],
                    dataLabels: {
                        format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                            ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                            '<span style="font-size:12px;color:silver">человек</span></div>'
                    },
                    tooltip: {
                        valueSuffix: 'человек'
                    }
                 }]

            },

        },
        "null":{
            type:"none",
            callback:function(d){ console.log (d);},
            title:"Not implemented",
            chartConfig:{},
            filters:[]
        }
    };
});