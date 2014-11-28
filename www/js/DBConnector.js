/**
 * Database connector module<br>
 * Implements ajax data fetching from Cache back-end
 * @module DBConnector
 */
define(['MessageCenter', 'Mocks'], function (mc, mocks) {
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
        var self = this;
        /**
         * Default settings for DBConnector
         * @var {Object}
         * @name module:DBConnector#defaults
         * @private
         * @property {string} username Username to connect to DB
         * @property {string} password Password to connect to DB
         */
//        var defaults = {
//            username: "_SYSTEM",
//            password: "159eAe72a79539f32acb15b305030060",
//            //password:"x79BTop",
//            cubeName: "PatientsCube",
//            server:"http://37.139.4.54/tfoms"
////              username: "_SYSTEM",
////            password: "x79BTop",
////            cubeName: "SubGroupCube",
////            server:"http://classroom.intersystems.ru:57772/stc/mdxrest"
//        };

        var parseJSON = function (d) {
            try {
                d = JSON.parse(d)
            } catch (e) {
                console.log("Error in parsing data:", d);
                d = undefined;

            };
            return d;
        }
        this.mode = "ONLINE";
        this.drillMDX = function (str, path) {
            var row = str.substring(str.indexOf(" ON 0,") + 6, str.indexOf(" ON 1"));
            str = str.replace(row, path + ".Children");
            return str;
        }
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
            //console.log("acquireData.args",args);
            var requester = args.target;
            //Calling wrong function
            //TODO: fix this
            if (requester === "dashboard") return;
            if (requester === "dashboard_list") return;
            if (requester === "drilldown") return;
            if (requester === "drilldown1") requester = "drilldown";
            var mdxRequested = "";
            var opts = $.extend({
                url: App.settings.server+"/MDX?Namespace=" + App.settings.namespace,
                type: "POST",
                contentType: "text/plain;charset=UTF-8",
                username: App.settings.username,
                password:  App.settings.password,
                success: function (d) {
                    //console.log("%cGot data from server:","font-color:red",d);
                    var chartData,
                        transformedData = [];
                        //localStorage[mdxRequested] = d;
                    if (d) {

                        d = parseJSON(d) || d;
                        chartData = d;
                    }
                    if(d.cells && d.cells.length===0) {chartData = null}
                    mc.publish("data_acquired:" + requester, {
                        data: chartData
                    });
                    return 1;
                }
            }, args.data);
            if (args.data.data.MDX.substr(0, 12).toUpperCase() == "DRILLTHROUGH") opts.url += "Drillthrough";
            opts.data = JSON.stringify({MDX: args.data.data.MDX});
            mdxRequested = opts.data.MDX;
            if (this.mode == "ONLINE") {
                if(localStorage[mdxRequested]){opts.success(localStorage[mdxRequested]);return;}
                $.ajax(opts);
                return;
            } else {
                opts.success(mocks.MDXs[opts.data.MDX]);
            }

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
                username: App.settings.username,
                password: App.settings.password,
                type: "GET",
                url: App.settings.server+"/FilterValues/" + App.settings.cubeName + "?Namespace=" + App.settings.namespace,
                success: function (d) {
                    if (d) {
                        try {

                            d = parseJSON(d) || d

                        } catch (e) {
                            throw new Error("Invalid data from server", e);
                        }
                        var filters = d.children.slice(0);
                        mc.publish("filters_acquired", {
                            data: filters
                        });
                    }

                }
            };
            if (this.mode == "ONLINE") {
                $.ajax(filter_opts);
                return;
            } else {
                filter_opts.success(mocks.filters);
            }
        };
        /**
         * Acquire possible values for selected filter
         * @function
         * @name module:DBConnector#acquireFilterValues
         * @fires module:MessageCenter#filter_list_acquired[path]
         * @listens module:MessageCenter#filter_list_requested
         */
        this.acquireFilterValues = function (args) {
            var path = args.target,
                name = args.data;
            if (sessionStorage.getItem("filterValues:" + path)) {
                mc.publish("filter_values_acquired:" + path, {
                    data: JSON.parse(sessionStorage.getItem("filterValues:" + path)),
                    path: path,
                    name: name
                });
                return;
            }
            var filter_list_opts = {
                username: App.settings.username,
                password: App.settings.password,
                type: "GET",
                url: App.settings.server+"/FilterValues/" + App.settings.cubeName + "/" + path,
                success: function (d) {
                    if (d) {
                        var d = JSON.parse(d) || d,
                            filterValues = d.children.slice(0);
                        sessionStorage.setItem("filterValues:" + path, JSON.stringify(filterValues))
                        mc.publish("filter_values_acquired:" + path, {
                            data: filterValues,
                            path: path,
                            name: name
                        });
                    }

                }
            }
            $.ajax(filter_list_opts);
        };
        this.acquireDrilldown = function (args) {

            var cubeName = args.cubeName,
                path = args.path,
                widget = args.widget || null;

            var MDX = "SELECT NON EMPTY " + path + ".children ON 1 FROM [" + cubeName + "]";
            //console.log(widget);
            if (widget) MDX = this.drillMDX(widget.datasource.data.MDX, path);
            args.target = "drilldown1";
            args.data = {
                data: {
                    MDX: MDX
                }
            };
           // console.log(args);
            this.acquireData(args);
        };

        this.acquireDashboardData = function (args) {
            var dashName = args;
            var dash_opts = {
                username: App.settings.username,
                password: App.settings.password,
                type: "POST",
                url: App.settings.server+"/Widgets?Namespace=" + App.settings.namespace,
                data: JSON.stringify({Dashboard: dashName}),
                contentType: "text/plain;charset=UTF-8", // this needed because otherwise jq send request as form, not as raw data
                success: function (d) {
                    if (d) {
                        d = parseJSON(d) || d;
                        mc.publish("data_acquired:dashboard", d);
                    }

                }
            };
            if (this.mode == "ONLINE") {
                $.ajax(dash_opts);
                return;
            } else {
                dash_opts.success(mocks.sample_dash);
            }
        };
        this.acquireDashboardList = function (args) {
            var dash_opts = {
                username: App.settings.username,
                password: App.settings.password,
                type: "GET",
                url: App.settings.server+"/Dashboards?Namespace="+App.settings.namespace,
                success: function (d) {
                    if (d) {
                        var d = parseJSON(d) || d;
                        // temp. delete after debug. hide trash items
                        /*var r = [];
                        for (var i = 0; i < d.children.length; i++) if (d.children[i].path.indexOf("$TRASH") == -1) r.push(d.children[i]);
                        d.children = r;*/
                        // ---------------
                        mc.publish("data_acquired:dashboard_list", d);

                    }

                }
            };
            if (this.mode == "ONLINE") {
                $.ajax(dash_opts);
                return;
            } else {
                dash_opts.success(mocks.dashboards);
            }
        };
        /* Subscriptions */
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
        mc.subscribe("data_requested:dashboard_list", {
            subscriber: this,
            callback: this.acquireDashboardList
        });
        mc.subscribe("data_requested:dashboard", {
            subscriber: this,
            callback: this.acquireDashboardData
        });
        mc.subscribe("data_requested:drilldown", {
            subscriber: this,
            callback: this.acquireDrilldown
        });
    };
    return new DBConnector();
});