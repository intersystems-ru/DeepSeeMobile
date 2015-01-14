define([], function () {
    function ChartBase() {
        return this;
    }

    ChartBase.prototype.fixData = function(tempData) {
        for (var g = 0; g < tempData.length; g++) {
            if (!tempData[g].y) tempData[g].y = 0;
            if (tempData[g].y == "") tempData[g].y = 0;
        }
    }

    ChartBase.prototype.multivalueDataConvertor = function(config, d) {
        var data = d.data;

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
                        name: data.Cols[0].tuples[t].caption + "/" + data.Cols[0].tuples[t].children[c].caption
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
                    name: data.Cols[0].tuples[j].caption
                });
            }
        }
    }


    ChartBase.prototype.getDate = function(str) {
        /* if (!window.tmpConvDate) {
            window.tmpConvDate = {
                from: [],
                to: []
            }
        }
        window.tmpConvDate.from.push(str);
         "02/01/2013
        */
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

        config.series = [];
        config.xAxis.categories = [];
        /*for (var i = 0; i < data.Cols[1].tuples.length; i++) {
            config.xAxis.categories.push(data.Cols[1].tuples[i].caption.toString());
        };*/
        config.series = [];
        var tempData = [];

        if (data.Cols[0].tuples[0].children) {
            var k = 0;
            for(var t = 0; t < data.Cols[0].tuples.length; t++) {
                for (var c = 0; c < data.Cols[0].tuples[t].children.length; c++) {
                    tempData = [];
                    for (var d = 0; d < data.Cols[1].tuples.length; d++) {
                      /*  tempData.push({
                            y: data.Data[data.Cols[0].tuples.length * data.Cols[0].tuples[t].children.length * d + t * data.Cols[0].tuples[t].children.length + c],
                            cube: data.Info.cubeName,
                            path: data.Cols[1].tuples[t].path
                        });*/
                        tempData.push([
                            this.getDate(data.Cols[1].tuples[i].caption),
                            data.Data[data.Cols[0].tuples.length * data.Cols[0].tuples[t].children.length * d + t * data.Cols[0].tuples[t].children.length + c]
                                ]);
                        k++;
                    }
                    this.fixData(tempData);
                    config.series.push({
                        data: tempData,
                        name: data.Cols[0].tuples[t].caption + "/" + data.Cols[0].tuples[t].children[c].caption
                    });
                }
            }
        } else {
            for(var j = 0; j < data.Cols[0].tuples.length; j++) {
                tempData = [];
                for (var i = 0; i < data.Cols[1].tuples.length; i++) {

                    tempData.push(
                        [this.getDate(data.Cols[1].tuples[i].caption), data.Data[i * data.Cols[0].tuples.length + j]]
                        //drilldown: true,
                        //cube: data.Info.cubeName,
                        //path: data.Cols[1].tuples[i].path
                    //});
                        );
                }
                //this.fixData(tempData);
                config.series.push({
                    data: tempData,
                    name: data.Cols[0].tuples[j].caption
                });
            }
        }
    }

    return new ChartBase();
});
