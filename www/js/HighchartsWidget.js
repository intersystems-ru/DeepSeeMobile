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

                    /*$(w_selector).highcharts({
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'Monthly Average Temperature'
                        },
                        rangeSelector:{
                            enabled:true
                        },
                        series: [{
                            name: 'Tokyo',
                            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                        }]
                    });
*/
                    $("svg text").filter(function(){return $(this).html()=='Highcharts.com'}).remove();
                }
            }
        }
      /*  this.convertor = function (d) {
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

        } */
    };

    HighchartsWidget.prototype.onActivate = function() {
        require("Widget").prototype.onActivate.apply(this);

        var self = this;

        this.btnSettings.on("click", function() {
            self.chart.legendToggle();

           /* require(['text!../views/ChartOptions.html'], function (html) {
                var sl = $(".side-slider");
                if (self.settingsVisible) {
                    sl.css("left", "100%");
                    self.settingsVisible = false;
                } else {
                    sl.empty();
                    $(html).appendTo(sl);
                    sl.css("left", $(document).width() - sl.width());
                    self.settingsVisible = true;


                    self.btnLegend = sl.find("div[data-id='legend']");

                    self.btnLegend.on("click", function(e) {
                       if ($(e.target).hasClass("active")) {
                           self.chart.legendShow();
                       } else {
                           self.chart.legendHide();
                       }
                    });
                }
            });*/


        });

        this.btnSettings.appendTo(App.ui.navBar);
    }

    HighchartsWidget.prototype.onDeactivate = function() {
        require("Widget").prototype.onDeactivate.apply(this);
       /* if (this.settingsVisible) {
            $(".side-slider").css("left", "100%");
            this.settingsVisible = false;
        }*/
        this.btnSettings.remove();
    }

    HighchartsWidget.prototype.toString = function () {
        return 'HighchartsWidget'
    };
    return HighchartsWidget;
});