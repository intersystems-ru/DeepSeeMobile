define([], function(){
    return function(){
        var servers;
        var login;
        var pass;


        if (sessionStorage.dashboard_list) delete sessionStorage.dashboard_list;

        if (localStorage.servers) servers = JSON.parse(localStorage.servers);
        if (servers) {
            if (localStorage.currentServerId) {
                var id = parseInt(localStorage.currentServerId);
                if (servers[id]) {
                    if (servers[id].name) $("#selServer").text("Server: " + servers[id].name);
                    else $("#selServer").text("Server: " + servers[id].ip);
                    $("#txtLogin").val(servers[id].user);
                    $("#txtPassword").val(servers[id].password);
                    App.settings.server = servers[id].ip;
                    App.settings.namespace = servers[id].namespace;
                }
            }
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
                    url: App.settings.server + "/Test",
                    dataType: 'text',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", make_base_auth(login, pass));
                    },
                    error: loginError,
                    success: loginSuccess
                });
            }
        }

        function make_base_auth(user, password) {
            var tok = user + ':' + password;
            var hash = btoa(tok);
            return "Basic " + hash;
        }

        function loginSuccess(d){
            $("#loginScreen").hide();
            $("#mainScreen").show();
            $("#txtError").hide();
            $("#loginProgress").hide();
            App.settings.username = login;
            App.settings.password = pass;
            $.ajaxPrefilter(function( options ) {
                if (!options.beforeSend) {
                    options.beforeSend = function (xhr) {
                        xhr.setRequestHeader('Authorization', make_base_auth(login, pass));
                        //xhr.setRequestHeader('Authorization', make_base_auth("_SYSTEM", "159eAe72a79539f32acb15b305030060"));
                    }
                }
            });

            App.m.publish("viewchange:DashboardList", {
                holder: "#mainScreen > .content"
            });
        }

        function loginError(d) {
            $("#loginProgress").hide();
            $("#txtError").text("Wrong login or password").show();
        }

        $("#selServer").off('tap').on('tap', function(){
            App.m.publish("viewchange:ServerList", { holder: "#loginScreen" });
        });

        $("#btnLogin").off('tap').on('tap', DoLogin);



    };
});