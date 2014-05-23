var chartData = [];
$(document).on("dataAcquired0",function(){
    
    AmCharts.makeChart("chartdiv1",
				{
					"type": "serial",
					"pathToImages": "http://cdn.amcharts.com/lib/3/images/",
					"categoryField": "category",
					"startDuration": 1,
					"categoryAxis": {
						"gridPosition": "start"
					},
					"trendLines": [],
					"graphs": [
						{
							"balloonText": "[[title]] of [[category]]:[[value]]",
							"fillAlphas": 1,
							"id": "AmGraph-1",
							"title": "Профили",
							"type": "column",
							"valueField": "value"
						}
					],
					"guides": [],
					"valueAxes": [
						{
							"id": "ValueAxis-1",
							"title": "Кол-во человек"
						}
					],
					"allLabels": [],
					"balloon": {},
					"legend": {
						"useGraphSettings": true
					},
					"titles": [
						{
							"id": "Title-1",
							"size": 15,
							"text": "Профили"
						}
					],
					"dataProvider": chartData[0]
				}
			);
});
$(document).on("dataAcquired1",function(){
    

	AmCharts.makeChart("chartdiv2",
				{
					"type": "pie",
					"pathToImages": "http://cdn.amcharts.com/lib/3/images/",
					"angle": 12,
                    "fontSize": 5,
					"balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
					"depth3D": 15,
					"innerRadius": "40%",
					"titleField": "category",
					"valueField": "value",
					"allLabels": [],
					"balloon": {},
					"legend": {
						"align": "center",
						"markerType": "circle"
					},
					"titles": [],
					"dataProvider": chartData[1]
				}
			);
});
$(document).on("dataAcquired2",function(){
    

    gauge = AmCharts.makeChart("chartdiv3",
				{
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
							"endValue": 100000,
							"id": "GaugeAxis-1",
							"valueInterval": 10000,
							"bands": [
								{
									"color": "#00CC00",
									"endValue": 40000,
									"id": "GaugeBand-1",
									"startValue": 0
								},
								{
									"color": "#ffac29",
									"endValue": 80000,
									"id": "GaugeBand-2",
									"startValue": 40000
								},
								{
									"color": "#ea3838",
									"endValue": 100000,
									"id": "GaugeBand-3",
									"innerRadius": "95%",
									"startValue": 80000
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
							"text": "Speedometer"
						}
					]
				}
                       
			);
    var v = chartData[2][0].value;
    gauge.arrows[0].setValue(v);
    gauge.axes[0].setBottomText(v + " человек");
});

var opts = {
    id:0,
    url:"http://37.139.4.54/tfoms/MDX",
    type:"POST",
    data:{
        MDX:'SELECT NON EMPTY {TOPPERCENT(ORDER([ProfileMODep].[H1].[Profile].Members,Measures.[%COUNT],BDESC),80),%LABEL(SUM(BOTTOMPERCENT(ORDER([ProfileMODep].[H1].[Profile].Members,Measures.[%COUNT],BDESC),20)),"Другой",,,,"font-style:italic;")} ON 1 FROM [QueueCube] %FILTER [status].[H1].[status].&[0]'
    },
    username:"_SYSTEM",
    password:"159eAe72a79539f32acb15b305030060",
    success: function( d ) {
        console.log(d);
        if(d) { 
            var d = JSON.parse(d) || d;
            var transformedData = [];
            for(var i=0;i<d.axes[1].tuples.length;i++) {
                transformedData.push({
                    category:d.axes[1].tuples[i].caption,
                    value:d.cells[i]
                });
            }
            console.log(this.id, transformedData);
            chartData[this.id]=transformedData;
        }
        $(document).trigger("dataAcquired"+this.id);
        return 1;
    }
}
$.ajax( opts );

var opts2 = $.extend(opts,{
    data : {MDX:'SELECT NON EMPTY HEAD(ORDER([MUFULLProrfle].[H1].[MU].Members,Measures.[%COUNT],BDESC),5) ON 1 FROM [QueueCube] %FILTER [status].[H1].[status].&[0]'},id:1
});
$.ajax(opts2);

var opts3 = $.extend(opts,{
    data : {MDX:'SELECT NON EMPTY {%LABEL([status].[H1].[status].&[0],"В очереди",""),%LABEL([Measures].[%COUNT],"Всего","")} ON 0 FROM [QueueCube]'},id:2
});
$.ajax(opts3);

