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
    var login  = "";
    var pass   = "";

    $("#Login").focus();
    $("#btnLogin").on("tap", DoLogin);
    //Start();

    function make_base_auth(user, password) {
        var tok = user + ':' + password;
        var hash = btoa(tok);
        return "Basic " + hash;
    }

    function DoLogin() {
        $("#txtError").hide();
        login = $("#txtLogin").val();
        pass = $("#txtPassword").val();
        if (login && pass) {
            $("#loginProgress").show();
            $.ajax
            ({
                type: "GET",
                url: "http://37.139.4.54/tfomsauth/Test",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", make_base_auth(login, pass));
                },
                error: loginError,
                success: loginSuccess
            });
        }
    }

    function loginSuccess(d){
        $("#txtError").hide();
        $("#loginProgress").hide();
        Start();
    }

    function loginError(d) {
        $("#loginProgress").hide();
        $("#txtError").text("Wrong login or password").show();
    }

    function Start() {
        $.ajaxPrefilter(function( options ) {
            if (!options.beforeSend) {
                options.beforeSend = function (xhr) {
                    xhr.setRequestHeader('Authorization', make_base_auth(login, pass));
                    //xhr.setRequestHeader('Authorization', make_base_auth("_SYSTEM", "159eAe72a79539f32acb15b305030060"));
                }
            }
        });

        $("#loginScreen").remove();
        $("#mainScreen").show();
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

        //set default connection if not exists
        if (!App.settings.server) App.settings.server = "http://37.139.4.54/tfoms";
        if (!App.settings.username) App.settings.username = "_SYSTEM";
        if (!App.settings.password) App.settings.password = "Ae72a79539f32acb15b305030060";
        if (!App.settings.namespace) App.settings.namespace = "samples";
        //if (!App.settings.cubeName) App.settings.cubeName = "HoleFoods";

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
        //MessageCenter.publish('filters_requested');

        MessageCenter.publish("viewchange:DashboardList", {
            holder: "#mainScreen > .content"
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
    }

});