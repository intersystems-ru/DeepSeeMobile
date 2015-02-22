define(['Language', 'MessageCenter', 'Dashboard'], function (Lang, MessageCenter, Dashboard) {
    function DashboardListController() {
        var self = this;
        this.FilterFolders = function(childs) {
            var items = [];
            var deep = App.folder.split("/").length;
            for (var i = 0; i < childs.length; i++) {
                var p = childs[i].path.split("/");
                var path = "";
                for (var k = 0; k < deep; k++) path += p[k] + "/";
                if (path != "") path = path.substr(0, path.length - 1);
                path = path.toLowerCase();
                if (path == App.folder.toLowerCase()) {
                    var firstPart = childs[i].path.toLowerCase().replace(App.folder.toLowerCase() + "/", "").split("/");
                    items.push({path: firstPart[0], desc: firstPart[0], title: childs[i].title, isFolder: firstPart.length > 1, icon: "fa-dashboard"});
                    if (items[items.length - 1].isFolder) {
                        items[items.length - 1].icon = "fa-folder-o";
                        items[items.length - 1].title = items[items.length - 1].path;
                        items[items.length - 1].desc = Lang.getText("folder");
                    }
                }
            }
            return items.sort(function(a, b){
                if (a.isFolder && !b.isFolder) return -1;
                if (!a.isFolder && b.isFolder) return 1;
                if (a.title > b.title) return 1; else return -1;
            });
        }

        var onDashboardListAcquired = function (e) {
            var items = self.FilterFolders(e.children);
            $("#btnMainRefresh").off('tap').on('tap', function() {
                if (App.a) {
                    if (App.a.widgets[App.a.activeWidget]) App.a.widgets[App.a.activeWidget].requestData();
                } else {
                    delete sessionStorage.dashboard_list;
                    App.m.publish("viewchange:DashboardList", {holder: "#mainScreen > .content"});
                }
            });

            App.dashboardList = items;
            if (sessionStorage.getItem("dashboard_list") == null) {
                sessionStorage.setItem('dashboard_list', JSON.stringify(e))
            };
            require(['text!../views/DashboardList.html'], function (html) {
                App.setTitle("");
                $("#btnMainFilter").hide();
                var template = Handlebars.compile(html);
                var rendered = template({
                    dashboardList: items
                });
                var final = $(rendered);
                final.show();
                final.find("li").off("tap").on('tap', function (e) {
                    var item = App.dashboardList[$(this).data('id')];
                    e.preventDefault();
                    if (item.isFolder) {
                        App.folder += "/" + item.path;
                        App.m.publish("viewchange:DashboardList", {holder: "#mainScreen > .content"});
                        $("#btnMainBack").show();
                    } else {
                        $("#btnMainBack").hide();
                        final.find("> *").removeClass("active");
                        $(this).addClass("active");
                        App.a = new Dashboard(App.folder + "/" + item.path).render();
                    }
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