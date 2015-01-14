define(['charts/ChartBase'], function (cb) {
    return {
        type: "highcharts",
            callback: function (d) {
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
                        name: data.Cols[0].tuples[0].caption
                    }];


        //this.renderWidget();
            },
        config: {
            chart: {
                type: 'column',
                    margin: 75,
                /*options3d: {
                 enabled: true,
                 alpha: 15,
                 beta: 15,
                 viewDistance: 25,
                 depth: 40
                 }*/
            },
            title: {
                text: ''
            },
            /*subtitle: {
             text: 'Notice the 3D'
             },*/
            legend:{
                enabled:false
            },
            plotOptions: {
                column: {
                    depth: 25,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                opposite: true
            },
            series: []
        }
    }
});