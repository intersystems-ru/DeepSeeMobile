define([], function () {
    return function DBConnector() {
        var defaults = {
            username: "_SYSTEM",
            password: "159eAe72a79539f32acb15b305030060",
        }
        this.acquireData = function (args) {
            var requester = args[0];
            console.log("[DBConnector]Got args:", args);

            var opts = $.extend({
                url: "http://37.139.4.54/tfoms/MDX",
                type: "POST",
                data: {},
                username: "_SYSTEM",
                password: "159eAe72a79539f32acb15b305030060",
                success: function (d) {
                    var chartData;
                    if (d) {
                        var d = JSON.parse(d) || d;
                        var transformedData = [];
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
        this.acquireFilters = function (args) {
            var requester = args[0];
            var filter_opts = {
                username: defaults.username,
                password: defaults.password,
                type: "GET",
                url: "http://37.139.4.54/tfoms/FilterValues/QueueCube",
                success: function (d) {
                    if (d) {
                        var d = JSON.parse(d) || d;
                        filters = d.children.slice(0);
                        mc.publish(requester + "_filters_acquired", {
                            data: filters
                        });
                    }

                }
            };
            $.ajax(filter_opts);
        };
        this.acquireFilterList = function(args){
            var path = args[0],
                name=args[1];
            var filter_list_opts = {
            username: defaults.username,
                password: defaults.password,
                type: "GET",
                url: "http://37.139.4.54/tfoms/FilterValues/QueueCube/"+path,
                success: function (d) {
                    if (d) {
                        var d = JSON.parse(d) || d;
                        filters = d.children.slice(0);
                        mc.publish("filter_list_acquired"+path, {
                            data: filters,
                            path:path,
                            name:name
                        });
                    }

                }
            }
            $.ajax(filter_list_opts);
        }
        if (mc) {
            mc.subscribe("data_requested", {
                subscriber: this,
                callback: this.acquireData
            });
            mc.subscribe("filters_requested", {
                subscriber: this,
                callback: this.acquireFilters
            });
            mc.subscribe("filter_list_requested", {
                subscriber: this,
                callback: this.acquireFilterList
            });
        }
    };

});