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
    'FiltersView',
    'Utils'
], function (MessageCenter,LoadingSpinner, DBConnector, Dashboard, FiltersView, Utils) {
    window.App = {};
    App.m = MessageCenter;
    //App.m.subscribe("data_acquired", {subscriber:this, callback:function(d){console.log("DATA ACQUIRED:",d)}})
    App.a = new Dashboard("TEST/Mobiles.dashboard").render();


});