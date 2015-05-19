define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (_d) {
            var data = _d.data;
            var retVal = [];
            this.config.series[0].name = data.Cols[0].caption;
            for (var d = 0; d < data.Cols[1].tuples.length; d++) {
                retVal.push([data.Cols[1].tuples[d].caption.toString(), data.Data[d]]);
            };
            var name = "Count";
            var format = "";
            if (data.Cols[0].tuples[0]) {
                name = data.Cols[0].tuples[0].caption;
                format = data.Cols[0].tuples[0].format;
            }
            this.config.series[0].data = retVal;
            this.config.series[0].name = name;
            this.config.series[0].format = format;
        },
        config: {
            tooltip: {
                formatter: cb.defaultPieTooltipFormatter
            },
            chart: {
                /*plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,*/

            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        shadow: false,
                        style: { "fontWeight": "normal", "fontSize": "11px", textShadow: "" },
                        enabled: true
                        /*inside: true,
                        distance: -20,
                        softConnector: false,
                        connectorWidth: 0*/
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