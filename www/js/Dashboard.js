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
            for (var i = 0; i < widgets.length; i++) {

                var widget = widgets[i];
                var widget_config = WidgetMap[widget.type];
                if (!widget_config) {
                    widget_config = WidgetMap["null"]
                }
                widget_config.datasource = {
                    pivot: widget.dataSource,
                    data: {
                        MDX: widget.mdx
                    }
                };

                if (widget.type == "pivot") {
                    widget_config.datasource.data.MDX = widget.basemdx;
                }
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
                self.widgets[self.widgets.length - 1].cube = widgets[i].cube;
                if (widgets[i].cube) {
                    mc.publish('filters_requested', {cube: widgets[i].cube, widget: self.widgets[self.widgets.length - 1]});
                }
                if (widgets[i].controls) {
                    self.widgets[self.widgets.length - 1].controls = [];
                    for (var k = 0; k < widgets[i].controls.length; k++) if (widgets[i].controls[k].value != ""){
                        self.widgets[self.widgets.length - 1].controls.push(widgets[i].controls[k]);
                    }
                }

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
        $(".tri-left").hide();
        $(".tri-right").hide();
    };

    Dashboard.prototype.updateMarkers = function() {
        $(".tri-left").hide();
        $(".tri-right").hide();
        if (App.a.widgets.length == 0) return;
        if (App.a.activeWidget == 0) {
            $(".tri-right").show();
            return;
        }
        if (App.a.activeWidget == App.a.widgets.length - 1) {
            $(".tri-left").show();
            return;
        }
        $(".tri-right").show();
        $(".tri-left").show();
    }

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

        /** TODO: make widget page change from popover
            var name = widget.name;
            if (!name) name = "Widget #" + this.widgets.length.toString();
            var el = $("<li num="+this.widgets.length+" class='table-view-cell'>" + name + "</li>");
            el.on("tap", function(e) {
                var slide = $(self.config.holder).find(".slide").get(0);
                var offset = (parseInt($(e.target).attr("num"))-1) * slide.offsetWidth;
                // Move slide
                var slider = $(self.config.holder).find('.slide-group').get(0);
                slider.style['-webkit-transition-duration'] = '.2s';
                slider.style.webkitTransform = 'translate3d(-' + offset + 'px,0,0)';
                $("#widgetList").removeClass("visible");
                $('div.backdrop').remove();
            });
            $("#widgetList").find(".table-view").append(el);
**/
            widget = null;
            return def.promise();
        };

        Dashboard.prototype.createHolder = function(){
            var holder = (this.config && this.config.holder) ? this.config.holder : "mainScreen > .content";


            //temp//
            /*$(holder + " > *").remove();
            var tbl = $("<table border='1' width='100%'></table>");
            tbl.appendTo(holder);
            return;*/
            ///////////

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

           // setTimeout(this.tileView, 1000);


            return this;
        };

        Dashboard.prototype.tileView = function() {
            var slide = $(App.a.config.holder).find('.slide-group');
            var tbl = $("<table border='1'></table>");
            var tr = null;
            var td = null;
            var c = 0;
            slide.find(".slide").each(function(n, e){
                if (c == 0) {
                    tr = $("<tr></tr>");
                }
                tr.appendTo(tbl);
                td = $("<td></td>");
                $(e).find("div:eq(0)").appendTo(td);
                td.appendTo(tr);
                c++;
                if (c == 2) c = 0;
                console.log(e);
            });

            tbl.css("width", "300px")
                .css("border", "1px solid")
                .appendTo(App.a.config.holder);

            $(App.a.config.holder).find(".slider").remove();
        }

    return Dashboard;


})