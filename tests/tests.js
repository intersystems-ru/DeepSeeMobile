requirejs.config({
    baseUrl: '../www/js/',
    paths: {
        text: "lib/text",
        jquery: "lib/jquery-2.1.1"
    }
});
require(['jquery','lib/highcharts.src','lib/underscore'],function(){});
QUnit.asyncTest("MessageCenter creating", function (assert) {
  var r = 0;


        var global = undefined;
        require(['MessageCenter','MessageCenter'], function (mc,mc2) {
            assert.ok(mc ? true : false, "Exists!");
            assert.ok(mc.subscribe ? true : false, "Has subscribe method!");
            assert.ok(mc.publish ? true : false, "Has publish method!");
            assert.deepEqual(mc, mc2, "Message Center is singleton");
            QUnit.start();
        });
        
    //    assert.equal(r, 1);

});
QUnit.asyncTest("Dashboard creating", function (assert) {
    require(['Dashboard'], function (d) {
            assert.ok(d, "Constructor exists!");
            var dash = new d();
            console.log(dash);
            assert.ok(dash, "Creates new object!");
            assert.ok(dash.render, "Has render method!");
            QUnit.start();
        });
        
    //    assert.equal(r, 1);

});