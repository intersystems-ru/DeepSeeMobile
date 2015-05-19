define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (d) {

/*
            this.config =  {
                chart: {
                    type: 'boxplot'
                },

            title: {
                text: 'Highcharts box plot styling'
            },

            legend: {
                enabled: false
            },

            xAxis: {
                categories: ['1', '2', '3', '4', '5'],
                    title: {
                    text: 'Experiment No.'
                }
            },

            yAxis: {
                title: {
                    text: 'Observations'
                }
            },

            plotOptions: {
                boxplot: {
                    fillColor: '#F0F0E0',
                        lineWidth: 2,
                        medianColor: '#0C5DA5',
                        medianWidth: 3,
                        stemColor: '#A63400',
                        stemDashStyle: 'dot',
                        stemWidth: 1,
                        whiskerColor: '#3D9200',
                        whiskerLength: '20%',
                        whiskerWidth: 3
                }
            },

            series: [{
                name: 'Observations',
                data: [
                    [760, 801, 848, 895, 965],
                    [733, 853, 939, 980, 1080],
                    [714, 762, 817, 870, 918],
                    [724, 802, 806, 871, 950],
                    [834, 836, 864, 882, 910]
                ]
            }]

        };
         return;*/


            var data = d.data;

            this.config.xAxis.categories = [];
            for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                this.config.xAxis.categories.push(data.Cols[1].tuples[i].caption.toString());
            };
            this.config.series = [];
            var tempData = [];

            if (data.Cols[0].tuples[0].children) {
               /* var k = 0;
                for(var t = 0; t < data.Cols[0].tuples.length; t++) {
                    for (var c = 0; c < data.Cols[0].tuples[t].children.length; c++) {
                        tempData = [];
                        for (var d = 0; d < data.Cols[1].tuples.length; d++) {
                            tempData.push({
                                y: data.Data[data.Cols[0].tuples.length * data.Cols[0].tuples[t].children.length * d + t * data.Cols[0].tuples[t].children.length + c],
                                cube: data.Info.cubeName,
                                path: data.Cols[1].tuples[t].path
                            });
                            k++;
                        }
                        this.fixData(tempData);
                        config.series.push({
                            data: tempData,
                            name: data.Cols[0].tuples[t].caption + "/" + data.Cols[0].tuples[t].children[c].caption
                        });
                    }
                }*/
                console.error("Data converter for this hi-low chart not implemented!")
            } else {
               // for(var j = 0; j < data.Cols[0].tuples.length; j++) {
                    tempData = [];
                    for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                        //tempData.push({low: 10, high: 100, q1: 0, q3: 0});
                        tempData.push({
                            q1: data.Data[i * 2],
                            q3: data.Data[i * 2 + 1],
                            low: data.Data[i * 2],
                            high: data.Data[i * 2 + 1],
                            cube: data.Info.cubeName,
                            path: data.Cols[1].tuples[i].path
                        });
                    }
                    //this.fixData(tempData);
                    this.config.series.push({
                        data: tempData
                        //name: data.Cols[0].tuples[j].caption
                    });
                //}
            }

            var self = this;
            this.config.tooltip = {
                formatter: function () {
                    return this.key + '<br/>Maximum:<b>' + this.point.high + '</b><br/>Minimum:<b>' + this.point.low + '</b>';
                }
            };
        },
        config: {
            chart: {
                type: "boxplot"
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            series: {
                fillColor:  '#00dddddF'
            },
            plotOptions: {
                boxplot: {
                    whiskerLength: 0,
                    colorByPoint: true,
                    lineWidth: 3,
                    stemWidth: 0
                }
            },
            legend: {
                enabled: false
            },
            series: []
        }
    }
});