$(document).ready(function(){
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
							"valueField": "column-1"
						},
						{
							"balloonText": "[[title]] of [[category]]:[[value]]",
							"fillAlphas": 1,
							"id": "AmGraph-2",
							"title": "graph 2",
							"type": "column",
							"valueField": "column-2"
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
					"dataProvider": [
						{
							"category": "category 1",
							"column-1": 8,
							"column-2": 5
						},
						{
							"category": "category 2",
							"column-1": 6,
							"column-2": 7
						},
						{
							"category": "category 3",
							"column-1": 2,
							"column-2": 3
						}
					]
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