define([], function () {
    function PivotWidget() {
        var hasDiv = false;
        var showDrilldown = false;
        this.renderWidget = function () {
                var w_selector = "#widget" + this.id || "";
                var pivotSelector = ".pivot-container";
                if(Object.keys(this.config).length <2) return this;
                if (!hasDiv) {
                    $("<div class='pivot-container'>").appendTo(w_selector);
                    $("<div class='pivot-drilldown-container'>").hide().appendTo(w_selector);
                    hasDiv = true;
                }
                if(showDrilldown) {
                    $(w_selector).find(pivotSelector).hide();
                    pivotSelector = ".pivot-drilldown-container"; 
                    $(w_selector).find(pivotSelector).show();
                }
                console.log(this.config.data);
                $(w_selector).find(pivotSelector).pivotUI(this.config.data,{
                    rows:this.config.rows, 
                    cols:this.config.cols, 
                    measures:this.config.measures, 
                    onDrillDown:this.config.onDrillDown
                });
                
               
//                self=null;
                }
            }
    PivotWidget.prototype.toString = function () {
        return 'PivotWidget'
    };
    return PivotWidget;
});