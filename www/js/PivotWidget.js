define([], function () {
    function PivotWidget() {
        var hasDiv = false;
        var showDrilldown = false;
        this.renderWidget = function (isDrillDown) {

            if (this.pivot) {
                this.pivot.dataSource.BASIC_MDX =  this.datasource.data.MDX;
                this.pivot.refresh();
                return;
            }

            var w_selector = "#widget" + this.id || "";
            /*var pivotSelector = ".pivot-container";
            if (isDrillDown) showDrilldown = isDrillDown;
            //console.log("PW: ", this.config, w_selector);
            if (Object.keys(this.config).length < 2) return this;
            if (!hasDiv) {
                $("<div class='pivot-container' width=100%>").appendTo(w_selector);
                $("<div class='pivot-drilldown-container'>").hide().appendTo(w_selector);
                $("<div class='drilldown-back-container'>").hide().appendTo(w_selector);
                hasDiv = true;
            }*/
            /*if (showDrilldown) {
                $(w_selector).find(pivotSelector).hide();
                pivotSelector = ".pivot-drilldown-container";
                $(w_selector).find(pivotSelector).show();
                $(w_selector).find(".drilldown-back-container").show();
            }*/
            //if(!this.config.data || (this.config.data[0] === undefined)) return;
            /*$(w_selector).find(pivotSelector).pivotUI(this.config.data, {
                rows: this.config.rows,
                cols: this.config.cols,
                measures: this.config.measures,
                onDrillDown: this.config.onDrillDown
            });*/

            /*if (!this.pivotScroll) {
                this.pivotScroll = new IScroll($(w_selector).parent().get(0), {vScrollbar: true});
            }*/

            var self= this;
            self.selCellFilters = "";
            var setup = {
                    container: $(w_selector).get(0),
                    dataSource: {
                        MDX2JSONSource: App.settings.server,
                        basicMDX: this.datasource.data.MDX,
                        namespace: App.settings.namespace,
                        username: App.settings.username,
                        password: App.settings.password
                    },
                    triggers: {
                        drillDown: function() {
                            $("#btnMainBack").show();
                        },
                        drillThrough: function() {
                            $("#btnMainBack").show();
                        },
                        /* cellDrillThrough: function(d) {
                            $(d.event.currentTarget).parent().parent().find(".selected-cell").removeClass("selected-cell");
                            $(d.event.currentTarget).addClass("selected-cell");
                            self.selCellFilters = d.filters;
                            //self.pivot.tryDrillThrough(d.filters);
                            $("#btnMainDrillthrough").show();
                            return false;
                        }*/
                    },
                    hideButtons: true,
                    showSummary: true,
                    triggerEvent: "click",
                    formatNumbers: "#,###.##"
                }

           /* lp.setFilter("[DateOfSale].[Actual].[YearSold].&[2009]");
            lp.refresh();var setup = { // Object that contain settings. Any setting may be missed.
                    container: document.getElementById("pivot"), // HTMLElement on DOM which will contain table.
                    dataSource: {
                        MDX2JSONSource: "http://localhost:57772/SAMPLES", // MDX2JSON source server address
                        basicMDX: "SELECT NON EMPTY [Product].[P1].[Product Category].Members ON 0, NON EMPTY [Outlet].[H1].[Region].Members ON 1 FROM [HoleFoods]" // basic MDX which are going to be rendered when widget loads
                    }
                    , caption: "My table" // if set, table basic caption will be replaced by this text
                    , showSummary: true // show summary by columns
                    , formatNumbers: "#,###.##" // number formatting mask // @deprecated
                    , drillDownTarget: "dashboard name.dashboard" // custom drilldown target, DeepSee only.
                },*/

            this.pivot = new LightPivotTable(setup);

            //new IScroll($(w_selector).parent().parent().parent().get(0));
            //lp.setFilter("[DateOfSale].[Actual].[YearSold].&[2009]");
            //lp.refresh();

            /*if (showDrilldown) {
                $(w_selector).find(".drilldown-back-container").text("<").one("tap", function () {
                    //console.log("PIVOT SELECTOR", pivotSelector);
                    $(w_selector).find(".pivot-drilldown-container").hide();
                    $(w_selector).find(".drilldown-back-container").hide();
                    pivotSelector = ".pivot-container";
                    $(w_selector).find(".pivot-container").show();
                    showDrilldown = false;
                });
            }*/
        }
    }
    PivotWidget.prototype.toString = function () {
        return 'PivotWidget'
    };
    return PivotWidget;
});