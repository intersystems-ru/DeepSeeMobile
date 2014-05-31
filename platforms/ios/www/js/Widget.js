//Widget class definition

define(['FiltersList'], function (FiltersList) {
    return function Widget(config) {
        var self = this;
        this.id = config.id;
        this.name = config.title || "Widget" + this.id;
        this.dashboard = config.dashboard || "";
        this.amcharts_config = config.amconfig || {};
        this.chart = '';
        this.requestData = function () {
            mc.publish("data_requested", ["widget" + self.id, {
                data: self.datasource.data
            }]);
        }
        var callback = config.callback || function (d) {
            this.amcharts_config.dataProvider = d.data;
            this.render();
        };

        //When created widget, must subscribe to widget[i] data acquired
        if (mc) {
            mc.subscribe("widget" + this.id + "_data_acquired", {
                subscriber: this,
                callback: callback
            });
        }
        this.filters = new FiltersList({filters:config.filters, onSetFilter:this.requestData});
        //Creating datasource property
        var _datasource = {};
        Object.defineProperty(this, 'datasource', {
            get: function () {
                var retVal = _datasource.data.MDX;
                if (self.filters.hasFilters()) {
                    var _filters = self.filters.getAll();
                    console.log("%cFILTERS:", "color:blue",_filters);
                    for (var i in _filters) {
                        if (_filters[i] == "") continue;
                        retVal += ' ' + _filters[i];
                    }
                }
                return {
                    data: {
                        MDX: retVal
                    }
                };
            },
            set: function (value) {
                _datasource = value;
                self.requestData();
            }


        });
        
        this.datasource = config.datasource || {
            data: {}
        };


        this.render = function () {
            var widget_holder = this.dashboard.config.holder + " .dashboard" || ".content .dashboard";
            require(["text!../Widget.html"], function (html) {
                html = html.replace("{{title}}", self.name)
                    .replace("{{id}}", self.id);
                if ($("#widget" + self.id)[0] == undefined) $(widget_holder).append(html);

                if (self.amcharts_config) {
                    var w_selector = "widget" + self.id || "";
                    if (AmCharts) {
                        self.chart = AmCharts.makeChart(w_selector, self.amcharts_config);
                        
                    }
                }
                if (self.filters.hasFilters()) {   
                    self.filters.render("#widget" + self.id);
                    };
                console.log("[Render]Finished: " + self.name);
            });

        }
    }

})