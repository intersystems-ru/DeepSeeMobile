/**
 * @fileOverview
 * Dashboard module<br>
 * @author Shmidt Ivan
 * @version 0.0.1
 * @module Dashboard
 * @requires DashboardConfig
 * @requires Widget
 * @requires Filter
 * @requires MessageCenter
 * @requires jQuery
 * @todo Delete jQuery dependency
 */
define([
    'DashboardConfig',
    'Widget',
    'Filter',
    'MessageCenter',
    "WidgetMap"
], function (DashboardConfiguration, Widget, Filter, mc, WidgetMap) {
    'use strict';
    /**
     * @class
     * @class Dashboard
     * @alias module:Dashboard
     * @listens module:MessageCenter#filters_acquired
     * @fires module:MessageCenter#filters_requested
     * @return {Dashboard} New dashboard object
     */
    function Dashboard(dashName) {
        /**@lends module:Dashboard#*/
        /**
         * Array of Widget objects
         * @var {Array<module:Widget>}
         * @name module:Dashboard#widgets
         * @todo Make this one private
         */
        this.widgets = [];
        /** 
         * Flag, that shows current active widget
         * @var {number} module:Dashboard#activeWidget
         * @public
         */
        this.activeWidget = undefined;
        this.subs = [];
        /**
         * Dashboard config
         * @var {module:DashboardConfig} module:Dashboard#config
         */
        this.config = new DashboardConfiguration();
        /****
        Methods
        *****/
        this.createHolder();
        this.onDashboardDataAcquired = function (d) {
            $("#btnMainFilter").show();
            if(d === "null"){
            //No widgets in dashboard
                return;
            }
            App.filters = [];
            var requestedFiltersForCube = [];
            var widgets = d.children;
            var self = this;

            //var widget_configs = [];
            for (var i = 0; i < widgets.length; i++) {

                var widget = widgets[i];
                var widget_config;

                if (!WidgetMap[widget.type]) {
                    widget_config = WidgetMap["null"]
                } else
                    widget_config = $.extend(true, {}, WidgetMap[widget.type]);
                widget_config.id = Math.random();
                widget_config.datasource = {
                    pivot: widget.dataSource,
                    data: {
                        MDX: widget.mdx
                    }
                };

                widget_config.filters = [];
                _.each(widget.children, function (filter) {
                    widget_config.filters.push({
                        name: filter.label,
                        path: filter.path,
                        value: filter.value
                    });
                });

                if (!widget_config.config) widget_config.config = {};
                widget_config.config.title = {
                    text: widget.title
                };
                self.addWidget(widget_config);
                //widget_config.widget = self.widgets[self.widgets.length - 1];
                var curWidget = self.widgets[self.widgets.length - 1];
                curWidget.cube = widgets[i].cube;

                // setup widget controls
                for (var c = 0; c < widgets[i].controls.length; c++) if (widgets[i].controls[c].action == "applyFilter") {
                    curWidget.controls.push(widgets[i].controls[c]);
                    curWidget.filters.setFilter(new Filter({name: widgets[i].controls[c].label, path: widgets[i].controls[c].targetProperty, info: widgets[i].controls[c].type}, widgets[i].cube, curWidget), true);
                    //App.filters.push(new Filter({name: widgets[i].controls[c].label, path: widgets[i].controls[c].targetProperty, info: widgets[i].controls[c].type}, widgets[i].cube, curWidget));

                    var val = widgets[i].controls[c].value;
                    var disp = widgets[i].controls[c].targetPropertyDisplay;
                    var matches = val.match(/\[(.*?)\]/);
                    if (matches) disp = matches[1];

                    if (val != "") {
                        curWidget.filters.setFilter({
                            name: widgets[i].controls[c].label,
                            path: widgets[i].controls[c].targetProperty,
                            value: [val],
                            valueName: [disp]
                            //cube: curWidget.cube,
                            //widget: curWidget
                        }, true);
                        if (App.a.activeWidget == curWidget.id) $("#btnMainFilter").addClass("tab-item-green");
                    }
                }

                $('<div class="circle"></div>').appendTo(".markets");

                widget = null;
                widget_config = null;
            };
            self = null;
            this.updateMarkers();
        };

        this.subs.push(mc.subscribe("data_acquired:dashboard", {
            subscriber: this,
            callback: this.onDashboardDataAcquired
        }));
        mc.publish("data_requested:dashboard", dashName);
        
        this.removeRefs = function () {
            this.hideMarkers();
            var self = this;
            for (var i = 0; i < this.subs.length; i++) {
                mc.remove(this.subs[i]);
                self.subs[i] = null;
            };
            this.subs = [];
            self = null;

        };
        mc.subscribe("set_active_widget", {
            subscriber: this,
            callback: this.updateMarkers
        });
        mc.subscribe("clear:dashboard", {
            subscriber: this,
            callback: this.removeRefs,
            once: true
        });
    };

    Dashboard.prototype.hideMarkers = function() {
        $(".markets").empty();
    };

    Dashboard.prototype.updateMarkers = function() {
        if (App.a.widgets.length <= 1) {
            this.hideMarkers();
            return;
        }

        $(".markets").find(".circle").removeClass("circle-full");
        $(".markets").find(".circle:eq("+App.a.activeWidget+")").addClass("circle-full");
    }

    /**
     * @name module:Dashboard#toString
     * @function
     * @return {String} Module name
     */
    Dashboard.prototype.toString = function () {
        return "Dashboard";
    };

    Dashboard.prototype.addWidget = function (config) {
            var self = this;
            var def = $.Deferred();
            var config = config || {};
            config.dashboard = this;
            config.id = this.widgets.length;
            config.promise = def;
            //Put promise to widget constructor
            var widget = new Widget(config);
            this.widgets[this.widgets.length] = widget;
            if (this.activeWidget == null) {
                this.activeWidget = 0;
                App.setTitle(widget.name);
                widget.onActivate();
                //mc.publish("set_active_widget", { id: 0 });
            }

            widget = null;
            return def.promise();
        };

        Dashboard.prototype.createHolder = function(){
            var holder = (this.config && this.config.holder) ? this.config.holder : "mainScreen > .content";
                require(['text!../views/Dashboard.html'], function (html) {
                    $(holder + " > *").remove();
                    $(holder).append(html);
                });
        };
             /**
         * Renders up the whole dashboard with its widgets and so on.
         * @function module:Dashboard#render
         */

        Dashboard.prototype.render = function () {
            App.setTitle("");
            for (var i = 0; i < this.widgets.length; i++) {
                this.widgets[i].renderWidget();
            }
            var self = this;
            //Handling active widget change
            $(this.config.holder).off("slide").on("slide", function (e) {
                if (self.activeWidget != e.originalEvent.detail.slideNumber) {
                    var oldWidget = App.a.widgets[self.activeWidget];
                    if (oldWidget) oldWidget.onDeactivate();
                    self.activeWidget = e.originalEvent.detail.slideNumber;
                    var w = App.a.widgets[self.activeWidget];
                    if (w) w.onActivate();

                    $("#btnMainBack").hide();
                    $("#btnMainDrillthrough").hide();
                    if (w.pivot) {
                        $("#btnMainDrillthrough").show();
                        if (w.pivot.pivotView.tablesStack.length > 1) $("#btnMainBack").show();
                    }
                    App.setTitle(w.name);
                    if (mc) mc.publish("set_active_widget", {
                        id: self.activeWidget
                    });
                }
            });
            return this;
        };
    return Dashboard;


})