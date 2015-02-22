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
            if (!tempData[g].y) tempData[g].y = null;
            if (tempData[g].y == "") tempData[g].y = null;
        }
    }

    ChartBase.getMinValue = function(data) {
        var min = Infinity;
        for (var i = 0; i < data.length; i++) {
            if (data[i] < min) min = data[i];
        }
        return min;
    };

    ChartBase.getMaxValue = function(data) {
        var max = Number.NEGATIVE_INFINITY;
        for (var i = 0; i < data.length; i++) {
            if (data[i] > max) max = data[i];
        }
        return max;
    }


    ChartBase.prototype.multivalueDataConvertor = function(config, d) {
        var cb = this;
        var data = d.data;

        config.yAxis.min = ChartBase.getMinValue(data.Data);

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
                    cb.fixData(tempData);
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
                cb.fixData(tempData);
                config.series.push({
                    data: tempData,
                    name: data.Cols[0].tuples[j].caption,
                    format: data.Cols[0].tuples[j].format
                });
            }
        }
    };

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(date.getDate() + days);
        return result;
    }

    ChartBase.prototype.convertDateFromCache = function(s) {
        if (s == "" && s == undefined || s == null) return null;
        var str = s.toString();
        if (str.length == 4) return this.getDate(s);
        if (str.indexOf("-") != -1) return this.getDate(s);
        if (str.indexOf(" ") != -1) return this.getDate(s);
        if (str.length == 6) {
            var y = str.substr(0, 4);
            var m = str.substr(4, 2);
            return Date.parse(new Date(parseInt(y), parseInt(m)-1, 1));
        }
        if (str.length == 5 && !isNaN(parseInt(str))) {
            var base = new Date(1840, 11, 31);
            var p = str.toString().split(",");
            var d = parseInt(p[0]);
            var t = null;
            if (p.length > 1) t = parseInt(p[1]);
            base = addDays(base, parseInt(d));
            if (t) base.setSeconds(t);
            return Date.parse(base);
        } else return this.getDate(s);
    };

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
        config.yAxis.min = ChartBase.getMinValue(data.Data);
        //config.yAxis.max = ChartBase.getMaxValue(data.Data);
        config.series = [];
        config.xAxis.categories = [];
        config.series = [];
        var tempData = [];
        var minDate = Number.POSITIVE_INFINITY;
        var maxDate = Number.NEGATIVE_INFINITY;

        if (data.Cols[0].tuples[0].children) {
            var k = 0;
            for(var t = 0; t < data.Cols[0].tuples.length; t++) {
                for (var c = 0; c < data.Cols[0].tuples[t].children.length; c++) {
                    tempData = [];
                    minDate = Number.POSITIVE_INFINITY;
                    maxDate = Number.NEGATIVE_INFINITY;
                    for (var d = 0; d < data.Cols[1].tuples.length; d++) {
                        var da = this.convertDateFromCache(data.Cols[1].tuples[i].valueID);//this.getDate(data.Cols[1].tuples[i].caption);
                        //if (da < minDate) minDate = da;
                        //if (da > maxDate) maxDate = da;
                        tempData.push([
                            da,
                            data.Data[data.Cols[0].tuples.length * data.Cols[0].tuples[t].children.length * d + t * data.Cols[0].tuples[t].children.length + c]
                                ]);
                        if (tempData[tempData.length - 1][1] == "") tempData[tempData.length - 1][1] = null;
                        k++;
                    }
                   /* if (minDate != Number.POSITIVE_INFINIT && maxDate !=  Number.NEGATIVE_INFINITY) {
                        tempData.splice(0, 0, [
                            minDate - 1,
                            null
                        ]);
                        tempData.push([
                            maxDate + 1,
                            null
                        ]);
                    }*/
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
                minDate = Number.POSITIVE_INFINITY;
                maxDate = Number.NEGATIVE_INFINITY;
                for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                    //var da = this.getDate(data.Cols[1].tuples[i].caption);
                    var da = this.convertDateFromCache(data.Cols[1].tuples[i].valueID);//this.getDate(data.Cols[1].tuples[i].caption);
                    //tempData.push(
                      //  {x: da, y: data.Data[i * data.Cols[0].tuples.length + j], name: data.Cols[1].tuples[i].caption }
                    //);
                    tempData.push(
                        [da, data.Data[i * data.Cols[0].tuples.length + j]]
                        );
                }
                /*if (minDate !=  Number.POSITIVE_INFINITY && maxDate !=  Number.NEGATIVE_INFINITY) {
                    tempData.splice(0, 0, [
                        minDate - 1,
                        null
                    ]);
                    tempData.push([
                        maxDate + 1,
                        null
                    ]);
                }*/
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
