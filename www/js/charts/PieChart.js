define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (_d) {
            var data = _d.data;
            var retVal = [];
            this.config.series[0].name = data.Cols[0].caption;
            for (var d = 0; d < data.Cols[1].tuples.length; d++) {
                retVal.push([data.Cols[1].tuples[d].caption, data.Data[d]]);
            };
            //console.log("GOT DATA PIE:", this, retVal);
            this.config.series[0].data = retVal;
            //                this.renderWidget();
        },
        config: {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            //legend:{enabled:true},
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                type: "pie",
                data: []
            }]
        }
    }
});