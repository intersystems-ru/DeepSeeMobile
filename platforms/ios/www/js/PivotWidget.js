define([], function () {
    function PivotWidget() {
        var hasDiv = false;
        var showDrilldown = false;
        this.renderWidget = function (isDrillDown) {
            
            var w_selector = "#widget" + this.id || "";
            var pivotSelector = ".pivot-container";
            if (isDrillDown) showDrilldown = isDrillDown;
            console.log("PW: ", this.config, w_selector);
            if (Object.keys(this.config).length < 2) return this;
            if (!hasDiv) {
                $("<div class='pivot-container' width=100%>").appendTo(w_selector);
                $("<div class='pivot-drilldown-container'>").hide().appendTo(w_selector);
                $("<div class='drilldown-back-container'>").hide().appendTo(w_selector);
                hasDiv = true;
            }
            if (showDrilldown) {
                $(w_selector).find(pivotSelector).hide();
                pivotSelector = ".pivot-drilldown-container";
                $(w_selector).find(pivotSelector).show();
                $(w_selector).find(".drilldown-back-container").show();
            }
            //if(!this.config.data || (this.config.data[0] === undefined)) return;
            $(w_selector).find(pivotSelector).pivotUI(this.config.data, {
                rows: this.config.rows,
                cols: this.config.cols,
                measures: this.config.measures,
                onDrillDown: this.config.onDrillDown
            });
            if (showDrilldown) {
                $(w_selector).find(".drilldown-back-container").text("<").one("tap", function () {
                    console.log("PIVOT SELECTOR", pivotSelector);
                    $(w_selector).find(".pivot-drilldown-container").hide();
                    $(w_selector).find(".drilldown-back-container").hide();
                    pivotSelector = ".pivot-container";
                    $(w_selector).find(".pivot-container").show();
                    showDrilldown = false;
                });
            }
        }
    }
    PivotWidget.prototype.toString = function () {
        return 'PivotWidget'
    };
    return PivotWidget;
});