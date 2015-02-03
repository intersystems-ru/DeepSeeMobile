define([
    'Language'
], function (Lang) {
    function PivotWidget(conf) {
        var hasDiv = false;
        var showDrilldown = false;
        this.conf = conf;

        this.renderWidget = function (isDrillDown) {

            if (this.pivot) {
                var newMdx = this.datasource.data.MDX
                if (this.pivot.getActualMDX() != newMdx) this.pivot.changeBasicMDX(newMdx);
                //this.pivot.dataSource.BASIC_MDX =  this.datasource.data.MDX;
                this.pivot.refresh();
                return;
            }

            var w_selector = "#widget" + this.id || "";
            $(w_selector).css("padding-bottom","10px").empty();

            var self= this;
            self.selCellFilters = "";
            var setup = {
                    container: $(w_selector).get(0),
                    dataSource: {
                        pivot: this.conf.datasource.pivot,
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
                        }
                    },
                    columnResizing: false,
                    hideButtons: true,
                    showSummary: true,
                    enableHeadersScrolling: true,
                    loadingMessageHTML: '<div class="loader"></div>',
                    //triggerEvent: "click",
                    locale: Lang.currentLocale(),
                    formatNumbers: "#,###.##"
                }

            this.pivot = new LightPivotTable(setup);
        }
    }

    PivotWidget.prototype.onDeactivate = function() {
        require("Widget").prototype.onDeactivate.apply(this);
        $("#btnMainBack").hide();
    }

    PivotWidget.prototype.toString = function () {
        return 'PivotWidget'
    };
    return PivotWidget;
});