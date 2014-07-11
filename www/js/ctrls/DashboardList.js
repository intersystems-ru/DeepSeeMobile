define(['lib/iscroll','MessageCenter','Dashboard'], function(IScroll,MessageCenter,Dashboard){
    function DashboardListController(){
        
        var onDashboardListAcquired = function(e){
        App.dashboardList =  e.children;
        if(sessionStorage.getItem("dashboard_list") == null) {sessionStorage.setItem('dashboard_list', JSON.stringify(e))};
        require(['text!../views/DashboardList.html'], function(html){
            var template = Handlebars.compile(html);
            var rendered = template({dashboardList:e.children});
            var final = $(rendered);
            final.find("li").off("tap").on('tap', function(e){
                e.preventDefault();
                final.find("> *").removeClass("active"); 
                $(this).addClass("active"); 
                App.a = new Dashboard(App.dashboardList[$(this).data('id')].path).render();
                return false;
            });
            $('body > .content').html(final);
            new IScroll('body > .content', {
                        tap: true
                    });
        });
    };
        if(sessionStorage.getItem("dashboard_list") == null){
        MessageCenter.subscribe("data_acquired:dashboard_list", {subscriber:this, callback:onDashboardListAcquired, once:true});
        MessageCenter.publish("data_requested:dashboard_list");
        }
        else 
        {
            onDashboardListAcquired(JSON.parse(sessionStorage.getItem("dashboard_list")));
        }
    };
    return DashboardListController;
});