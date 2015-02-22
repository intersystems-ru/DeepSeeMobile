define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (d) {

            cb.multivalueTimeDataConvertor(this.config, d);

            //determine max data range
            var minDate = +Infinity;
            var maxDate = -Infinity;
            for (var i = 0; i <  this.config.series.length; i++) {
                var minValue = this.config.series[i].data[0][0];
                var maxValue = this.config.series[i].data[this.config.series[i].data.length - 1][0];

                if (minValue < minDate) minDate = minValue;
                if (maxValue > maxDate) maxDate = maxValue;
            }


            function daysBetween(first, second) {
                var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
                var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());
                var millisecondsPerDay = 1000 * 60 * 60 * 24;
                var millisBetween = two.getTime() - one.getTime();
                var days = millisBetween / millisecondsPerDay;
                return Math.floor(days);
            }



            var days = daysBetween(new Date(minValue), new Date(maxValue));

            if (days <= 2) {
                this.config.rangeSelector.buttons =
                    [{
                        type : 'minute',
                        count : 1,
                        text : '1m'
                    }, {
                        type : 'hour',
                        count : 1,
                        text : '1h'
                    }, {
                        type : 'all',
                        count : 1,
                        text : 'All'
                    }];
            } else if (days <= 30) {
                this.config.rangeSelector.buttons =
                    [{
                        type : 'hour',
                        count : 1,
                        text : '1h'
                    }, {
                        type : 'day',
                        count : 1,
                        text : '1D'
                    }, {
                        type : 'all',
                        count : 1,
                        text : 'All'
                    }];
            } else if (days <= 360) {
                this.config.rangeSelector.buttons =
                    [{
                        type : 'day',
                        count : 1,
                        text : '1D'
                    }, {
                        type : 'month',
                        count : 1,
                        text : '1M'
                    }, {
                        type : 'all',
                        count : 1,
                        text : 'All'
                    }];

            } else {
                this.config.rangeSelector.buttons =
                    [{
                        type : 'day',
                        count : 1,
                        text : '1D'
                    }, {
                        type : 'month',
                        count : 1,
                        text : '1M'
                    }, {
                        type : 'year',
                        count : 1,
                        text : '1Y'
                    }, {
                        type : 'all',
                        count : 1,
                        text : 'All'
                    }];
                this.config.rangeSelector.selected = 3;
            }
        },
        config: {
            tooltip: {
                formatter: cb.defaultTimechartTooltipFormatter
            },
            timechart: 1,
            rangeSelector:{
                inputEnabled: false,
                buttons : [{
                    type : 'hour',
                    count : 1,
                    text : '1h'
                }, {
                    type : 'day',
                    count : 1,
                    text : '1D'
                }, {
                    type : 'all',
                    count : 1,
                    text : 'All'
                }],
                selected : 1
            },
            scrollbar : {
                enabled : false
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: ''
                }
            },
            yAxis: {
                min: 0,
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
                enabled: false
            },
            series: []
        }
    }
});