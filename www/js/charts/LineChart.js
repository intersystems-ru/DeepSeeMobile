define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (d) {
            cb.multivalueDataConvertor(this.config, d);
        },
        config: {
            zoomType: "x",
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
            plotOptions: {
                series: {
                    lineWidth: 3,
                    marker: {
                        enabled: false
                    }
                }
            },
            legend: {
                enabled: true
            },
            series: []
        }
    }
});