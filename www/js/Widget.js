//Widget class definition

define(['FiltersList','Utils','MessageCenter'], function (FiltersList,Utils,mc) {
    return function Widget(config) {
        var self = this;
        this.id = config.id;
        this.toString = function(){
            return "Widget"+this.id;
        }
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
            mc.subscribe("widget" + this.id + "_filters_acquired", {
                subscriber: this,
                callback: function (d) {
                    console.log("filters available:", d);
                    this.filtersAvailable = d.data;
                }
            });
        }
        //Selected Filters
                this.filters = new FiltersList({
                    filters: config.filters,
                    onSetFilter: this.requestData,
                    container: "#widget" + self.id
                });
        //        this.filtersAvailable = [];
        //Creating datasource property
        var _datasource = {};
        Object.defineProperty(this, 'datasource', {
            get: function () {
                var retVal = _datasource.data.MDX;
                              if (self.filters.hasFilters()) {
                    var _filters = self.filters.getAll();
                    console.log("%cFILTERS:", "color:blue", _filters);
                    for (var i in _filters) {
                        if (_filters[i].value != '')
                            retVal += ' %FILTER ' + _filters[i].path + "." + _filters[i].value;
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
                html = html.replace("{{title}}", Utils.trim(self.name))
                    .replace("{{id}}", self.id);
                if ($("#widget" + self.id)[0] == undefined) $(widget_holder).append(html);

                if (self.amcharts_config) {
                    var w_selector = "widget" + self.id || "";
                    if (AmCharts) {
                        self.chart = AmCharts.makeChart(w_selector, self.amcharts_config);

                    }
                }
                console.log("[Render]Finished: " + self.name);
            });

        }
    
        
        
    }

})