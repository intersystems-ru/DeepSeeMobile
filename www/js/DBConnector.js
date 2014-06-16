/**
 * Database connector module<br>
 * Implements ajax data fetching from Cache back-end
 * @module DBConnector
 */
define(['jquery', 'MessageCenter'], function ($, mc) {
    "use strict";
    /**
     * @constructor
     * @alias module:DBConnector
     * @return {Object} Instance
     */
    function DBConnector() {
        /**@lends module:DBConnector#*/
        /** Singleton instantiating */
        if (DBConnector.prototype._instance) {
            return DBConnector.prototype._instance;
        }
        DBConnector.prototype._instance = this;
        /**
         * Default settings for DBConnector
         * @var {Object}
         * @name module:DBConnector#defaults
         * @private
         * @property {string} username Username to connect to DB
         * @property {string} password Password to connect to DB
         */
        var defaults = {
            username: "_SYSTEM",
            password: "159eAe72a79539f32acb15b305030060"
        };
        /**
         * @name module:DBConnector#toString
         * @function
         * @return {String} Module name
         */
        this.toString = function () {
            return "DBConnector";
        };
        /**
         * Does ajax request for data from server
         * @function
         * @name module:DBConnector#acquireData
         * @fires module:MessageCenter#*_data_acquired
         * @listens module:MessageCenter#data_requested
         */
        this.acquireData = function (args) {
            var requester = args[0],
                opts = $.extend({
                    url: "http://37.139.4.54/tfoms/MDX",
                    type: "POST",
                    data: {},
                    username: "_SYSTEM",
                    password: "159eAe72a79539f32acb15b305030060",
                    success: function (d) {
                        var chartData,
                            transformedData = [];
                        if (d) {
                            try {
                                d = JSON.parse(d) || d;
                            } catch (e) {
                                throw new Error("Incorrect data from server");
                            }
                            for (var i = 0; i < d.axes[1].tuples.length; i++) {
                                transformedData.push({
                                    category: d.axes[1].tuples[i].caption,
                                    value: d.cells[i]
                                });
                            }
                            chartData = transformedData;
                        }
                        mc.publish(requester + "_data_acquired", {
                            data: chartData
                        });
                        return 1;
                    }
                }, args[1]);
            $.ajax(opts);

        }
        /**
         * Acquires filter list for cube from server
         * @function
         * @name module:DBConnector#acquireFilters
         * @fires module:MessageCenter#filters_acquired
         * @listens module:MessageCenter#filters_requested
         */
        this.acquireFilters = function (args) {
            var filter_opts = {
                username: defaults.username,
                password: defaults.password,
                type: "GET",
                url: "http://37.139.4.54/tfoms/FilterValues/QueueCube",
                success: function (d) {
                    if (d) {
                        try {
                            var d = JSON.parse(d) || d
                        } catch (e) {
                            throw new Error("Invalid data from server");
                        }
                        var filters = d.children.slice(0);
                        mc.publish("filters_acquired", {
                            data: filters
                        });
                    }

                }
            };
            $.ajax(filter_opts);
        };
        /**
         * Acquire possible values for selected filter
         * @function
         * @name module:DBConnector#acquireFilterValues
         * @fires module:MessageCenter#filter_list_acquired[path]
         * @listens module:MessageCenter#filter_list_requested
         */
        this.acquireFilterValues = function (args) {
            var path = args[0],
                name = args[1];
            var filter_list_opts = {
                username: defaults.username,
                password: defaults.password,
                type: "GET",
                url: "http://37.139.4.54/tfoms/FilterValues/QueueCube/" + path,
                success: function (d) {
                    if (d) {
                        var d = JSON.parse(d) || d,
                            filters = d.children.slice(0);
                        mc.publish("filter_values_acquired" + path, {
                            data: filters,
                            path: path,
                            name: name
                        });
                    }

                }
            }
            $.ajax(filter_list_opts);
        };
        /* Subscriptions */
        if (mc) {
            mc.subscribe("data_requested", {
                subscriber: this,
                callback: this.acquireData
            });
            mc.subscribe("filters_requested", {
                subscriber: this,
                callback: this.acquireFilters
            });
            mc.subscribe("filter_values_requested", {
                subscriber: this,
                callback: this.acquireFilterValues
            });
        };
    };
    return new DBConnector();
});