define(['DashboardConfig', 'Widget'], function (DashboardConfiguration, Widget) {
    return function Dashboard() {
        this.widgets = [];
        this.config = new DashboardConfiguration();
        this.render = function () {
            var holder = this.config.holder || "body";
            require(['text!../Dashboard.html'], function (html) {
                $(holder+" > *").remove();
                $(holder).append(html);
            });

            for (var i = 0; i < this.widgets.length; i++) {
                this.widgets[i].render()
            }
            return this;
        };
        this.addWidget = function (config) {
            config = config || {};
            config.dashboard = this;
            config.id = this.widgets.length;
            var widget = new Widget(config);
            this.widgets[this.widgets.length]=widget;
        }

    }


})