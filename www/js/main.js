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
    'lib/iscroll',
    'ViewManager',
    'Utilizer',
    'Filter'
], function (MessageCenter, LoadingSpinner, DBConnector, Dashboard, FiltersView, Utils, IScroll, ViewManager,Utilizer,Filter) {
    
    window.App = {};
    App.settings = {
           
            get server(){return (localStorage.settings_server || "")},
            set server(v){ localStorage.settings_server = v;},
            get username(){return (localStorage.settings_username || "")},
            set username(v){ localStorage.settings_username = v;},
            get password(){return (localStorage.settings_password || "")},
            set password(v){ localStorage.settings_password = v;},
            get cubeName(){return (localStorage.settings_cube || "")},
            set cubeName(v){ localStorage.settings_cube = v;},
            get namespace(){return (localStorage.settings_namespace || "")},
            set namespace(v){ localStorage.settings_namespace = v;}
        }
    App.m = MessageCenter;
    App.v = ViewManager;
    App.filters = [];
    MessageCenter.subscribe("filters_acquired", {
            subscriber: this,
            callback: function (d) {
                for (var i = 0; i < d.data.data.length; i++) {
                    App.filters.push(new Filter(d.data.data[i]));
                }
            }
        });
    MessageCenter.publish('filters_requested');
    MessageCenter.publish("viewchange:DashboardList", {
        holder: "body > .content"
    });
    $("a.nav-home").off('tap').on('tap', function (e) {
        e.preventDefault();
        MessageCenter.publish('viewchange:DashboardList', {
            holder: "body> .content"
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

});