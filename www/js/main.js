/**
 * @fileOverview
 * Entry point for DeepSeeMobile application
 * @author Shmidt Ivan
 * @version 0.0.1
 */
require.config({
    baseUrl: 'js/',
    paths: {
        text: "lib/text"
    }
});
require([
    'MessageCenter',
    'LoadingSpinner',
    'DBConnector',
    'Dashboard',
    'ctrls/Filters',
    'Utils',
//    'lib/iscroll',
    'ViewManager',
    'Utilizer',
    'Filter'
], function (MessageCenter, LoadingSpinner, DBConnector, Dashboard, FiltersView, Utils, /*IScroll,*/ ViewManager,Utilizer,Filter) {
    
    window.App = {};

    App.settings = {
        server: "",
        namespace: "",
        title: "InterSystems DeepSee™"
    };

    App.m = MessageCenter;
    App.v = ViewManager;
    App.filters = [];
    MessageCenter.subscribe("filters_acquired", {
        subscriber: this,
        callback: function (d) {
            for (var i = 0; i < d.data.data.length; i++) {
                App.filters.push(new Filter(d.data.data[i], d.data.cube, d.data.widget));
            }
        }
    });


    MessageCenter.publish("viewchange:Login", {
        holder: "#loginScreen"
    });

    $("a.nav-home").off('tap').on('tap', function (e) {
        e.preventDefault();
        MessageCenter.publish('viewchange:DashboardList', {
            holder: "#mainScreen > .content"
        });
        return false;
    });
    App.clearData = function() {
        App.m.publish("clear:widgets");
        if (App.a && App.a.widget) {
            _.each(App.a.widgets, function (w, i) {
                delete App.a.widgets[i];
            });
            App.a.widgets = [];
        };
        App.m.publish("clear:dashboard");
    };

    App.setTitle = function(txt) {
        if (!txt) $("#mainTitle").text(App.settings.title); else $("#mainTitle").text(txt);
    }


});