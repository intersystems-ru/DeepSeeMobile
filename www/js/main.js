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

    App.ui = {
        navBar: $("#mainScreen .bar-nav")
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
            if (d.data.widget.controls) if (d.data.widget.controls.length != 0) {
                // move controls to filters if exists
                for (var c = 0; c < d.data.widget.controls.length; c++) {
                    for (var i = 0; i < App.filters.length; i++) if (App.filters[i].widget == d.data.widget) {
                        if (App.filters[i].path == d.data.widget.controls[c].targetProperty) {
                            var val = d.data.widget.controls[c].value;
                            var disp = d.data.widget.controls[c].targetPropertyDisplay;
                            var matches = val.match(/\[(.*?)\]/);
                            if (matches) disp = matches[1];
                            d.data.widget.filters.setFilter({
                                name: App.filters[i].name,
                                path: App.filters[i].path,
                                value: [val],
                                valueName: [disp]
                            }, true);
                        }
                    }
                }
                if (d.data.widget == App.a.widgets[App.a.activeWidget]) $("#btnMainFilter").addClass("tab-item-green");
                d.data.widget.controls = [];
            }
        }
    });


    MessageCenter.publish("viewchange:Login", {
        holder: "#loginScreen"
    });

    $("a.nav-home").off('tap').on('tap', function (e) {
        e.preventDefault();
        //App.clearData();
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