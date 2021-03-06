define([
        'Language'
], function (Lang) {
    return function(){
         var servers;
         if (localStorage.servers) servers = JSON.parse(localStorage.servers);

         $("#txtSelServer").text(Lang.getText("selServer"));
         $("#btnDone").text(Lang.getText("done"));

         if (servers) {
            var $lst = $("#lstServers");
            for (var i = 0; i < servers.length; i++) {
                var idx = (i+1).toString();
                var name = servers[i].name;
                if (!name) name = servers[i].ip;
                var $item = $('<li id="itemServer' + idx + '" class="table-view-cell filter-list-item" style="text-overflow: ellipsis">' + name + '<button id="btnEditServer' + idx + '" class="btn"><span class="icon icon-edit"></span>' + Lang.getText("edit") + '</button><button id="btnDeleteServer' + idx + '" class="btn btn-negative" style="display:none"><span class="icon icon-trash"></span>' + Lang.getText("delete") +'</button></li>');
                $item.attr("serverIndex", i.toString()).appendTo($lst);
                if (localStorage.currentServerId == i) {
                    $item.addClass("active");
                }
                $item.off('tap').on('tap', SetCurrentServer);
                $("#btnEditServer" + (i+1).toString()).off('tap').on('tap', EditServer);
                $("#btnDeleteServer" + (i+1).toString()).off('tap').on('tap', DeleteServer);
            }
        }

        function SetCurrentServer(e) {
            var id = $(e.currentTarget).attr("serverIndex");
            $("#lstServers .active").removeClass("active");
            $(e.currentTarget).addClass("active");
            localStorage.currentServerId = id;
            App.m.publish("viewchange:Login", { holder: "#loginScreen" });
        }

        function EditServer(e) {
            var id = $(e.currentTarget).parent().attr("serverIndex");
            App.m.publish("viewchange:ServerInfo", { holder: "#loginScreen", id: id });
        }

        function DeleteServer(e) {
            var id = $(e.currentTarget).parent().attr("serverIndex");
            if (id != undefined) {
                var servers;
                if (localStorage.servers) servers = JSON.parse(localStorage.servers);
                if (servers) {
                    if (localStorage.currentServerId == id) delete localStorage.currentServerId;
                    if (servers[id]) servers.splice(id, 1);
                    $(".table-view-cell:eq(" + id + ")").remove();
                    localStorage.servers = JSON.stringify(servers);
                }
            }
        }

        $("#btnDelete").off('tap').on('tap', function() {
            if ($(".table-view-cell").length == 0) return;
            $("#btnDone").show();
            $("#btnAdd").hide();
            $(".table-view-cell .btn").hide();
            $(".table-view-cell .btn-negative").show();
        });
        $("#btnDone").off('tap').on('tap', function() {
            $("#btnDone").hide();
            $("#btnAdd").show();
            $(".table-view-cell .btn").show();
            $(".table-view-cell .btn-negative").hide();
        });

        $("#btnBack").off('tap').on('tap', function() {
            App.m.publish("viewchange:Login", { holder: "#loginScreen" });
        });
        $("#btnAdd").off('tap').on('tap', function() {
            App.m.publish("viewchange:ServerInfo", { holder: "#loginScreen" });
        });


    };
});