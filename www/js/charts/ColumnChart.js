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

                   /* for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                        this.config.xAxis.categories.push(data.Cols[1].tuples[i].caption.toString());
                        data.Data[i] = {
                            y: data.Data[i],
                            drilldown: true,
                            cube: data.Info.cubeName,
                            path: data.Cols[1].tuples[i].path
                        };
                    };
                    require("charts/ChartBase").fixData(data.Data);

                    var name = "Count";
                    var format = "";
                    if (data.Cols[0].tuples[0]) {
                        name = data.Cols[0].tuples[0].caption;
                        format = data.Cols[0].tuples[0].format;
                    }
                    this.config.series = [{
                        colorByPoint: true,
                        data: data.Data,
                        name: name,
                        format: format
                    }];*/
                cb.multivalueDataConvertor(this.config, d);
        //this.renderWidget();
            },
        config: {

            //storedCats: [],
            requestDrilldown: function(point) {

                var mc = require("MessageCenter");
                this.p = point;
                this.c = point.series.chart;
                var self = this;

                mc.subscribe("data_acquired:drilldown", {
                    subscriber: this,
                    once: true,
                    callback: function (d) {
                        if (!d.data.Data) return;
                        if (d.data.Data.length == 0) return;
                        var hasValue = false;
                        for (var i = 0; i < d.data.Data.length; i++) if (d.data.Data[i]) {
                            hasValue = true;
                            break;
                        }
                        if (!hasValue) return;

                        var data = d.data;
                        if (!self.c.widget.__storedCats) self.c.widget.__storedCats = [];
                        self.c.widget.__storedCats.push(this.c.xAxis[0].categories);
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
                        require("charts/ChartBase").fixData(data.Data);
                        self.c.widget.drillLevel++;
                        self.c.widget.drills.push(self.p.path);
                        var name = "Count";
                        var format = "";
                        if (data.Cols[0].tuples[0]) {
                            name = data.Cols[0].tuples[0].caption;
                            format = data.Cols[0].tuples[0].format;
                        }
                        this.c.addSeriesAsDrilldown(this.p,{
                            colorByPoint: true,
                            data: data.Data,
                            name: name,
                            format: format
                        });
                    }
                });


               /* var path = self.p.path;
                if (self.c.widget.pivotData)
                    if (self.c.widget.pivotData.rowAxisOptions)
                        if (self.c.widget.pivotData.rowAxisOptions.drilldownSpec) path = self.c.widget.pivotData.rowAxisOptions.drilldownSpec;
*/
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
                        this.xAxis[0].categories = this.widget.__storedCats.pop();
                        this.widget.drills.pop();
                        this.widget.drillLevel--;
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