define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (d) {

            //console.log("HERE:", d);
            var data = d.data;
            //this.config.xAxis.type="category";
            //this.config.xAxis.showEmpty = false;
            this.config.xAxis.title = {
                text: data.Cols[1].caption
            };
            this.config.yAxis.title = {
                text: data.defaultCaption || data.Cols[0].caption
            };
            var _pos = 0;
            this.config.xAxis.categories = [];
            this    .config.series = [];
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

                this.config.series.push({
                    colorByPoint:  (data.Cols[0].tuples.length>1) ? false : true,
                    data: tempData,
                    name: data.Cols[0].tuples[j].caption,
                });
            }

        },
        config: {
            chart: {
                type: 'bar',
                events: {
                    drilldown: function (e) {
                        console.log("DFGDF");
                        if(this._isDrilldown) return;
                        this._isDrilldown = true;
                        var chart = this;
                        //var catName = chart.options.xAxis[0].title.text;

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
                }
            },
            xAxis: {
                categories: []
            },
            yAxis: {},
            legend:{enabled:true},
            /*plotOptions: {
                bar: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true
                    }
                }
            },*/
            series: [],
            drilldown: {
                series: []
            }

        }
    }
});