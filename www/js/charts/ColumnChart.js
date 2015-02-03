define(['charts/ChartBase'], function (cb) {
    var o = {
        type: "highcharts",
            callback: function (d) {
                //this.config.storedCats = [];
                this.config.c = null;
                this.config.p = null;
                    var data = d.data;
                    this.config.xAxis.title = {
                        text: data.Cols[1].caption
                    };
                    this.config.yAxis.title = {
                        text: data.Cols[0].caption
                    };
                    this.config.xAxis.categories = [];
                    this.config.series = [];
                    for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                        this.config.xAxis.categories.push(data.Cols[1].tuples[i].caption.toString());
                        data.Data[i] = {
                            y: data.Data[i],
                            drilldown: true,
                            cube: data.Info.cubeName,
                            path: data.Cols[1].tuples[i].path
                        };
                    };

                    this.config.series = [{
                        colorByPoint: true,
                        data: data.Data,
                        name: data.Cols[0].tuples[0].caption,
                        format: data.Cols[0].tuples[0].format
                    }];
        //this.renderWidget();
            },
        config: {

            //storedCats: [],
            requestDrilldown: function(point) {

                var mc = require("MessageCenter");
                this.p = point;
                this.c = point.series.chart;

                mc.subscribe("data_acquired:drilldown", {
                    subscriber: this,
                    once: true,
                    callback: function (d) {
                        if (!d.data.Data) return;
                        if (d.data.Data.length == 0) return;

                        var data = d.data;
                        if (!point.series.chart.__storedCats) point.series.chart.__storedCats = [];
                        point.series.chart.__storedCats.push(this.c.xAxis[0].categories);
                        //this.storedCats.push(this.c.xAxis[0].categories);
                        this.c.xAxis[0].categories = [];
                        for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                            this.c.xAxis[0].categories.push(data.Cols[1].tuples[i].caption.toString());
                            data.Data[i] = {
                                y: data.Data[i],
                                drilldown: true,
                                cube: data.Info.cubeName,
                                path: data.Cols[1].tuples[i].path
                            };
                        };

                        this.c.addSeriesAsDrilldown(this.p,{
                            colorByPoint: true,
                            data: data.Data,
                            name: data.Cols[0].tuples[0].caption,
                            format: data.Cols[0].tuples[0].format
                        });
                    }
                });

                var self = this;
                mc.publish("data_requested:drilldown", {
                    cubeName: self.p.cube,
                    path: self.p.path,
                    widget: self.c.widget
                });
                mc = null;
            },
            tooltip: {
                formatter: cb.defaultTooltipFormatter
            },
            drilldown: {
                drillUpButton: {
                    relativeTo: 'spacingBox',
                    position: {
                        y: 0,
                        x: 0
                    },
                    theme: {
                        fill: "#DCE7F1"
                    }
                },
                series: []
            },
            chart: {
                type: 'column',
                margin: 75,
                events: {
                    drillup: function (e) {
                        this.xAxis[0].categories = e.target.__storedCats.pop();
                        //this.xAxis[0].categories = o.config.storedCats.pop();
                    }
                }
            },
            title: {
                text: ''
            },
            legend:{
                enabled:false
            },
            plotOptions: {
                column: {
                    depth: 25,
                    dataLabels: {
                        enabled: false
                    },
                    point: {
                        events: {
                            click: function (e) {
                                var p = e.point;
                                if (p) {
                                    var chart = p.series.chart;
                                    if (chart.__selPoint == p) {
                                        o.config.requestDrilldown(p);
                                    } else {
                                        chart.__selPoint = p;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            xAxis: {
                categories: [],
                labels: {
                    rotation: -45
                }
            },
            yAxis: {
                opposite: true
            },
            series: [],

            lang: {
                drillUpText: '< Back'
            }
        }
    }

    return o;
});