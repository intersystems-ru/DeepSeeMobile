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
            require("charts/ChartBase").fixData(data.Data);
            this.config.series = [{
                colorByPoint: true,
                data: data.Data,
                name: data.Cols[0].tuples[0].caption,
                format: data.Cols[0].tuples[0].format
            }];
            /*var data = d.data;

            this.config.xAxis.title = {
                text: data.Cols[1].caption
            };
            this.config.yAxis.title = {
                text: data.defaultCaption || data.Cols[0].caption
            };
            var _pos = 0;
            this.config.xAxis.categories = [];
            this.config.series = [];
            for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                this.config.xAxis.categories.push(data.Cols[1].tuples[i].caption.toString());
            }

            for(var j = 0; j< data.Cols[0].tuples.length; j++){
                var tempData = [];
                for(var i = 0; i< data.Cols[1].tuples.length; i++){
                    tempData[i] = {
                        y: data.Data[i* data.Cols[0].tuples.length + j],
                        drilldown: true,
                        cube: data.Info.cubeName,
                        path: data.Cols[1].tuples[i].path
                    };

                };
                require("charts/ChartBase").fixData(tempData);
                this.config.series.push({
                    colorByPoint:  (data.Cols[0].tuples.length>1) ? false : true,
                    data: tempData,
                    name: data.Cols[0].tuples[j].caption,
                    format: data.Cols[0].tuples[j].format
                });
            }*/

        },
        config: {

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
                        this.c.addSeriesAsDrilldown(this.p,{
                            colorByPoint: true,
                            data: data.Data,
                            name: data.Cols[0].tuples[0].caption,
                            format: data.Cols[0].tuples[0].format
                        });
                    }
                });

                var self = this;
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
            plotOptions: {
                bar: {
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
            chart: {
                type: 'bar',
                events: {
                    drillup: function (e) {
                        //this.xAxis[0].categories = e.target.__storedCats.pop();
                        this.xAxis[0].categories = this.widget.__storedCats.pop();
                        this.widget.drills.pop();
                        this.widget.drillLevel--;
                    }
                }
                    /*drilldown: function (e) {
                        if(this._isDrilldown) return;
                        this._isDrilldown = true;
                        var chart = this;
                        // Show the loading label
                        chart.showLoading('Doing drilldown ...');
                        var mc = require("MessageCenter");
                        mc.subscribe("data_acquired:drilldown", {
                            subscriber: this,
                            callback: function (d) {
                                chart._categories = (this.axes[0].categories[0]==undefined) ? this.userOptions.xAxis.categories : this.axes[0].categories;
                                chart.axes[0].categories = [];
                                if(chart.userOptions&& chart.userOptions.xAxis) chart.userOptions.xAxis.categories = [];


                                var transformedData = [];
                                var _name = d.data.Cols[0].caption;
                                if (typeof d == "object" && (d.length != 0) && d.data != null && d.data != "null") {
                                    d = d.data;
                                    for (var i = 0; i < d.Cols[1].tuples.length; i++) {
//                                            chart.options.xAxis[0].categories[i]= d.Cols[1].tuples[i].caption.toString();
                                        chart.axes[0].categories[i]= d.Cols[1].tuples[i].caption.toString();
                                    }
                                    for (var i = 0; i < d.Cols[1].tuples.length; i++) {
                                        transformedData.push({
                                            name: d.Cols[1].tuples[i].caption,
                                            path: d.Cols[1].tuples[i].path,
                                            cube: d.Info.cubeName,
                                            data: d.Data[i]
                                        });
                                    }
                                    d = transformedData;
                                }
                                var data = d;
                                var retVal = [{
                                    name: _name,
                                    data: []
                                }]
                                for (var i = 0; i < data.length; i++) {
                                    retVal[0].data.push({
                                        name: data[i].name,
                                        y: data[i].data,
                                        path: data[i].path,
                                        cube: data[i].cube
                                    });
                                };
                                chart.hideLoading();
                                chart.addSeriesAsDrilldown(e.point, retVal[0]);
                                chart = null;
                            },
                            once: true
                        });
                        mc.publish("data_requested:drilldown", {
                            cubeName: e.point.cube,
                            path: e.point.path
                            //name: chart.userOptions.axes[0]
                        });
                        mc = null;

                    },
                    drillup:function(e){
                        //console.log("DRILLUP");
                        this._isDrilldown = false;
                        if (this._categories) {this.axes[0].categories = this._categories;}
                    }
                }*/
            },
            xAxis: {
                categories: []
            },
            yAxis: {},
            legend:{enabled:false},
            series: [],
            lang: {
                drillUpText: '< Back'
            }
        }
    }
    return o;
});