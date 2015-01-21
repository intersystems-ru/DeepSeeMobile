define([], function () {

    function TextWidget() {

        this.btnChangeMode = null;
        this.displayMode = 0;


        this.renderWidget = function () {
            var w_selector = "#widget" + this.id || "";
            var parent = $(w_selector);
            parent.css("overflow-y", "auto");
            var self = this;

            if (this.displayMode == 0) {
                this.renderAsTableview();
                return;
            }

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
                            var val = d.Data[i];
                            if (d.Cols[0].tuples[i].format != "") val = numeral(val).format(d.Cols[0].tuples[i].format);
                            listItem.html(listItem.html().replace(/{{title}}/, d.Cols[0].tuples[i].caption));
                            listItem.html(listItem.html().replace(/{{value}}/, val));
                            listItem.appendTo(list);
                        }
                    }
                }
            });
        }
    };

    $.fn.fitText = function( kompressor, options ) {
        var compressor = kompressor || 1,
            settings = $.extend({
                'minFontSize' : Number.NEGATIVE_INFINITY,
                'maxFontSize' : Number.POSITIVE_INFINITY
            }, options);

        return this.each(function(){
            var $this = $(this);
            var resizer = function () {
                $this.css('font-size', Math.max(Math.min($this.height() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
            };
            resizer();
            $(window).on('resize.fittext orientationchange.fittext', resizer);
        });

    };

    $.fn.textfill = function(options) {
        var fontSize = options.maxFontPixels;
        var ourText = $('span:visible:first', this);
        var maxHeight = options.maxHeight ? options.maxHeight : $(this).height();
        var maxWidth = options.maxWidth ? options.maxWidth : $(this).width();
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
                        var val = d.Data[i];
                        if (d.Cols[0].tuples[i].format != "") val = numeral(val).format(d.Cols[0].tuples[i].format);
                        r.html(r.html().replace(/{{title}}/, d.Cols[0].tuples[i].caption));
                        r.html(r.html().replace(/{{value}}/, val));
                        var div = r.find("span:eq(0)");
                        r.appendTo(table);
                        div.textfill({ maxFontPixels: 200, maxWidth: table.width(), maxHeight: table.height() / d.Cols[0].tuples.length - r.find("div:eq(0)").height() });
                            r.find("span:eq(1)").css("top", parseInt(table.height() / d.Cols[0].tuples.length / 3.1).toString() + "px");
                    }
                }
            }

        });
    }

    TextWidget.prototype.changeMode = function() {

    }

    TextWidget.prototype.onActivate = function() {
        var self = this;
        $(window).on("orientationchange", this.renderWidget());

        require("Widget").prototype.onActivate.apply(this);
        if (!this.btnChangeMode) {
            this.btnChangeMode = $('<a class="icon fa fa-file-text-o pull-right"></a>');
        }
        this.btnChangeMode.appendTo(App.ui.navBar);


        this.btnChangeMode.on("tap", function() {
            self.btnChangeMode.removeClass("fa-file-text-o");
            self.btnChangeMode.removeClass("fa-file-text");
            if (self.displayMode == 1) {
                self.displayMode = 0;
                self.btnChangeMode.addClass("fa-file-text-o");
            } else {
                self.displayMode = 1;
                self.btnChangeMode.addClass("fa-file-text");
            }

            self.renderWidget();
        });
    }

    TextWidget.prototype.onDeactivate = function() {
        require("Widget").prototype.onDeactivate.apply(this);
        $(window).off("orientationchange", this.renderWidget());
        if (this.btnChangeMode) {
            this.btnChangeMode.off("tap");
            this.btnChangeMode.remove();
        }
    }

    TextWidget.prototype.toString = function () {
        return 'TextWidget'
    };

    return TextWidget;
});