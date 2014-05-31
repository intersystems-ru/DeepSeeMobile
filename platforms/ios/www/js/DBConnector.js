define([], function () {
    return function DBConnector() {
        this.acquireData = function (args) {
            var requester = args[0];
            console.log("We got params:",args);
            console.log("We got opts:",args[1]);
            
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
        if(mc){
            mc.subscribe("data_requested",{subscriber:this, callback:this.acquireData});
        }
    };

});