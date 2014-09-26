define(['lib/iscroll-probe', 'MessageCenter', 'Dashboard'], function (_iscroll, MessageCenter, Dashboard) {
    function DashboardListController() {

        var onDashboardListAcquired = function (e) {
            //console.log("Entered controller");
            App.dashboardList = e.children;
            if (sessionStorage.getItem("dashboard_list") == null) {
                sessionStorage.setItem('dashboard_list', JSON.stringify(e))
            };
            require(['text!../views/DashboardList.html'], function (html) {
                var template = Handlebars.compile(html);
                var rendered = template({
                    dashboardList: e.children
                });
                var final = $(rendered);
                final.find("li").off("tap").on('tap', function (e) {
                    e.preventDefault();
                    final.find("> *").removeClass("active");
                    $(this).addClass("active");
                    //Устраняем самопроизвольный запрос  dashboard_list'a
                    myScroll.destroy();
                    App.a = new Dashboard(App.dashboardList[$(this).data('id')].path).render();
                    return false;
                });
                $('body > .content').html(final);
                var pullDownEl = document.getElementById('pullDown'),
                    pullDownOffset = pullDownEl.offsetHeight;
                var myScroll = new IScroll('body > .content', {
                    probeType: 1
                });
                myScroll.on('scroll', function () {
                    if (this.y > 5 && !pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'flip';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
                        this.minScrollY = 0;
                    } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                        pullDownEl.className = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                        this.minScrollY = -pullDownOffset;
                    }
                });
                myScroll.on('scrollEnd', function () {
                    if (pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'loading';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
                        //console.log("Entered onScrollEnd");
                        MessageCenter.subscribe("data_acquired:dashboard_list", {
                            subscriber: this,
                            callback: function(e){myScroll.destroy(); onDashboardListAcquired(e); },
                            once: true
                        });
                        MessageCenter.publish("data_requested:dashboard_list");
                    }
                });
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