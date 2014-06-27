/**
 * @fileOverview
 * Entry point for DeepSeeMobile application
 * @author Shmidt Ivan
 * @version 0.0.1
 */
requirejs.config({
    baseUrl: 'js/',
    paths: {
        text: "lib/text"
        //        jquery: "lib/jquery-2.1.1"
    }
});
require([
    'MessageCenter',
    'DBConnector',
    'Dashboard',
    'FiltersView',
    'Utils',
], function (MessageCenter, DBConnector, Dashboard, FiltersView, Utils) {


    window.a = new Dashboard({
        holder: "body > .content"
    })
        .addWidget({
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
                this.render();

            },
            chartConfig: {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: "Очередь пациентов по профилям",
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
            },
            datasource: {
                data: {
                    MDX: 'SELECT NON EMPTY {TOPPERCENT(ORDER([ProfileMODep].[H1].[Profile].Members,Measures.[%COUNT],BDESC),80),%LABEL(SUM(BOTTOMPERCENT(ORDER([ProfileMODep].[H1].[Profile].Members,Measures.[%COUNT],BDESC),20)),"Другой",,,,"font-style:italic;")} ON 1 FROM [QueueCube]'
                }
            },
            filters: [{
                name: "status",
                path: "[status].[H1].[status]",
                value: "&[0]",
                valueName: "0"
                    }]
        })
        .addWidget({
            callback: function (data) {
                var data = data.data;
                var retVal = [];
                for (var d = 0; d < data.length; d++) {
                    retVal.push([data[d].name, data[d].data]);
                };

                this.chartConfig.series[0].data = retVal;
                this.render();
            },
            chartConfig: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Топ 5 МО по размеру очереди'
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
            },
            datasource: {
                data: {
                    MDX: 'SELECT NON EMPTY HEAD(ORDER([MUFULLProrfle].[H1].[MU].Members,Measures.[%COUNT],BDESC),5) ON 1 FROM [QueueCube]'
                }
            },
            filters: [{
                name: "Пол",
                path: "[SEXNAM].[H1].[SEXNAM]",
                value: "&[Мужской]",
                valueName: "Мужской"
                    }]
        })
        .addWidget({
            callback: function (d) {
                chart = $('#widget' + this.id).highcharts();
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

                title: {
                    text: 'Человек в очереди'
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
            datasource: {
                data: {
                    MDX: 'SELECT NON EMPTY {%LABEL([status].[H1].[status].&[0],"В очереди",""),%LABEL([Measures].[%COUNT],"Всего","")} ON 0 FROM [QueueCube]'
                }
            }
        })
        .render();


});