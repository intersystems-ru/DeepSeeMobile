define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
        callback: function (d) {
            var data = d.data;

            this.config.series = [];
            this.config.xAxis.categories = [];
            if (data.Cols[0].tuples.length >= 1) this.config.xAxis.title.text = data.Cols[0].tuples[0].caption;
            if (data.Cols[0].tuples.length >= 2) this.config.yAxis.title.text = data.Cols[0].tuples[1].caption;
            /*for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                this.config.xAxis.categories.push(data.Cols[1].tuples[i].caption.toString());
            }*;*/
            this.config.series = [];
            var tempData = [];

            if (data.Cols[0].tuples[0].children) {
              /*  var k = 0;
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
                        this.config.series.push({
                            data: tempData,
                            name: data.Cols[0].tuples[t].caption + "/" + data.Cols[0].tuples[t].children[c].caption
                        });
                    }
                }*/
                console.error("Data converter for this bubble chart not implemented!")
            } else {
                //for(var j = 0; j < data.Cols[0].tuples.length; j++) {

                    for (var i = 0; i < data.Cols[1].tuples.length; i++) {
                        tempData = [];
                        tempData.push([data.Data[i * 2], data.Data[i * 2 + 1], 1]);
                        //cb.fixData(tempData);
                        this.config.series.push({
                            data: tempData,
                            name: data.Cols[1].tuples[i].caption
                        });
                    }
                //}
            }

            var self = this;
            this.config.tooltip = {
                formatter: function () {
                    return this.series.name + '<br/>'+ self.config.xAxis.title.text + ':<b>' + this.x + '</b><br/>'+ self.config.yAxis.title.text + ':<b>' + this.y + '</b>';
                }
            };
        },
        config: {
            chart: {
                type: "bubble",
                zoomType: 'xy'
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                    text: ''
                }
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
            },
            legend: {
                enabled: false
            },
            series: []
        }
    }
});