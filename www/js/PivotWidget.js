define([], function () {
    function PivotWidget() {
        var hasDiv = false;
        this.renderWidget = function () {
                var w_selector = "#widget" + this.id || "";
                if(Object.keys(this.config).length <2) return this;
                if (!hasDiv) {
                    $("<div class='pivot-container'>").appendTo(w_selector);
                    hasDiv = true;
                }
                $(w_selector).find(".pivot-container").pivotUI(this.config.data,{rows:this.config.rows, cols:this.config.cols, measures:this.config.measures});
                
               
//                self=null;
                }
            }
    PivotWidget.prototype.toString = function () {
        return 'PivotWidget'
    };
    return PivotWidget;
});