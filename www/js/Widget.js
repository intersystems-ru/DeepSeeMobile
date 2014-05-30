//Widget class definition
 
define([], function () {
    return function Widget(config) {
        var self = this;
        this.id = config.id;
        this.chart='';
        this.name = config.title || "Widget" + this.id;
        var callback = config.callback || function(d){
                console.log("gotta:",d);
                this.amcharts_config.dataProvider = d.data;
                this.render();
            };
        //When created widget, must subscribe to widget[i] data acquired
        if(mc){
            mc.subscribe("widget"+this.id+"_data_acquired", {subscriber:this, callback: callback});
        }
        this.dashboard = config.dashboard || "";
        this.amcharts_config = config.amconfig || {};
        this.render = function () {
            var widget_holder = this.dashboard.config.holder + " .dashboard" || ".content .dashboard";
            require(["text!../Widget.html"], function (html) {
                console.log(html);
                html = html.replace("{{title}}", self.name)
                    .replace("{{id}}", self.id);
                if($("#widget"+self.id)[0]==undefined) $(widget_holder).append(html);
                
                if (self.amcharts_config) {
                    var w_selector = "widget" + self.id || "";
                    if (AmCharts) {
                        console.log(w_selector,self.amcharts_config);
                        self.chart = AmCharts.makeChart(w_selector, self.amcharts_config);
                        console.log("[Render]Finished: " + self.name);
                    }
                }
            });

        }
    }

})