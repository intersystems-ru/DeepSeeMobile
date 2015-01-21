define([/*'lib/iscroll-probe',*/ 'MessageCenter', 'Dashboard'], function (/*_iscroll, */MessageCenter, Dashboard) {
    function DashboardListController() {

        var onDashboardListAcquired = function (e) {
            $("#btnMainRefresh").off('tap').on('tap', function() {
                if (App.a) {
                    if (App.a.widgets[App.a.activeWidget]) App.a.widgets[App.a.activeWidget].requestData();
                } else {
                    delete sessionStorage.dashboard_list;
                    App.m.publish("viewchange:DashboardList", {holder: "#mainScreen > .content"});
                }
            });

            App.dashboardList = e.children;
            if (sessionStorage.getItem("dashboard_list") == null) {
                sessionStorage.setItem('dashboard_list', JSON.stringify(e))
            };
            require(['text!../views/DashboardList.html'], function (html) {
                App.setTitle("");
                $("#btnMainFilter").hide();
                var template = Handlebars.compile(html);
                var rendered = template({
                    dashboardList: e.children
                });
                var final = $(rendered);
                final.show();
                final.find("li").off("tap").on('tap', function (e) {
                    e.preventDefault();
                    final.find("> *").removeClass("active");
                    $(this).addClass("active");
                    App.a = new Dashboard(App.dashboardList[$(this).data('id')].path).render();
                    return false;
                });


                $('#mainScreen > .content').html(final);
                $('#mainScreen > .content').find(".loader").remove();
            });
        };
        if (sessionStorage.getItem("dashboard_list") == null) {
            MessageCenter.subscribe("data_acquired:dashboard_list", {
                subscriber: this,
                callback: onDashboardListAcquired,
                once: true
            });
            MessageCenter.publish("data_requested:dashboard_list");
        } else {
            onDashboardListAcquired(JSON.parse(sessionStorage.getItem("dashboard_list")));
        }
    };
    return DashboardListController;
});