requirejs(['Dashboard', 'MessageCenter'], function (Dashboard, MessageCenter) {
    window.mc = new MessageCenter();
    window.a = new Dashboard();
    a.addWidget({
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

        }
    })

    a.addWidget({
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
                "markerType": "circle"
            },
            "titles": []
        }
    });
    a.addWidget({
        title: "Человек в очереди",
        callback:function(d){
            console.log("Entered callback:",d);
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
        }
    })
    var opts = {
        id: 0,
        url: "http://37.139.4.54/tfoms/MDX",
        type: "POST",
        data: {
            MDX: 'SELECT NON EMPTY {TOPPERCENT(ORDER([ProfileMODep].[H1].[Profile].Members,Measures.[%COUNT],BDESC),80),%LABEL(SUM(BOTTOMPERCENT(ORDER([ProfileMODep].[H1].[Profile].Members,Measures.[%COUNT],BDESC),20)),"Другой",,,,"font-style:italic;")} ON 1 FROM [QueueCube] %FILTER [status].[H1].[status].&[0]'
        },
        username: "_SYSTEM",
        password: "159eAe72a79539f32acb15b305030060",
        success: function (d) {
            var chartData;
            console.log(d);
            if (d) {
                var d = JSON.parse(d) || d;
                var transformedData = [];
                for (var i = 0; i < d.axes[1].tuples.length; i++) {
                    transformedData.push({
                        category: d.axes[1].tuples[i].caption,
                        value: d.cells[i]
                    });
                }
                console.log(0, transformedData);
                chartData = transformedData;
            }
            mc.publish("widget" + this.id + "_data_acquired", {
                data: chartData
            });
            return 1;
        }
    }
    var opts2 = $.extend(false, opts, {
        data: {
            MDX: 'SELECT NON EMPTY HEAD(ORDER([MUFULLProrfle].[H1].[MU].Members,Measures.[%COUNT],BDESC),5) ON 1 FROM [QueueCube] %FILTER [status].[H1].[status].&[0]'
        },
        id: 1
    });
    var opts3 = $.extend(false, opts, {
        data: {
            MDX: 'SELECT NON EMPTY {%LABEL([status].[H1].[status].&[0],"В очереди",""),%LABEL([Measures].[%COUNT],"Всего","")} ON 0 FROM [QueueCube]'
        },
        id: 2
    });
    $.ajax(opts3);
    a.render();
    $.ajax(opts);
    $.ajax(opts2);
});
//        $(document).on("dataAcquired0", )
//


//var chartData = [];
//
//window.addEventListener('push', function(e){
//                console.log(e);
//               var pageName = e.detail.state.url.match(/\/?(\w*)\.html/) ? e.detail.state.url.match(/\/?(\w*)\.html/)[1] : "";
//                console.log("pageName:", pageName);
//               $.getScript('/js/'+pageName+".js");
//               }); //adding page script auto-eval
//
//

//$(document).on("dataAcquired1",function(){
//    
//
//	AmCharts.makeChart("chartdiv2",
//				
//			);
//});
//$(document).on("dataAcquired2",function(){
//    
//
//    gauge = AmCharts.makeChart("chartdiv3",
//				{
//					"type": "gauge",
//					"pathToImages": "http://cdn.amcharts.com/lib/3/images/",
//					"theme": "default",
//					"arrows": [
//						{
//							"id": "GaugeArrow-1",
//						}
//					],
//					"axes": [
//						{
//							"bottomText": "0  человек",
//							"bottomTextYOffset": -20,
//							"endValue": 30000,
//							"id": "GaugeAxis-1",
//							"valueInterval": 3000,
//							"bands": [
//								{
//									"color": "#00CC00",
//									"endValue": 10000,
//									"id": "GaugeBand-1",
//									"startValue": 0
//								},
//								{
//									"color": "#ffac29",
//									"endValue": 20000,
//									"id": "GaugeBand-2",
//									"startValue": 10000
//								},
//								{
//									"color": "#ea3838",
//									"endValue": 30000,
//									"id": "GaugeBand-3",
//									"innerRadius": "95%",
//									"startValue": 20000
//								}
//							]
//						}
//					],
//					"allLabels": [],
//					"balloon": {},
//					"titles": [
//						{
//							"id": "Title-1",
//							"size": 15,
//							"text": ""
//						}
//					]
//				}
//                       
//			);
//    var v = chartData[2][0].value;
//    gauge.arrows[0].setValue(v);
//    gauge.axes[0].setBottomText(v + " человек");
////    window.setInterval(function(){
////        var sign = Math.round((Math.random()*2 - 1)) || 1;
////        var v = gauge.arrows[0].value+sign*Math.round(Math.random()*1000);
////        v= (v>30000)?18000:v;
////        gauge.arrows[0].setValue(v);
////        gauge.axes[0].setBottomText(v + " человек");
////    },2000);
//});
//

//

//

//
//var filters = [];
//var filter_opts = {
//    username:opts.username,
//    password:opts.password,
//    type:"GET", 
//    url:"http://37.139.4.54/tfoms/FilterValues/QueueCube",
//    success: function(d){
//        if(d) { 
//            var d = JSON.parse(d) || d;
//            filters = d.children.slice(0);
//        }
//        for(var i=0;i<filters.length;i++){
//            $('.filter-list').append('\
//                <li class="table-view-cell">\
//                    <a class="navigate-right select-filter" data-paths="'+filters[i].path+'">\
//                        '+filters[i].name+'\
//                    </a>\
//                </li>');
//        };
//        $(".select-filter").on('tap', function(e){
//            var path = $(e.target).data("paths");
//            filter_opts.oldUrl = filter_opts.url;
//            filter_opts.url = filter_opts.oldUrl + "/"+path;
//            filter_opts.oldSuccess = filter_opts.success;
//            filter_opts.success = function(d){
//                if(d) { 
//                    var d = JSON.parse(d) || d;
//                }
//                $(".filter-list > *").remove();
//                for(var i=0;i<d.children.length;i++){
//                    $('.filter-list').append('\
//                    <li class="table-view-cell">\
//                    <a class="navigate-right select-filter-value" data-value="'+d.children[i].value+'">\
//                        '+d.children[i].name+'\
//                    </a>\
//                </li>');
//                };
//                filter_opts.url=filter_opts.oldUrl;
//                filter_opts.success = filter_opts.oldSuccess;
//            
//            }
//            $.ajax(filter_opts);
//        });
//    }
//};
//$.ajax(filter_opts)
//$(window).on("modalOpened", function(e,m){console.log(e,m);})