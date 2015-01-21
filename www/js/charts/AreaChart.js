define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (d) {
            cb.multivalueDataConvertor(this.config, d);
            delete this.config.title;
            console.log(this.config);
        },
        config: {
            tooltip: {
                formatter: cb.defaultTooltipFormatter
            },
            chart: {
                type: 'area'
            },
            xAxis: {
                categories: [],
                title: {
                    text: ""
                }
            },
            yAxis: {
                title: {
                    text: ""
                }
            },
            legend:{enabled:true},
            plotOptions: {
                series: {
                    stacking: 'normal',
                    marker: {
                        enabled: false
                    }
                }
            },
            series: []
        }
    }
});