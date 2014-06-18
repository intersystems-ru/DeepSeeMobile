/**
 * @fileOverview
 * Widget module<br>
 * @author Shmidt Ivan
 * @version 0.0.1
 * @module Widget
 * @requires FiltersList
 * @requires Utils
 * @requires MessageCenter
 */
define(['FiltersList', 'Utils', 'MessageCenter'], function (FiltersList, Utils, mc) {
    /**
     * Creates new Widget object
     * @alias module:Widget
     * @constructor Widget
     * @param config Configuration object
     * @listens module:MessageCenter#widget*_data_acquired
     * @return {module:Widget} new Widget object
     * @example
     *<caption>Creating new widget</caption>
     * new Widget(config);
     */
    function Widget(config) {
        /** @lends module:Widget#*/
        'use strict';
        var self = this;
        /**
         * @var {number} module:Widget#id ID of widget in dashboard
         */
        this.id = config.id;
        this.toString = function () {
            return "Widget" + this.id;
        };
        /**
         * @var {string} module:Widget#name Name of widget (title)
         */
        this.name = config.title || "Widget" + this.id;
        /**
         * @var {module:Dashboard} module:Widget#dashboard Parent dashboard object
         */
        this.dashboard = config.dashboard || "";
        /**
         * @var {Object} module:Widget#amcharts_config AmCharts config object
         */
        this.amcharts_config = config.amconfig || {};
        /**
         * @var {Object} module:Widget#chart Amcharts object, created after rendering
         */
        this.chart = '';
        /**
         * Request data from module:MessageCenter
         * @function module:Widget#requestData
         * @fires module:MessageCenter#data_requested
         */
        this.requestData = function () {
            mc.publish("data_requested", ["widget" + self.id, {
                data: self.datasource.data
            }]);
        }
        /**
         * Callback, fired when data acquired
         * @function module:Widget#onDataAcquired
         * @private
         */
        var onDataAcquired = config.callback || function (d) {
            this.amcharts_config.dataProvider = d.data;
            this.render();
        };

        //When created widget, must subscribe to widget[i] data acquired
        if (mc) {
            mc.subscribe("widget" + this.id + "_data_acquired", {
                subscriber: this,
                callback: onDataAcquired
            });
        }
        /**
         * @var {module:FiltersList} module:Widget#filters Selected filters list
         */
        this.filters = new FiltersList({
            filters: config.filters,
            onSetFilter: this.requestData,
            container: "#widget" + self.id
        });
        /**
         * @var {object} module:Widget#datasource Object with getter and setter, represents Widget's data source
         */
        var _datasource = {};
        Object.defineProperty(this, 'datasource', {
            get: function () {
                var retVal = _datasource.data.MDX;
                if (self.filters.hasFilters()) {
                    var _filters = self.filters.getAll();
                    console.log("%cFILTERS:", "color:blue", _filters);
                    for (var i in _filters) {
                        if (_filters[i].value != '')
                            retVal += ' %FILTER ' + _filters[i].path + "." + _filters[i].value;
                    }
                }
                return {
                    data: {
                        MDX: retVal
                    }
                };
            },
            set: function (value) {
                _datasource = value;
                self.requestData();
            }


        });

        //Set up datasource using setter
        this.datasource = config.datasource || {
            data: {}
        };

        /**
         * Simply renders widget
         *@function module:Widget#render
         */
        this.render = function () {
            var widget_holder = this.dashboard.config.holder + " .dashboard" || ".content .dashboard";

            require(["text!../Widget.html"], function (html) {
                html = html.replace("{{title}}", Utils.trim(self.name))
                    .replace("{{id}}", self.id);
                if ($("#widget" + self.id)[0] == undefined) $(widget_holder).append(html);
                if (self.amcharts_config.dataProvider && self.amcharts_config.dataProvider.length == 0) {
                    $("#widget" + self.id).empty().append("<p class='alert'>Cannot visuallize data! Change datasource</p>");
                    return;
                };
                if (self.amcharts_config) {
                    var w_selector = "widget" + self.id || "";
                    if (AmCharts) {
                        self.chart = AmCharts.makeChart(w_selector, self.amcharts_config);

                    }
                }
                console.log("[Render]Finished: " + self.name);
            });
            return this;

        }
    };
    return Widget;
})