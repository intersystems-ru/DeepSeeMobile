define([], function () {
    function HighchartsWidget() {

        this.btnSettings = $('<a class="icon fa fa-list-ul pull-right"></a>');
        this.btnLegend = null;

        this.settingsVisible = false;

        this.renderWidget = function () {
            if (this.config) {
                var w_selector = "#widget" + this.id || "";
                this.config.title = {text:""};
                var self = this;
                if (Highcharts) {
                    if (this.config.timechart == 1)
                        $(w_selector).highcharts('StockChart', this.config, function(chart){self.chart = chart});
                    else
                        $(w_selector).highcharts(this.config, function(chart){self.chart = chart});
                    $("svg text").filter(function(){return $(this).html()=='Highcharts.com'}).remove();
                }
            }
        }
    };

    HighchartsWidget.prototype.onActivate = function() {
        require("Widget").prototype.onActivate.apply(this);

        var self = this;

        this.btnSettings.on("click", function() {
            if (self.chart.series) if (self.chart.series[0]) if (self.chart.series[0].type == "pie") {
                var opt = self.chart.series[0].options;
                opt.dataLabels.enabled = !opt.dataLabels.enabled;
                self.chart.series[0].update(opt);
                return;
            }
            self.chart.legendToggle();
        });

        this.btnSettings.appendTo(App.ui.navBar);
    }

    HighchartsWidget.prototype.onDeactivate = function() {
        require("Widget").prototype.onDeactivate.apply(this);
        this.btnSettings.remove();
    }

    HighchartsWidget.prototype.toString = function () {
        return 'HighchartsWidget'
    };
    return HighchartsWidget;
});