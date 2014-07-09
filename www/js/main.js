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
    'ViewManager'
], function (MessageCenter,LoadingSpinner, DBConnector, Dashboard, FiltersView,Utils, IScroll, ViewManager) {
    window.App = {};
    App.m = MessageCenter;
    App.v = ViewManager;
    
    MessageCenter.publish("viewchange:DashboardList",{holder:"body > .content"});
    $("a.nav-home").off('tap').on('tap', function(e){
        e.preventDefault();
        MessageCenter.publish('viewchange:DashboardList', {holder:"body> .content"});
        return false;
    });
    //App.m.subscribe("data_acquired", {subscriber:this, callback:function(d){console.log("DATA ACQUIRED:",d)}})
    //App.a = new Dashboard("TEST/Mobiles.dashboard").render();


});