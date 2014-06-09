define(['DashboardConfig', 'Widget', 'Filter'], function (DashboardConfiguration, Widget, Filter) {
    return function Dashboard() {
        this.toString = function(){ return "Dashboard";};
        this.toString = function(){ return "Dashboard";};
        this.widgets = [];
        this.activeWidget = null;
        this.filters = []; //just array of Filter objects
        this.config = new DashboardConfiguration();
        this.render = function () {
            var holder = this.config.holder || "body";
            require(['text!../Dashboard.html'], function (html) {
                $(holder + " > *").remove();
                $(holder).append(html);
            });

            for (var i = 0; i < this.widgets.length; i++) {
                this.widgets[i].render()
            }
            var self = this;
            //Handling active widget change
            $(this.config.holder).on("slide", function (e) {
                if (self.activeWidget != e.originalEvent.detail.slideNumber) {
                    self.activeWidget = e.originalEvent.detail.slideNumber;
                    if (mc) mc.publish("set_active_widget", {
                        id: self.activeWidget
                    });
                }
            });
            return this;
        };
        this.addWidget = function (config) {
            config = config || {};
            config.dashboard = this;
            config.id = this.widgets.length;
            var widget = new Widget(config);
            this.widgets[this.widgets.length] = widget;
            if (this.activeWidget == null) {
                this.activeWidget = 0;
            }
        }
        if (mc) {
            mc.subscribe("filters_acquired", {
                subscriber: this,
                callback: function (d) {
                    for (var i = 0; i < d.data.length; i++) {
                        this.filters.push(new Filter(d.data[i]));
                    }
                }
            });
            mc.publish("filters_requested");
        }


    }


})