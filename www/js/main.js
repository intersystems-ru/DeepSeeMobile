/**
 * @fileOverview
 * Entry point for DeepSeeMobile application
 * @author Shmidt Ivan
 * @version 0.0.1
 */
require.config({
    baseUrl: './js/',
    paths: {
        text: "lib/text",
        jquery: "http://code.jquery.com/jquery-2.1.1"
    }
});
requirejs([
    'MessageCenter', 
    'DBConnector', 
    'Dashboard', 
    'FiltersView', 
    'Utils', 
    'jquery'
], function (MessageCenter, DBConnector, Dashboard, FiltersView, Utils, $) {
    window.a = new Dashboard({
        holder: "body > .content"
    })
                .addWidget({
        title: "Очередь пациентов по профилям",
        amconfig: {
            "type": "serial",
            "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
            "categoryField": "category",
            "rotate": true,
            "startDuration": 1,
            "categoryAxis": {
                "autoRotateCount": -5,
                "gridPosition": "start",
                "inside": true
            },
            "trendLines": [],
            "graphs": [
                {
                    "balloonText": "[[title]] of [[category]]:[[value]]",
                    "fillAlphas": 1,
                    "id": "AmGraph-1",
                    "title": "",
                    "type": "column",
                    "valueField": "value"
      }
     ],
            "guides": [],
            "valueAxes": [
                {
                    "axisTitleOffset": -7,
                    "id": "ValueAxis-1",
                    "title": "Кол-во человек"
      }
     ],
            "allLabels": [],
            "balloon": {},
            "titles": [
                {
                    "id": "Title-1",
                    "size": 15,
                    "text": ""
      }
     ],

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
        title: "Топ 5 МО по размеру очереди",
        amconfig: {
            "type": "pie",
            "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
            "angle": 12,
            labelRadius: -30,
            labelText: "[[value]]",
            "fontSize": 11,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "depth3D": 0,
            "innerRadius": "40%",
            "titleField": "category",
            "valueField": "value",
            "allLabels": [],
            "balloon": {},
            "legend": {
                "align": "center",
                "markerType": "circle",
                valueWidth: 20
            },
            "titles": []
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
        title: "Человек в очереди",
        callback: function (d) {
            this.chart.arrows[0].setValue(d.data[0].value);
            this.chart.axes[0].setBottomText(d.data[0].value + " человек");
        },
        amconfig: {
            "type": "gauge",
            "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
            "theme": "default",
            "arrows": [
                {
                    "id": "GaugeArrow-1",
      }
     ],
            "axes": [
                {
                    "bottomText": "0  человек",
                    "bottomTextYOffset": -20,
                    "endValue": 30000,
                    "id": "GaugeAxis-1",
                    "valueInterval": 3000,
                    "bands": [
                        {
                            "color": "#00CC00",
                            "endValue": 10000,
                            "id": "GaugeBand-1",
                            "startValue": 0
        },
                        {
                            "color": "#ffac29",
                            "endValue": 20000,
                            "id": "GaugeBand-2",
                            "startValue": 10000
        },
                        {
                            "color": "#ea3838",
                            "endValue": 30000,
                            "id": "GaugeBand-3",
                            "innerRadius": "95%",
                            "startValue": 20000
        }
       ]
      }
     ],
            "allLabels": [],
            "balloon": {},
            "titles": [
                {
                    "id": "Title-1",
                    "size": 15,
                    "text": ""
      }
     ]
        },
        datasource: {
            data: {
                MDX: 'SELECT NON EMPTY {%LABEL([status].[H1].[status].&[0],"В очереди",""),%LABEL([Measures].[%COUNT],"Всего","")} ON 0 FROM [QueueCube]'
            }
        }
    })
                .render();


});