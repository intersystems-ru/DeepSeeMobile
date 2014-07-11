define(['MessageCenter'], function (mc) {
    function Utilizer() {
        if (Utilizer.prototype._instance) return Utilizer.prototype._instance;
        Utilizer.prototype._instance = this;
        this.clearData = function() {
            App.m.publish("clear:widgets");

            if (App.a && App.a.widget) {
                _.each(App.a.widgets, function (w, i) {
                    delete App.a.widgets[i];
                });
                App.a.widgets = [];
            };
            App.m.publish("clear:dashboard");
            for (var key in App.a) {
                delete App.a[key];
            };
            delete App.a;
        };
        mc.subscribe('viewchange:DashboardList', {
            subscriber: this,
            callback: this.clearData
        });

    }
    return new Utilizer();

});