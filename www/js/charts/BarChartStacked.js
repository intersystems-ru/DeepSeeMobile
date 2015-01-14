define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (d) {
            /*var data = d.data;
            console.log(d);
            var t = this;
            t.config.xAxis.title = {
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

            for(var j = 0; j< data.Cols[0].tuples.length; j++) {
                var tempData = [];
                for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                    tempData[i] = {
                        y: data.Data[i * data.Cols[0].tuples.length + j],
                        drilldown: true,
                        cube: data.Info.cubeName,
                        path: data.Cols[1].tuples[i].path
                    };
                };
                this.config.series.push({
                    colorByPoint:  (data.Cols[0].tuples.length>1) ? false : true,
                    data: tempData,
                    name: data.Cols[0].tuples[j].caption
                });
            };*/
            cb.multivalueDataConvertor(this.config, d);
        },
        config: {
            title: "",
            chart: {
                type: 'bar'
            },
            xAxis: {
                categories: []
            },
            yAxis: {},
            legend:{enabled:true},
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: []
        }
    }
});