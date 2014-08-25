define([], function () {
    function HighchartsWidget() {
        this.renderWidget = function () {
            if (this.config) {
                var w_selector = "#widget" + this.id || "";
                this.config.title = {text:""};
                if (Highcharts) {
                    this.chart = $(w_selector).highcharts(this.config);

                }
            }
        }
        this.convertor = function (d) {
            var transformedData = [];
            this.config.axes=[];
            this.config.axes[0]=d.data.axes[0].caption;
            this.config.axes[1]=d.data.axes[1].caption;
            if (typeof d == "object" && (d.length != 0)) {
                d = d.data;
                for (var i = 0; i < d.axes[1].tuples.length; i++) {
                    transformedData.push({
                        name: d.axes[1].tuples[i].caption,
                        path: d.axes[1].tuples[i].path,
                        cube: d.cubeName,
                        data: d.cells[i]
                    });
                }
                d = transformedData;
            }
            
            return d;

        }
    };
    HighchartsWidget.prototype.toString = function () {
        return 'HighchartsWidget'
    };
    return HighchartsWidget;
});