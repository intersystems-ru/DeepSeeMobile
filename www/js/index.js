var chartData = [];
$(document).on("dataAcquired",function(){
    
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
							"title": "graph 1",
							"type": "column",
							"valueField": "value"
						}
					],
					"guides": [],
					"valueAxes": [
						{
							"id": "ValueAxis-1",
							"title": "Axis title"
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
							"text": "Chart Title"
						}
					],
					"dataProvider": chartData[0]
				}
			);

	AmCharts.makeChart("chartdiv2",
				{
					"type": "pie",
					"pathToImages": "http://cdn.amcharts.com/lib/3/images/",
					"angle": 12,
					"balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
					"depth3D": 15,
					"innerRadius": "40%",
					"titleField": "category",
					"valueField": "column-1",
					"allLabels": [],
					"balloon": {},
					"legend": {
						"align": "center",
						"markerType": "circle"
					},
					"titles": [],
					"dataProvider": [
						{
							"category": "category 1",
							"column-1": 8
						},
						{
							"category": "category 2",
							"column-1": 6
						},
						{
							"category": "category 3",
							"column-1": 2
						}
					]
				}
			);
    AmCharts.makeChart("chartdiv3",
				{
					"type": "gauge",
					"pathToImages": "http://cdn.amcharts.com/lib/3/images/",
					"theme": "default",
					"arrows": [
						{
							"id": "GaugeArrow-1"
						}
					],
					"axes": [
						{
							"bottomText": "0 km/h",
							"bottomTextYOffset": -20,
							"endValue": 220,
							"id": "GaugeAxis-1",
							"valueInterval": 10,
							"bands": [
								{
									"color": "#00CC00",
									"endValue": 90,
									"id": "GaugeBand-1",
									"startValue": 0
								},
								{
									"color": "#ffac29",
									"endValue": 130,
									"id": "GaugeBand-2",
									"startValue": 90
								},
								{
									"color": "#ea3838",
									"endValue": 220,
									"id": "GaugeBand-3",
									"innerRadius": "95%",
									"startValue": 130
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
});

var opts = {
    url:"http://37.139.4.54/tfoms/MDX",
    type:"POST",
    data:{
        MDX:'SELECT {CROSSJOIN([SEXNAM].[H1].[SEXNAM].Members,%LABEL(CROSSJOIN(,{%LABEL([Measures].[%COUNT],"Всего",""),%LABEL([daysWaitingOverStandard].[H1].[daysWaiting].&[Дольше 30 дней],"> 30 дней","",,"background:rgb(255, 208, 208);summary:sum;")}),"Число пациентов","")),%LABEL(CROSSJOIN(,%LABEL(CROSSJOIN(,{%LABEL([Measures].[%COUNT],"Всего",""),%LABEL([daysWaitingOverStandard].[H1].[daysWaiting].&[Дольше 30 дней],"> 30 дней","",,"background:rgb(255, 208, 208);"),%LABEL([Measures].[daysWaiting],"","",,"summary:avg;")}),"Число пациентов","")),"ИТОГО","")} ON 0,NON EMPTY HEAD([ProfileMODep].[H1].[Profile].Members,15) ON 1 FROM [QueueCube] %FILTER [status].[H1].[status].&[0]'
    },
    username:"_SYSTEM",
    password:"159eAe72a79539f32acb15b305030060",
    success: function( data ) {
        console.log(data);
        if(data) { 
            var data = JSON.parse(data) || data;
            var transformedData = [];
            for(var i=0;i<data.axes[0].tuples.length;i++) {
                transformedData.push({
                    category:data.axes[0].tuples[i].caption,
                    value:data.cells[i]
                });
            }
            chartData.push(transformedData);
        }
        $(document).trigger("dataAcquired");
        return 1;
    }
}
$.ajax( opts );