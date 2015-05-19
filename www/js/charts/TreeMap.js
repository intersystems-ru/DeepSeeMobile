define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (d) {
            this.config.plotOptions = {
                treemap: {
                    colorByPoint: true
                }
            };
            /*this.config = {
                series: [{
                    layoutAlgorithm: 'squarified',
                    dataLabels: {
                        enabled: true
                    },
                    type: "treemap",
                    data: [{
                        id: 'A',
                        value: 6
                    }, {
                        id: 'B',
                        value: 6
                    }, {
                        id: 'C',
                        value: 4
                    }, {
                        id: 'D',
                        value: 3
                    }, {
                        id: 'E',
                        value: 2
                    }, {
                        id: 'F',
                        value: 2
                    }, {
                        id: 'G',
                        value: 1
                    }]
                }],
                title: {
                    text: 'Highcharts Squarified Treemap'
                }
            };
            return;*/

            var data = d.data;

            this.config.series = [];
           /* this.config.xAxis.categories = [];
            if (data.Cols[0].tuples.length >= 1) this.config.xAxis.title.text = data.Cols[0].tuples[0].caption;
            if (data.Cols[0].tuples.length >= 2) this.config.yAxis.title.text = data.Cols[0].tuples[1].caption;
            for (var i = 0; i < data.Cols[1].tuples.length; i++) {
             this.config.xAxis.categories.push(data.Cols[1].tuples[i].caption.toString());
             }*;*/
            this.config.series = [];
            var tempData = [];

            if (data.Cols[0].tuples[0].children) {
                console.error("Data converter for this treemap chart not implemented!")
            } else {
                //for(var j = 0; j < data.Cols[0].tuples.length; j++) {
                tempData = [];
                var total = 0;
                for (var i = 0; i < data.Data.length; i++) total += parseFloat(data.Data[i]);

                for (var i = 0; i < data.Cols[1].tuples.length; i++) {

                    tempData.push({
                        id: data.Cols[1].tuples[i].caption +"<br>"+  parseFloat(parseFloat(data.Data[i]) / total * 100).toFixed(2).toString() + "%",
                        value: parseFloat(data.Data[i])
                    });
                    //cb.fixData(tempData);
                }
                this.config.series.push({
                    data: tempData,
                    layoutAlgorithm: 'squarified',
                    dataLabels: {
                        enabled: true
                    }
                });

                //this.config.xAxis.tickInterval = Math.round((tempData[tempData.length - 1][0] - tempData[0][0]) / 10);
                //this.config.xAxis.minorTickInterval = this.config.xAxis.tickInterval / 2;
                //}
            }

            var self = this;
            this.config.tooltip = {
                formatter: function () {
                    return this.point.id + "<br>"+data.Cols[0].tuples[0].caption + ": <b>" + this.point.value + '</b>';
                }
            };
        },
        config: {
            chart: {
                type: 'treemap'
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                    text: ''
                }
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
            },
            legend: {
                enabled: false
            },
            series: []
        }
    }
});