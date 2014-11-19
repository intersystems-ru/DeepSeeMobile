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
            if(d === "null"){
            //No widgets in dashboard
                return;
            }
            var widgets = d.children;
            var self = this;
            for (var i = 0; i < widgets.length; i++) {

                var widget = widgets[i];
                var widget_config = WidgetMap[widget.type];
                if (!widget_config) {
                    widget_config = WidgetMap["null"]
                }
                widget_config.datasource = {
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


                widget_config.config.title = {
                    text: widget.title
                };
                self.addWidget(widget_config);
                widget = null;
                widget_config = null;
            };
            self = null;
            
        };
        this.subs.push(mc.subscribe("data_acquired:dashboard", {
            subscriber: this,
            callback: this.onDashboardDataAcquired
        }));
        mc.publish("data_requested:dashboard", dashName);
        
        this.removeRefs = function () {
            var self = this;
            for (var i = 0; i < this.subs.length; i++) {
                mc.remove(this.subs[i]);
                self.subs[i] = null;
            };
            this.subs = [];
            self = null;

        };
        mc.subscribe("clear:dashboard", {
            subscriber: this,
            callback: this.removeRefs,
            once: true
        });
    };
    /**
     * @name module:Dashboard#toString
     * @function
     * @return {String} Module name
     */
    Dashboard.prototype.toString = function () {
        return "Dashboard";
    };
/**
         * Renders up the whole dashboard with its widgets and so on.
         * @function module:Dashboard#addWidget
         * @param config {Object}  Configuration object for Widget
         * @example
         *  a.addWidget({
        title: "Очередь пациентов по профилям",
        amconfig: {
            "type": "serial",
            "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
            "categoryField": "category",
            "rotate": true,
            "startDuration": 1,
            "categoryAxis": {
                "autoRotateCount": -5,
                "gridPosition": "start",
                "inside": true
            },
            "trendLines": [],
            "graphs": [
                {
                    "balloonText": "[[title]] of [[category]]:[[value]]",
                    "fillAlphas": 1,
                    "id": "AmGraph-1",
                    "title": "",
                    "type": "column",
                    "valueField": "value"
      }
     ],
            "guides": [],
            "valueAxes": [
                {
                    "axisTitleOffset": -7,
                    "id": "ValueAxis-1",
                    "title": "Кол-во человек"
      }
     ],
            "allLabels": [],
            "balloon": {},
            "titles": [
                {
                    "id": "Title-1",
                    "size": 15,
                    "text": ""
      }
     ],

        },
        datasource: {
            data: {
                MDX: 'SELECT NON EMPTY {TOPPERCENT(ORDER([ProfileMODep].[H1].[Profile].Members,Measures.[%COUNT],BDESC),80),%LABEL(SUM(BOTTOMPERCENT(ORDER([ProfileMODep].[H1].[Profile].Members,Measures.[%COUNT],BDESC),20)),"Другой",,,,"font-style:italic;")} ON 1 FROM [QueueCube]'
            }
        },
        filters: [{
            name: "status",
            path: "[status].[H1].[status]",
            value: "&[0]",
            valueName: "0"
        }]
    });
         */
    Dashboard.prototype.addWidget = function (config) {
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
            }
            widget = null;
            return def.promise();
        };
Dashboard.prototype.createHolder = function(){
var holder = (this.config && this.config.holder) ? this.config.holder : "body";
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
            
            for (var i = 0; i < this.widgets.length; i++) {
                this.widgets[i].renderWidget();
            }
            var self = this;
            //Handling active widget change
            $(this.config.holder).off("slide").on("slide", function (e) {
                if (self.activeWidget != e.originalEvent.detail.slideNumber) {
                    self.activeWidget = e.originalEvent.detail.slideNumber;
                    if (mc) mc.publish("set_active_widget", {
                        id: self.activeWidget
                    });
                }
            });

            return this;
        };
    return Dashboard;


})