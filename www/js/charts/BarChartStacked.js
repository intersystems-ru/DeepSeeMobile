define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (d) {
            cb.multivalueDataConvertor(this.config, d);
        },
        config: {
            tooltip: {
                formatter: cb.defaultTooltipFormatter
            },
            title: "",
            chart: {
                type: 'bar'
            },
            xAxis: {
                categories: []
            },
            yAxis: {},
            legend:{enabled:true},
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: []
        }
    }
});