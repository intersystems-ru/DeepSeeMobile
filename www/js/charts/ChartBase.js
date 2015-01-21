define([], function () {
    function ChartBase() {
        return this;
    }

    ChartBase.prototype.defaultPieTooltipFormatter = function() {
        var fmt = this.series.options.format;
        var val = this.y;
        if (fmt) val = numeral(val).format(fmt);
        var a = this.point.name + '<br>' + this.series.name + ': <b>' + val + "</b><br>";
        a += parseFloat(this.point.percentage).toFixed(2).toString() + "%";
        return a;
    }

    ChartBase.prototype.defaultTooltipFormatter = function() {
        if (this.series) {
            var fmt = this.series.options.format;
            var val = this.y;
            if (fmt) val = numeral(val).format(fmt);
            var a = this.point.category + '<br/><span style="color:' + this.series.color + '">\u25CF</span>' + this.series.name + ':<b> ' + val + "</b>";
            return a;
        } else {
            var a = "";
            for (var i = 0; i < this.points.length; i++) {
                var fmt = this.points[i].series.options.format;
                var val = this.points[i].y;
                if (fmt) val = numeral(val).format(fmt);
                a += this.points[i].point.category + '<br/><span style="color:' + this.points[i].series.color + '">\u25CF</span>' + this.points[i].series.name + ':<b> ' + val + '<br>';
            }
            return a;
        }
    }

    ChartBase.prototype.defaultTimechartTooltipFormatter = function() {
        if (this.series) {
            var fmt = this.series.options.format;
            var val = this.y;
            if (fmt) val = numeral(val).format(fmt);
            var a = '<span style="color:' + this.series.color + '">\u25CF</span>' + this.series.name + ':<b> ' + val;
            return a;
        } else {
            var a = "";
            for (var i = this.points.length - 1; i > -1; i--) {
                var fmt = this.points[i].series.options.format;
                var val = this.points[i].y;
                if (fmt) val = numeral(val).format(fmt);
                a += '<span style="color:' + this.points[i].series.color + '">\u25CF</span>' + this.points[i].series.name + ':<b> ' + val + '<br>';
            }
            return a;
        }
    }

    ChartBase.prototype.fixData = function(tempData) {
        for (var g = 0; g < tempData.length; g++) {
            if (!tempData[g].y) tempData[g].y = 0;
            if (tempData[g].y == "") tempData[g].y = 0;
        }
    }

    ChartBase.prototype.getMinValue = function(data) {
        var min = Infinity;
        for (var i = 0; i < data.length; i++) {
            if (data[i] < min) min = data[i];
        }
        return min;
    }

    ChartBase.prototype.multivalueDataConvertor = function(config, d) {
        var data = d.data;

        config.yAxis.min = this.getMinValue(data.Data);

        config.series = [];
        config.xAxis.categories = [];
        for (var i = 0; i < data.Cols[1].tuples.length; i++) {
            config.xAxis.categories.push(data.Cols[1].tuples[i].caption.toString());
        };
        config.series = [];
        var tempData = [];

        if (data.Cols[0].tuples[0].children) {
            var k = 0;
            for(var t = 0; t < data.Cols[0].tuples.length; t++) {
                for (var c = 0; c < data.Cols[0].tuples[t].children.length; c++) {
                    tempData = [];
                    for (var d = 0; d < data.Cols[1].tuples.length; d++) {
                        tempData.push({
                            y: data.Data[data.Cols[0].tuples.length * data.Cols[0].tuples[t].children.length * d + t * data.Cols[0].tuples[t].children.length + c],
                            cube: data.Info.cubeName,
                            path: data.Cols[1].tuples[t].path
                        });
                        k++;
                    }
                    this.fixData(tempData);
                    config.series.push({
                        data: tempData,
                        name: data.Cols[0].tuples[t].caption + "/" + data.Cols[0].tuples[t].children[c].caption,
                        format: data.Cols[0].tuples[t].children[c].format
                    });
                }
            }
        } else {
            for(var j = 0; j < data.Cols[0].tuples.length; j++) {
                tempData = [];
                for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                    tempData.push({
                        y: data.Data[i * data.Cols[0].tuples.length + j],
                        drilldown: true,
                        cube: data.Info.cubeName,
                        path: data.Cols[1].tuples[i].path
                    });
                }
                this.fixData(tempData);
                config.series.push({
                    data: tempData,
                    name: data.Cols[0].tuples[j].caption,
                    format: data.Cols[0].tuples[j].format
                });
            }
        }
    }

    ChartBase.prototype.getDate = function(str) {
        var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

        var d = Date.parse(str);
        if (!isNaN(d)) return d;
        if (str.split("-").length == 2) {
            var parts = str.split("-");
            var idx = months.indexOf(parts[0].toLowerCase());
            if (idx != -1) {
                return Date.parse((idx+1).toString() + "/01/" + parts[1]);
            }
        } else
        if (str.split(" ").length == 2) {
            //like 2015-01-07 05
            str += ":00";
            d = Date.parse(str.replace(/-/g, "/"));
            if (!isNaN(d)) return d;
        }
        return 0;
    }

    ChartBase.prototype.multivalueTimeDataConvertor = function(config, d) {
        var data = d.data;
        config.yAxis.min = this.getMinValue(data.Data);
        config.series = [];
        config.xAxis.categories = [];
        config.series = [];
        var tempData = [];

        if (data.Cols[0].tuples[0].children) {
            var k = 0;
            for(var t = 0; t < data.Cols[0].tuples.length; t++) {
                for (var c = 0; c < data.Cols[0].tuples[t].children.length; c++) {
                    tempData = [];
                    for (var d = 0; d < data.Cols[1].tuples.length; d++) {
                        tempData.push([
                            this.getDate(data.Cols[1].tuples[i].caption),
                            data.Data[data.Cols[0].tuples.length * data.Cols[0].tuples[t].children.length * d + t * data.Cols[0].tuples[t].children.length + c]
                                ]);
                        k++;
                    }
                    config.series.push({
                        data: tempData,
                        name: data.Cols[0].tuples[t].caption + "/" + data.Cols[0].tuples[t].children[c].caption,
                        format: data.Cols[0].tuples[t].format
                    });
                }
            }
        } else {
            for(var j = 0; j < data.Cols[0].tuples.length; j++) {
                tempData = [];
                for (var i = 0; i < data.Cols[1].tuples.length; i++) {

                    tempData.push(
                        [this.getDate(data.Cols[1].tuples[i].caption), data.Data[i * data.Cols[0].tuples.length + j]]
                        );
                }
                config.series.push({
                    data: tempData,
                    name: data.Cols[0].tuples[j].caption,
                    format: data.Cols[0].tuples[j].format
                });
            }
        }
    }

    return new ChartBase();
});
