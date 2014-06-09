define(['DashboardConfig', 'Widget', 'FilterList'], function (DashboardConfiguration, Widget, FilterList) {
    return function Dashboard() {
        this.widgets = [];
        this.activeWidget = null;
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
            var self=this;
            //Handling active widget change
            $(this.config.holder).on("slide", function (e) {
                self.activeWidget = e.originalEvent.detail.slideNumber;
                if(mc) mc.publish("active_widget_set",{id:self.activeWidget});
            });
            return this;
        };
        this.addWidget = function (config) {
            config = config || {};
            config.dashboard = this;
            config.id = this.widgets.length;
            var widget = new Widget(config);
            this.widgets[this.widgets.length] = widget;
            if(this.activeWidget == null) {this.activeWidget=0;}
        }
        this.filters = new FilterList();


    }


})