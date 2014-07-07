/**
 * @fileOverview
 * Widget module.<br>
 * Represents widget class.
 * Implements common widget interface.
 * All render details must be implemented in classes ******Widget.js
 * and added to typesMap
 * @author Shmidt Ivan
 * @version 0.0.1
 * @module Widget
 * @requires FiltersList
 * @requires Utils
 * @requires MessageCenter
 */
define([
    'FiltersList',
    'Utils',
    'MessageCenter',
    'HighchartsWidget',
], function (FiltersList, Utils, mc, HighchartsWidget) {
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
        config = config || {};
        /** @lends module:Widget#*/
        'use strict';
        var self = this;
        this.active = false;
        /** 
         * If defined, would be used for data convertion
         * @function module:Widget#convertor
         * @return ConvertedData
         */
        this.convertor = _.has(config, 'convertor') ? config.convertor : null;
        /**
         * @var {number} module:Widget#id ID of widget in dashboard
         */
        this.id = _.has(config, 'id') ? config.id : null;

        /**
         * @var {string} module:Widget#name Name of widget (title)
         */
        this.name = _.has(config, 'title') ? config.title : "Widget" + this.id;
        /**
         * @var {module:Dashboard} module:Widget#dashboard Parent dashboard object
         */
        this.dashboard = _.has(config, 'dashboard') ? config.dashboard : null;
        /**
         * @var {Object} module:Widget#chartConfig Chart config object
         */
        this.chartConfig = _.has(config, 'chartConfig') ? config.chartConfig : {};
        /**
         * @var {Object} module:Widget#chart Amcharts object, created after rendering
         *@deprecated
         */
        this.chart = '';

        /**
         * Callback, fired when data acquired
         * @function module:Widget#onDataAcquired
         * @private
         * @todo Route which field data would be kept
         */
        this.onDataAcquired = config.callback || function (d) {
            console.log("GOT DATA:", this);
            this.chartConfig.series = d.data;
            this.renderWidget();
        };
        /**
         * @var {object} module:Widget#datasource Object with getter and setter, represents Widget's data source
         */
        var _datasource = {};

        //Set up datasource without using setter
        _datasource = config.datasource || {
            data: {}
        };
        Object.defineProperty(this, 'datasource', {
            get: function () {
                var retVal = _datasource.data.MDX;
                if (self.filters.hasFilters()) {
                    var _filters = self.filters.getAll();
                    //                    console.log("%cFILTERS:", "color:blue", _filters);
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
        this.filters = "";

        var typesMap = {
            'highcharts': HighchartsWidget
        };
        //Render for differend Widgets
        if (_.has(config, 'type') && _.has(typesMap, config.type)) {
            _.extend(this, new typesMap[config.type](this))
        }
        //When created widget, must subscribe to widget[i] data acquired
        this.init(config);
        return this;
    };

    Widget.prototype.toString = function () {
        return "Widget" + this.id;
    };
    Widget.prototype.init = function (config) {
        mc.subscribe("data_acquired:widget" + this.id , {
            subscriber: this,
            callback: this.onDataAcquired
        });

        /**
         * @var {module:FiltersList} module:Widget#filters Selected filters list
         */
        this.filters = new FiltersList({
            filters: config.filters,
            onSetFilter: this.requestData,
            container: "#widget" + this.id,
            w_obj: this
        });

        this.requestData();
    };
    /**
     * Simply renders widget
     *@function module:Widget#render
     */
    Widget.prototype.render = function () {
        //if (!this.active) return this;
        var widget_holder = this.dashboard.config.holder + " .dashboard" || ".content .dashboard";
        var self = this;
        require(["text!../Widget.html"], function (html) {
            html = html.replace("{{title}}", self.name)
                .replace("{{id}}", self.id);
            if ($("#widget" + self.id)[0] == undefined) {
                $(widget_holder).append(html);
                self.renderWidget();
                console.log("[Render]Finished: " + self.name);
            }
        });
        return this;

    };
    /**
     * Request data from module:MessageCenter
     * @function module:Widget#requestData
     * @fires module:MessageCenter#data_requested
     */
    Widget.prototype.requestData = function () {
        mc.publish("data_requested:widget" + this.id, {
            data: this.datasource.data
            });
    };
    return Widget;
})