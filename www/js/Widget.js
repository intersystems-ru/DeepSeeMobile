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
    'PivotWidget'
], function (FiltersList, Utils, mc, HighchartsWidget, PivotWidget) {
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
    function Widget(opts) {

        this.def = opts.promise;
        opts = opts || {};
        /** @lends module:Widget#*/
        'use strict';
        this.active = false;
        /** 
         * If defined, would be used for data convertion
         * @function module:Widget#convertor
         * @return ConvertedData
         */
        this.convertor = _.has(opts, 'convertor') ? opts.convertor : null;
        /**
         * @var {number} module:Widget#id ID of widget in dashboard
         */
        this.id = _.has(opts, 'id') ? opts.id : null;
        this.callback = opts.callback || undefined;
        /**
         * @var {string} module:Widget#name Name of widget (title)
         */
        this.name = _.has(opts, 'config') ? opts.config.title.text : "Widget" + this.id;
        /**
         * @var {module:Dashboard} module:Widget#dashboard Parent dashboard object
         */
        this.dashboard = _.has(opts, 'dashboard') ? opts.dashboard : null;
        /**
         * @var {Object} module:Widget#config Chart config object
         */
        this.config = _.has(opts, 'config') ? opts.config : {};
        /**
         * @var {Object} module:Widget#chart Amcharts object, created after rendering
         *@deprecated
         */
        this.chart = '';
        this.subs = [];

        /**
         * @var {string} module:Widget#cube Cube name used by widget
         */
        this.cube = null;
        var parts = opts.datasource.data.MDX.toUpperCase().split("FROM ");
        if (parts.length >= 2) {
            this.cube = parts[1].split(" ")[0].replace("[", "").replace("]", "");
        }

        /**
         * @var {object} module:Widget#datasource Object with getter and setter, represents Widget's data source
         */
        var _datasource = {};

        //Set up datasource without using setter
        _datasource = opts.datasource || {
            data: {}
        };
        Object.defineProperty(this, 'datasource', {
            get: function () {
                var retVal = _datasource.data.MDX;
                if (this.filters.hasFilters()) {
                    var _filters = this.filters.getAll();
                    for (var i in _filters) {
                        if ($.isArray(_filters[i].value)) {
                            if (_filters[i].value.length == 1) {
                                if (_filters[i].value[0] != '') retVal += ' %FILTER ' + _filters[i].path + "." + _filters[i].value[0];
                            } else {
                                retVal += ' %FILTER {'
                                for (var k = 0; k < _filters[i].value.length; k++) {
                                    if (_filters[i].value[k] != "") retVal += _filters[i].path + "." + _filters[i].value[k] + ",";
                                }
                                if (retVal.substr(retVal.length - 1, 1) == ",") retVal= retVal.substr(0, retVal.length - 1);
                                retVal += "} ";
                            }
                        } else {
                            if (_filters[i].value != '') retVal += ' %FILTER ' + _filters[i].path + "." + _filters[i].value;
                        }
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
                this.requestData();
            }


        });
        this.filters = "";

        var typesMap = {
            'highcharts': HighchartsWidget,
            'pivot': PivotWidget
        };
        //Extend with type-specified opts
        if (_.has(opts, 'type') && _.has(typesMap, opts.type)) {
            _.extend(this, new typesMap[opts.type]())
        };
        /**
         * Callback, fired when data acquired
         * @function module:Widget#onDataAcquired
         * @private
         * @todo Route which field data would be kept
         */
        this.onDataAcquired = function (d, isDrillDown) {
            //console.log(d);
             $("#widget" + this.id).parent().find(".error-msg").html('').hide();
            if(isDrillDown === undefined) isDrillDown = false;
            if (d===undefined || d.data === null) {
                $("#widget" + this.id).parent().find(".error-msg").html("<h4 class='data-null'>Dataset is empty, change filters or query</h4>").show();
                return;
            }
            if (this.convertor) {
                // d =  || d;
                d = this.convertor(d);
            }
            if (this.callback) {
                //Added widget link to callback's call
                this.callback(d,this);
            }
            if (this.renderWidget) this.renderWidget(isDrillDown);
        };
        this.removeRefs = function () {
            var self = this;
            _.each(this.subs, function (sub, i) {
                mc.remove(sub);
                sub = null;
                self.subs.splice(i, 1);
            });
            this.subs = [];
            self = null;
        };
        //When created widget, must subscribe to widget[i] data acquired
        this.init(opts);
        return this;
    };

    Widget.prototype.toString = function () {
        return "Widget" + this.id;
    };
    Widget.prototype.init = function (opts) {

       // if (this.cube) {
         //   mc.publish('filters_requested', {cube: this.cube});
        //}
        this.subs.push(mc.subscribe("data_acquired:widget" + this.id, {
            subscriber: this,
            callback: this.onDataAcquired
        }));
        mc.subscribe("clear:widgets", {
            subscriber: this,
            callback: this.removeRefs,
            once: true
        });
        /**
         * @var {module:FiltersList} module:Widget#filters Selected filters list
         */
        this.filters = new FiltersList({
            filters: opts.filters || [],
            onSetFilter: this.requestData,
            container: "#widget" + this.id,
            w_obj: this
        });
        var self = this;
        this.createHolder().then(function(){self.requestData()});
        mc.publish('[Init]Finished: ' +this.name);
    };
    /**
     * Simply renders widget
     *@function module:Widget#render
     */
    Widget.prototype.createHolder = function () {
        var def = $.Deferred();
        //if (!this.active) return this;
        var widget_holder = this.dashboard.config.holder + " .dashboard" || ".content .dashboard";
        var self = this;
        require(["text!../views/Widget.html"], function (html) {
            html = html.replace("{{title}}", self.name)
                .replace("{{id}}", self.id);
            if ($("#widget" + self.id)[0] == undefined) {
                $(widget_holder).append(html);
                def.resolve();
                //mc.publish("[Render]Holder created: " + self.name);
                
            }
            self = null;
        });

        return def.promise();

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