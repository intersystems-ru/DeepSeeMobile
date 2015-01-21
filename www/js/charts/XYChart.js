define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (d) {
            var data = d.data;

            this.config.series = [];
            this.config.xAxis.categories = [];
            if (data.Cols[0].tuples.length >= 1) this.config.xAxis.title.text = data.Cols[0].tuples[0].caption;
            if (data.Cols[0].tuples.length >= 2) this.config.yAxis.title.text = data.Cols[0].tuples[1].caption;
            this.config.series = [];
            var tempData = [];

            if (data.Cols[0].tuples[0].children) {
                console.error("Data converter for this xy chart not implemented!")
            } else {
                tempData = [];
                for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                    tempData.push([parseFloat(data.Data[i * 2]), parseFloat(data.Data[i * 2 + 1])]);
                }
                this.config.series.push({
                    data: tempData,
                    name: ""
                });

                this.config.xAxis.tickInterval = Math.round((tempData[tempData.length - 1][0] - tempData[0][0]) / 10);
            }

            var self = this;
            this.config.tooltip = {
                formatter: function () {
                    return self.config.xAxis.title.text + ':<b>' + this.x + '</b><br/>'+ self.config.yAxis.title.text + ':<b>' + this.y + '</b>';
                }
            };
        },
        config: {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
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
                minorGridLineWidth: 1,
                title: {
                    text: ''
                }
            },
            plotOptions: {
                series: {
                    lineWidth: 3,
                    marker: {
                        enabled: true
                    }
                }
            },
            legend: {
                enabled: false
            },
            series: []
        }
    }
});