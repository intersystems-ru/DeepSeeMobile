define(['MessageCenter'], function (mc) {
    function ViewManager() {
        if (ViewManager.prototype._instance) return ViewManager.prototype._instance;
        ViewManager.prototype._instance = this;
        

        this.onViewChange = function (d) {
            var view = d.target;
            if (d && d.handler && typeof d.handler == 'function') {
                d.handler();
            }
            $(d.data.holder).empty();
            var self = this;
            require(["text!../views/" + view + ".html", 'js/ctrls/' + view + '.js'], function (html, js) {
                var $html = $(html);
                $(d.data.holder).append($html);
                console.log(d.data.holder,$html);
                js.call(self, d.data);
            });
            
        };
        mc.subscribe('viewchange', {
                subscriber: this,
                callback: this.onViewChange
            });


    };
    ViewManager.prototype.toString = function () {
        return 'ViewManager'
    };
    return new ViewManager();
});