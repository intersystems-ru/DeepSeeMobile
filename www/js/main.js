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
        convertor: function (data) {
            var retVal = [];
            for (var d = 0; d < data.length; d++) {
                retVal.push([data[d].name, data[d].data[0]]);
            };
            return retVal;
        },
        //title: "Топ 5 МО по размеру очереди",
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
        .render();
    //                .addWidget({
    //        title: "Человек в очереди",
    //        callback: function (d) {
    //            this.chart.arrows[0].setValue(d.data[0].value);
    //            this.chart.axes[0].setBottomText(d.data[0].value + " человек");
    //        },
    //        amconfig: {
    //            "type": "gauge",
    //            "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
    //            "theme": "default",
    //            "arrows": [
    //                {
    //                    "id": "GaugeArrow-1",
    //      }
    //     ],
    //            "axes": [
    //                {
    //                    "bottomText": "0  человек",
    //                    "bottomTextYOffset": -20,
    //                    "endValue": 30000,
    //                    "id": "GaugeAxis-1",
    //                    "valueInterval": 3000,
    //                    "bands": [
    //                        {
    //                            "color": "#00CC00",
    //                            "endValue": 10000,
    //                            "id": "GaugeBand-1",
    //                            "startValue": 0
    //        },
    //                        {
    //                            "color": "#ffac29",
    //                            "endValue": 20000,
    //                            "id": "GaugeBand-2",
    //                            "startValue": 10000
    //        },
    //                        {
    //                            "color": "#ea3838",
    //                            "endValue": 30000,
    //                            "id": "GaugeBand-3",
    //                            "innerRadius": "95%",
    //                            "startValue": 20000
    //        }
    //       ]
    //      }
    //     ],
    //            "allLabels": [],
    //            "balloon": {},
    //            "titles": [
    //                {
    //                    "id": "Title-1",
    //                    "size": 15,
    //                    "text": ""
    //      }
    //     ]
    //        },
    //        datasource: {
    //            data: {
    //                MDX: 'SELECT NON EMPTY {%LABEL([status].[H1].[status].&[0],"В очереди",""),%LABEL([Measures].[%COUNT],"Всего","")} ON 0 FROM [QueueCube]'
    //            }
    //        }
    //    })
    //                .render();


});