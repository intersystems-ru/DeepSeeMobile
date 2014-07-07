define([], function () {
    function HighchartsWidget() {
        this.renderWidget = function () {
            if (this.chartConfig) {
                var w_selector = "#widget" + this.id || "";
                if (Highcharts) {
                    console.log(this.chartConfig.series);
                   
                    this.chart = $(w_selector).highcharts(this.chartConfig);
                    

                }
            }
        }
    };
    HighchartsWidget.prototype.toString = function () {
        return 'HighchartsWidget'
    };
    return HighchartsWidget;
});