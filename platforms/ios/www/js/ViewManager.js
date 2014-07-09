define(['MessageCenter'], function (mc) {
    function ViewManager() {
        if (ViewManager.prototype._instance) return ViewManager.prototype._instance;
        ViewManager.prototype._instance = this;
        var self = this;

        var onViewChange = function (d) {
            var view = d.target;
            if (d && d.handler && typeof d.handler == 'function') {
                d.handler();
            }
            $(d.holder).empty();
            require(["text!../views/" + view + ".html", 'js/ctrls/' + view + '.js'], function (html, js) {
                var $html = $(html);
                $(d.holder).append($html);
                js.call(self);
            });
        };
        mc.subscribe('viewchange', {
                subscriber: this,
                callback: onViewChange
            });


    };
    ViewManager.prototype.toString = function () {
        return 'ViewManager'
    };
    return new ViewManager();
});