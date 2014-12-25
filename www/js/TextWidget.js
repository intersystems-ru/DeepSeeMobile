define([], function () {
    function TextWidget() {
        this.renderWidget = function () {
            var w_selector = "#widget" + this.id || "";
            var parent = $(w_selector);
            var self = this;

            require(['text!../views/TextWidget.html'], function (html) {
                var list = $(html).clone();
                parent.empty().append(list);
                list = list.find(".table-view");
                list.empty();

                var d = self.config.textData.data;
                if (d.Cols[0]) {
                    if (d.Cols[0].tuples.length != 0) {
                        for (var i = 0; i < d.Cols[0].tuples.length; i++) {
                            var listItem = $(html).find(".table-view-cell").clone();
                            listItem.html(listItem.html().replace(/{{title}}/, d.Cols[0].tuples[i].caption));
                            listItem.html(listItem.html().replace(/{{value}}/, d.Data[i]));
                            listItem.appendTo(list);
                        }
                    }
                }
            });

            /*parent.empty();
            parent = $('<div class="card"></div>').appendTo(parent);
            parent = $('<ul class="table-view"></ul>').appendTo(parent);

            var d = this.config.textData.data;
            if (d.Cols[0]) {
                if (d.Cols[0].tuples.length != 0) {
                    for (var i = 0; i < d.Cols[0].tuples.length; i++) {
                        //var el = $("<div style='border: 1px soild #000'></div>");
                        var el = $('<li class="table-view-cell"></li>');
                        if (d.Cols[0].tuples[i].caption) el.html("<b>" + d.Cols[0].tuples[i].caption + ":</b> <span class='badge'>" + d.Data[i] + "</span>");
                        el.appendTo(parent);
                    }
                }
            }*/

        }
    };

    TextWidget.prototype.toString = function () {
        return 'TextWidget'
    };
    return TextWidget;
});