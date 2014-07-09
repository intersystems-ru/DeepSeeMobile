define(['lib/iscroll','MessageCenter','Dashboard'], function(IScroll,MessageCenter,Dashboard){
    function DashboardListController(){
        
        var onDashboardListAcquired = function(e){
        App.dashboardList = e.children;
        require(['text!../views/DashboardList.html'], function(html){
            var template = Handlebars.compile(html);
            var rendered = template({dashboardList:e.children});
            var final = $(rendered);
            final.find("li").off("tap").on('tap', function(e){
                e.preventDefault();
                final.find("> *").removeClass("active"); 
                $(this).addClass("active");
                delete App.a;
                App.a = new Dashboard(App.dashboardList[$(this).data('id')].path).render();
                return false;
            });
            $('body > .content').html(final);
            new IScroll('body > .content', {
                        tap: true
                    });
        });
    };
        MessageCenter.subscribe("data_acquired:dashboard_list", {subscriber:this, callback:onDashboardListAcquired, once:true});
        MessageCenter.publish("data_requested:dashboard_list");
    };
    return DashboardListController;
});