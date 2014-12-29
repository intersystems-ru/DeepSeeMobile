define([], function () {
    function TextWidget() {
        this.renderWidget = function () {
            var w_selector = "#widget" + this.id || "";
            var parent = $(w_selector);
            var self = this;

            this.renderAsTableview();
            return;

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

            /*
             <div class="card">
             <ul class="table-view">
             <li class="table-view-cell"><b>{{title}}</b><span class="badge widget-txt-val">{{value}}</span></li>
             </ul>
             </div>
             */

        }
    };

    $.fn.textfill = function(options) {
        var fontSize = options.maxFontPixels;
        var ourText = $('span:visible:first', this);
        var maxHeight = $(this).height();
        var maxWidth = $(this).width();
        var textHeight;
        var textWidth;
        do {
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while (textHeight > maxHeight || textWidth > maxWidth && fontSize > 3);
        return this;
    }

    TextWidget.prototype.renderAsTableview = function() {
        var w_selector = "#widget" + this.id || "";
        var parent = $(w_selector);
        var self = this;

        require(['text!../views/TextWidgetTable.html'], function (html) {
            var table = $(html).clone();
            parent.empty().append(table);
            var tr = table.find("tr");
            table.empty();
            var d = self.config.textData.data;
            if (d.Cols[0]) {
                if (d.Cols[0].tuples.length != 0) {
                    for (var i = 0; i < d.Cols[0].tuples.length; i++) {
                        var r = tr.clone();
                        //var listItem = $(html).find(".table-view-cell").clone();
                        r.html(r.html().replace(/{{title}}/, d.Cols[0].tuples[i].caption));
                        r.html(r.html().replace(/{{value}}/, d.Data[i]));

                        var div = r.find("div:eq(1)");
                        r.appendTo(table);
                        div.textfill({ maxFontPixels: 200 });
                        //r.find('div').textfill({ maxFontPixels: 1500 });
                    }
                }
            }


            /*for (var i = 0; i < items.length; i++) {
                var r = tr.clone();
                console.log(r.html());
                table.append(r);
            }*/
        });
    }

    TextWidget.prototype.toString = function () {
        return 'TextWidget'
    };
    return TextWidget;
});